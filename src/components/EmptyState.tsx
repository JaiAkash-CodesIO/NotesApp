import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeColors } from '../theme/theme';
import { PlusIcon, ChecklistIcon } from './Icons';

interface EmptyStateProps {
  theme: ThemeColors;
  isSearching: boolean;
  isArchive: boolean;
  onCreateNote: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  theme,
  isSearching,
  isArchive,
  onCreateNote,
}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.primaryLight, borderColor: theme.primary },
        ]}
      >
        <ChecklistIcon size={40} color={theme.primary} />
      </View>

      <Text style={[styles.title, { color: theme.text }]}>
        {isSearching
          ? 'No matching notes'
          : isArchive
          ? 'No archived notes'
          : 'No notes yet'}
      </Text>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {isSearching
          ? 'Try searching with different keywords or categories.'
          : isArchive
          ? 'Notes you archive will show up here.'
          : 'Capture ideas, to-do lists, and memories on your phone.'}
      </Text>

      {!isArchive && !isSearching && (
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.primary }]}
          onPress={onCreateNote}
        >
          <PlusIcon size={18} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Note</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
