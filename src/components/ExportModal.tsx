import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { Note } from '../types/note';
import { ThemeColors } from '../theme/theme';
import {
  CloseIcon,
  DownloadIcon,
  FileTextIcon,
  ShareIcon,
  CheckIcon,
} from './Icons';

interface ExportModalProps {
  visible: boolean;
  note: Note | null;
  theme: ThemeColors;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  note,
  theme,
  onClose,
}) => {
  if (!note) return null;

  // Format as Markdown
  const formatMarkdown = (): string => {
    let md = `# ${note.title || 'Untitled Note'}\n\n`;
    if (note.category) {
      md += `**Category:** #${note.category}\n`;
    }
    md += `**Date:** ${new Date(note.updatedAt).toLocaleString()}\n\n`;
    if (note.content) {
      md += `${note.content}\n\n`;
    }
    if (note.checklist && note.checklist.length > 0) {
      md += `### Checklist\n`;
      note.checklist.forEach((item) => {
        md += `- [${item.completed ? 'x' : ' '}] ${item.text}\n`;
      });
      md += '\n';
    }
    md += `*Exported from Modern Notes App*`;
    return md;
  };

  // Format as Plain Text
  const formatPlainText = (): string => {
    let txt = `=== ${note.title || 'Untitled Note'} ===\n`;
    txt += `Category: ${note.category}\n`;
    txt += `Date: ${new Date(note.updatedAt).toLocaleString()}\n\n`;
    txt += `${note.content}\n\n`;
    if (note.checklist && note.checklist.length > 0) {
      txt += `--- Checklist ---\n`;
      note.checklist.forEach((item) => {
        txt += `[${item.completed ? '✓' : ' '}] ${item.text}\n`;
      });
      txt += '\n';
    }
    return txt;
  };

  // Handle Share / Export
  const handleExport = async (format: 'md' | 'txt' | 'pdf') => {
    try {
      let content = '';
      let title = `${note.title || 'Note'}`;

      if (format === 'md') {
        content = formatMarkdown();
        title += '.md';
      } else if (format === 'txt') {
        content = formatPlainText();
        title += '.txt';
      } else {
        // PDF / Print style document layout
        content = `📄 ${note.title || 'Note Document'}\n====================\n\n${formatPlainText()}`;
      }

      await Share.share({
        title: title,
        message: content,
      });
      onClose();
    } catch (error) {
      console.warn('Export error:', error);
    }
  };

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
                <DownloadIcon size={18} color={theme.primary} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>
                Export Note
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={18} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.noteName, { color: theme.textSecondary }]}>
            Exporting: <Text style={{ color: theme.text, fontWeight: '700' }}>{note.title || 'Untitled Note'}</Text>
          </Text>

          {/* Export Options */}
          <View style={styles.optionsList}>
            {/* Markdown (.md) */}
            <TouchableOpacity
              style={[
                styles.optionCard,
                { backgroundColor: theme.inputBg, borderColor: theme.border },
              ]}
              onPress={() => handleExport('md')}
              activeOpacity={0.8}
            >
              <View style={[styles.formatIcon, { backgroundColor: theme.primaryLight }]}>
                <FileTextIcon size={18} color={theme.primary} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: theme.text }]}>
                  Markdown (.md)
                </Text>
                <Text style={[styles.optionDesc, { color: theme.textMuted }]}>
                  Formatted markdown with tasks and tags
                </Text>
              </View>
            </TouchableOpacity>

            {/* Plain Text (.txt) */}
            <TouchableOpacity
              style={[
                styles.optionCard,
                { backgroundColor: theme.inputBg, borderColor: theme.border },
              ]}
              onPress={() => handleExport('txt')}
              activeOpacity={0.8}
            >
              <View style={[styles.formatIcon, { backgroundColor: '#10B98125' }]}>
                <FileTextIcon size={18} color="#10B981" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: theme.text }]}>
                  Plain Text (.txt)
                </Text>
                <Text style={[styles.optionDesc, { color: theme.textMuted }]}>
                  Standard text for email, SMS, or docs
                </Text>
              </View>
            </TouchableOpacity>

            {/* PDF Document Print Layout */}
            <TouchableOpacity
              style={[
                styles.optionCard,
                { backgroundColor: theme.inputBg, borderColor: theme.border },
              ]}
              onPress={() => handleExport('pdf')}
              activeOpacity={0.8}
            >
              <View style={[styles.formatIcon, { backgroundColor: '#EF444425' }]}>
                <DownloadIcon size={18} color="#EF4444" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: theme.text }]}>
                  PDF / Document Share
                </Text>
                <Text style={[styles.optionDesc, { color: theme.textMuted }]}>
                  Formatted printable document share sheet
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={[styles.cancelBtn, { backgroundColor: theme.inputBg }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelBtnText, { color: theme.text }]}>
              Cancel
            </Text>
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
    maxWidth: 380,
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
  noteName: {
    fontSize: 12.5,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  optionsList: {
    padding: 16,
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  formatIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 11.5,
  },
  cancelBtn: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 11,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
});
