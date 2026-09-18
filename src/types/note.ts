export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  isLocked?: boolean;
  isDeleted?: boolean;
  deletedAt?: number;
  images?: string[];
  checklist?: ChecklistItem[];
  createdAt: number;
  updatedAt: number;
}

export type Category = {
  id: string;
  name: string;
  icon?: string;
  color?: string;
};

export type ViewMode = 'grid' | 'list';

export type SortOption = 'updated_desc' | 'updated_asc' | 'created_desc' | 'title_asc';

export type ExportFormat = 'markdown' | 'text' | 'pdf_share';
