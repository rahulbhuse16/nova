export type DocumentType = "pdf" | "image" | "word" | "excel" | "powerpoint" | "note" | "receipt" | "certificate" | "invoice" | "contract" | "other";
export type DocumentCategory = "personal" | "work" | "finance" | "medical" | "travel" | "education" | "projects" | "certificates";
export type DocumentStatus = "active" | "archived" | "deleted" | "processing";
export type ViewMode = "grid" | "list";
export type SortBy = "name" | "date" | "size" | "type";

export interface Document {
  id: string;
  title: string;
  description?: string;
  type: DocumentType;
  category: DocumentCategory;
  size: number; // in bytes
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
  pinned: boolean;
  tags: string[];
  thumbnail?: string;
  aiSummary?: string;
  pages?: number;
  author?: string;
  status: DocumentStatus;
}

export interface Folder {
  id: string;
  name: string;
  category: DocumentCategory;
  documentCount: number;
  createdAt: string;
  color: string;
  icon: string;
}

export interface DocumentOverview {
  totalDocuments: number;
  totalFolders: number;
  favorites: number;
  recentFiles: number;
  storageUsed: number; // in bytes
  storageTotal: number; // in bytes
  aiIndexed: number;
}

export interface DocumentStorage {
  used: number;
  total: number;
  categoryDistribution: Record<DocumentCategory, number>;
  recentUploads: Document[];
}

export interface DocumentFilters {
  type?: DocumentType | "all";
  category?: DocumentCategory | "all";
  dateRange?: { start: string; end: string };
  sizeRange?: { min: number; max: number };
  tags?: string[];
}

export interface DocumentUI {
  selectedDocument: string | null;
  viewMode: ViewMode;
  sortBy: SortBy;
  search: string;
  filters: DocumentFilters;
  showFavoritesOnly: boolean;
  showPinnedOnly: boolean;
}

export interface DocumentState {
  loading: boolean;
  documents: Document[];
  folders: Folder[];
  selectedDocument: Document | null;
  viewMode: ViewMode;
  sortBy: SortBy;
  search: string;
  filters: DocumentFilters;
  favorites: Document[];
  recent: Document[];
  categories: DocumentCategory[];
  storage: DocumentStorage;
  overview: DocumentOverview;
  ui: DocumentUI;
}
