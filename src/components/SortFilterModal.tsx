import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SortOption } from '../types/note';
import { ThemeColors } from '../theme/theme';
import { CloseIcon, CheckIcon, SortIcon } from './Icons';

interface SortFilterModalProps {
  visible: boolean;
  currentSort: SortOption;
  theme: ThemeColors;
  onSelectSort: (sort: SortOption) => void;
  onClose: () => void;
}

const SORT_OPTIONS: { id: SortOption; label: string; desc: string }[] = [
  {
    id: 'updated_desc',
    label: 'Recently Modified',
    desc: 'Notes with recent changes first',
  },
  {
    id: 'created_desc',
    label: 'Date Created (Newest)',
    desc: 'Recently created notes first',
  },
  {
    id: 'updated_asc',
    label: 'Oldest Modified',
    desc: 'Least recently updated notes first',
  },
  {
    id: 'title_asc',
    label: 'Title (A → Z)',
    desc: 'Alphabetical order by note title',
  },
];

export const SortFilterModal: React.FC<SortFilterModalProps> = ({
  visible,
  currentSort,
  theme,
  onSelectSort,
  onClose,
}) => {
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
                <SortIcon size={18} color={theme.primary} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>Sort Notes</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={18} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.optionsList}>
            {SORT_OPTIONS.map((opt) => {
              const isSelected = currentSort === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor: isSelected
                        ? theme.primaryLight
                        : 'transparent',
                      borderColor: isSelected
                        ? theme.primary
                        : theme.cardBorder,
                    },
                  ]}
                  onPress={() => {
                    onSelectSort(opt.id);
                    onClose();
                  }}
                >
                  <View style={styles.optionTextContainer}>
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: isSelected ? theme.primary : theme.text,
                          fontWeight: isSelected ? '700' : '600',
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text
                      style={[
                        styles.optionDesc,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {opt.desc}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected
                          ? theme.primary
                          : theme.textMuted,
                        backgroundColor: isSelected
                          ? theme.primary
                          : 'transparent',
                      },
                    ]}
                  >
                    {isSelected && <CheckIcon size={12} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
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
  optionsList: {
    padding: 14,
    gap: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  optionDesc: {
    fontSize: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
