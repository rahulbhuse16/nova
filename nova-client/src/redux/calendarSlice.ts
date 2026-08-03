import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type {
  CalendarState,
  CalendarEvent,
  CalendarView,
  EventType,
  EventCategory,
  EventPriority,
  CreateEventInput,
} from "@/types/calendar.types";
import { buildMockEvents } from "./calendarMockData";
import { todayKey, isSameDayAsKey, durationMinutes } from "@/lib/date";

/* ------------------------------------------------------------------ */
/* Derived-state recomputation                                         */
/* Everything here is a client-side mock heuristic — no backend calls. */
/* ------------------------------------------------------------------ */

function recomputeDerived(state: CalendarState) {
  const today = todayKey();
  const now = new Date();

  const todayEvents = state.events.filter((e) => isSameDayAsKey(e.startDate, today));
  state.todayEventIds = todayEvents
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .map((e) => e.id);

  const upcoming = state.events
    .filter((e) => new Date(e.startDate).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 8);
  state.upcomingEventIds = upcoming.map((e) => e.id);

  const meetingsToday = todayEvents.filter((e) => e.type === "meeting");
  const focusToday = todayEvents.filter((e) => e.type === "learning" || e.category === "Work");
  const busyMinutes = todayEvents
    .filter((e) => !e.allDay)
    .reduce((sum, e) => sum + durationMinutes(e.startDate, e.endDate), 0);
  const tasksScheduled = state.events.filter(
    (e) => (e.type === "task" || e.source === "task") && !e.completed
  ).length;

  state.overview = {
    todayCount: todayEvents.length,
    upcomingCount: state.upcomingEventIds.length,
    tasksScheduled,
    freeHours: Math.max(0, Math.round(((16 * 60 - busyMinutes) / 60) * 10) / 10),
    focusHours:
      Math.round(
        (focusToday.reduce((sum, e) => sum + durationMinutes(e.startDate, e.endDate), 0) / 60) * 10
      ) / 10,
    meetingsCount: meetingsToday.length,
  };
}

function buildInitialState(): CalendarState {
  const state: CalendarState = {
    loading: false,
    events: buildMockEvents(),
    selectedDate: todayKey(),
    selectedEventId: null,
    currentView: "month",
    search: "",
    filters: {
      types: [],
      categories: [],
      priorities: [],
      showCompleted: true,
    },
    todayEventIds: [],
    upcomingEventIds: [],
    overview: {
      todayCount: 0,
      upcomingCount: 0,
      tasksScheduled: 0,
      freeHours: 0,
      focusHours: 0,
      meetingsCount: 0,
    },
  };
  recomputeDerived(state);
  return state;
}

const initialState: CalendarState = buildInitialState();

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    changeView(state, action: PayloadAction<CalendarView>) {
      state.currentView = action.payload;
    },

    nextMonth(state) {
      const d = new Date(state.selectedDate);
      d.setMonth(d.getMonth() + 1);
      state.selectedDate = d.toISOString().slice(0, 10);
    },

    previousMonth(state) {
      const d = new Date(state.selectedDate);
      d.setMonth(d.getMonth() - 1);
      state.selectedDate = d.toISOString().slice(0, 10);
    },

    goToday(state) {
      state.selectedDate = todayKey();
    },

    selectDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },

    selectEvent(state, action: PayloadAction<string | null>) {
      state.selectedEventId = action.payload;
    },

    createEvent: {
      reducer(state, action: PayloadAction<CalendarEvent>) {
        state.events.unshift(action.payload);
        recomputeDerived(state);
      },
      prepare(input: CreateEventInput) {
        const event: CalendarEvent = {
          id: nanoid(),
          title: input.title,
          description: input.description,
          type: input.type,
          category: input.category,
          priority: input.priority ?? "medium",
          status: "upcoming",
          location: input.location,
          startDate: input.startDate,
          endDate: input.endDate,
          allDay: input.allDay ?? false,
          color: input.color ?? "#7C6CF6",
          icon: input.icon ?? "CalendarDays",
          completed: false,
          source: "manual",
        };
        return { payload: event };
      },
    },

    updateEvent(state, action: PayloadAction<{ id: string; changes: Partial<CalendarEvent> }>) {
      const event = state.events.find((e) => e.id === action.payload.id);
      if (event) Object.assign(event, action.payload.changes);
      recomputeDerived(state);
    },

    deleteEvent(state, action: PayloadAction<string>) {
      state.events = state.events.filter((e) => e.id !== action.payload);
      if (state.selectedEventId === action.payload) state.selectedEventId = null;
      recomputeDerived(state);
    },

    toggleCompleted(state, action: PayloadAction<string>) {
      const event = state.events.find((e) => e.id === action.payload);
      if (event) {
        event.completed = !event.completed;
        event.status = event.completed ? "completed" : "upcoming";
      }
      recomputeDerived(state);
    },

    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },

    setFilter(
      state,
      action: PayloadAction<
        | { key: "types"; value: EventType[] }
        | { key: "categories"; value: EventCategory[] }
        | { key: "priorities"; value: EventPriority[] }
        | { key: "showCompleted"; value: boolean }
      >
    ) {
      // @ts-expect-error — discriminated union assignment is safe here
      state.filters[action.payload.key] = action.payload.value;
    },

    resetFilters(state) {
      state.filters = { types: [], categories: [], priorities: [], showCompleted: true };
      state.search = "";
    },
  },
});

export const {
  setLoading,
  changeView,
  nextMonth,
  previousMonth,
  goToday,
  selectDate,
  selectEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleCompleted,
  setSearch,
  setFilter,
  resetFilters,
} = calendarSlice.actions;

export default calendarSlice.reducer;
