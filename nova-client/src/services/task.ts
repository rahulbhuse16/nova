import api from "@/api/api";



const apiClient=api

/**
 * =====================================================================
 * TYPES
 * (Mirrors the backend Task model / standard response shape)
 * =====================================================================
 */
export interface Subtask {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
}

export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "draft" | "pending" | "in-progress" | "completed" | "cancelled";

export interface Task {
  _id: string;
  user: string;
  title: string;
  description?: string;
  category?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  startTime?: string;
  endTime?: string;
  estimatedDuration?: string;
  timezone?: string;
  repeat?: string;
  reminder?: string;
  customReminder?: string;
  subtasks: Subtask[];
  tags: string[];
  completed: boolean;
  completedAt?: string;
  aiSummary?: string;
  aiSuggestions?: unknown;
  aiOptimized: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  category?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  startTime?: string;
  endTime?: string;
  estimatedDuration?: string;
  timezone?: string;
  repeat?: string;
  reminder?: string;
  customReminder?: string;
  subtasks?: Subtask[];
  tags?: string[];
}

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface GenerateSubtasksResult {
  subtasks: { title: string; description?: string }[];
  task: Task;
}

export interface OptimizeScheduleResult {
  recommendedStartTime: string;
  recommendedEndTime: string;
  estimatedDuration: string;
  reason: string;
  task: Task;
}

export interface TaskSuggestion {
  title: string;
  description: string;
  confidence: number;
}

export interface GenerateSuggestionsResult {
  summary: string;
  priority: string;
  estimatedHours: number;
  suggestions: TaskSuggestion[];
  task: Task;
}

export interface TaskQueryFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  completed?: boolean;
}

/**
 * =====================================================================
 * API CALLS
 * (One function per backend route)
 * =====================================================================
 */
export const taskApi = {
  /** GET / */
  async getTasks(filters?: TaskQueryFilters): Promise<Task[]> {
    const { data } = await apiClient.get<StandardResponse<Task[]>>("/tasks", {
      params: filters,
    });
    return data.data;
  },

  /** GET /:taskId */
  async getTask(taskId: string): Promise<Task> {
    const { data } = await apiClient.get<StandardResponse<Task>>(`/tasks/${taskId}`);
    return data.data;
  },

  /** POST / */
  async createTask(payload: TaskInput): Promise<Task> {
    const { data } = await apiClient.post<StandardResponse<Task>>("/tasks", payload);
    return data.data;
  },

  /** PATCH /:taskId */
  async updateTask(taskId: string, payload: Partial<TaskInput>): Promise<Task> {
    const { data } = await apiClient.patch<StandardResponse<Task>>(`/tasks/${taskId}`, payload);
    return data.data;
  },

  /** DELETE /:taskId */
  async deleteTask(taskId: string): Promise<{ _id: string }> {
    const { data } = await apiClient.delete<StandardResponse<{ _id: string }>>(`/tasks/${taskId}`);
    return data.data;
  },

  /** POST /draft */
  async saveDraft(payload: TaskInput): Promise<Task> {
    const { data } = await apiClient.post<StandardResponse<Task>>("/tasks/draft", payload);
    return data.data;
  },

  /** PATCH /:taskId/toggle */
  async toggleCompletion(taskId: string): Promise<Task> {
    const { data } = await apiClient.patch<StandardResponse<Task>>(`/tasks/${taskId}/toggle`);
    return data.data;
  },

  /** POST /:taskId/generate-subtasks */
  async generateSubtasks(taskId: string): Promise<GenerateSubtasksResult> {
    const { data } = await apiClient.post<StandardResponse<GenerateSubtasksResult>>(
      `/tasks/${taskId}/generate-subtasks`
    );
    return data.data;
  },

  /** POST /:taskId/optimize-schedule */
  async optimizeSchedule(taskId: string): Promise<OptimizeScheduleResult> {
    const { data } = await apiClient.post<StandardResponse<OptimizeScheduleResult>>(
      `/tasks/${taskId}/optimize-schedule`
    );
    return data.data;
  },

  /** POST /:taskId/generate-suggestions */
  async generateTaskSuggestions(taskId: string): Promise<GenerateSuggestionsResult> {
    const { data } = await apiClient.post<StandardResponse<GenerateSuggestionsResult>>(
      `/tasks/${taskId}/generate-suggestions`
    );
    return data.data;
  },
};

export default taskApi;