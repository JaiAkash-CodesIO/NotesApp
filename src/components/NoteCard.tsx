import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Note, ViewMode } from '../types/note';
import { NOTE_COLORS, ThemeColors } from '../theme/theme';
import {
  PinIcon,
  TrashIcon,
  ArchiveIcon,
  TagIcon,
  CheckIcon,
  LockIcon,
  RotateCcwIcon,
  ImageIcon,
  DownloadIcon,
} from './Icons';

interface NoteCardProps {
  note: Note;
  theme: ThemeColors;
  isDark: boolean;
  viewMode: ViewMode;
  isTrashView?: boolean;
  onPress: () => void;
  onTogglePin?: () => void;
  onToggleArchive?: () => void;
  onDelete: () => void;
  onRestore?: () => void;
  onExport?: () => void;
  onToggleChecklistItem?: (noteId: string, itemId: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  theme,
  isDark,
  viewMode,
  isTrashView = false,
  onPress,
  onTogglePin,
  onToggleArchive,
  onDelete,
  onRestore,
  onExport,
  onToggleChecklistItem,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const colorDef = NOTE_COLORS.find((c) => c.id === note.color) || NOTE_COLORS[0];
  const cardBgColor = isDark ? colorDef.darkBg : colorDef.lightBg;
  const cardBorderColor = note.isPinned
    ? theme.primary
    : isDark
    ? colorDef.darkBorder
    : colorDef.lightBorder;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isGrid = viewMode === 'grid';
  const gridItemWidth = (windowWidth - 32 - 10) / 2;

  const completedTasksCount =
    note.checklist?.filter((t) => t.completed).length || 0;
  const totalTasksCount = note.checklist?.length || 0;
  const hasImages = note.images && note.images.length > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={[
        styles.card,
        isGrid ? { width: gridItemWidth, minHeight: 140 } : styles.listCard,
        {
          backgroundColor: cardBgColor,
          borderColor: cardBorderColor,
          borderWidth: note.isPinned ? 1.5 : 1,
        },
      ]}
      onPress={onPress}
    >
      {/* Top Accent Color Bar */}
      <View
        style={[
          styles.accentBar,
          { backgroundColor: colorDef.accent },
        ]}
      />

      {/* Image Thumbnail Banner (if note has images) */}
      {hasImages && !note.isLocked && (
        <View style={styles.imageThumbnailWrap}>
          <Image
            source={{ uri: note.images![0] }}
            style={styles.imageThumbnail}
            resizeMode="cover"
          />
          {note.images!.length > 1 && (
            <View style={styles.imageCountBadge}>
              <Text style={styles.imageCountText}>+{note.images!.length - 1}</Text>
            </View>
          )}
        </View>
      )}

      {/* Header with Title & Pin/Lock */}
      <View style={styles.cardHeader}>
        <View style={styles.titleWrapper}>
          {note.isPinned && !isTrashView && (
            <View style={styles.pinnedBadge}>
              <PinIcon size={12} color="#FBBF24" filled />
            </View>
          )}
          {note.isLocked && (
            <View style={styles.lockedBadge}>
              <LockIcon size={13} color={theme.primary} />
            </View>
          )}
          <Text
            numberOfLines={isGrid ? 2 : 1}
            style={[styles.title, { color: theme.text }]}
          >
            {note.title || (note.isLocked ? 'Protected Note' : 'Untitled')}
          </Text>
        </View>

        {!isTrashView && onTogglePin && (
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={onTogglePin}
            style={styles.headerPinBtn}
          >
            <PinIcon
              size={15}
              color={note.isPinned ? '#FBBF24' : theme.textMuted}
              filled={note.isPinned}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Note Content / Locked Concealment */}
      {note.isLocked ? (
        <View style={styles.lockedContainer}>
          <LockIcon size={18} color={theme.textMuted} />
          <Text style={[styles.lockedMessage, { color: theme.textMuted }]}>
            Protected with PIN
          </Text>
        </View>
      ) : (
        <>
          {note.content.length > 0 && (
            <Text
              numberOfLines={isGrid ? 3 : 2}
              style={[styles.contentSnippet, { color: theme.textSecondary }]}
            >
              {note.content}
            </Text>
          )}

          {/* Checklist Preview */}
          {note.checklist && note.checklist.length > 0 && (
            <View style={styles.checklistPreview}>
              {note.checklist.slice(0, isGrid ? 2 : 2).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.checklistItemRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (onToggleChecklistItem) {
                      onToggleChecklistItem(note.id, item.id);
                    } else {
                      onPress();
                    }
                  }}
                >
                  <View
                    style={[
                      styles.checkCircle,
                      {
                        backgroundColor: item.completed
                          ? theme.success
                          : 'transparent',
                        borderColor: item.completed ? theme.success : theme.textMuted,
                      },
                    ]}
                  >
                    {item.completed && <CheckIcon size={9} color="#FFFFFF" />}
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.checklistText,
                      {
                        color: item.completed ? theme.textMuted : theme.textSecondary,
                        textDecorationLine: item.completed ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>
              ))}
              {note.checklist.length > 2 && (
                <Text style={[styles.moreItemsText, { color: theme.textMuted }]}>
                  {completedTasksCount}/{totalTasksCount} done
                </Text>
              )}
            </View>
          )}
        </>
      )}

      {/* Footer Info */}
      <View style={styles.footerRow}>
        <View style={styles.metaLeft}>
          {note.category && note.category !== 'all' && !isTrashView && (
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
              ]}
            >
              <TagIcon size={9} color={theme.textSecondary} />
              <Text
                numberOfLines={1}
                style={[styles.categoryBadgeText, { color: theme.textSecondary }]}
              >
                {note.category}
              </Text>
            </View>
          )}
          <Text style={[styles.dateText, { color: theme.textMuted }]}>
            {formatDate(note.updatedAt)}
          </Text>
        </View>

        {/* Quick Actions / Trash Actions */}
        <View style={styles.quickActions}>
          {isTrashView ? (
            <>
              {/* Restore Button */}
              {onRestore && (
                <TouchableOpacity
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={onRestore}
                  style={styles.actionBtn}
                >
                  <RotateCcwIcon size={14} color={theme.success} />
                </TouchableOpacity>
              )}
              {/* Delete Forever Button */}
              <TouchableOpacity
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={onDelete}
                style={styles.actionBtn}
              >
                <TrashIcon size={14} color={theme.danger} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Export Trigger */}
              {onExport && (
                <TouchableOpacity
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={onExport}
                  style={styles.actionBtn}
                >
                  <DownloadIcon size={13} color={theme.textMuted} />
                </TouchableOpacity>
              )}
              {/* Archive Trigger */}
              {onToggleArchive && (
                <TouchableOpacity
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={onToggleArchive}
                  style={styles.actionBtn}
                >
                  <ArchiveIcon size={13} color={theme.textMuted} />
                </TouchableOpacity>
              )}
              {/* Trash Trigger */}
              <TouchableOpacity
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={onDelete}
                style={styles.actionBtn}
              >
                <TrashIcon size={13} color={theme.danger} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3.5,
  },
  imageThumbnailWrap: {
    height: 80,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 8,
    position: 'relative',
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  imageCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  listCard: {
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 2,
    marginBottom: 6,
  },
  titleWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pinnedBadge: {
    marginRight: 2,
  },
  lockedBadge: {
    marginRight: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  headerPinBtn: {
    paddingLeft: 4,
  },
  lockedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  lockedMessage: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  contentSnippet: {
    fontSize: 12.5,
    lineHeight: 17,
    marginBottom: 6,
  },
  checklistPreview: {
    marginVertical: 4,
    gap: 4,
  },
  checklistItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 1,
  },
  checkCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checklistText: {
    fontSize: 12,
    flex: 1,
  },
  moreItemsText: {
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    overflow: 'hidden',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    maxWidth: 70,
  },
  categoryBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 10.5,
  },
  quickActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  actionBtn: {
    padding: 2,
  },
});
