import * as React from "react";
import { Badge } from "@/components/shared/Badge";
import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { CalendarEmptyState } from "./CalendarEmptyState";
import { EventCard } from "./EventCard";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectEventsForSelectedDate, selectSelectedDate } from "@/redux/calendarSelectors";
import { selectEvent, toggleCompleted } from "@/redux/calendarSlice";
import { parseDateKey, formatDayLabel } from "@/lib/date";

export interface CalendarDayViewProps {
  onAddEvent?: () => void;
}

export function CalendarDayView({ onAddEvent }: CalendarDayViewProps) {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(selectSelectedDate);
  const dayEvents = useAppSelector(selectEventsForSelectedDate);

  const allDay = dayEvents.filter((e) => e.allDay);
  const timed = dayEvents
    .filter((e) => !e.allDay)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">{formatDayLabel(parseDateKey(selectedDate))}</h3>
        {!!allDay.length && (
          <div className="flex flex-wrap gap-1.5">
            {allDay.map((e) => (
              <Badge key={e.id} variant="neutral" dot>
                {e.title}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {timed.length === 0 ? (
        <CalendarEmptyState onCreateEvent={onAddEvent} compact />
      ) : (
        <AnimatedSection kind="stagger-children" className="space-y-3">
          {timed.map((event) => (
            <AnimatedItem key={event.id}>
              <EventCard
                event={event}
                onClick={(e) => dispatch(selectEvent(e.id))}
                onToggleCompleted={(id) => dispatch(toggleCompleted(id))}
              />
            </AnimatedItem>
          ))}
        </AnimatedSection>
      )}
    </div>
  );
}
