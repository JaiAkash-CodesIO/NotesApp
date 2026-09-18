import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, SortOption } from '../types/note';

const NOTES_STORAGE_KEY = '@modern_notes_app_data_v3';
const THEME_STORAGE_KEY = '@modern_notes_theme_mode';
const VIEW_STORAGE_KEY = '@modern_notes_view_mode';
const SORT_STORAGE_KEY = '@modern_notes_sort_mode';
const PIN_STORAGE_KEY = '@modern_notes_security_pin';

export const SAMPLE_NOTES: Note[] = [
  {
    id: 'sample-1',
    title: '🚀 Welcome to Modern Notes',
    content: 'A high-performance React Native notes app running natively on your Android device.\n\n• Wireless debugging enabled\n• Zero Expo Go overhead\n• 4 major upgrades: Lock, PDF Export, Images & Trash Recovery',
    category: 'personal',
    color: 'sapphire',
    isPinned: true,
    isArchived: false,
    isLocked: false,
    isDeleted: false,
    images: [
      'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80',
    ],
    checklist: [
      { id: 'c1', text: 'Try locking a note with custom 4-digit PIN', completed: false },
      { id: 'c2', text: 'Export note as PDF or Markdown', completed: false },
      { id: 'c3', text: 'Add image attachments to notes', completed: true },
      { id: 'c4', text: 'Test Recycle Bin trash and restore', completed: false },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    updatedAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: 'sample-2',
    title: '🔒 Private Diary & Passwords',
    content: 'This note is protected by your 4-digit PIN! Only you can unlock and view its contents.',
    category: 'personal',
    color: 'amethyst',
    isPinned: true,
    isArchived: false,
    isLocked: true,
    isDeleted: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'sample-3',
    title: '📋 Weekly Roadmap & Sprint',
    content: '1. Review architecture with team\n2. Setup automated pipeline\n3. Optimize UI animations and gesture responsiveness',
    category: 'work',
    color: 'teal',
    isPinned: false,
    isArchived: false,
    isLocked: false,
    isDeleted: false,
    checklist: [
      { id: 'c7', text: 'Complete code review', completed: true },
      { id: 'c8', text: 'Deploy release APK to phone', completed: true },
    ],
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    updatedAt: Date.now() - 1000 * 60 * 60 * 10,
  },
  {
    id: 'sample-4',
    title: '🗑️ Old Reference Notes',
    content: 'This note was moved to the recycle bin. You can restore it anytime within 30 days or delete permanently.',
    category: 'study',
    color: 'rose',
    isPinned: false,
    isArchived: false,
    isLocked: false,
    isDeleted: true,
    deletedAt: Date.now() - 1000 * 60 * 60 * 48,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    updatedAt: Date.now() - 1000 * 60 * 60 * 48,
  }
];

export const loadNotes = async (): Promise<Note[]> => {
  try {
    const rawData = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
    if (!rawData) {
      // First launch: initialize with sample notes
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(SAMPLE_NOTES));
      return SAMPLE_NOTES;
    }
    const notes: Note[] = JSON.parse(rawData);
    return notes;
  } catch (error) {
    console.error('Error loading notes from storage:', error);
    return SAMPLE_NOTES;
  }
};

export const saveNotes = async (notes: Note[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Error saving notes to storage:', error);
    return false;
  }
};

export const createNote = async (
  noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Note> => {
  const newNote: Note = {
    ...noteData,
    id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
    isDeleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const existingNotes = await loadNotes();
  const updatedNotes = [newNote, ...existingNotes];
  await saveNotes(updatedNotes);
  return newNote;
};

export const updateNote = async (
  id: string,
  updates: Partial<Omit<Note, 'id' | 'createdAt'>>
): Promise<Note[]> => {
  const existingNotes = await loadNotes();
  const updatedNotes = existingNotes.map((n) =>
    n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
  );
  await saveNotes(updatedNotes);
  return updatedNotes;
};

// Soft Delete (Move to Trash)
export const moveToTrashNote = async (id: string): Promise<Note[]> => {
  const existingNotes = await loadNotes();
  const updatedNotes = existingNotes.map((n) =>
    n.id === id ? { ...n, isDeleted: true, deletedAt: Date.now(), isPinned: false } : n
  );
  await saveNotes(updatedNotes);
  return updatedNotes;
};

// Restore from Trash
export const restoreNote = async (id: string): Promise<Note[]> => {
  const existingNotes = await loadNotes();
  const updatedNotes = existingNotes.map((n) =>
    n.id === id ? { ...n, isDeleted: false, deletedAt: undefined, updatedAt: Date.now() } : n
  );
  await saveNotes(updatedNotes);
  return updatedNotes;
};

// Permanent Delete
export const deletePermanentlyNote = async (id: string): Promise<Note[]> => {
  const existingNotes = await loadNotes();
  const updatedNotes = existingNotes.filter((n) => n.id !== id);
  await saveNotes(updatedNotes);
  return updatedNotes;
};

// Empty Trash
export const emptyTrash = async (): Promise<Note[]> => {
  const existingNotes = await loadNotes();
  const updatedNotes = existingNotes.filter((n) => !n.isDeleted);
  await saveNotes(updatedNotes);
  return updatedNotes;
};

export const togglePinNote = async (id: string): Promise<Note[]> => {
  const existingNotes = await loadNotes();
  const updatedNotes = existingNotes.map((n) =>
    n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: Date.now() } : n
  );
  await saveNotes(updatedNotes);
  return updatedNotes;
};

export const toggleArchiveNote = async (id: string): Promise<Note[]> => {
  const existingNotes = await loadNotes();
  const updatedNotes = existingNotes.map((n) =>
    n.id === id ? { ...n, isArchived: !n.isArchived, updatedAt: Date.now() } : n
  );
  await saveNotes(updatedNotes);
  return updatedNotes;
};

export const toggleLockNote = async (id: string): Promise<Note[]> => {
  const existingNotes = await loadNotes();
  const updatedNotes = existingNotes.map((n) =>
    n.id === id ? { ...n, isLocked: !n.isLocked, updatedAt: Date.now() } : n
  );
  await saveNotes(updatedNotes);
  return updatedNotes;
};

export const toggleChecklistItemInNote = async (
  noteId: string,
  itemId: string
): Promise<Note[]> => {
  const existingNotes = await loadNotes();
  const updatedNotes = existingNotes.map((n) => {
    if (n.id === noteId && n.checklist) {
      const updatedChecklist = n.checklist.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      return { ...n, checklist: updatedChecklist, updatedAt: Date.now() };
    }
    return n;
  });
  await saveNotes(updatedNotes);
  return updatedNotes;
};

// Security PIN Management
export const getAppPin = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(PIN_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setAppPin = async (pin: string): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(PIN_STORAGE_KEY, pin);
    return true;
  } catch {
    return false;
  }
};

export const saveThemePreference = async (isDark: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
  } catch (e) {
    console.warn('Error saving theme pref', e);
  }
};

export const loadThemePreference = async (): Promise<boolean> => {
  try {
    const pref = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    return pref === null ? true : pref === 'dark';
  } catch {
    return true;
  }
};

export const saveViewPreference = async (mode: 'grid' | 'list'): Promise<void> => {
  try {
    await AsyncStorage.setItem(VIEW_STORAGE_KEY, mode);
  } catch (e) {
    console.warn('Error saving view pref', e);
  }
};

export const loadViewPreference = async (): Promise<'grid' | 'list'> => {
  try {
    const pref = await AsyncStorage.getItem(VIEW_STORAGE_KEY);
    return (pref as 'grid' | 'list') || 'grid';
  } catch {
    return 'grid';
  }
};

export const saveSortPreference = async (sort: SortOption): Promise<void> => {
  try {
    await AsyncStorage.setItem(SORT_STORAGE_KEY, sort);
  } catch (e) {
    console.warn('Error saving sort pref', e);
  }
};

export const loadSortPreference = async (): Promise<SortOption> => {
  try {
    const pref = await AsyncStorage.getItem(SORT_STORAGE_KEY);
    return (pref as SortOption) || 'updated_desc';
  } catch {
    return 'updated_desc';
  }
};

export const sortNotes = (notes: Note[], sortBy: SortOption): Note[] => {
  return [...notes].sort((a, b) => {
    // Pinned notes always come first
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    switch (sortBy) {
      case 'updated_desc':
        return b.updatedAt - a.updatedAt;
      case 'updated_asc':
        return a.updatedAt - b.updatedAt;
      case 'created_desc':
        return b.createdAt - a.createdAt;
      case 'title_asc':
        return a.title.localeCompare(b.title);
      default:
        return b.updatedAt - a.updatedAt;
    }
  });
};
