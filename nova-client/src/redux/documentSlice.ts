import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Document, Folder, DocumentState, ViewMode, SortBy, DocumentCategory, DocumentType } from "../types/document.types";

const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Resume.pdf",
    description: "Professional resume with work experience and skills",
    type: "pdf",
    category: "personal",
    size: 245000,
    createdAt: "2025-12-15",
    updatedAt: "2026-01-20",
    favorite: true,
    pinned: true,
    tags: ["resume", "career", "professional"],
    thumbnail: "📄",
    aiSummary: "Professional resume with 5 years of experience in software development",
    pages: 2,
    author: "Alex Rivera",
    status: "active",
  },
  {
    id: "2",
    title: "Invoice_Jan2026.pdf",
    description: "Monthly invoice for services rendered",
    type: "invoice",
    category: "work",
    size: 128000,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    favorite: false,
    pinned: false,
    tags: ["invoice", "work", "finance"],
    thumbnail: "🧾",
    aiSummary: "Invoice for consulting services - $5,000 total",
    pages: 1,
    author: "Client",
    status: "active",
  },
  {
    id: "3",
    title: "Passport.pdf",
    description: "Valid passport document for international travel",
    type: "pdf",
    category: "travel",
    size: 512000,
    createdAt: "2025-08-20",
    updatedAt: "2025-08-20",
    favorite: true,
    pinned: true,
    tags: ["passport", "travel", "id"],
    thumbnail: "🛂",
    aiSummary: "Passport valid until 2030",
    pages: 2,
    author: "Government",
    status: "active",
  },
  {
    id: "4",
    title: "Tax_Report_2025.pdf",
    description: "Annual tax report and filing documents",
    type: "pdf",
    category: "finance",
    size: 1024000,
    createdAt: "2026-01-15",
    updatedAt: "2026-01-15",
    favorite: false,
    pinned: false,
    tags: ["tax", "finance", "annual"],
    thumbnail: "📊",
    aiSummary: "Tax report showing total income and deductions for 2025",
    pages: 8,
    author: "Tax Consultant",
    status: "active",
  },
  {
    id: "5",
    title: "Medical_Report.pdf",
    description: "Annual health checkup results",
    type: "pdf",
    category: "medical",
    size: 768000,
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
    favorite: false,
    pinned: false,
    tags: ["medical", "health", "report"],
    thumbnail: "🏥",
    aiSummary: "Annual health checkup - all parameters normal",
    pages: 4,
    author: "Hospital",
    status: "active",
  },
  {
    id: "6",
    title: "Driving_License.pdf",
    description: "Valid driving license document",
    type: "pdf",
    category: "personal",
    size: 384000,
    createdAt: "2025-03-15",
    updatedAt: "2025-03-15",
    favorite: true,
    pinned: false,
    tags: ["license", "id", "driving"],
    thumbnail: "🚗",
    aiSummary: "Driving license valid until 2028",
    pages: 1,
    author: "DMV",
    status: "active",
  },
  {
    id: "7",
    title: "Offer_Letter.pdf",
    description: "Job offer letter from Nova Inc",
    type: "pdf",
    category: "work",
    size: 156000,
    createdAt: "2025-11-01",
    updatedAt: "2025-11-01",
    favorite: true,
    pinned: true,
    tags: ["offer", "work", "career"],
    thumbnail: "✉️",
    aiSummary: "Job offer for Senior Developer position at Nova Inc",
    pages: 3,
    author: "Nova Inc",
    status: "active",
  },
  {
    id: "8",
    title: "Nova_Architecture.pdf",
    description: "System architecture documentation for Nova",
    type: "pdf",
    category: "projects",
    size: 2048000,
    createdAt: "2026-01-05",
    updatedAt: "2026-01-25",
    favorite: false,
    pinned: true,
    tags: ["architecture", "nova", "technical"],
    thumbnail: "🏗️",
    aiSummary: "Complete system architecture with microservices design",
    pages: 15,
    author: "Tech Team",
    status: "active",
  },
  {
    id: "9",
    title: "Travel_Tickets.pdf",
    description: "Flight tickets for Europe trip",
    type: "pdf",
    category: "travel",
    size: 256000,
    createdAt: "2026-01-20",
    updatedAt: "2026-01-20",
    favorite: false,
    pinned: false,
    tags: ["travel", "tickets", "flight"],
    thumbnail: "✈️",
    aiSummary: "Round trip flight tickets to Europe - August 2026",
    pages: 2,
    author: "Airline",
    status: "active",
  },
  {
    id: "10",
    title: "Property_Documents.pdf",
    description: "Property ownership and registration documents",
    type: "pdf",
    category: "finance",
    size: 3072000,
    createdAt: "2025-06-10",
    updatedAt: "2025-06-10",
    favorite: false,
    pinned: false,
    tags: ["property", "finance", "legal"],
    thumbnail: "🏠",
    aiSummary: "Property registration and ownership documents",
    pages: 12,
    author: "Registry",
    status: "active",
  },
];

const mockFolders: Folder[] = [
  { id: "f1", name: "Personal", category: "personal", documentCount: 3, createdAt: "2025-01-01", color: "bg-indigo-500/20", icon: "👤" },
  { id: "f2", name: "Work", category: "work", documentCount: 3, createdAt: "2025-01-01", color: "bg-emerald-500/20", icon: "💼" },
  { id: "f3", name: "Finance", category: "finance", documentCount: 3, createdAt: "2025-01-01", color: "bg-cyan-500/20", icon: "💰" },
  { id: "f4", name: "Medical", category: "medical", documentCount: 1, createdAt: "2025-01-01", color: "bg-rose-500/20", icon: "🏥" },
  { id: "f5", name: "Travel", category: "travel", documentCount: 2, createdAt: "2025-01-01", color: "bg-amber-500/20", icon: "✈️" },
  { id: "f6", name: "Education", category: "education", documentCount: 0, createdAt: "2025-01-01", color: "bg-purple-500/20", icon: "📚" },
  { id: "f7", name: "Projects", category: "projects", documentCount: 1, createdAt: "2025-01-01", color: "bg-teal-500/20", icon: "🚀" },
  { id: "f8", name: "Certificates", category: "certificates", documentCount: 0, createdAt: "2025-01-01", color: "bg-orange-500/20", icon: "🎓" },
];

const initialState: DocumentState = {
  loading: false,
  documents: mockDocuments,
  folders: mockFolders,
  selectedDocument: null,
  viewMode: "grid",
  sortBy: "date",
  search: "",
  filters: {},
  favorites: mockDocuments.filter((d) => d.favorite),
  recent: mockDocuments.slice(0, 5),
  categories: ["personal", "work", "finance", "medical", "travel", "education", "projects", "certificates"],
  storage: {
    used: 8584000,
    total: 10737418240,
    categoryDistribution: {
      personal: 893000,
      work: 2332000,
      finance: 4128000,
      medical: 768000,
      travel: 768000,
      education: 0,
      projects: 2048000,
      certificates: 0,
    },
    recentUploads: mockDocuments.slice(0, 3),
  },
  overview: {
    totalDocuments: 10,
    totalFolders: 8,
    favorites: 4,
    recentFiles: 5,
    storageUsed: 8584000,
    storageTotal: 10737418240,
    aiIndexed: 10,
  },
  ui: {
    selectedDocument: null,
    viewMode: "grid",
    sortBy: "date",
    search: "",
    filters: {},
    showFavoritesOnly: false,
    showPinnedOnly: false,
  },
};

const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    selectDocument: (state, action: PayloadAction<string>) => {
      const document = state.documents.find((d) => d.id === action.payload);
      state.selectedDocument = document || null;
      state.ui.selectedDocument = action.payload;
    },
    addDocument: (state, action: PayloadAction<Document>) => {
      state.documents.unshift(action.payload);
      state.overview.totalDocuments += 1;
      state.storage.used += action.payload.size;
      state.recent.unshift(action.payload);
      state.storage.recentUploads.unshift(action.payload);
    },
    updateDocument: (state, action: PayloadAction<{ id: string; updates: Partial<Document> }>) => {
      const { id, updates } = action.payload;
      const index = state.documents.findIndex((d) => d.id === id);
      if (index !== -1) {
        state.documents[index] = { ...state.documents[index], ...updates, updatedAt: new Date().toISOString().split("T")[0] };
      }
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      const document = state.documents.find((d) => d.id === action.payload);
      state.documents = state.documents.filter((d) => d.id !== action.payload);
      if (document) {
        state.storage.used -= document.size;
        state.overview.totalDocuments -= 1;
      }
      if (state.selectedDocument?.id === action.payload) {
        state.selectedDocument = null;
        state.ui.selectedDocument = null;
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const document = state.documents.find((d) => d.id === action.payload);
      if (document) {
        document.favorite = !document.favorite;
        document.updatedAt = new Date().toISOString().split("T")[0];
        if (document.favorite) {
          state.favorites.push(document);
          state.overview.favorites += 1;
        } else {
          state.favorites = state.favorites.filter((d) => d.id !== action.payload);
          state.overview.favorites -= 1;
        }
      }
    },
    togglePin: (state, action: PayloadAction<string>) => {
      const document = state.documents.find((d) => d.id === action.payload);
      if (document) {
        document.pinned = !document.pinned;
        document.updatedAt = new Date().toISOString().split("T")[0];
      }
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
      state.ui.viewMode = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.ui.search = action.payload;
    },
    setSort: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload;
      state.ui.sortBy = action.payload;
    },
    setCategory: (state, action: PayloadAction<DocumentCategory | "all">) => {
      state.filters.category = action.payload === "all" ? undefined : action.payload;
      state.ui.filters.category = action.payload === "all" ? undefined : action.payload;
    },
    setType: (state, action: PayloadAction<DocumentType | "all">) => {
      state.filters.type = action.payload === "all" ? undefined : action.payload;
      state.ui.filters.type = action.payload === "all" ? undefined : action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.search = "";
      state.ui.filters = {};
      state.ui.search = "";
    },
    toggleFavoritesOnly: (state) => {
      state.ui.showFavoritesOnly = !state.ui.showFavoritesOnly;
    },
    togglePinnedOnly: (state) => {
      state.ui.showPinnedOnly = !state.ui.showPinnedOnly;
    },
  },
});

export const {
  selectDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  toggleFavorite,
  togglePin,
  setViewMode,
  setSearch,
  setSort,
  setCategory,
  setType,
  clearFilters,
  toggleFavoritesOnly,
  togglePinnedOnly,
} = documentSlice.actions;

export default documentSlice.reducer;
