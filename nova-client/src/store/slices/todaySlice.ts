import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { todayService } from '../../services/todayService';
import type { DailyPlan, MemoryInsight, TodayData } from '../../services/todayService';

interface TodayState {
  dailyPlan: DailyPlan | null;
  memoryInsights: MemoryInsight[];
  todayData: TodayData | null;
  loading: boolean;
  error: string | null;
}

const initialState: TodayState = {
  dailyPlan: {
    topPriority: 'Complete the most important task for today',
    recommendedFocus: 'Focus on deep work and avoid unnecessary context switching',
    importantTasks: [
      'Finish the current project milestone',
      'Review pending tasks',
      'Plan tomorrow’s priorities',
    ],
    commitments: [
      'Complete the task you committed to earlier',
    ],
    suggestedOrder: [
      'Start with the highest-impact task',
      'Handle important commitments',
      'Complete smaller tasks',
    ],
    personalizedMessage:
      'Good morning! Start with one meaningful task and build momentum from there.',
  },

  memoryInsights: [
    {
      type: 'goal',
      content: 'You are currently working toward completing your main project milestone.',
      relevance: 'High relevance for today',
      date: new Date().toISOString(),
    },
    {
      type: 'pattern',
      content: 'You tend to be more productive when you focus on one task at a time.',
      relevance: 'Based on your previous activity',
    },
    {
      type: 'commitment',
      content: 'You previously planned to make progress on your current project.',
      relevance: 'Relevant to today’s plan',
    },
  ],

  todayData: {
    date: new Date().toISOString().split('T')[0],
    dailyPlan: {
      topPriority: 'Complete the most important task for today',
      recommendedFocus: 'Focus on deep work and avoid unnecessary context switching',
      importantTasks: [
        'Finish the current project milestone',
        'Review pending tasks',
        'Plan tomorrow’s priorities',
      ],
      commitments: [
        'Complete the task you committed to earlier',
      ],
      suggestedOrder: [
        'Start with the highest-impact task',
        'Handle important commitments',
        'Complete smaller tasks',
      ],
      personalizedMessage:
        'Good morning! Start with one meaningful task and build momentum from there.',
    },
    memoryInsights: [
      {
        type: 'goal',
        content: 'You are currently working toward completing your main project milestone.',
        relevance: 'High relevance for today',
      },
    ],
  },

  loading: false,
  error: null,
};

export const fetchTodayData = createAsyncThunk(
  'today/fetchTodayData',
  async () => {
    return await todayService.getTodayData();
  }
);

export const generateDailyPlan = createAsyncThunk(
  'today/generateDailyPlan',
  async () => {
    return await todayService.generateDailyPlan();
  }
);

export const fetchMemoryInsights = createAsyncThunk(
  'today/fetchMemoryInsights',
  async () => {
    return await todayService.getMemoryInsights();
  }
);

const todaySlice = createSlice({
  name: 'today',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayData.fulfilled, (state, action) => {
        state.loading = false;
        state.todayData = action.payload;
        state.dailyPlan = action.payload.dailyPlan;
        state.memoryInsights = action.payload.memoryInsights;
      })
      .addCase(fetchTodayData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch today data';
      })
      .addCase(generateDailyPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateDailyPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyPlan = action.payload;
      })
      .addCase(generateDailyPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate daily plan';
      })
      .addCase(fetchMemoryInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemoryInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.memoryInsights = action.payload;
      })
      .addCase(fetchMemoryInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch memory insights';
      });
  },
});

export const { clearError } = todaySlice.actions;
export default todaySlice.reducer;
