import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note, Folder, NoteState, ViewMode, SortBy, NoteFolder, NoteColor, NoteFilters } from "../types/note.types";

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Nova Architecture",
    content: "Nova is an AI-powered Daily Operating System designed to help users manage their daily tasks, goals, finances, and knowledge in one unified interface. The architecture consists of multiple modules including Today, Goals, Finance, Documents, and Notes.",
    preview: "Nova is an AI-powered Daily Operating System designed to help users manage their daily tasks, goals, finances, and knowledge...",
    folder: "work",
    tags: ["nova", "architecture", "system"],
    favorite: true,
    pinned: true,
    color: "blue",
    createdAt: "2026-01-15",
    updatedAt: "2026-01-25",
    lastViewed: "2026-01-25",
    wordCount: 45,
    readingTime: 2,
    linkedGoals: ["goal-1"],
    linkedTasks: [],
    linkedDocuments: [],
    status: "active",
  },
  {
    id: "2",
    title: "Business Ideas",
    content: "1. AI-powered personal assistant for daily productivity\n2. Smart document management system\n3. Automated financial tracking and insights\n4. Goal achievement platform with AI coaching\n5. Knowledge management system with semantic search",
    preview: "1. AI-powered personal assistant for daily productivity\n2. Smart document management system...",
    folder: "ideas",
    tags: ["business", "startup", "ideas"],
    favorite: false,
    pinned: true,
    color: "green",
    createdAt: "2026-01-10",
    updatedAt: "2026-01-20",
    lastViewed: "2026-01-20",
    wordCount: 38,
    readingTime: 2,
    linkedGoals: [],
    linkedTasks: ["task-1"],
    linkedDocuments: [],
    status: "active",
  },
  {
    id: "3",
    title: "Weekly Planning",
    content: "Monday: Focus on Nova development and architecture review\nTuesday: Meeting with design team for UI improvements\nWednesday: Code review and bug fixes\nThursday: Feature planning for next sprint\nFriday: Documentation and team sync\n\nGoals for the week:\n- Complete Notes module\n- Improve AI insights\n- Add voice note support",
    preview: "Monday: Focus on Nova development and architecture review\nTuesday: Meeting with design team...",
    folder: "work",
    tags: ["planning", "weekly", "productivity"],
    favorite: true,
    pinned: false,
    color: "yellow",
    createdAt: "2026-01-22",
    updatedAt: "2026-01-22",
    lastViewed: "2026-01-22",
    wordCount: 52,
    readingTime: 3,
    linkedGoals: ["goal-2"],
    linkedTasks: ["task-2", "task-3"],
    linkedDocuments: [],
    status: "active",
  },
  {
    id: "4",
    title: "Meeting Notes - Design Review",
    content: "Attendees: Alex, Sarah, Mike\n\nDiscussed:\n- New color scheme for dark mode\n- Typography improvements\n- Glassmorphism effects\n- Animation transitions\n\nAction items:\n- Sarah to create new design mockups\n- Alex to implement color palette\n- Mike to work on animations",
    preview: "Attendees: Alex, Sarah, Mike\n\nDiscussed:\n- New color scheme for dark mode...",
    folder: "work",
    tags: ["meeting", "design", "team"],
    favorite: false,
    pinned: false,
    color: "purple",
    createdAt: "2026-01-18",
    updatedAt: "2026-01-18",
    lastViewed: "2026-01-18",
    wordCount: 41,
    readingTime: 2,
    linkedGoals: [],
    linkedTasks: ["task-4"],
    linkedDocuments: [],
    status: "active",
  },
  {
    id: "5",
    title: "React Tips & Best Practices",
    content: "1. Use functional components with hooks\n2. Implement proper error boundaries\n3. Optimize with useMemo and useCallback\n4. Keep components small and focused\n5. Use TypeScript for type safety\n6. Implement proper state management\n7. Write unit tests for critical logic\n8. Use proper key props in lists",
    preview: "1. Use functional components with hooks\n2. Implement proper error boundaries...",
    folder: "learning",
    tags: ["react", "programming", "best-practices"],
    favorite: true,
    pinned: false,
    color: "blue",
    createdAt: "2026-01-12",
    updatedAt: "2026-01-20",
    lastViewed: "2026-01-20",
    wordCount: 48,
    readingTime: 2,
    linkedGoals: ["goal-3"],
    linkedTasks: [],
    linkedDocuments: [],
    status: "active",
  },
  {
    id: "6",
    title: "Learning Roadmap 2026",
    content: "Q1 2026:\n- Master React and TypeScript\n- Learn advanced Redux patterns\n- Study AI/ML fundamentals\n\nQ2 2026:\n- Deep dive into system design\n- Learn cloud architecture\n- Study database optimization\n\nQ3 2026:\n- Focus on AI integration\n- Learn natural language processing\n- Study computer vision basics\n\nQ4 2026:\n- Master DevOps practices\n- Learn security best practices\n- Study performance optimization",
    preview: "Q1 2026:\n- Master React and TypeScript\n- Learn advanced Redux patterns...",
    folder: "learning",
    tags: ["learning", "roadmap", "growth"],
    favorite: true,
    pinned: true,
    color: "green",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-15",
    lastViewed: "2026-01-15",
    wordCount: 68,
    readingTime: 4,
    linkedGoals: ["goal-3", "goal-4"],
    linkedTasks: [],
    linkedDocuments: [],
    status: "active",
  },
  {
    id: "7",
    title: "Travel Checklist - Europe",
    content: "Documents:\n- Passport\n- Visa\n- Travel insurance\n- Flight tickets\n- Hotel reservations\n\nEssentials:\n- Phone charger\n- Power bank\n- Universal adapter\n- Camera\n- Medications\n\nClothing:\n- Weather-appropriate clothes\n- Comfortable shoes\n- Rain jacket\n\nActivities:\n- Museum visits\n- Local food tours\n- Historical sites",
    preview: "Documents:\n- Passport\n- Visa\n- Travel insurance...",
    folder: "travel",
    tags: ["travel", "checklist", "europe"],
    favorite: false,
    pinned: false,
    color: "orange",
    createdAt: "2026-01-08",
    updatedAt: "2026-01-08",
    lastViewed: "2026-01-08",
    wordCount: 55,
    readingTime: 3,
    linkedGoals: [],
    linkedTasks: ["task-5"],
    linkedDocuments: ["doc-1", "doc-2"],
    status: "active",
  },
  {
    id: "8",
    title: "Books To Read",
    content: "Fiction:\n- The Midnight Library\n- Project Hail Mary\n- The Martian\n\nNon-fiction:\n- Atomic Habits\n- Deep Work\n- The Lean Startup\n- Thinking, Fast and Slow\n\nTech:\n- Clean Code\n- The Pragmatic Programmer\n- Design Patterns\n\nBusiness:\n- Zero to One\n- The Hard Thing About Hard Things\n- Good to Great",
    preview: "Fiction:\n- The Midnight Library\n- Project Hail Mary\n- The Martian...",
    folder: "personal",
    tags: ["books", "reading", "learning"],
    favorite: true,
    pinned: false,
    color: "pink",
    createdAt: "2026-01-05",
    updatedAt: "2026-01-20",
    lastViewed: "2026-01-20",
    wordCount: 58,
    readingTime: 3,
    linkedGoals: ["goal-5"],
    linkedTasks: [],
    linkedDocuments: [],
    status: "active",
  },
  {
    id: "9",
    title: "AI Ideas for Nova",
    content: "1. Smart note summarization\n2. Automatic task extraction from notes\n3. Goal suggestions based on content\n4. Document categorization\n5. Voice-to-text for quick capture\n6. Semantic search across all modules\n7. Relationship mapping between notes\n8. AI-powered writing assistant\n9. Automatic tag suggestions\n10. Content recommendations",
    preview: "1. Smart note summarization\n2. Automatic task extraction from notes...",
    folder: "ideas",
    tags: ["ai", "nova", "innovation"],
    favorite: false,
    pinned: true,
    color: "purple",
    createdAt: "2026-01-14",
    updatedAt: "2026-01-24",
    lastViewed: "2026-01-24",
    wordCount: 52,
    readingTime: 3,
    linkedGoals: ["goal-1"],
    linkedTasks: [],
    linkedDocuments: [],
    status: "active",
  },
  {
    id: "10",
    title: "Finance Planning",
    content: "Monthly Budget:\n- Income: $8,000\n- Rent: $2,000\n- Food: $800\n- Transportation: $400\n- Utilities: $300\n- Entertainment: $500\n- Savings: $2,000\n- Investments: $2,000\n\nFinancial Goals:\n1. Build emergency fund (6 months)\n2. Maximize retirement contributions\n3. Diversify investment portfolio\n4. Reduce unnecessary expenses\n5. Increase passive income",
    preview: "Monthly Budget:\n- Income: $8,000\n- Rent: $2,000\n- Food: $800...",
    folder: "finance",
    tags: ["finance", "budget", "planning"],
    favorite: true,
    pinned: false,
    color: "green",
    createdAt: "2026-01-02",
    updatedAt: "2026-01-22",
    lastViewed: "2026-01-22",
    wordCount: 62,
    readingTime: 3,
    linkedGoals: ["goal-6"],
    linkedTasks: ["task-6"],
    linkedDocuments: ["doc-3"],
    status: "active",
  },
];

const mockFolders: Folder[] = [
  { id: "f1", name: "all", displayName: "All Notes", noteCount: 10, color: "bg-indigo-500/20", icon: "📝" },
  { id: "f2", name: "personal", displayName: "Personal", noteCount: 1, color: "bg-pink-500/20", icon: "👤" },
  { id: "f3", name: "work", displayName: "Work", noteCount: 3, color: "bg-blue-500/20", icon: "💼" },
  { id: "f4", name: "ideas", displayName: "Ideas", noteCount: 2, color: "bg-yellow-500/20", icon: "💡" },
  { id: "f5", name: "learning", displayName: "Learning", noteCount: 2, color: "bg-green-500/20", icon: "📚" },
  { id: "f6", name: "projects", displayName: "Projects", noteCount: 0, color: "bg-purple-500/20", icon: "🚀" },
  { id: "f7", name: "journal", displayName: "Journal", noteCount: 0, color: "bg-cyan-500/20", icon: "📔" },
  { id: "f8", name: "travel", displayName: "Travel", noteCount: 1, color: "bg-orange-500/20", icon: "✈️" },
  { id: "f9", name: "finance", displayName: "Finance", noteCount: 1, color: "bg-emerald-500/20", icon: "💰" },
  { id: "f10", name: "health", displayName: "Health", noteCount: 0, color: "bg-rose-500/20", icon: "❤️" },
  { id: "f11", name: "documents", displayName: "Documents", noteCount: 0, color: "bg-slate-500/20", icon: "📄" },
];

const initialState: NoteState = {
  loading: false,
  notes: mockNotes,
  folders: mockFolders,
  selectedNote: null,
  search: "",
  filters: {},
  viewMode: "grid",
  sortBy: "updated",
  favorites: mockNotes.filter((n) => n.favorite),
  pinned: mockNotes.filter((n) => n.pinned),
  recent: mockNotes.slice(0, 5),
  tags: ["nova", "architecture", "business", "startup", "ideas", "planning", "weekly", "productivity", "meeting", "design", "team", "react", "programming", "best-practices", "learning", "roadmap", "growth", "travel", "checklist", "europe", "books", "reading", "ai", "innovation", "finance", "budget"],
  overview: {
    totalNotes: 10,
    totalFolders: 11,
    pinned: 4,
    favorites: 6,
    recent: 5,
    aiIndexed: 10,
  },
  ui: {
    selectedNote: null,
    viewMode: "grid",
    sortBy: "updated",
    search: "",
    filters: {},
    showFavoritesOnly: false,
    showPinnedOnly: false,
  },
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    selectNote: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((n) => n.id === action.payload);
      state.selectedNote = note || null;
      state.ui.selectedNote = action.payload;
      if (note) {
        note.lastViewed = new Date().toISOString().split("T")[0];
      }
    },
    createNote: (state, action: PayloadAction<Note>) => {
      state.notes.unshift(action.payload);
      state.overview.totalNotes += 1;
      state.recent.unshift(action.payload);
    },
    updateNote: (state, action: PayloadAction<{ id: string; updates: Partial<Note> }>) => {
      const { id, updates } = action.payload;
      const index = state.notes.findIndex((n) => n.id === id);
      if (index !== -1) {
        state.notes[index] = { ...state.notes[index], ...updates, updatedAt: new Date().toISOString().split("T")[0] };
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((n) => n.id !== action.payload);
      state.overview.totalNotes -= 1;
      if (state.selectedNote?.id === action.payload) {
        state.selectedNote = null;
        state.ui.selectedNote = null;
      }
    },
    duplicateNote: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((n) => n.id === action.payload);
      if (note) {
        const duplicate = {
          ...note,
          id: `${Date.now()}`,
          title: `${note.title} (Copy)`,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };
        state.notes.unshift(duplicate);
        state.overview.totalNotes += 1;
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((n) => n.id === action.payload);
      if (note) {
        note.favorite = !note.favorite;
        note.updatedAt = new Date().toISOString().split("T")[0];
        if (note.favorite) {
          state.favorites.push(note);
          state.overview.favorites += 1;
        } else {
          state.favorites = state.favorites.filter((n) => n.id !== action.payload);
          state.overview.favorites -= 1;
        }
      }
    },
    togglePinned: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((n) => n.id === action.payload);
      if (note) {
        note.pinned = !note.pinned;
        note.updatedAt = new Date().toISOString().split("T")[0];
        if (note.pinned) {
          state.pinned.push(note);
          state.overview.pinned += 1;
        } else {
          state.pinned = state.pinned.filter((n) => n.id !== action.payload);
          state.overview.pinned -= 1;
        }
      }
    },
    archiveNote: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((n) => n.id === action.payload);
      if (note) {
        note.status = "archived";
        note.updatedAt = new Date().toISOString().split("T")[0];
      }
    },
    restoreNote: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((n) => n.id === action.payload);
      if (note) {
        note.status = "active";
        note.updatedAt = new Date().toISOString().split("T")[0];
      }
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.ui.search = action.payload;
    },
    setFilter: (state, action: PayloadAction<{ key: keyof NoteFilters; value: any }>) => {
      const { key, value } = action.payload;
      (state.filters as any)[key] = value;
      (state.ui.filters as any)[key] = value;
    },
    setSort: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload;
      state.ui.sortBy = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
      state.ui.viewMode = action.payload;
    },
  },
});

export const {
  selectNote,
  createNote,
  updateNote,
  deleteNote,
  duplicateNote,
  toggleFavorite,
  togglePinned,
  archiveNote,
  restoreNote,
  setSearch,
  setFilter,
  setSort,
  setViewMode,
} = notesSlice.actions;

export default notesSlice.reducer;
