import * as React from "react";
import { CalendarPlus, ListChecks, Target, BellPlus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { pressable } from "@/components/shared/AnimatedSection";
import { cn } from "@/lib/utils";

export interface CalendarQuickActionsProps {
  onCreateEvent: () => void;
  onCreateTask?: () => void;
  onScheduleGoal?: () => void;
  onAddReminder?: () => void;
  onOpenAIPlanner: () => void;
}

const actionCls =
  "flex flex-col items-center gap-2.5 rounded-lg border border-border bg-card p-5 text-center shadow-soft transition-shadow hover:shadow-float";

export function CalendarQuickActions({
  onCreateEvent,
  onCreateTask,
  onScheduleGoal,
  onAddReminder,
  onOpenAIPlanner,
}: CalendarQuickActionsProps) {
  const actions = [
    { label: "Create Event", icon: CalendarPlus, onClick: onCreateEvent, accent: "primary" as const },
    { label: "Create Task", icon: ListChecks, onClick: onCreateTask, accent: "success" as const },
    { label: "Schedule Goal", icon: Target, onClick: onScheduleGoal, accent: "warning" as const },
    { label: "Add Reminder", icon: BellPlus, onClick: onAddReminder, accent: "error" as const },
    { label: "Open AI Planner", icon: Sparkles, onClick: onOpenAIPlanner, accent: "primary" as const, gradient: true },
  ];

  const accentCls = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/12 text-warning",
    error: "bg-error/12 text-error",
  };

  return (
    <ContentGrid columns={4} gap="md">
      {actions.map((action) => (
        <motion.button key={action.label} onClick={action.onClick} {...pressable} className={actionCls}>
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full text-white",
              !action.gradient && accentCls[action.accent]
            )}
            style={action.gradient ? { backgroundImage: "var(--gradient-aurora)" } : undefined}
          >
            <action.icon className={cn("h-5 w-5", action.gradient && "text-white")} />
          </span>
          <span className="text-sm font-medium text-text">{action.label}</span>
        </motion.button>
      ))}
    </ContentGrid>
  );
}
