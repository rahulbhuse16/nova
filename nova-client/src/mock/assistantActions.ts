import { QuickAction } from "../types/assistant.types";

export const mockQuickActions: QuickAction[] = [
  {
    id: "1",
    label: "Today's Brief",
    icon: "📋",
    description: "Get a quick overview of your day",
    action: "brief",
  },
  {
    id: "2",
    label: "Create Task",
    icon: "✅",
    description: "Add a new task to your list",
    action: "create-task",
  },
  {
    id: "3",
    label: "New Note",
    icon: "📝",
    description: "Capture a quick thought",
    action: "create-note",
  },
  {
    id: "4",
    label: "Schedule Event",
    icon: "📅",
    description: "Add to your calendar",
    action: "schedule-event",
  },
  {
    id: "5",
    label: "New Goal",
    icon: "🎯",
    description: "Set a new objective",
    action: "create-goal",
  },
  {
    id: "6",
    label: "Weekly Review",
    icon: "📊",
    description: "Review your progress",
    action: "weekly-review",
  },
  {
    id: "7",
    label: "Expense Summary",
    icon: "💰",
    description: "Check your finances",
    action: "expense-summary",
  },
  {
    id: "8",
    label: "Voice Conversation",
    icon: "🎤",
    description: "Talk with Nova",
    action: "voice-mode",
  },
];
