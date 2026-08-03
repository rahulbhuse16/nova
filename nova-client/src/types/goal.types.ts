export type GoalPriority = "low" | "medium" | "high" | "urgent";
export type GoalStatus = "not_started" | "in_progress" | "completed" | "archived" | "on_hold";
export type GoalCategory = "personal" | "career" | "health" | "finance" | "learning" | "fitness" | "travel" | "business" | "family";
export type GoalSortBy = "deadline" | "priority" | "progress" | "created" | "title";

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  completedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number; // 0-100
  deadline: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  color: string;
  icon: string;
  milestones: Milestone[];
  tags: string[];
}

export interface GoalOverview {
  activeGoals: number;
  completedGoals: number;
  weeklyProgress: number;
  currentStreak: number;
  successRate: number;
}

export interface GoalAnalytics {
  totalGoals: number;
  completedThisMonth: number;
  averageCompletionTime: number;
  topCategory: GoalCategory;
  productivityScore: number;
}

export interface GoalUI {
  selectedGoal: string | null;
  categoryFilter: GoalCategory | "all";
  search: string;
  sortBy: GoalSortBy;
  showArchived: boolean;
  showFavoritesOnly: boolean;
}

export interface GoalState {
  loading: boolean;
  goals: Goal[];
  selectedGoal: Goal | null;
  categoryFilter: GoalCategory | "all";
  search: string;
  sortBy: GoalSortBy;
  overview: GoalOverview;
  analytics: GoalAnalytics;
  ui: GoalUI;
}
