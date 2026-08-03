import * as React from "react";
import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { CalendarEmptyState } from "./CalendarEmptyState";
import { EventCard } from "./EventCard";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectUpcomingEvents } from "@/redux/calendarSelectors";
import { selectEvent, toggleCompleted } from "@/redux/calendarSlice";

export interface UpcomingEventsProps {
  onAddEvent?: () => void;
  limit?: number;
}

export function UpcomingEvents({ onAddEvent, limit = 4 }: UpcomingEventsProps) {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectUpcomingEvents).slice(0, limit);

  if (events.length === 0) {
    return <CalendarEmptyState onCreateEvent={onAddEvent} />;
  }

  return (
    <AnimatedSection kind="stagger-children" className="grid gap-4 md:grid-cols-2">
      {events.map((event) => (
        <AnimatedItem key={event.id}>
          <EventCard
            event={event}
            onClick={(e) => dispatch(selectEvent(e.id))}
            onToggleCompleted={(id) => dispatch(toggleCompleted(id))}
          />
        </AnimatedItem>
      ))}
    </AnimatedSection>
  );
}
