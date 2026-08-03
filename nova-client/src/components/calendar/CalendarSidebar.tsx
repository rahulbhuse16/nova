import * as React from "react";
import { Cloud, Sparkles, ArrowRight, Clock } from "lucide-react";
import { PremiumCard } from "@/components/cards/PremiumCard";
import { Badge } from "@/components/shared/Badge";
import { CalendarMiniView } from "./CalendarMiniView";
import { resolveEventIcon } from "./iconMap";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectTodayEvents, selectUpcomingEvents } from "@/redux/calendarSelectors";
import { selectEvent } from "@/redux/calendarSlice";
import { formatTime } from "@/lib/date";

export function CalendarSidebar() {
  const dispatch = useAppDispatch();
  const todayEvents = useAppSelector(selectTodayEvents);
  const upcoming = useAppSelector(selectUpcomingEvents);

  const completedToday = todayEvents.filter((e) => e.completed).length;
  const progressPct = todayEvents.length ? Math.round((completedToday / todayEvents.length) * 100) : 0;
  const nextEvent = upcoming[0];
  const NextIcon = nextEvent ? resolveEventIcon(nextEvent.icon) : null;

  return (
    <div className="sticky top-4 space-y-4">
      <PremiumCard variant="default" className="p-5">
        <CalendarMiniView />
      </PremiumCard>

      <PremiumCard variant="default" className="p-5">
        <p className="text-sm font-medium text-text">Today's progress</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0">
            <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
              <circle cx="28" cy="28" r="24" fill="none" stroke="rgb(var(--border))" strokeWidth="6" />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="rgb(var(--primary))"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(progressPct / 100) * 150.8} 150.8`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-text">
              {progressPct}%
            </span>
          </div>
          <p className="text-xs text-text-secondary">
            {completedToday} of {todayEvents.length} events done today
          </p>
        </div>
      </PremiumCard>

      <PremiumCard variant="default" className="p-5">
        <p className="mb-3 text-sm font-medium text-text">Next event</p>
        {nextEvent ? (
          <button
            onClick={() => dispatch(selectEvent(nextEvent.id))}
            className="flex w-full items-center gap-3 rounded-md border border-border bg-surface p-3 text-left transition-colors hover:bg-card-elevated"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm"
              style={{ backgroundColor: `${nextEvent.color}1A`, color: nextEvent.color }}
            >
              {NextIcon && <NextIcon className="h-4 w-4" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-text">{nextEvent.title}</span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock className="h-3 w-3" />
                {nextEvent.allDay ? "All day" : formatTime(nextEvent.startDate)}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted" />
          </button>
        ) : (
          <p className="text-sm text-muted">Nothing else scheduled — enjoy the open time.</p>
        )}
      </PremiumCard>

      <PremiumCard variant="glass" className="p-5">
        <div className="flex items-start gap-2.5">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <Badge variant="primary" className="mb-1.5">AI tip</Badge>
            <p className="text-sm text-text-secondary">
              Your afternoons are lighter than mornings this week — a good window for deep work.
            </p>
          </div>
        </div>
      </PremiumCard>

      <PremiumCard variant="outlined" className="flex items-center gap-3 p-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary">
          <Cloud className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-text">Weather</p>
          <p className="text-xs text-muted">Connect a location to see today's forecast here.</p>
        </div>
      </PremiumCard>
    </div>
  );
}
