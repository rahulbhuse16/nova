import * as React from "react";
import { CalendarPlus } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { cn } from "@/lib/utils";

export interface CalendarEmptyStateProps {
  onCreateEvent?: () => void;
  compact?: boolean;
  className?: string;
}

export function CalendarEmptyState({ onCreateEvent, compact, className }: CalendarEmptyStateProps) {
  return (
    <EmptyState
      icon={<CalendarPlus className="h-6 w-6" />}
      title="No events scheduled"
      description={
        compact
          ? "Nothing planned for this day yet."
          : "Your calendar is clear. Add your first event to start planning smarter."
      }
      actionLabel={onCreateEvent ? "Create First Event" : undefined}
      onAction={onCreateEvent}
      className={cn(compact ? "py-8" : "py-14", className)}
    />
  );
}
