import api from '@/api/api';

export interface DailyPlan {
  topPriority: string;
  recommendedFocus: string;
  importantTasks: string[];
  commitments: string[];
  suggestedOrder: string[];
  personalizedMessage: string;
}

export interface MemoryInsight {
  type: 'decision' | 'commitment' | 'goal' | 'pattern' | 'reminder';
  content: string;
  relevance: string;
  date?: string;
}

export interface TodayData {
  dailyPlan: DailyPlan;
  memoryInsights: MemoryInsight[];
  date: string;
}

export const todayService = {
  getTodayData: async (): Promise<TodayData> => {
    const response = await api.get<TodayData>('/today');
    return response.data;
  },

  generateDailyPlan: async (): Promise<DailyPlan> => {
    const response = await api.post<DailyPlan>('/today/daily-plan');
    return response.data;
  },

  getMemoryInsights: async (): Promise<MemoryInsight[]> => {
    const response = await api.get<MemoryInsight[]>('/today/memory-insights');
    return response.data;
  },
};
