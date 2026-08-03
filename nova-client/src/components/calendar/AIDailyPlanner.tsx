import * as React from "react";
import { Sparkles, Wand2, RefreshCcw, Coffee } from "lucide-react";
import { PremiumCard } from "@/components/cards/PremiumCard";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { useAppSelector } from "@/redux/hooks";
import { selectOverview } from "@/redux/calendarSelectors";

export interface AIDailyPlannerProps {
  onOptimizeDay?: () => void;
  onReschedule?: () => void;
  onSuggestBreaks?: () => void;
}

/** UI-only placeholder for Nova's daily planning assistant — no AI wired up. */
export function AIDailyPlanner({ onOptimizeDay, onReschedule, onSuggestBreaks }: AIDailyPlannerProps) {
  const overview = useAppSelector(selectOverview);

  const tips = [
    `You have ${overview.meetingsCount} meeting${overview.meetingsCount === 1 ? "" : "s"} today.`,
    "Move Workout to 7 PM to free up your morning focus block.",
    `You have ${overview.focusHours || 2} hours of uninterrupted focus time available.`,
    "Tomorrow is looking overloaded — consider moving one meeting.",
  ];

  return (
    <PremiumCard variant="glass" className="overflow-hidden">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundImage: "var(--gradient-aurora)" }}
        >
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">AI Daily Planner</p>
          <h3 className="mt-1 text-base font-semibold text-text">Here's how your day is shaping up</h3>

          <ul className="mt-3 space-y-2">
            {tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                {tip}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            <PrimaryButton size="sm" variant="gradient" icon={<Wand2 className="h-4 w-4" />} onClick={onOptimizeDay}>
              Optimize Day
            </PrimaryButton>
            <SecondaryButton size="sm" variant="outline" icon={<RefreshCcw className="h-4 w-4" />} onClick={onReschedule}>
              Reschedule
            </SecondaryButton>
            <SecondaryButton size="sm" variant="outline" icon={<Coffee className="h-4 w-4" />} onClick={onSuggestBreaks}>
              Suggest Breaks
            </SecondaryButton>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
