import * as React from "react";
import { MapPin, Users, Bell, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Sheet } from "@/components/overlays/Sheet";
import { Badge } from "@/components/shared/Badge";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { Avatar } from "@/components/user/Avatar";
import { resolveEventIcon } from "./iconMap";
import {
  EVENT_TYPE_LABELS,
  PRIORITY_BADGE_VARIANT,
  PRIORITY_LABELS,
  STATUS_BADGE_VARIANT,
  STATUS_LABELS,
} from "./eventMeta";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectSelectedEvent } from "@/redux/calendarSelectors";
import { selectEvent, toggleCompleted, deleteEvent } from "@/redux/calendarSlice";
import { formatTime, formatDuration, isSameDay } from "@/lib/date";

export function EventDetailsDrawer() {
  const dispatch = useAppDispatch();
  const event = useAppSelector(selectSelectedEvent);

  const isOpen = !!event;
  const Icon = event ? resolveEventIcon(event.icon) : null;

  return (
    <Sheet isOpen={isOpen} onClose={() => dispatch(selectEvent(null))} title={event?.title ?? ""}>
      {event && (
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: `${event.color}1A`, color: event.color }}
            >
              {Icon && <Icon className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm text-text-secondary">
                {event.allDay
                  ? "All day"
                  : isSameDay(event.startDate, event.endDate)
                  ? `${formatTime(event.startDate)} – ${formatTime(event.endDate)} · ${formatDuration(event.startDate, event.endDate)}`
                  : `${formatTime(event.startDate)} → ${formatTime(event.endDate)}`}
              </p>
            </div>
          </div>

          {event.description && (
            <p className="text-sm leading-relaxed text-text-secondary">{event.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="neutral">{event.category}</Badge>
            <Badge variant={PRIORITY_BADGE_VARIANT[event.priority]}>{EVENT_TYPE_LABELS[event.type]}</Badge>
            <Badge variant={STATUS_BADGE_VARIANT[event.status]}>{STATUS_LABELS[event.status]}</Badge>
          </div>

          <div className="space-y-3 rounded-md border border-border bg-surface p-4 text-sm">
            {event.location && (
              <div className="flex items-center gap-2.5 text-text-secondary">
                <MapPin className="h-4 w-4 text-muted" /> {event.location}
              </div>
            )}
            {event.reminder && (
              <div className="flex items-center gap-2.5 text-text-secondary">
                <Bell className="h-4 w-4 text-muted" /> {event.reminder.minutesBefore} minutes before
              </div>
            )}
            <div className="flex items-center gap-2.5 text-text-secondary">
              <span className="text-muted">{PRIORITY_LABELS[event.priority]}</span>
            </div>
          </div>

          {!!event.attendees?.length && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                <Users className="mr-1 inline h-3.5 w-3.5" /> Attendees
              </p>
              <div className="flex -space-x-2">
                {event.attendees.map((a) => (
                  <Avatar key={a.id} name={a.name} size="sm" className="ring-2 ring-card" />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <PrimaryButton
              size="sm"
              variant="solid"
              icon={event.completed ? <Circle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              onClick={() => dispatch(toggleCompleted(event.id))}
            >
              {event.completed ? "Mark not done" : "Mark completed"}
            </PrimaryButton>
            <SecondaryButton
              size="sm"
              variant="outline"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => dispatch(deleteEvent(event.id))}
            >
              Delete
            </SecondaryButton>
          </div>
        </div>
      )}
    </Sheet>
  );
}
