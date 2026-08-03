import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMonthGridDays, toDateKey, todayKey, parseDateKey, formatMonthLabel, WEEKDAY_LABELS } from "@/lib/date";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectEventsByDay, selectSelectedDate } from "@/redux/calendarSelectors";
import { selectDate, nextMonth, previousMonth } from "@/redux/calendarSlice";

export function CalendarMiniView() {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(selectSelectedDate);
  const eventsByDay = useAppSelector(selectEventsByDay);

  const anchor = parseDateKey(selectedDate);
  const days = getMonthGridDays(anchor);
  const currentMonth = anchor.getMonth();
  const today = todayKey();

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-text">{formatMonthLabel(anchor)}</p>
        <div className="flex items-center gap-1">
          <button
            aria-label="Previous month"
            onClick={() => dispatch(previousMonth())}
            className="rounded-full p-1 text-muted hover:bg-surface hover:text-text"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            aria-label="Next month"
            onClick={() => dispatch(nextMonth())}
            className="rounded-full p-1 text-muted hover:bg-surface hover:text-text"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="text-[10px] font-medium uppercase text-muted">
            {label[0]}
          </span>
        ))}

        {days.map((day) => {
          const key = toDateKey(day);
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isToday = key === today;
          const isSelected = key === selectedDate;
          const hasEvents = (eventsByDay.get(key) ?? []).length > 0;

          return (
            <button
              key={key}
              onClick={() => dispatch(selectDate(key))}
              className={cn(
                "relative mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors",
                isSelected ? "bg-primary/15 text-primary font-medium" : "hover:bg-surface",
                !isCurrentMonth && "opacity-30"
              )}
            >
              {isToday ? (
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full font-medium text-white"
                  style={{ backgroundImage: "var(--gradient-aurora)" }}
                >
                  {day.getDate()}
                </span>
              ) : (
                day.getDate()
              )}
              {hasEvents && !isToday && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
