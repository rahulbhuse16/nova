import * as React from "react";
import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { CalendarEmptyState } from "./CalendarEmptyState";
import { EventCard } from "./EventCard";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectTodayEvents } from "@/redux/calendarSelectors";
import { selectEvent } from "@/redux/calendarSlice";

export interface TodayTimelineProps {
  onAddEvent?: () => void;
}

/** The Section 4 reference timeline — today's schedule, top to bottom. */
export function TodayTimeline({ onAddEvent }: TodayTimelineProps) {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectTodayEvents);

  if (events.length === 0) {
    return <CalendarEmptyState onCreateEvent={onAddEvent} compact />;
  }

  return (
    <AnimatedSection kind="stagger-children" className="relative space-y-1">
      <div className="absolute bottom-2 left-[76px] top-2 w-px bg-border" aria-hidden />
      {events.map((event) => (
        <AnimatedItem key={event.id}>
          <EventCard variant="timeline" event={event} onClick={(e) => dispatch(selectEvent(e.id))} />
        </AnimatedItem>
      ))}
    </AnimatedSection>
  );
}
