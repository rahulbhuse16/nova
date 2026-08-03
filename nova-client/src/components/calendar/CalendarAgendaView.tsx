import * as React from "react";
import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { CalendarEmptyState } from "./CalendarEmptyState";
import { EventCard } from "./EventCard";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectFilteredEvents } from "@/redux/calendarSelectors";
import { selectEvent, toggleCompleted } from "@/redux/calendarSlice";
import { formatDayLabel, todayKey } from "@/lib/date";
import type { CalendarEvent } from "@/types/calendar.types";

export interface CalendarAgendaViewProps {
  onAddEvent?: () => void;
}

export function CalendarAgendaView({ onAddEvent }: CalendarAgendaViewProps) {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectFilteredEvents);
  const today = todayKey();

  const groups = React.useMemo(() => {
    const upcoming = events
      .filter((e) => e.startDate.slice(0, 10) >= today)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const map = new Map<string, CalendarEvent[]>();
    for (const event of upcoming) {
      const key = event.startDate.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    }
    return Array.from(map.entries());
  }, [events, today]);

  if (groups.length === 0) {
    return <CalendarEmptyState onCreateEvent={onAddEvent} />;
  }

  return (
    <AnimatedSection kind="stagger-children" className="space-y-6">
      {groups.map(([dateKey, dayEvents]) => (
        <AnimatedItem key={dateKey}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            {dateKey === today ? "Today" : formatDayLabel(new Date(dateKey))}
          </p>
          <div className="space-y-3">
            {dayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={(e) => dispatch(selectEvent(e.id))}
                onToggleCompleted={(id) => dispatch(toggleCompleted(id))}
              />
            ))}
          </div>
        </AnimatedItem>
      ))}
    </AnimatedSection>
  );
}
