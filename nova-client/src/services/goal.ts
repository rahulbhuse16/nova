import api from "@/api/api";
import type { Goal, GoalCategory, GoalPriority, GoalStatus } from "@/types/goal.types";

const apiClient = api;

/**
 * =====================================================================
 * TYPES
 * =====================================================================
 */
export interface GoalPlanInput {
  id?: string;
  title: string;
  description?: string;
  category?: GoalCategory;
  priority?: GoalPriority;
  status?: GoalStatus;
  progress?: number;
  deadline: string;
  milestones?: { id: string; title: string; completed: boolean; dueDate: string }[];
  tags?: string[];
}

export interface GoalPlanMilestone {
  id: string;
  title: string;
  dueDate: string;
  description?: string;
}

export interface GoalPlanRisk {
  title: string;
  severity: "low" | "medium" | "high";
  mitigation: string;
}

export interface GoalPlanResult {
  analysis: string;
  deadlineFeasibility: {
    feasible: boolean;
    assessment: string;
    recommendedDeadline?: string;
  };
  milestones: GoalPlanMilestone[];
  weeklyPlan: { week: number; focus: string; tasks: string[] }[];
  dailyActions: { day: string; actions: string[] }[];
  coachingInsights: string[];
  executionStrategy: string;
  risks: GoalPlanRisk[];
  strengths: string[];
  coachMessage: string;
}

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * =====================================================================
 * API CALLS
 * =====================================================================
 */
export const goalApi = {
  /** POST /plan */
  async planGoal(payload: GoalPlanInput): Promise<GoalPlanResult> {
    const { data } = await apiClient.post<StandardResponse<GoalPlanResult>>("/goals/plan", payload);
    return data.data;
  },

  /** POST /:goalId/plan */
  async planGoalById(goalId: string, goal: Goal): Promise<GoalPlanResult> {
    const { data } = await apiClient.post<StandardResponse<GoalPlanResult>>(
      `/goals/${goalId}/plan`,
      { goal }
    );
    return data.data;
  },
};

export default goalApi;
