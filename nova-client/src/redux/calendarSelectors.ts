import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { CalendarEvent } from "@/types/calendar.types";
import { isSameDayAsKey } from "@/lib/date";

export const selectCalendarState = (state: RootState) => state.calendar;
export const selectAllEvents = (state: RootState) => state.calendar.events;
export const selectLoading = (state: RootState) => state.calendar.loading;
export const selectCurrentView = (state: RootState) => state.calendar.currentView;
export const selectSelectedDate = (state: RootState) => state.calendar.selectedDate;
export const selectSearch = (state: RootState) => state.calendar.search;
export const selectFilters = (state: RootState) => state.calendar.filters;
export const selectOverview = (state: RootState) => state.calendar.overview;

export const selectSelectedEvent = createSelector(
  [selectAllEvents, (state: RootState) => state.calendar.selectedEventId],
  (events, id): CalendarEvent | null => events.find((e) => e.id === id) ?? null
);

export const selectTodayEvents = createSelector(
  [selectAllEvents, (state: RootState) => state.calendar.todayEventIds],
  (events, ids) => ids.map((id) => events.find((e) => e.id === id)).filter(Boolean) as CalendarEvent[]
);

export const selectUpcomingEvents = createSelector(
  [selectAllEvents, (state: RootState) => state.calendar.upcomingEventIds],
  (events, ids) => ids.map((id) => events.find((e) => e.id === id)).filter(Boolean) as CalendarEvent[]
);

/** Events for the exact selected day (used by CalendarDayView / mini view detail). */
export const selectEventsForSelectedDate = createSelector(
  [selectAllEvents, selectSelectedDate],
  (events, dateKey) => events.filter((e) => isSameDayAsKey(e.startDate, dateKey))
);

/** Search + filter pipeline shared by Month/Week/Day/Agenda views. */
export const selectFilteredEvents = createSelector(
  [selectAllEvents, selectSearch, selectFilters],
  (events, search, filters) => {
    const query = search.trim().toLowerCase();
    return events.filter((e) => {
      if (query && !e.title.toLowerCase().includes(query) && !e.description?.toLowerCase().includes(query)) {
        return false;
      }
      if (filters.types.length && !filters.types.includes(e.type)) return false;
      if (filters.categories.length && !filters.categories.includes(e.category)) return false;
      if (filters.priorities.length && !filters.priorities.includes(e.priority)) return false;
      if (!filters.showCompleted && e.completed) return false;
      return true;
    });
  }
);

/** Groups filtered events by day-key, for month grid dot indicators. */
export const selectEventsByDay = createSelector([selectFilteredEvents], (events) => {
  const map = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = event.startDate.slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(event);
  }
  return map;
});
