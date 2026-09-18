import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Note, ViewMode, SortOption, ChecklistItem } from './src/types/note';
import { lightTheme, darkTheme, CATEGORIES } from './src/theme/theme';
import {
  loadNotes,
  createNote,
  updateNote,
  moveToTrashNote,
  restoreNote,
  deletePermanentlyNote,
  emptyTrash,
  togglePinNote,
  toggleArchiveNote,
  toggleChecklistItemInNote,
  loadThemePreference,
  saveThemePreference,
  loadViewPreference,
  saveViewPreference,
  loadSortPreference,
  saveSortPreference,
  sortNotes,
} from './src/storage/noteStorage';
import { Header } from './src/components/Header';
import { CategoryBar } from './src/components/CategoryBar';
import { NoteCard } from './src/components/NoteCard';
import { NoteEditorModal } from './src/components/NoteEditorModal';
import { EmptyState } from './src/components/EmptyState';
import { WirelessDebugModal } from './src/components/WirelessDebugModal';
import { SortFilterModal } from './src/components/SortFilterModal';
import { StatsModal } from './src/components/StatsModal';
import { ShareAppModal } from './src/components/ShareAppModal';
import { PinLockModal } from './src/components/PinLockModal';
import { ExportModal } from './src/components/ExportModal';
import { PlusIcon, TrashIcon, RotateCcwIcon } from './src/components/Icons';

function MainApp(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isArchiveView, setIsArchiveView] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('updated_desc');

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isWirelessModalOpen, setIsWirelessModalOpen] = useState<boolean>(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState<boolean>(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // 4 Features State: PIN Lock & Export
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pendingUnlockNote, setPendingUnlockNote] = useState<Note | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportTargetNote, setExportTargetNote] = useState<Note | null>(null);

  const theme = isDark ? darkTheme : lightTheme;

  // Load initial preferences and notes
  useEffect(() => {
    const initApp = async () => {
      const savedThemeDark = await loadThemePreference();
      setIsDark(savedThemeDark);

      const savedView = await loadViewPreference();
      setViewMode(savedView);

      const savedSort = await loadSortPreference();
      setSortBy(savedSort);

      const loadedNotes = await loadNotes();
      setNotes(loadedNotes);
    };

    initApp();
  }, [systemColorScheme]);

  const handleToggleTheme = useCallback(async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    await saveThemePreference(newMode);
  }, [isDark]);

  const handleToggleViewMode = useCallback(async () => {
    const newView = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newView);
    await saveViewPreference(newView);
  }, [viewMode]);

  const handleSelectSort = useCallback(async (newSort: SortOption) => {
    setSortBy(newSort);
    await saveSortPreference(newSort);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const loadedNotes = await loadNotes();
    setNotes(loadedNotes);
    setRefreshing(false);
  }, []);

  const handleOpenCreateNote = useCallback(() => {
    setSelectedNote(null);
    setIsEditorOpen(true);
  }, []);

  // Handle Note Tap (with PIN verification check if locked)
  const handleOpenEditNote = useCallback((note: Note) => {
    if (note.isLocked) {
      setPendingUnlockNote(note);
      setIsPinModalOpen(true);
    } else {
      setSelectedNote(note);
      setIsEditorOpen(true);
    }
  }, []);

  const handlePinUnlockSuccess = useCallback(() => {
    setIsPinModalOpen(false);
    if (pendingUnlockNote) {
      setSelectedNote(pendingUnlockNote);
      setIsEditorOpen(true);
      setPendingUnlockNote(null);
    }
  }, [pendingUnlockNote]);

  const handleSaveNote = useCallback(
    async (noteData: {
      title: string;
      content: string;
      category: string;
      color: string;
      isPinned: boolean;
      isArchived: boolean;
      isLocked?: boolean;
      images?: string[];
      checklist: ChecklistItem[];
    }) => {
      if (selectedNote) {
        // Edit existing
        const updated = await updateNote(selectedNote.id, noteData);
        setNotes(updated);
      } else {
        // Create new
        const newNote = await createNote(noteData);
        setNotes((prev) => [newNote, ...prev]);
      }
    },
    [selectedNote]
  );

  // Soft delete (Move to Trash)
  const handleMoveToTrash = useCallback(async (id: string) => {
    const updated = await moveToTrashNote(id);
    setNotes(updated);
  }, []);

  // Restore from Trash
  const handleRestoreNote = useCallback(async (id: string) => {
    const updated = await restoreNote(id);
    setNotes(updated);
  }, []);

  // Delete Permanently
  const handleDeleteForever = useCallback(async (id: string) => {
    Alert.alert(
      'Delete Permanently',
      'This note will be deleted forever. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            const updated = await deletePermanentlyNote(id);
            setNotes(updated);
          },
        },
      ]
    );
  }, []);

  // Empty Trash
  const handleEmptyTrash = useCallback(async () => {
    Alert.alert(
      'Empty Recycle Bin',
      'Are you sure you want to permanently delete all notes in the Trash?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Empty Trash',
          style: 'destructive',
          onPress: async () => {
            const updated = await emptyTrash();
            setNotes(updated);
          },
        },
      ]
    );
  }, []);

  const handleTogglePin = useCallback(async (id: string) => {
    const updated = await togglePinNote(id);
    setNotes(updated);
  }, []);

  const handleToggleArchive = useCallback(async (id: string) => {
    const updated = await toggleArchiveNote(id);
    setNotes(updated);
  }, []);

  const handleToggleChecklistItem = useCallback(
    async (noteId: string, itemId: string) => {
      const updated = await toggleChecklistItemInNote(noteId, itemId);
      setNotes(updated);
    },
    []
  );

  // Export note trigger
  const handleOpenExport = useCallback((note: Note) => {
    setExportTargetNote(note);
    setIsExportModalOpen(true);
  }, []);

  const isTrashView = selectedCategory === 'trash';

  // Filtered and sorted notes
  const displayedNotes = useMemo(() => {
    if (isTrashView) {
      return notes.filter((n) => n.isDeleted);
    }

    let filtered = notes.filter((n) =>
      !n.isDeleted && (isArchiveView ? n.isArchived : !n.isArchived)
    );

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((n) => n.category === selectedCategory);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q) ||
          (n.checklist &&
            n.checklist.some((c) => c.text.toLowerCase().includes(q)))
      );
    }

    return sortNotes(filtered, sortBy);
  }, [notes, isTrashView, isArchiveView, selectedCategory, searchQuery, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const baseNotes = notes.filter((n) =>
      !n.isDeleted && (isArchiveView ? n.isArchived : !n.isArchived)
    );

    counts.all = baseNotes.length;
    CATEGORIES.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = baseNotes.filter((n) => n.category === cat.id).length;
      }
    });

    return counts;
  }, [notes, isArchiveView]);

  const trashCount = useMemo(() => {
    return notes.filter((n) => n.isDeleted).length;
  }, [notes]);

  const topSafeAreaPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 20) : 0
  );

  return (
    <View
      style={[
        styles.safeArea,
        {
          backgroundColor: theme.background,
          paddingTop: topSafeAreaPadding,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />

      {/* Top Header with Top-Left Share Button & Navigation */}
      <Header
        theme={theme}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        onOpenWirelessModal={() => setIsWirelessModalOpen(true)}
        onOpenSortModal={() => setIsSortModalOpen(true)}
        onOpenStatsModal={() => setIsStatsModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        isArchiveView={isArchiveView}
        onToggleArchiveView={() => setIsArchiveView(!isArchiveView)}
        notesCount={displayedNotes.length}
        currentSort={sortBy}
      />

      {/* Category Pills Bar with Trash Tab */}
      <CategoryBar
        theme={theme}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
        trashCount={trashCount}
      />

      {/* Trash Header Banner (When in Trash view) */}
      {isTrashView && (
        <View style={[styles.trashBanner, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.trashBannerInfo}>
            <Text style={[styles.trashBannerTitle, { color: theme.text }]}>
              Recycle Bin ({trashCount})
            </Text>
            <Text style={[styles.trashBannerDesc, { color: theme.textSecondary }]}>
              Notes are stored for 30 days before permanent cleanup.
            </Text>
          </View>
          {trashCount > 0 && (
            <TouchableOpacity
              style={[styles.emptyTrashBtn, { backgroundColor: theme.danger }]}
              onPress={handleEmptyTrash}
            >
              <TrashIcon size={13} color="#FFFFFF" />
              <Text style={styles.emptyTrashBtnText}>Empty</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Notes List / Grid */}
      <FlatList
        data={displayedNotes}
        key={viewMode === 'grid' ? 'grid-view' : 'list-view'}
        numColumns={viewMode === 'grid' ? 2 : 1}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          displayedNotes.length === 0 && styles.emptyListContent,
        ]}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            theme={theme}
            isDark={isDark}
            viewMode={viewMode}
            isTrashView={isTrashView}
            onPress={() => handleOpenEditNote(item)}
            onTogglePin={!isTrashView ? () => handleTogglePin(item.id) : undefined}
            onToggleArchive={!isTrashView ? () => handleToggleArchive(item.id) : undefined}
            onDelete={() => (isTrashView ? handleDeleteForever(item.id) : handleMoveToTrash(item.id))}
            onRestore={isTrashView ? () => handleRestoreNote(item.id) : undefined}
            onExport={!isTrashView ? () => handleOpenExport(item) : undefined}
            onToggleChecklistItem={handleToggleChecklistItem}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            theme={theme}
            isSearching={searchQuery.length > 0}
            isArchive={isArchiveView || isTrashView}
            onCreateNote={handleOpenCreateNote}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      />

      {/* Floating Action Button (FAB) */}
      {!isArchiveView && !isTrashView && (
        <TouchableOpacity
          style={[
            styles.fab,
            {
              backgroundColor: theme.fabBg,
              shadowColor: theme.primary,
              bottom: Math.max(insets.bottom + 16, 22),
            },
          ]}
          onPress={handleOpenCreateNote}
          activeOpacity={0.85}
          accessibilityLabel="Create Note"
        >
          <PlusIcon size={26} color={theme.fabIcon} />
        </TouchableOpacity>
      )}

      {/* Note Editor Modal */}
      <NoteEditorModal
        visible={isEditorOpen}
        note={selectedNote}
        theme={theme}
        isDark={isDark}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        onDelete={handleMoveToTrash}
        onExport={handleOpenExport}
      />

      {/* Security PIN Lock Modal */}
      <PinLockModal
        visible={isPinModalOpen}
        noteTitle={pendingUnlockNote?.title}
        theme={theme}
        onSuccess={handlePinUnlockSuccess}
        onClose={() => {
          setIsPinModalOpen(false);
          setPendingUnlockNote(null);
        }}
      />

      {/* Export to PDF / Markdown Modal */}
      <ExportModal
        visible={isExportModalOpen}
        note={exportTargetNote}
        theme={theme}
        onClose={() => {
          setIsExportModalOpen(false);
          setExportTargetNote(null);
        }}
      />

      {/* Wireless Debugging Guide Modal */}
      <WirelessDebugModal
        visible={isWirelessModalOpen}
        theme={theme}
        onClose={() => setIsWirelessModalOpen(false)}
      />

      {/* Sort Options Modal */}
      <SortFilterModal
        visible={isSortModalOpen}
        currentSort={sortBy}
        theme={theme}
        onSelectSort={handleSelectSort}
        onClose={() => setIsSortModalOpen(false)}
      />

      {/* Productivity Stats Modal */}
      <StatsModal
        visible={isStatsModalOpen}
        notes={notes}
        theme={theme}
        onClose={() => setIsStatsModalOpen(false)}
      />

      {/* Share App Modal (WhatsApp, Telegram, etc.) */}
      <ShareAppModal
        visible={isShareModalOpen}
        theme={theme}
        onClose={() => setIsShareModalOpen(false)}
      />
    </View>
  );
}

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  trashBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  trashBannerInfo: {
    flex: 1,
    marginRight: 8,
  },
  trashBannerTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  trashBannerDesc: {
    fontSize: 11,
  },
  emptyTrashBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  emptyTrashBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 95,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
