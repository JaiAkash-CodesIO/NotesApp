import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { ThemeColors } from '../theme/theme';
import {
  SearchIcon,
  CloseIcon,
  SunIcon,
  MoonIcon,
  GridIcon,
  ListIcon,
  WifiIcon,
  ArchiveIcon,
  SortIcon,
  StatsIcon,
  ShareIcon,
} from './Icons';
import { ViewMode, SortOption } from '../types/note';

interface HeaderProps {
  theme: ThemeColors;
  isDark: boolean;
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  onOpenWirelessModal: () => void;
  onOpenSortModal: () => void;
  onOpenStatsModal: () => void;
  onOpenShareModal: () => void;
  isArchiveView: boolean;
  onToggleArchiveView: () => void;
  notesCount: number;
  currentSort: SortOption;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  isDark,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleViewMode,
  onOpenWirelessModal,
  onOpenSortModal,
  onOpenStatsModal,
  onOpenShareModal,
  isArchiveView,
  onToggleArchiveView,
  notesCount,
  currentSort,
}) => {
  const getSortLabel = () => {
    switch (currentSort) {
      case 'updated_desc':
        return 'Recent';
      case 'created_desc':
        return 'Newest';
      case 'updated_asc':
        return 'Oldest';
      case 'title_asc':
        return 'A-Z';
      default:
        return 'Sort';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header Row with Top-Left Share Button, Branding and Controls */}
      <View style={styles.topRow}>
        {/* Top Left Section: Share Button + Logo + Title */}
        <View style={styles.leftSection}>
          {/* Top Left Corner Share Button */}
          <TouchableOpacity
            style={[
              styles.shareIconBtn,
              {
                backgroundColor: theme.primaryLight,
                borderColor: theme.primary,
              },
            ]}
            onPress={onOpenShareModal}
            activeOpacity={0.8}
            accessibilityLabel="Share App via WhatsApp or Telegram"
          >
            <ShareIcon size={16} color={theme.primary} />
          </TouchableOpacity>

          {/* App Branding */}
          <View style={styles.brandingRow}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="cover"
            />
            <View style={styles.titleInfo}>
              <View style={styles.titleWithBadge}>
                <Text style={[styles.appTitle, { color: theme.text }]}>
                  {isArchiveView ? 'Archive' : 'Notes'}
                </Text>
                <View
                  style={[
                    styles.countPill,
                    { backgroundColor: theme.primaryLight },
                  ]}
                >
                  <Text style={[styles.countPillText, { color: theme.primary }]}>
                    {notesCount}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Primary Right Controls */}
        <View style={styles.primaryControls}>
          {/* Grid / List Mode */}
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={onToggleViewMode}
            accessibilityLabel="Toggle View Layout"
          >
            {viewMode === 'grid' ? (
              <ListIcon size={16} color={theme.textSecondary} />
            ) : (
              <GridIcon size={16} color={theme.textSecondary} />
            )}
          </TouchableOpacity>

          {/* Dark / Light Mode */}
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={onToggleTheme}
            accessibilityLabel="Toggle Dark/Light Mode"
          >
            {isDark ? (
              <SunIcon size={16} color="#FBBF24" />
            ) : (
              <MoonIcon size={16} color="#6366F1" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input Bar */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: theme.inputBg,
            borderColor: searchQuery.length > 0 ? theme.primary : theme.border,
          },
        ]}
      >
        <SearchIcon size={17} color={searchQuery.length > 0 ? theme.primary : theme.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search notes, tasks, or tags..."
          placeholderTextColor={theme.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            style={styles.clearSearchBtn}
          >
            <CloseIcon size={15} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Action Chips Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickChipsContent}
        style={styles.quickChipsScroll}
      >
        {/* Share App Pill */}
        <TouchableOpacity
          style={[
            styles.actionChip,
            { backgroundColor: theme.primaryLight, borderColor: theme.primary },
          ]}
          onPress={onOpenShareModal}
        >
          <ShareIcon size={13} color={theme.primary} />
          <Text style={[styles.actionChipText, { color: theme.primary, fontWeight: '700' }]}>
            Share App
          </Text>
        </TouchableOpacity>

        {/* Sort Trigger Pill */}
        <TouchableOpacity
          style={[
            styles.actionChip,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
          onPress={onOpenSortModal}
        >
          <SortIcon size={13} color={theme.textSecondary} />
          <Text style={[styles.actionChipText, { color: theme.text }]}>
            {getSortLabel()}
          </Text>
        </TouchableOpacity>

        {/* Stats Trigger Pill */}
        <TouchableOpacity
          style={[
            styles.actionChip,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
          onPress={onOpenStatsModal}
        >
          <StatsIcon size={13} color={theme.textSecondary} />
          <Text style={[styles.actionChipText, { color: theme.textSecondary }]}>
            Insights
          </Text>
        </TouchableOpacity>

        {/* Archive Toggle Pill */}
        <TouchableOpacity
          style={[
            styles.actionChip,
            {
              backgroundColor: isArchiveView ? theme.primaryLight : theme.card,
              borderColor: isArchiveView ? theme.primary : theme.cardBorder,
            },
          ]}
          onPress={onToggleArchiveView}
        >
          <ArchiveIcon
            size={13}
            color={isArchiveView ? theme.primary : theme.textSecondary}
          />
          <Text
            style={[
              styles.actionChipText,
              { color: isArchiveView ? theme.primary : theme.textSecondary },
            ]}
          >
            {isArchiveView ? 'Active Notes' : 'Archive'}
          </Text>
        </TouchableOpacity>

        {/* Wireless Debugging Guide Pill */}
        <TouchableOpacity
          style={[
            styles.actionChip,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
          onPress={onOpenWirelessModal}
        >
          <WifiIcon size={13} color={theme.accent} />
          <Text style={[styles.actionChipText, { color: theme.textSecondary }]}>
            Wi-Fi Debug
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shareIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 34,
    height: 34,
    borderRadius: 9,
  },
  titleInfo: {
    justifyContent: 'center',
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appTitle: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  countPill: {
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 9,
  },
  countPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  primaryControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    borderWidth: 1.2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  quickChipsScroll: {
    marginTop: 8,
    marginBottom: 4,
  },
  quickChipsContent: {
    gap: 8,
    alignItems: 'center',
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
