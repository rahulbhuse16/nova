import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Users, CheckCircle2, Circle } from "lucide-react";
import { PremiumCard } from "@/components/cards/PremiumCard";
import { Badge } from "@/components/shared/Badge";
import { cn } from "@/lib/utils";
import { formatTime, formatDuration } from "@/lib/date";
import { resolveEventIcon } from "./iconMap";
import {
  EVENT_TYPE_LABELS,
  PRIORITY_BADGE_VARIANT,
  STATUS_BADGE_VARIANT,
  STATUS_LABELS,
} from "./eventMeta";
import type { CalendarEvent } from "@/types/calendar.types";

export interface EventCardProps {
  event: CalendarEvent;
  /** "timeline" = compact row for TodayTimeline. "compact" = dense list row.
   *  "full" (default) = premium card for Upcoming Events / Agenda. */
  variant?: "full" | "compact" | "timeline";
  onClick?: (event: CalendarEvent) => void;
  onToggleCompleted?: (id: string) => void;
  className?: string;
}

export function EventCard({ event, variant = "full", onClick, onToggleCompleted, className }: EventCardProps) {
  const Icon = resolveEventIcon(event.icon);

  if (variant === "timeline") {
    return (
      <motion.button
        onClick={() => onClick?.(event)}
        whileHover={{ x: 3 }}
        className={cn("flex w-full items-start gap-4 rounded-md px-2 py-2.5 text-left transition-colors hover:bg-surface", className)}
      >
        <div className="w-14 shrink-0 pt-0.5 text-xs font-medium text-muted">
          {event.allDay ? "All day" : formatTime(event.startDate)}
        </div>
        <span
          className="mt-1 h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: event.color }}
        />
        <div className="min-w-0 flex-1">
          <p className={cn("truncate text-sm font-medium text-text", event.completed && "line-through text-muted")}>
            {event.title}
          </p>
          {event.location && <p className="truncate text-xs text-muted">{event.location}</p>}
        </div>
      </motion.button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={() => onClick?.(event)}
        className={cn(
          "flex w-full items-center gap-3 rounded-md border-l-[3px] bg-surface px-3 py-2.5 text-left transition-colors hover:bg-card-elevated",
          className
        )}
        style={{ borderLeftColor: event.color }}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm" style={{ backgroundColor: `${event.color}1A`, color: event.color }}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-text">{event.title}</p>
          <p className="text-xs text-muted">{event.allDay ? "All day" : formatTime(event.startDate)}</p>
        </div>
        <Badge variant={PRIORITY_BADGE_VARIANT[event.priority]} className="shrink-0">
          {EVENT_TYPE_LABELS[event.type]}
        </Badge>
      </button>
    );
  }

  // "full"
  return (
    <PremiumCard
      variant="interactive"
      onClick={() => onClick?.(event)}
      className={cn("relative overflow-hidden pl-6", className)}
    >
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: event.color }} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: `${event.color}1A`, color: event.color }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className={cn("font-medium text-text", event.completed && "line-through text-muted")}>
              {event.title}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {event.allDay ? "All day" : `${formatTime(event.startDate)} · ${formatDuration(event.startDate, event.endDate)}`}
            </p>
          </div>
        </div>

        {onToggleCompleted && (
          <button
            aria-label={event.completed ? "Mark as not completed" : "Mark as completed"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompleted(event.id);
            }}
            className="shrink-0 text-muted hover:text-success"
          >
            {event.completed ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5" />}
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="neutral">{event.category}</Badge>
        <Badge variant={PRIORITY_BADGE_VARIANT[event.priority]}>{EVENT_TYPE_LABELS[event.type]}</Badge>
        <Badge variant={STATUS_BADGE_VARIANT[event.status]}>{STATUS_LABELS[event.status]}</Badge>
      </div>

      {(event.location || event.attendees?.length) && (
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-secondary">
          {event.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {event.location}
            </span>
          )}
          {!!event.attendees?.length && (
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {event.attendees.length} attending
            </span>
          )}
        </div>
      )}
    </PremiumCard>
  );
}
