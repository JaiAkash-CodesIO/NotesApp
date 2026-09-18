import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Note, ChecklistItem } from '../types/note';
import { CATEGORIES, NOTE_COLORS, ThemeColors } from '../theme/theme';
import {
  CloseIcon,
  CheckIcon,
  PinIcon,
  ArchiveIcon,
  PlusIcon,
  TrashIcon,
  TagIcon,
  PaletteIcon,
  ChecklistIcon,
  LockIcon,
  UnlockIcon,
  ImageIcon,
  DownloadIcon,
} from './Icons';
import { ImageViewerModal } from './ImageViewerModal';

interface NoteEditorModalProps {
  visible: boolean;
  note: Note | null;
  theme: ThemeColors;
  isDark: boolean;
  onClose: () => void;
  onSave: (noteData: {
    title: string;
    content: string;
    category: string;
    color: string;
    isPinned: boolean;
    isArchived: boolean;
    isLocked?: boolean;
    images?: string[];
    checklist: ChecklistItem[];
  }) => void;
  onDelete?: (id: string) => void;
  onExport?: (note: Note) => void;
}

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  visible,
  note,
  theme,
  isDark,
  onClose,
  onSave,
  onDelete,
  onExport,
}) => {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');
  const [color, setColor] = useState('default');
  const [isPinned, setIsPinned] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category || 'personal');
      setColor(note.color || 'default');
      setIsPinned(note.isPinned || false);
      setIsArchived(note.isArchived || false);
      setIsLocked(note.isLocked || false);
      setImages(note.images || []);
      setChecklist(note.checklist || []);
    } else {
      setTitle('');
      setContent('');
      setCategory('personal');
      setColor('default');
      setIsPinned(false);
      setIsArchived(false);
      setIsLocked(false);
      setImages([]);
      setChecklist([]);
    }
    setNewChecklistText('');
    setShowColorPicker(false);
  }, [note, visible]);

  const handleSave = () => {
    if (!title.trim() && !content.trim() && checklist.length === 0 && images.length === 0) {
      Alert.alert('Empty Note', 'Please enter a title, content, photo, or checklist item before saving.');
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      color,
      isPinned,
      isArchived,
      isLocked,
      images,
      checklist,
    });
    onClose();
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const newItem: ChecklistItem = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      text: newChecklistText.trim(),
      completed: false,
    };
    setChecklist([...checklist, newItem]);
    setNewChecklistText('');
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  // Add Image Prompt
  const handleAddImage = () => {
    Alert.prompt
      ? Alert.prompt(
          'Attach Photo / Image URL',
          'Enter an image URL or sample photo link to attach to this note:',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Add Photo',
              onPress: (url) => {
                if (url && url.trim()) {
                  setImages([...images, url.trim()]);
                }
              },
            },
          ],
          'plain-text',
          'https://images.unsplash.com/photo-1507842229451-7f01be7f7a26?w=600'
        )
      : (() => {
          // Default fallback sample photo
          const sample = 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80';
          setImages([...images, sample]);
        })();
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Quick formatting helpers
  const insertBullet = () => {
    setContent((prev) => (prev ? prev + '\n• ' : '• '));
  };

  const insertTimestamp = () => {
    const now = new Date();
    const formatted = `📅 ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n`;
    setContent((prev) => (prev ? prev + '\n' + formatted : formatted));
  };

  const colorDef = NOTE_COLORS.find((c) => c.id === color) || NOTE_COLORS[0];
  const modalBgColor = isDark ? colorDef.darkBg : colorDef.lightBg;

  const wordCount = content.trim().length > 0 ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 20) : 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[
          styles.container,
          {
            backgroundColor: modalBgColor,
            paddingTop: topPadding,
            paddingBottom: insets.bottom,
          },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Accent Stripe */}
        <View style={[styles.topAccentBar, { backgroundColor: colorDef.accent }]} />

        {/* Top App Bar */}
        <View style={[styles.topBar, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.navBtn, { backgroundColor: theme.card }]}
            onPress={onClose}
          >
            <CloseIcon size={19} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.topRightActions}>
            {/* Lock / Unlock Note Toggle */}
            <TouchableOpacity
              style={[
                styles.navBtn,
                {
                  backgroundColor: isLocked ? theme.primaryLight : theme.card,
                  borderColor: isLocked ? theme.primary : 'transparent',
                  borderWidth: 1,
                },
              ]}
              onPress={() => setIsLocked(!isLocked)}
              accessibilityLabel="Toggle Note Lock"
            >
              {isLocked ? (
                <LockIcon size={17} color={theme.primary} />
              ) : (
                <UnlockIcon size={17} color={theme.textSecondary} />
              )}
            </TouchableOpacity>

            {/* Pin Toggle */}
            <TouchableOpacity
              style={[
                styles.navBtn,
                {
                  backgroundColor: isPinned ? '#FBBF24' : theme.card,
                },
              ]}
              onPress={() => setIsPinned(!isPinned)}
            >
              <PinIcon
                size={17}
                color={isPinned ? '#000000' : theme.textSecondary}
                filled={isPinned}
              />
            </TouchableOpacity>

            {/* Color Palette Toggle */}
            <TouchableOpacity
              style={[
                styles.navBtn,
                {
                  backgroundColor: showColorPicker ? theme.primaryLight : theme.card,
                  borderColor: showColorPicker ? theme.primary : 'transparent',
                  borderWidth: 1,
                },
              ]}
              onPress={() => setShowColorPicker(!showColorPicker)}
            >
              <PaletteIcon size={17} color={showColorPicker ? theme.primary : theme.textSecondary} />
            </TouchableOpacity>

            {/* Export Trigger */}
            {note && onExport && (
              <TouchableOpacity
                style={[styles.navBtn, { backgroundColor: theme.card }]}
                onPress={() => onExport(note)}
              >
                <DownloadIcon size={17} color={theme.textSecondary} />
              </TouchableOpacity>
            )}

            {/* Delete Note */}
            {note && onDelete && (
              <TouchableOpacity
                style={[styles.navBtn, { backgroundColor: theme.card }]}
                onPress={() => {
                  Alert.alert(
                    'Move to Trash',
                    'Move this note to the Recycle Bin?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Move to Trash',
                        style: 'destructive',
                        onPress: () => {
                          onDelete(note.id);
                          onClose();
                        },
                      },
                    ]
                  );
                }}
              >
                <TrashIcon size={17} color={theme.danger} />
              </TouchableOpacity>
            )}

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              onPress={handleSave}
            >
              <CheckIcon size={15} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Color Picker Palette Bar */}
        {showColorPicker && (
          <View
            style={[
              styles.colorPaletteContainer,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}
          >
            <Text style={[styles.paletteTitle, { color: theme.textSecondary }]}>
              Note Theme Palette
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.colorRow}>
                {NOTE_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.colorCircle,
                      {
                        backgroundColor: isDark ? c.darkBg : c.lightBg,
                        borderColor: color === c.id ? theme.primary : c.darkBorder,
                        borderWidth: color === c.id ? 2.5 : 1,
                      },
                    ]}
                    onPress={() => {
                      setColor(c.id);
                      setShowColorPicker(false);
                    }}
                  >
                    <View
                      style={[
                        styles.colorAccentDot,
                        { backgroundColor: c.accent },
                      ]}
                    />
                    {color === c.id && <CheckIcon size={12} color={theme.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Category Selector Chips */}
        <View style={styles.categorySelectorWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryChipsContent}>
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
              const isSelected = category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: isSelected
                        ? theme.primary
                        : theme.inputBg,
                      borderColor: isSelected
                        ? theme.primary
                        : theme.border,
                    },
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <TagIcon
                    size={11}
                    color={isSelected ? '#FFFFFF' : theme.textMuted}
                  />
                  <Text
                    style={[
                      styles.catChipText,
                      {
                        color: isSelected ? '#FFFFFF' : theme.textSecondary,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Editor Body */}
        <ScrollView
          style={styles.editorScroll}
          contentContainerStyle={styles.editorContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <TextInput
            style={[styles.titleInput, { color: theme.text }]}
            placeholder="Title"
            placeholderTextColor={theme.textMuted}
            value={title}
            onChangeText={setTitle}
            multiline={false}
            returnKeyType="next"
          />

          {/* Attached Images Carousel */}
          {images.length > 0 && (
            <View style={styles.imagesSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.imagesRow}>
                  {images.map((imgUrl, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.imageThumbnailCard}
                      onPress={() => setSelectedImagePreview(imgUrl)}
                    >
                      <Image
                        source={{ uri: imgUrl }}
                        style={styles.editorImageThumb}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.removeImageBtn}
                        onPress={() => handleRemoveImage(idx)}
                      >
                        <CloseIcon size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Checklist Items */}
          {checklist.length > 0 && (
            <View style={styles.checklistSection}>
              <Text
                style={[
                  styles.sectionHeader,
                  { color: theme.textSecondary },
                ]}
              >
                CHECKLIST ({checklist.filter((t) => t.completed).length}/{checklist.length})
              </Text>
              {checklist.map((item) => (
                <View key={item.id} style={styles.checklistItemEditRow}>
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: item.completed
                          ? theme.success
                          : 'transparent',
                        borderColor: item.completed
                          ? theme.success
                          : theme.textMuted,
                      },
                    ]}
                    onPress={() => handleToggleChecklistItem(item.id)}
                  >
                    {item.completed && <CheckIcon size={12} color="#FFFFFF" />}
                  </TouchableOpacity>

                  <Text
                    style={[
                      styles.checklistInputText,
                      {
                        color: item.completed
                          ? theme.textMuted
                          : theme.text,
                        textDecorationLine: item.completed
                          ? 'line-through'
                          : 'none',
                      },
                    ]}
                  >
                    {item.text}
                  </Text>

                  <TouchableOpacity
                    onPress={() => handleDeleteChecklistItem(item.id)}
                    style={styles.deleteChecklistBtn}
                  >
                    <CloseIcon size={14} color={theme.danger} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Add Checklist Item Row */}
          <View
            style={[
              styles.addChecklistRow,
              {
                backgroundColor: theme.inputBg,
                borderColor: theme.border,
              },
            ]}
          >
            <ChecklistIcon size={16} color={theme.textMuted} />
            <TextInput
              style={[styles.addChecklistInput, { color: theme.text }]}
              placeholder="Add checklist item..."
              placeholderTextColor={theme.textMuted}
              value={newChecklistText}
              onChangeText={setNewChecklistText}
              onSubmitEditing={handleAddChecklistItem}
              returnKeyType="done"
            />
            {newChecklistText.length > 0 && (
              <TouchableOpacity
                style={[
                  styles.addChecklistBtn,
                  { backgroundColor: theme.primary },
                ]}
                onPress={handleAddChecklistItem}
              >
                <PlusIcon size={14} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Note Content Body */}
          <TextInput
            style={[styles.contentInput, { color: theme.text }]}
            placeholder="Type your notes here..."
            placeholderTextColor={theme.textMuted}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            scrollEnabled={false}
          />
        </ScrollView>

        {/* Rich Formatting Tool Bar with Add Image & Quick Tools */}
        <View style={[styles.formattingBar, { backgroundColor: theme.card, borderTopColor: theme.cardBorder }]}>
          <View style={styles.quickTools}>
            <TouchableOpacity
              style={[styles.toolBtn, { backgroundColor: theme.inputBg }]}
              onPress={handleAddImage}
            >
              <ImageIcon size={14} color={theme.primary} />
              <Text style={[styles.toolBtnText, { color: theme.primary }]}>Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolBtn, { backgroundColor: theme.inputBg }]}
              onPress={insertBullet}
            >
              <Text style={[styles.toolBtnText, { color: theme.text }]}>• Bullet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toolBtn, { backgroundColor: theme.inputBg }]}
              onPress={insertTimestamp}
            >
              <Text style={[styles.toolBtnText, { color: theme.text }]}>🕒 Time</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.statsText, { color: theme.textMuted }]}>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </Text>
        </View>

        {/* Lightbox Image Preview Modal */}
        <ImageViewerModal
          visible={!!selectedImagePreview}
          imageUrl={selectedImagePreview}
          theme={theme}
          onClose={() => setSelectedImagePreview(null)}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topAccentBar: {
    height: 3.5,
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 5,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  colorPaletteContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  paletteTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  colorCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  colorAccentDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  categorySelectorWrapper: {
    paddingVertical: 8,
  },
  categoryChipsContent: {
    paddingHorizontal: 16,
    gap: 6,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    gap: 5,
  },
  catChipText: {
    fontSize: 11.5,
    textTransform: 'capitalize',
  },
  editorScroll: {
    flex: 1,
  },
  editorContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
    paddingVertical: 4,
  },
  imagesSection: {
    marginBottom: 12,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  imageThumbnailCard: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  editorImageThumb: {
    width: '100%',
    height: '100%',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checklistSection: {
    marginBottom: 12,
    gap: 6,
  },
  sectionHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  checklistItemEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 5,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checklistInputText: {
    flex: 1,
    fontSize: 13.5,
  },
  deleteChecklistBtn: {
    padding: 3,
  },
  addChecklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
    gap: 6,
  },
  addChecklistInput: {
    flex: 1,
    fontSize: 12.5,
    paddingVertical: 0,
  },
  addChecklistBtn: {
    width: 24,
    height: 24,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentInput: {
    fontSize: 14.5,
    lineHeight: 21,
    minHeight: 180,
  },
  formattingBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderTopWidth: 1,
  },
  quickTools: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    gap: 4,
  },
  toolBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statsText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
});
