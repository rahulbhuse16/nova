import {
  Dumbbell,
  Users,
  UtensilsCrossed,
  BrainCircuit,
  Presentation,
  Stethoscope,
  BookOpen,
  Zap,
  Cake,
  Target,
  Plane,
  PiggyBank,
  CalendarDays,
  CheckCircle2,
  Bell,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Dumbbell,
  Users,
  UtensilsCrossed,
  BrainCircuit,
  Presentation,
  Stethoscope,
  BookOpen,
  Zap,
  Cake,
  Target,
  Plane,
  PiggyBank,
  CalendarDays,
  CheckCircle2,
  Bell,
};

/** Resolve a stored icon name (string, so it's serializable in Redux) to a component. */
export function resolveEventIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? CalendarDays;
}
