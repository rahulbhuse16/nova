import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { travelService, TravelPlan, Destination } from "../services/travelService";

export type TravelStep = "welcome" | "destination" | "dates" | "travellers" | "budget" | "transport" | "accommodation" | "interests" | "planning" | "result";

export interface TravelState {
  currentStep: TravelStep;
  completedSteps: TravelStep[];
  destination: Destination | null;
  dates: { start: string; end: string; duration: number };
  travellers: { type: string; count: number };
  budget: { amount: number; currency: string; level: string };
  transport: string;
  accommodation: string;
  interests: string[];
  travelPlan: TravelPlan | null;
  thinkingSteps: string[];
  currentThinkingStep: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
}

const initialState: TravelState = {
  currentStep: "welcome",
  completedSteps: [],
  destination: null,
  dates: { start: "", end: "", duration: 0 },
  travellers: { type: "solo", count: 1 },
  budget: { amount: 2000, currency: "USD", level: "balanced" },
  transport: "",
  accommodation: "",
  interests: [],
  travelPlan: null,
  thinkingSteps: [],
  currentThinkingStep: 0,
  loading: false,
  saving: false,
  error: null,
  success: null,
};

// Async Thunks
export const generateTravelPlan = createAsyncThunk(
  "travel/generatePlan",
  async (params: {
    destination: Destination;
    dates: { start: string; end: string };
    travellers: { type: string; count: number };
    budget: { amount: number; currency: string; level: string };
    transport: string;
    accommodation: string;
    interests: string[];
  }, { rejectWithValue }) => {
    try {
      const plan = await travelService.generateItinerary(params);
      return plan;
    } catch (error) {
      return rejectWithValue("Failed to generate travel plan");
    }
  }
);

export const getThinkingSteps = createAsyncThunk(
  "travel/getThinkingSteps",
  async (_, { rejectWithValue }) => {
    try {
      const steps = await travelService.getThinkingSteps();
      return steps;
    } catch (error) {
      return rejectWithValue("Failed to get thinking steps");
    }
  }
);

const travelSlice = createSlice({
  name: "travel",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<TravelStep>) => {
      state.currentStep = action.payload;
    },
    completeStep: (state, action: PayloadAction<TravelStep>) => {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },
    setDestination: (state, action: PayloadAction<Destination>) => {
      state.destination = action.payload;
    },
    setDates: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.dates.start = action.payload.start;
      state.dates.end = action.payload.end;
      const duration = Math.ceil(
        (new Date(action.payload.end).getTime() - new Date(action.payload.start).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      state.dates.duration = duration;
    },
    setTravellers: (state, action: PayloadAction<{ type: string; count: number }>) => {
      state.travellers = action.payload;
    },
    setBudget: (state, action: PayloadAction<{ amount: number; currency: string; level: string }>) => {
      state.budget = action.payload;
    },
    setTransport: (state, action: PayloadAction<string>) => {
      state.transport = action.payload;
    },
    setAccommodation: (state, action: PayloadAction<string>) => {
      state.accommodation = action.payload;
    },
    toggleInterest: (state, action: PayloadAction<string>) => {
      const index = state.interests.indexOf(action.payload);
      if (index > -1) {
        state.interests.splice(index, 1);
      } else {
        state.interests.push(action.payload);
      }
    },
    setInterests: (state, action: PayloadAction<string[]>) => {
      state.interests = action.payload;
    },
    setCurrentThinkingStep: (state, action: PayloadAction<number>) => {
      state.currentThinkingStep = action.payload;
    },
    resetTravel: (state) => {
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Generate Travel Plan
    builder
      .addCase(generateTravelPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateTravelPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.travelPlan = action.payload;
        state.success = "Travel plan generated successfully";
        state.currentStep = "result";
      })
      .addCase(generateTravelPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Thinking Steps
    builder
      .addCase(getThinkingSteps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getThinkingSteps.fulfilled, (state, action) => {
        state.loading = false;
        state.thinkingSteps = action.payload;
        state.currentThinkingStep = 0;
      })
      .addCase(getThinkingSteps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentStep,
  completeStep,
  setDestination,
  setDates,
  setTravellers,
  setBudget,
  setTransport,
  setAccommodation,
  toggleInterest,
  setInterests,
  setCurrentThinkingStep,
  resetTravel,
  clearError,
  clearSuccess,
} = travelSlice.actions;

// Selectors
export const selectCurrentStep = (state: { travel: TravelState }) => state.travel.currentStep;
export const selectCompletedSteps = (state: { travel: TravelState }) => state.travel.completedSteps;
export const selectDestination = (state: { travel: TravelState }) => state.travel.destination;
export const selectDates = (state: { travel: TravelState }) => state.travel.dates;
export const selectTravellers = (state: { travel: TravelState }) => state.travel.travellers;
export const selectBudget = (state: { travel: TravelState }) => state.travel.budget;
export const selectTransport = (state: { travel: TravelState }) => state.travel.transport;
export const selectAccommodation = (state: { travel: TravelState }) => state.travel.accommodation;
export const selectInterests = (state: { travel: TravelState }) => state.travel.interests;
export const selectTravelPlan = (state: { travel: TravelState }) => state.travel.travelPlan;
export const selectThinkingSteps = (state: { travel: TravelState }) => state.travel.thinkingSteps;
export const selectCurrentThinkingStep = (state: { travel: TravelState }) => state.travel.currentThinkingStep;
export const selectTravelLoading = (state: { travel: TravelState }) => state.travel.loading;
export const selectTravelError = (state: { travel: TravelState }) => state.travel.error;
export const selectTravelSuccess = (state: { travel: TravelState }) => state.travel.success;

export default travelSlice.reducer;
