import type { EventType, EventPriority, EventStatus } from "@/types/calendar.types";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  meeting: "Meeting",
  task: "Task",
  reminder: "Reminder",
  workout: "Workout",
  birthday: "Birthday",
  goal: "Goal",
  finance: "Finance",
  health: "Health",
  travel: "Travel",
  learning: "Learning",
  personal: "Personal",
};

export const PRIORITY_BADGE_VARIANT: Record<EventPriority, "error" | "warning" | "neutral"> = {
  high: "error",
  medium: "warning",
  low: "neutral",
};

export const PRIORITY_LABELS: Record<EventPriority, string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

export const STATUS_BADGE_VARIANT: Record<EventStatus, "primary" | "success" | "neutral" | "warning"> = {
  upcoming: "primary",
  "in-progress": "warning",
  completed: "success",
  cancelled: "neutral",
};

export const STATUS_LABELS: Record<EventStatus, string> = {
  upcoming: "Upcoming",
  "in-progress": "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};
