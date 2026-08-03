import * as React from "react";
import { cn } from "@/lib/utils";
import { getWeekDays, toDateKey, todayKey, parseDateKey } from "@/lib/date";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectFilteredEvents, selectSelectedDate } from "@/redux/calendarSelectors";
import { selectDate, selectEvent } from "@/redux/calendarSlice";
import { resolveEventIcon } from "./iconMap";
import type { CalendarEvent } from "@/types/calendar.types";

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_HEIGHT = 56; // px per hour row

function minutesFromGridStart(iso: string) {
  const d = new Date(iso);
  return (d.getHours() - START_HOUR) * 60 + d.getMinutes();
}

export function CalendarWeekView() {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(selectSelectedDate);
  const events = useAppSelector(selectFilteredEvents);
  const today = todayKey();

  const days = getWeekDays(parseDateKey(selectedDate));
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const gridHeight = hours.length * HOUR_HEIGHT;

  const eventsByDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      if (event.allDay) continue;
      const key = event.startDate.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    }
    return map;
  }, [events]);

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[720px] grid-cols-[56px_repeat(7,1fr)]">
        <div />
        {days.map((day) => {
          const key = toDateKey(day);
          const isToday = key === today;
          return (
            <button
              key={key}
              onClick={() => dispatch(selectDate(key))}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md py-2 text-center transition-colors hover:bg-surface",
                key === selectedDate && "bg-primary/5"
              )}
            >
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                  isToday ? "text-white" : "text-text"
                )}
                style={isToday ? { backgroundImage: "var(--gradient-aurora)" } : undefined}
              >
                {day.getDate()}
              </span>
            </button>
          );
        })}

        <div className="relative" style={{ height: gridHeight }}>
          {hours.map((hour, i) => (
            <div
              key={hour}
              className="absolute inset-x-0 border-t border-border/60 pr-2 text-right text-[11px] text-muted"
              style={{ top: i * HOUR_HEIGHT }}
            >
              <span className="-mt-2 block">{hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? "am" : "pm"}</span>
            </div>
          ))}
        </div>

        {days.map((day) => {
          const key = toDateKey(day);
          const dayEvents = eventsByDay.get(key) ?? [];
          return (
            <div key={key} className="relative border-l border-border/60" style={{ height: gridHeight }}>
              {hours.map((_, i) => (
                <div key={i} className="absolute inset-x-0 border-t border-border/60" style={{ top: i * HOUR_HEIGHT }} />
              ))}
              {dayEvents.map((event) => {
                const Icon = resolveEventIcon(event.icon);
                const top = Math.max(0, (minutesFromGridStart(event.startDate) / 60) * HOUR_HEIGHT);
                const durationMin = Math.max(
                  20,
                  (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / 60000
                );
                const height = (durationMin / 60) * HOUR_HEIGHT;
                return (
                  <button
                    key={event.id}
                    onClick={() => dispatch(selectEvent(event.id))}
                    className="absolute inset-x-1 overflow-hidden rounded-sm border-l-2 px-2 py-1 text-left shadow-soft transition-transform hover:scale-[1.02]"
                    style={{
                      top,
                      height: Math.max(24, height),
                      backgroundColor: `${event.color}1F`,
                      borderLeftColor: event.color,
                    }}
                  >
                    <span className="flex items-center gap-1 truncate text-[11px] font-medium text-text">
                      <Icon className="h-3 w-3 shrink-0" style={{ color: event.color }} />
                      {event.title}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
