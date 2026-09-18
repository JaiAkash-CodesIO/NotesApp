import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Note } from '../types/note';
import { CATEGORIES, ThemeColors } from '../theme/theme';
import { CloseIcon, StatsIcon, ChecklistIcon, PinIcon, ArchiveIcon } from './Icons';

interface StatsModalProps {
  visible: boolean;
  notes: Note[];
  theme: ThemeColors;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  visible,
  notes,
  theme,
  onClose,
}) => {
  const totalNotes = notes.filter((n) => !n.isArchived).length;
  const pinnedNotes = notes.filter((n) => n.isPinned && !n.isArchived).length;
  const archivedNotes = notes.filter((n) => n.isArchived).length;

  let totalTasks = 0;
  let completedTasks = 0;
  notes.forEach((n) => {
    if (n.checklist) {
      totalTasks += n.checklist.length;
      completedTasks += n.checklist.filter((t) => t.completed).length;
    }
  });

  const taskCompletionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalWords = notes
    .filter((n) => !n.isArchived)
    .reduce((acc, n) => {
      const words = n.content.trim().length > 0 ? n.content.trim().split(/\s+/).length : 0;
      return acc + words;
    }, 0);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.titleRow}>
              <View
                style={[
                  styles.iconBadge,
                  { backgroundColor: theme.primaryLight },
                ]}
              >
                <StatsIcon size={18} color={theme.primary} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>
                Notes & Tasks Insights
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={18} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* 2x2 Metric Grid */}
            <View style={styles.gridContainer}>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.inputBg, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.primary }]}>
                  {totalNotes}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Active Notes
                </Text>
              </View>

              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.inputBg, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.statValue, { color: '#FBBF24' }]}>
                  {pinnedNotes}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Pinned Notes
                </Text>
              </View>

              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.inputBg, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.success }]}>
                  {completedTasks}/{totalTasks}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Tasks Done ({taskCompletionRate}%)
                </Text>
              </View>

              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.inputBg, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.statValue, { color: theme.accent }]}>
                  {totalWords}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Total Words Written
                </Text>
              </View>
            </View>

            {/* Category Breakdown */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Category Distribution
            </Text>
            <View style={styles.categoryBreakdown}>
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const count = notes.filter(
                  (n) => !n.isArchived && n.category === cat.id
                ).length;
                const percentage =
                  totalNotes > 0 ? Math.round((count / totalNotes) * 100) : 0;

                return (
                  <View key={cat.id} style={styles.categoryRow}>
                    <View style={styles.catLabelRow}>
                      <Text
                        style={[
                          styles.catName,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {cat.name}
                      </Text>
                      <Text style={[styles.catCount, { color: theme.text }]}>
                        {count} notes ({percentage}%)
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.progressBarBg,
                        { backgroundColor: theme.inputBg },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${percentage}%`,
                            backgroundColor: theme.primary,
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.doneBtn, { backgroundColor: theme.primary }]}
            onPress={onClose}
          >
            <Text style={styles.doneBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  categoryBreakdown: {
    gap: 12,
    marginBottom: 16,
  },
  categoryRow: {
    gap: 6,
  },
  catLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catName: {
    fontSize: 13,
    fontWeight: '600',
  },
  catCount: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  doneBtn: {
    margin: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
