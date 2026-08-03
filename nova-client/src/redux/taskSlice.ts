import taskApi, { GenerateSubtasksResult, OptimizeScheduleResult, GenerateSuggestionsResult, Task, TaskQueryFilters, TaskInput } from "@/services/task";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";


/**
 * =====================================================================
 * STATE SHAPE
 * =====================================================================
 */
interface AiState {
  subtasksLoading: boolean;
  scheduleLoading: boolean;
  suggestionsLoading: boolean;
  lastSubtasksResult: GenerateSubtasksResult | null;
  lastScheduleResult: OptimizeScheduleResult | null;
  lastSuggestionsResult: GenerateSuggestionsResult | null;
  error: string | null;
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  creating: boolean;
  savingDraft: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
  ai: AiState;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  loading: false,
  creating: false,
  savingDraft: false,
  updating: false,
  deleting: false,
  error: null,
  ai: {
    subtasksLoading: false,
    scheduleLoading: false,
    suggestionsLoading: false,
    lastSubtasksResult: null,
    lastScheduleResult: null,
    lastSuggestionsResult: null,
    error: null,
  },
};

/**
 * =====================================================================
 * ASYNC THUNKS
 * =====================================================================
 */
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters: TaskQueryFilters | undefined, { rejectWithValue }) => {
    try {
      return await taskApi.getTasks(filters);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchTask = createAsyncThunk(
  "tasks/fetchTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      return await taskApi.getTask(taskId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (payload: TaskInput, { rejectWithValue }) => {
    try {
      return await taskApi.createTask(payload);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, payload }: { taskId: string; payload: Partial<TaskInput> }, { rejectWithValue }) => {
    try {
      return await taskApi.updateTask(taskId, payload);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      await taskApi.deleteTask(taskId);
      return taskId;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const saveDraft = createAsyncThunk(
  "tasks/saveDraft",
  async (payload: TaskInput, { rejectWithValue }) => {
    try {
      return await taskApi.saveDraft(payload);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const toggleCompletion = createAsyncThunk(
  "tasks/toggleCompletion",
  async (taskId: string, { rejectWithValue }) => {
    try {
      return await taskApi.toggleCompletion(taskId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const generateSubtasks = createAsyncThunk(
  "tasks/generateSubtasks",
  async (taskId: string, { rejectWithValue }) => {
    try {
      return await taskApi.generateSubtasks(taskId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const optimizeSchedule = createAsyncThunk(
  "tasks/optimizeSchedule",
  async (taskId: string, { rejectWithValue }) => {
    try {
      return await taskApi.optimizeSchedule(taskId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const generateTaskSuggestions = createAsyncThunk(
  "tasks/generateTaskSuggestions",
  async (taskId: string, { rejectWithValue }) => {
    try {
      return await taskApi.generateTaskSuggestions(taskId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

/**
 * =====================================================================
 * SLICE
 * =====================================================================
 */
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearCurrentTask(state) {
      state.currentTask = null;
    },
    clearTaskError(state) {
      state.error = null;
      state.ai.error = null;
    },
    setCurrentTaskLocal(state, action: PayloadAction<Task | null>) {
      // Useful for optimistic local edits before a save/draft round-trip.
      state.currentTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch tasks";
      })

      // fetchTask
      .addCase(fetchTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch task";
      })

      // createTask
      .addCase(createTask.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.creating = false;
        state.tasks.unshift(action.payload);
        state.currentTask = action.payload;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.creating = false;
        state.error = (action.payload as string) || "Failed to create task";
      })

      // updateTask
      .addCase(updateTask.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.updating = false;
        state.currentTask = action.payload;
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.updating = false;
        state.error = (action.payload as string) || "Failed to update task";
      })

      // deleteTask
      .addCase(deleteTask.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleting = false;
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
        if (state.currentTask?._id === action.payload) state.currentTask = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.deleting = false;
        state.error = (action.payload as string) || "Failed to delete task";
      })

      // saveDraft
      .addCase(saveDraft.pending, (state) => {
        state.savingDraft = true;
        state.error = null;
      })
      .addCase(saveDraft.fulfilled, (state, action: PayloadAction<Task>) => {
        state.savingDraft = false;
        state.tasks.unshift(action.payload);
        state.currentTask = action.payload;
      })
      .addCase(saveDraft.rejected, (state, action) => {
        state.savingDraft = false;
        state.error = (action.payload as string) || "Failed to save draft";
      })

      // toggleCompletion
      .addCase(toggleCompletion.fulfilled, (state, action: PayloadAction<Task>) => {
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.tasks[idx] = action.payload;
        if (state.currentTask?._id === action.payload._id) state.currentTask = action.payload;
      })
      .addCase(toggleCompletion.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to toggle completion";
      })

      // generateSubtasks
      .addCase(generateSubtasks.pending, (state) => {
        state.ai.subtasksLoading = true;
        state.ai.error = null;
      })
      .addCase(generateSubtasks.fulfilled, (state, action: PayloadAction<GenerateSubtasksResult>) => {
        state.ai.subtasksLoading = false;
        state.ai.lastSubtasksResult = action.payload;
        state.currentTask = action.payload.task;
      })
      .addCase(generateSubtasks.rejected, (state, action) => {
        state.ai.subtasksLoading = false;
        state.ai.error = (action.payload as string) || "Failed to generate subtasks";
      })

      // optimizeSchedule
      .addCase(optimizeSchedule.pending, (state) => {
        state.ai.scheduleLoading = true;
        state.ai.error = null;
      })
      .addCase(optimizeSchedule.fulfilled, (state, action: PayloadAction<OptimizeScheduleResult>) => {
        state.ai.scheduleLoading = false;
        state.ai.lastScheduleResult = action.payload;
        state.currentTask = action.payload.task;
      })
      .addCase(optimizeSchedule.rejected, (state, action) => {
        state.ai.scheduleLoading = false;
        state.ai.error = (action.payload as string) || "Failed to optimize schedule";
      })

      // generateTaskSuggestions
      .addCase(generateTaskSuggestions.pending, (state) => {
        state.ai.suggestionsLoading = true;
        state.ai.error = null;
      })
      .addCase(
        generateTaskSuggestions.fulfilled,
        (state, action: PayloadAction<GenerateSuggestionsResult>) => {
          state.ai.suggestionsLoading = false;
          state.ai.lastSuggestionsResult = action.payload;
          state.currentTask = action.payload.task;
        }
      )
      .addCase(generateTaskSuggestions.rejected, (state, action) => {
        state.ai.suggestionsLoading = false;
        state.ai.error = (action.payload as string) || "Failed to generate suggestions";
      });
  },
});

export const { clearCurrentTask, clearTaskError, setCurrentTaskLocal } = taskSlice.actions;
export default taskSlice.reducer;