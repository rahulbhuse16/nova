import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { generateItinerary as generateItineraryService } from "../services/travel";
import { RootState } from "@/store/store";

/* ==================================================================
 * Nova Travel Planner — Redux slice
 * UI + Redux only. No backend, no HTTP, no external booking APIs.
 * ================================================================== */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Destination {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export type DateMode = "weekend" | "week" | "month" | "custom";

export interface TripDates {
  mode: DateMode;
  startDate: string; // ISO date
  endDate: string; // ISO date
  label: string;
  nights: number;
}

export type TravellerType = "solo" | "couple" | "family" | "friends" | "business" | "custom";

export interface Travellers {
  type: TravellerType;
  count: number;
}

export type BudgetTier = "budget" | "balanced" | "luxury";

export interface Budget {
  tier: BudgetTier;
  currency: string;
  amount: number;
}

export type TransportMode = "flight" | "train" | "road-trip" | "bus" | "mixed";

export type AccommodationType =
  | "hotel"
  | "hostel"
  | "apartment"
  | "resort"
  | "camping"
  | "luxury-stay";

export interface Accommodation {
  type: AccommodationType;
  preferences: string[];
}

export interface ItineraryActivity {
  time: string;
  title: string;
  description: string;
  icon: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryActivity[];
}

export interface ItineraryPlace {
  name: string;
  category: string;
  description: string;
}

export interface ItineraryRestaurant {
  name: string;
  cuisine: string;
  priceRange: string;
  description: string;
}

export interface BudgetBreakdownItem {
  label: string;
  amount: number;
}

export interface GeneratedItinerary {
  overview: string;
  tripScore: number;
  travelMood: string;
  budgetEstimate: {
    total: number;
    currency: string;
    breakdown: BudgetBreakdownItem[];
  };
  weatherSummary: {
    condition: string;
    tempHighC: number;
    tempLowC: number;
    advice: string;
  };
  dailyTimeline: ItineraryDay[];
  placesToVisit: ItineraryPlace[];
  restaurants: ItineraryRestaurant[];
  packingChecklist: string[];
  importantTips: string[];
  quickFacts: { label: string; value: string }[];
  emergencyContacts: { label: string; value: string }[];
  aiRecommendations: string[];
}

export interface TripInput {
  destination: Destination;
  dates: TripDates;
  travellers: Travellers;
  budget: Budget;
  transport: TransportMode;
  accommodation: Accommodation;
  interests: string[];
}

export interface TravelState {
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  destination: Destination | null;
  dates: TripDates | null;
  travellers: Travellers | null;
  budget: Budget | null;
  transport: TransportMode | null;
  accommodation: Accommodation | null;
  interests: string[];
  aiThinkingIndex: number;
  itinerary: GeneratedItinerary | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

/* ------------------------------------------------------------------ */
/* Initial state                                                       */
/* ------------------------------------------------------------------ */

const initialState: TravelState = {
  currentStep: 1,
  completedSteps: [],
  destination: null,
  dates: null,
  travellers: null,
  budget: null,
  transport: null,
  accommodation: null,
  interests: [],
  aiThinkingIndex: 0,
  itinerary: null,
  loading: false,
  saving: false,
  error: null,
};

/* ------------------------------------------------------------------ */
/* Async thunks — all local/mock via travelService, no HTTP            */
/* ------------------------------------------------------------------ */

export const planTripWithAI = createAsyncThunk<
  GeneratedItinerary,
  void,
  { state: RootState; rejectValue: string }
>("travelPlanner/planTripWithAI", async (_, { getState, rejectWithValue }) => {
  const { travelPlanner } = getState();
  if (
    !travelPlanner.destination ||
    !travelPlanner.dates ||
    !travelPlanner.travellers ||
    !travelPlanner.budget ||
    !travelPlanner.transport ||
    !travelPlanner.accommodation
  ) {
    return rejectWithValue("Nova needs a few more details before it can plan this trip.");
  }

  try {
    const itinerary = await generateItineraryService({
      destination: travelPlanner.destination,
      dates: travelPlanner.dates,
      travellers: travelPlanner.travellers,
      budget: travelPlanner.budget,
      transport: travelPlanner.transport,
      accommodation: travelPlanner.accommodation,
      interests: travelPlanner.interests,
    });
    return itinerary;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Nova couldn't finish planning this trip.");
  }
});

export const saveTrip = createAsyncThunk<void, void, { state: RootState }>(
  "travelPlanner/saveTrip",
  async () => {
    // Local-only "save" — simulates persistence latency without a backend.
    await new Promise((resolve) => setTimeout(resolve, 700));
  }
);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function markComplete(state: TravelState, step: WizardStep) {
  if (!state.completedSteps.includes(step)) {
    state.completedSteps = [...state.completedSteps, step].sort((a, b) => a - b);
  }
}

/** Editing an earlier step invalidates completion (and the itinerary) for
 * everything after it, so the summary + result always reflect current answers. */
function invalidateAfter(state: TravelState, step: WizardStep) {
  state.completedSteps = state.completedSteps.filter((s) => s < step);
  if (step <= 9) {
    state.itinerary = null;
  }
}

/* ------------------------------------------------------------------ */
/* Slice                                                               */
/* ------------------------------------------------------------------ */

const travelSlice = createSlice({
  name: "travelPlanner",
  initialState,
  reducers: {
    goToStep(state, action: PayloadAction<WizardStep>) {
      state.currentStep = action.payload;
    },

    nextStep(state) {
      markComplete(state, state.currentStep);
      if (state.currentStep < 10) {
        state.currentStep = (state.currentStep + 1) as WizardStep;
      }
    },

    previousStep(state) {
      if (state.currentStep > 1) {
        state.currentStep = (state.currentStep - 1) as WizardStep;
      }
    },

    editStep(state, action: PayloadAction<WizardStep>) {
      state.currentStep = action.payload;
      invalidateAfter(state, action.payload);
    },

    setDestination(state, action: PayloadAction<Destination>) {
      state.destination = action.payload;
      invalidateAfter(state, 2);
    },

    setDates(state, action: PayloadAction<TripDates>) {
      state.dates = action.payload;
      invalidateAfter(state, 3);
    },

    setTravellers(state, action: PayloadAction<Travellers>) {
      state.travellers = action.payload;
      invalidateAfter(state, 4);
    },

    setBudget(state, action: PayloadAction<Budget>) {
      state.budget = action.payload;
      invalidateAfter(state, 5);
    },

    setTransport(state, action: PayloadAction<TransportMode>) {
      state.transport = action.payload;
      invalidateAfter(state, 6);
    },

    setAccommodation(state, action: PayloadAction<Accommodation>) {
      state.accommodation = action.payload;
      invalidateAfter(state, 7);
    },

    toggleInterest(state, action: PayloadAction<string>) {
      state.interests = state.interests.includes(action.payload)
        ? state.interests.filter((i) => i !== action.payload)
        : [...state.interests, action.payload];
      invalidateAfter(state, 8);
    },

    setAiThinkingIndex(state, action: PayloadAction<number>) {
      state.aiThinkingIndex = action.payload;
    },

    clearError(state) {
      state.error = null;
    },

    resetTravelPlanner() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(planTripWithAI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.aiThinkingIndex = 0;
      })
      .addCase(planTripWithAI.fulfilled, (state, action) => {
        state.loading = false;
        state.itinerary = action.payload;
        markComplete(state, 9);
        state.currentStep = 10;
      })
      .addCase(planTripWithAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something interrupted Nova's planning. Try again.";
      })
      .addCase(saveTrip.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveTrip.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(saveTrip.rejected, (state) => {
        state.saving = false;
      });
  },
});

export const {
  goToStep,
  nextStep,
  previousStep,
  editStep,
  setDestination,
  setDates,
  setTravellers,
  setBudget,
  setTransport,
  setAccommodation,
  toggleInterest,
  setAiThinkingIndex,
  clearError,
  resetTravelPlanner,
} = travelSlice.actions;

export default travelSlice.reducer;

/* ------------------------------------------------------------------ */
/* Selectors                                                           */
/* ------------------------------------------------------------------ */

export const selectTravel = (state: RootState) => state.travelPlanner;
export const selectCurrentStep = (state: RootState) => state.travelPlanner.currentStep;
export const selectCompletedSteps = (state: RootState) => state.travelPlanner.completedSteps;
export const selectDestination = (state: RootState) => state.travelPlanner.destination;
export const selectDates = (state: RootState) => state.travelPlanner.dates;
export const selectTravellers = (state: RootState) => state.travelPlanner.travellers;
export const selectBudget = (state: RootState) => state.travelPlanner.budget;
export const selectTransport = (state: RootState) => state.travelPlanner.transport;
export const selectAccommodation = (state: RootState) => state.travelPlanner.accommodation;
export const selectInterests = (state: RootState) => state.travelPlanner.interests;
export const selectItinerary = (state: RootState) => state.travelPlanner.itinerary;
export const selectLoading = (state: RootState) => state.travelPlanner.loading;
export const selectSaving = (state: RootState) => state.travelPlanner.saving;
export const selectError = (state: RootState) => state.travelPlanner.error;
export const selectAiThinkingIndex = (state: RootState) => state.travelPlanner.aiThinkingIndex;

export const TOTAL_STEPS = 9;

export const selectProgressPercent = (state: RootState) => {
  const { completedSteps, currentStep } = state.travelPlanner;
  const effective = Math.max(completedSteps.length, currentStep > 1 ? currentStep - 1 : 0);
  return Math.round((Math.min(effective, TOTAL_STEPS) / TOTAL_STEPS) * 100);
};

export const selectIsStepComplete = (step: WizardStep) => (state: RootState) =>
  state.travelPlanner.completedSteps.includes(step);

/** Whether the current step has enough information to move forward. */
export const selectCanAdvance = (state: RootState): boolean => {
  const t = state.travelPlanner;
  switch (t.currentStep) {
    case 1:
      return true;
    case 2:
      return !!t.destination;
    case 3:
      return !!t.dates;
    case 4:
      return !!t.travellers;
    case 5:
      return !!t.budget;
    case 6:
      return !!t.transport;
    case 7:
      return !!t.accommodation;
    case 8:
      return t.interests.length > 0;
    case 9:
      return !!t.itinerary && !t.loading;
    default:
      return true;
  }
};

export interface TripSummary {
  destination: Destination | null;
  dates: TripDates | null;
  travellers: Travellers | null;
  budget: Budget | null;
  transport: TransportMode | null;
  accommodation: Accommodation | null;
  interests: string[];
}

export const selectTripSummary = (state: RootState): TripSummary => ({
  destination: state.travelPlanner.destination,
  dates: state.travelPlanner.dates,
  travellers: state.travelPlanner.travellers,
  budget: state.travelPlanner.budget,
  transport: state.travelPlanner.transport,
  accommodation: state.travelPlanner.accommodation,
  interests: state.travelPlanner.interests,
});