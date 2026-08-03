import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMonthGridDays, toDateKey, todayKey, parseDateKey, WEEKDAY_LABELS } from "@/lib/date";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectEventsByDay, selectSelectedDate } from "@/redux/calendarSelectors";
import { selectDate } from "@/redux/calendarSlice";

export interface CalendarMonthViewProps {
  onOpenDay?: (dateKey: string) => void;
}

const MAX_DOTS = 3;

/** Beautiful premium month grid — current day highlight, selected day, event indicators. */
export function CalendarMonthView({ onOpenDay }: CalendarMonthViewProps) {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(selectSelectedDate);
  const eventsByDay = useAppSelector(selectEventsByDay);

  const anchor = parseDateKey(selectedDate);
  const days = getMonthGridDays(anchor);
  const currentMonth = anchor.getMonth();
  const today = todayKey();

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 pb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-1 text-center text-xs font-medium uppercase tracking-wide text-muted">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day) => {
          const key = toDateKey(day);
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isToday = key === today;
          const isSelected = key === selectedDate;
          const events = eventsByDay.get(key) ?? [];

          return (
            <motion.button
              key={key}
              whileHover={{ y: -2 }}
              onClick={() => {
                dispatch(selectDate(key));
                onOpenDay?.(key);
              }}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-start rounded-md border p-1.5 transition-colors",
                isSelected
                  ? "border-primary/40 bg-primary/10"
                  : "border-transparent hover:border-border hover:bg-surface",
                !isCurrentMonth && "opacity-40"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday ? "text-white" : isSelected ? "text-primary" : "text-text"
                )}
                style={isToday ? { backgroundImage: "var(--gradient-aurora)" } : undefined}
              >
                {day.getDate()}
              </span>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-0.5">
                {events.slice(0, MAX_DOTS).map((event) => (
                  <span
                    key={event.id}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                ))}
                {events.length > MAX_DOTS && (
                  <span className="text-[10px] font-medium text-muted">+{events.length - MAX_DOTS}</span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
