import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { CATEGORIES, ThemeColors } from '../theme/theme';
import { TrashIcon } from './Icons';

interface CategoryBarProps {
  theme: ThemeColors;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  categoryCounts: Record<string, number>;
  trashCount?: number;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  theme,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  trashCount = 0,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? theme.chipActiveBg : theme.chipBg,
                  borderColor: isSelected ? theme.primary : theme.border,
                },
              ]}
              onPress={() => onSelectCategory(cat.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? theme.chipActiveText : theme.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {cat.name}
              </Text>
              {count > 0 && (
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor: isSelected
                        ? 'rgba(255, 255, 255, 0.25)'
                        : theme.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      {
                        color: isSelected ? '#FFFFFF' : theme.textMuted,
                      },
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Trash / Recycle Bin Category Chip */}
        <TouchableOpacity
          style={[
            styles.chip,
            {
              backgroundColor:
                selectedCategory === 'trash'
                  ? theme.danger
                  : theme.chipBg,
              borderColor:
                selectedCategory === 'trash'
                  ? theme.danger
                  : theme.border,
            },
          ]}
          onPress={() => onSelectCategory('trash')}
        >
          <TrashIcon
            size={12}
            color={selectedCategory === 'trash' ? '#FFFFFF' : theme.danger}
          />
          <Text
            style={[
              styles.chipText,
              {
                color:
                  selectedCategory === 'trash'
                    ? '#FFFFFF'
                    : theme.danger,
                fontWeight: selectedCategory === 'trash' ? '700' : '500',
              },
            ]}
          >
            Trash
          </Text>
          {trashCount > 0 && (
            <View
              style={[
                styles.countBadge,
                {
                  backgroundColor:
                    selectedCategory === 'trash'
                      ? 'rgba(255, 255, 255, 0.25)'
                      : theme.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  {
                    color:
                      selectedCategory === 'trash'
                        ? '#FFFFFF'
                        : theme.danger,
                  },
                ]}
              >
                {trashCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    gap: 5,
  },
  chipText: {
    fontSize: 12.5,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
});
