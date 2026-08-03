export type NoteColor = "default" | "blue" | "green" | "yellow" | "red" | "purple" | "pink" | "orange";
export type NoteFolder = "all" | "personal" | "work" | "ideas" | "learning" | "projects" | "journal" | "travel" | "finance" | "health" | "documents";
export type NoteStatus = "active" | "archived" | "deleted";
export type ViewMode = "grid" | "list";
export type SortBy = "date" | "title" | "updated" | "created";

export interface Note {
  id: string;
  title: string;
  content: string;
  preview: string;
  folder: NoteFolder;
  tags: string[];
  favorite: boolean;
  pinned: boolean;
  color: NoteColor;
  createdAt: string;
  updatedAt: string;
  lastViewed: string;
  wordCount: number;
  readingTime: number;
  attachments?: string[];
  linkedGoals?: string[];
  linkedTasks?: string[];
  linkedDocuments?: string[];
  status: NoteStatus;
}

export interface Folder {
  id: string;
  name: NoteFolder;
  displayName: string;
  noteCount: number;
  color: string;
  icon: string;
}

export interface NoteOverview {
  totalNotes: number;
  totalFolders: number;
  pinned: number;
  favorites: number;
  recent: number;
  aiIndexed: number;
}

export interface NoteFilters {
  folder?: NoteFolder;
  tags?: string[];
  color?: NoteColor;
  dateRange?: { start: string; end: string };
}

export interface NoteUI {
  selectedNote: string | null;
  viewMode: ViewMode;
  sortBy: SortBy;
  search: string;
  filters: NoteFilters;
  showFavoritesOnly: boolean;
  showPinnedOnly: boolean;
}

export interface NoteState {
  loading: boolean;
  notes: Note[];
  folders: Folder[];
  selectedNote: Note | null;
  search: string;
  filters: NoteFilters;
  viewMode: ViewMode;
  sortBy: SortBy;
  favorites: Note[];
  pinned: Note[];
  recent: Note[];
  tags: string[];
  overview: NoteOverview;
  ui: NoteUI;
}
