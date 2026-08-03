import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton } from "@/components/buttons/IconButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { cn } from "@/lib/utils";
import { parseDateKey, formatMonthLabel, formatDayLabel, getWeekDays } from "@/lib/date";
import type { CalendarView } from "@/types/calendar.types";

const VIEWS: { id: CalendarView; label: string }[] = [
  { id: "month", label: "Month" },
  { id: "week", label: "Week" },
  { id: "day", label: "Day" },
  { id: "agenda", label: "Agenda" },
];

export interface CalendarToolbarProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  selectedDate: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

function rangeLabel(view: CalendarView, dateKey: string): string {
  const date = parseDateKey(dateKey);
  if (view === "day") return formatDayLabel(date);
  if (view === "week") {
    const days = getWeekDays(date);
    const start = days[0];
    const end = days[6];
    const sameMonth = start.getMonth() === end.getMonth();
    const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endLabel = end.toLocaleDateString("en-US", { month: sameMonth ? undefined : "short", day: "numeric", year: "numeric" });
    return `${startLabel} – ${endLabel}`;
  }
  if (view === "agenda") return "Next up";
  return formatMonthLabel(date);
}

/** Segmented view switcher + date navigation, shared above Month/Week/Day/Agenda. */
export function CalendarToolbar({
  currentView,
  onViewChange,
  selectedDate,
  onPrevious,
  onNext,
  onToday,
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <IconButton icon={<ChevronLeft className="h-4 w-4" />} label="Previous" onClick={onPrevious} size="sm" variant="glass" />
        <h2 className="min-w-[180px] text-center text-base font-semibold text-text">
          {rangeLabel(currentView, selectedDate)}
        </h2>
        <IconButton icon={<ChevronRight className="h-4 w-4" />} label="Next" onClick={onNext} size="sm" variant="glass" />
        <SecondaryButton variant="ghost" size="sm" onClick={onToday} className="ml-1">
          Today
        </SecondaryButton>
      </div>

      <div className="relative flex rounded-pill border border-border bg-surface p-1">
        {VIEWS.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={cn(
              "relative z-10 rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors",
              currentView === view.id ? "text-primary-foreground" : "text-text-secondary hover:text-text"
            )}
          >
            {currentView === view.id && (
              <motion.span
                layoutId="calendar-view-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 -z-10 rounded-pill shadow-glow"
                style={{ backgroundImage: "var(--gradient-aurora)" }}
              />
            )}
            {view.label}
          </button>
        ))}
      </div>
    </div>
  );
}
