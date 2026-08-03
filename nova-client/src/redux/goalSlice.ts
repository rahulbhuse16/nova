import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Goal, GoalState, GoalCategory, GoalSortBy, GoalPriority, GoalStatus } from "../types/goal.types";

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Launch Nova MVP",
    description: "Complete the MVP launch of Nova AI-powered Daily Operating System with all core features",
    category: "career",
    priority: "high",
    status: "in_progress",
    progress: 95,
    deadline: "2026-02-15",
    favorite: true,
    createdAt: "2025-12-01",
    updatedAt: "2026-01-28",
    color: "bg-indigo-500/20",
    icon: "🚀",
    milestones: [
      { id: "m1", title: "Design System", completed: true, dueDate: "2025-12-15", completedAt: "2025-12-14" },
      { id: "m2", title: "Core Components", completed: true, dueDate: "2026-01-01", completedAt: "2025-12-31" },
      { id: "m3", title: "Today Page", completed: true, dueDate: "2026-01-15", completedAt: "2026-01-14" },
      { id: "m4", title: "Finance Module", completed: true, dueDate: "2026-01-25", completedAt: "2026-01-24" },
      { id: "m5", title: "Goals Module", completed: true, dueDate: "2026-01-31", completedAt: "2026-01-30" },
      { id: "m6", title: "Testing & QA", completed: false, dueDate: "2026-02-10" },
      { id: "m7", title: "Launch", completed: false, dueDate: "2026-02-15" },
    ],
    tags: ["Nova", "MVP", "Launch"],
  },
  {
    id: "2",
    title: "Create Finance Module",
    description: "Build a comprehensive finance tracking module with budget management and analytics",
    category: "career",
    priority: "high",
    status: "in_progress",
    progress: 72,
    deadline: "2026-01-31",
    favorite: true,
    createdAt: "2025-12-15",
    updatedAt: "2026-01-28",
    color: "bg-emerald-500/20",
    icon: "💰",
    milestones: [
      { id: "m1", title: "Design Components", completed: true, dueDate: "2026-01-05", completedAt: "2026-01-04" },
      { id: "m2", title: "Balance Cards", completed: true, dueDate: "2026-01-10", completedAt: "2026-01-09" },
      { id: "m3", title: "Transaction List", completed: true, dueDate: "2026-01-15", completedAt: "2026-01-14" },
      { id: "m4", title: "Analytics", completed: true, dueDate: "2026-01-20", completedAt: "2026-01-19" },
      { id: "m5", title: "Integration", completed: false, dueDate: "2026-01-25" },
      { id: "m6", title: "Testing", completed: false, dueDate: "2026-01-31" },
    ],
    tags: ["Finance", "Development"],
  },
  {
    id: "3",
    title: "Read 24 Books",
    description: "Read 24 books this year to improve knowledge and expand perspectives",
    category: "learning",
    priority: "medium",
    status: "in_progress",
    progress: 45,
    deadline: "2026-12-31",
    favorite: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-28",
    color: "bg-amber-500/20",
    icon: "📚",
    milestones: [
      { id: "m1", title: "Q1 - 6 Books", completed: true, dueDate: "2026-03-31", completedAt: "2026-01-28" },
      { id: "m2", title: "Q2 - 6 Books", completed: false, dueDate: "2026-06-30" },
      { id: "m3", title: "Q3 - 6 Books", completed: false, dueDate: "2026-09-30" },
      { id: "m4", title: "Q4 - 6 Books", completed: false, dueDate: "2026-12-31" },
    ],
    tags: ["Reading", "Personal Growth"],
  },
  {
    id: "4",
    title: "Emergency Fund",
    description: "Build an emergency fund covering 6 months of expenses",
    category: "finance",
    priority: "high",
    status: "in_progress",
    progress: 82,
    deadline: "2026-06-30",
    favorite: true,
    createdAt: "2025-07-01",
    updatedAt: "2026-01-28",
    color: "bg-cyan-500/20",
    icon: "🏦",
    milestones: [
      { id: "m1", title: "₹50,000", completed: true, dueDate: "2025-09-30", completedAt: "2025-09-28" },
      { id: "m2", title: "₹100,000", completed: true, dueDate: "2025-12-31", completedAt: "2025-12-30" },
      { id: "m3", title: "₹150,000", completed: true, dueDate: "2026-03-31", completedAt: "2026-03-28" },
      { id: "m4", title: "₹200,000", completed: false, dueDate: "2026-06-30" },
    ],
    tags: ["Savings", "Finance"],
  },
  {
    id: "5",
    title: "Lose 8 kg",
    description: "Achieve healthy weight through consistent exercise and balanced diet",
    category: "fitness",
    priority: "medium",
    status: "in_progress",
    progress: 58,
    deadline: "2026-04-30",
    favorite: false,
    createdAt: "2025-10-01",
    updatedAt: "2026-01-28",
    color: "bg-rose-500/20",
    icon: "💪",
    milestones: [
      { id: "m1", title: "2 kg", completed: true, dueDate: "2025-11-30", completedAt: "2025-11-28" },
      { id: "m2", title: "4 kg", completed: true, dueDate: "2026-01-31", completedAt: "2026-01-28" },
      { id: "m3", title: "6 kg", completed: false, dueDate: "2026-03-31" },
      { id: "m4", title: "8 kg", completed: false, dueDate: "2026-04-30" },
    ],
    tags: ["Health", "Fitness"],
  },
  {
    id: "6",
    title: "Run Half Marathon",
    description: "Train for and complete a half marathon race",
    category: "fitness",
    priority: "low",
    status: "in_progress",
    progress: 34,
    deadline: "2026-05-15",
    favorite: false,
    createdAt: "2025-11-01",
    updatedAt: "2026-01-28",
    color: "bg-purple-500/20",
    icon: "🏃",
    milestones: [
      { id: "m1", title: "5K Training", completed: true, dueDate: "2025-12-31", completedAt: "2025-12-28" },
      { id: "m2", title: "10K Training", completed: false, dueDate: "2026-02-28" },
      { id: "m3", title: "15K Training", completed: false, dueDate: "2026-04-15" },
      { id: "m4", title: "Race Day", completed: false, dueDate: "2026-05-15" },
    ],
    tags: ["Running", "Fitness"],
  },
  {
    id: "7",
    title: "Learn TypeScript",
    description: "Master TypeScript for better type safety in development",
    category: "learning",
    priority: "medium",
    status: "completed",
    progress: 100,
    deadline: "2026-01-15",
    favorite: false,
    createdAt: "2025-10-15",
    updatedAt: "2026-01-10",
    color: "bg-blue-500/20",
    icon: "📘",
    milestones: [
      { id: "m1", title: "Basics", completed: true, dueDate: "2025-11-15", completedAt: "2025-11-10" },
      { id: "m2", title: "Advanced Types", completed: true, dueDate: "2025-12-15", completedAt: "2025-12-10" },
      { id: "m3", title: "Project Practice", completed: true, dueDate: "2026-01-15", completedAt: "2026-01-10" },
    ],
    tags: ["TypeScript", "Learning"],
  },
  {
    id: "8",
    title: "Europe Trip",
    description: "Plan and execute a 2-week trip to Europe",
    category: "travel",
    priority: "medium",
    status: "not_started",
    progress: 15,
    deadline: "2026-08-15",
    favorite: true,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-28",
    color: "bg-teal-500/20",
    icon: "✈️",
    milestones: [
      { id: "m1", title: "Save Money", completed: true, dueDate: "2026-03-31", completedAt: "2026-01-28" },
      { id: "m2", title: "Book Flights", completed: false, dueDate: "2026-04-30" },
      { id: "m3", title: "Plan Itinerary", completed: false, dueDate: "2026-06-30" },
      { id: "m4", title: "Pack & Go", completed: false, dueDate: "2026-08-15" },
    ],
    tags: ["Travel", "Europe"],
  },
];

const initialState: GoalState = {
  loading: false,
  goals: mockGoals,
  selectedGoal: null,
  categoryFilter: "all",
  search: "",
  sortBy: "deadline",
  overview: {
    activeGoals: 6,
    completedGoals: 1,
    weeklyProgress: 12,
    currentStreak: 9,
    successRate: 87,
  },
  analytics: {
    totalGoals: 8,
    completedThisMonth: 1,
    averageCompletionTime: 45,
    topCategory: "career",
    productivityScore: 85,
  },
  ui: {
    selectedGoal: null,
    categoryFilter: "all",
    search: "",
    sortBy: "deadline",
    showArchived: false,
    showFavoritesOnly: false,
  },
};

const goalSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    selectGoal: (state, action: PayloadAction<string>) => {
      const goal = state.goals.find((g) => g.id === action.payload);
      state.selectedGoal = goal || null;
      state.ui.selectedGoal = action.payload;
    },
    addGoal: (state, action: PayloadAction<Goal>) => {
      state.goals.unshift(action.payload);
      state.overview.activeGoals += 1;
      state.analytics.totalGoals += 1;
    },
    updateGoal: (state, action: PayloadAction<{ id: string; updates: Partial<Goal> }>) => {
      const { id, updates } = action.payload;
      const index = state.goals.findIndex((g) => g.id === id);
      if (index !== -1) {
        state.goals[index] = { ...state.goals[index], ...updates, updatedAt: new Date().toISOString().split("T")[0] };
     }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      const goal = state.goals.find((g) => g.id === action.payload);
      state.goals = state.goals.filter((g) => g.id !== action.payload);
      if (goal?.status === "in_progress") {
        state.overview.activeGoals -= 1;
      }
      state.analytics.totalGoals -= 1;
      if (state.selectedGoal?.id === action.payload) {
        state.selectedGoal = null;
        state.ui.selectedGoal = null;
      }
    },
    completeGoal: (state, action: PayloadAction<string>) => {
      const goal = state.goals.find((g) => g.id === action.payload);
      if (goal) {
        goal.status = "completed";
        goal.progress = 100;
        goal.updatedAt = new Date().toISOString().split("T")[0];
        state.overview.activeGoals -= 1;
        state.overview.completedGoals += 1;
        state.analytics.completedThisMonth += 1;
      }
    },
    archiveGoal: (state, action: PayloadAction<string>) => {
      const goal = state.goals.find((g) => g.id === action.payload);
      if (goal) {
        const wasActive = goal.status !== "completed" && goal.status !== "archived";
        goal.status = "archived";
        goal.updatedAt = new Date().toISOString().split("T")[0];
        if (wasActive) {
          state.overview.activeGoals -= 1;
        }
      }
    },
    setCategory: (state, action: PayloadAction<GoalCategory | "all">) => {
      state.categoryFilter = action.payload;
      state.ui.categoryFilter = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.ui.search = action.payload;
    },
    setSort: (state, action: PayloadAction<GoalSortBy>) => {
      state.sortBy = action.payload;
      state.ui.sortBy = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const goal = state.goals.find((g) => g.id === action.payload);
      if (goal) {
        goal.favorite = !goal.favorite;
        goal.updatedAt = new Date().toISOString().split("T")[0];
      }
    },
    toggleCompleted: (state, action: PayloadAction<string>) => {
      const goal = state.goals.find((g) => g.id === action.payload);
      if (goal && goal.status !== "archived") {
        if (goal.status === "completed") {
          goal.status = "in_progress";
          goal.progress = goal.progress < 100 ? goal.progress : 50;
          state.overview.activeGoals += 1;
          state.overview.completedGoals -= 1;
        } else {
          goal.status = "completed";
          goal.progress = 100;
          state.overview.activeGoals -= 1;
          state.overview.completedGoals += 1;
          state.analytics.completedThisMonth += 1;
        }
        goal.updatedAt = new Date().toISOString().split("T")[0];
      }
    },
    resetFilters: (state) => {
      state.categoryFilter = "all";
      state.search = "";
      state.sortBy = "deadline";
      state.ui.categoryFilter = "all";
      state.ui.search = "";
      state.ui.sortBy = "deadline";
    },
  },
});

export const {
  selectGoal,
  addGoal,
  updateGoal,
  deleteGoal,
  completeGoal,
  archiveGoal,
  setCategory,
  setSearch,
  setSort,
  toggleFavorite,
  toggleCompleted,
  resetFilters,
} = goalSlice.actions;

export default goalSlice.reducer;
