export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  cardBorder: string;
  cardHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryGradient: string[];
  accent: string;
  danger: string;
  dangerLight: string;
  warning: string;
  warningLight: string;
  success: string;
  successLight: string;
  border: string;
  inputBg: string;
  chipBg: string;
  chipActiveBg: string;
  chipActiveText: string;
  fabBg: string;
  fabIcon: string;
  badgeBg: string;
}

export const lightTheme: ThemeColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  cardHover: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#4F46E5', // Modern Indigo
  primaryLight: '#EEF2FF',
  primaryGradient: ['#4F46E5', '#6366F1'],
  accent: '#06B6D4',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  success: '#10B981',
  successLight: '#D1FAE5',
  border: '#E2E8F0',
  inputBg: '#F1F5F9',
  chipBg: '#F1F5F9',
  chipActiveBg: '#4F46E5',
  chipActiveText: '#FFFFFF',
  fabBg: '#4F46E5',
  fabIcon: '#FFFFFF',
  badgeBg: '#EEF2FF',
};

export const darkTheme: ThemeColors = {
  background: '#0B0F19', // Deep Obsidian
  surface: '#111827',
  card: '#151D2C', // Deep Sapphire Slate
  cardBorder: '#1F293D',
  cardHover: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#6366F1', // Electric Indigo
  primaryLight: '#1E1E38',
  primaryGradient: ['#6366F1', '#818CF8'],
  accent: '#38BDF8',
  danger: '#F87171',
  dangerLight: '#3B181E',
  warning: '#FBBF24',
  warningLight: '#3D2D10',
  success: '#34D399',
  successLight: '#133527',
  border: '#1F293D',
  inputBg: '#131A29',
  chipBg: '#151D2C',
  chipActiveBg: '#6366F1',
  chipActiveText: '#FFFFFF',
  fabBg: '#6366F1',
  fabIcon: '#FFFFFF',
  badgeBg: '#1E1E38',
};

export interface NoteColorOption {
  id: string;
  name: string;
  darkBg: string;
  darkBorder: string;
  lightBg: string;
  lightBorder: string;
  accent: string;
}

export const NOTE_COLORS: NoteColorOption[] = [
  {
    id: 'default',
    name: 'Default',
    darkBg: '#151D2C',
    darkBorder: '#1F293D',
    lightBg: '#FFFFFF',
    lightBorder: '#E2E8F0',
    accent: '#6366F1',
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    darkBg: '#0F2338',
    darkBorder: '#1B3B5C',
    lightBg: '#F0F9FF',
    lightBorder: '#BAE6FD',
    accent: '#0284C7',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    darkBg: '#0D2B22',
    darkBorder: '#164E3D',
    lightBg: '#F0FDF4',
    lightBorder: '#BBF7D0',
    accent: '#10B981',
  },
  {
    id: 'amber',
    name: 'Sunset',
    darkBg: '#31200E',
    darkBorder: '#543615',
    lightBg: '#FFFBEB',
    lightBorder: '#FDE68A',
    accent: '#F59E0B',
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    darkBg: '#251638',
    darkBorder: '#432663',
    lightBg: '#FAF5FF',
    lightBorder: '#E9D5FF',
    accent: '#A855F7',
  },
  {
    id: 'rose',
    name: 'Rose',
    darkBg: '#2E1520',
    darkBorder: '#522338',
    lightBg: '#FFF1F2',
    lightBorder: '#FECDD3',
    accent: '#F43F5E',
  },
  {
    id: 'teal',
    name: 'Teal',
    darkBg: '#0D282E',
    darkBorder: '#154B57',
    lightBg: '#F0FDFA',
    lightBorder: '#99F6E4',
    accent: '#14B8A6',
  },
];

export const CATEGORIES = [
  { id: 'all', name: 'All Notes', icon: 'Folder' },
  { id: 'personal', name: 'Personal', icon: 'User' },
  { id: 'work', name: 'Work', icon: 'Briefcase' },
  { id: 'ideas', name: 'Ideas', icon: 'Sparkles' },
  { id: 'tasks', name: 'Tasks', icon: 'Checklist' },
  { id: 'study', name: 'Study', icon: 'Book' },
];
