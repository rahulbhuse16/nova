import * as React from "react";
import { PremiumCard } from "@/components/cards/PremiumCard";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { StatCard } from "@/components/cards/StatCard";
import { TrendingUp, Users2, Coffee, Flame } from "lucide-react";

const WEEKLY_ACTIVITY = [
  { day: "Mon", hours: 6.5 },
  { day: "Tue", hours: 7.2 },
  { day: "Wed", hours: 5.8 },
  { day: "Thu", hours: 8.1 },
  { day: "Fri", hours: 6.0 },
  { day: "Sat", hours: 2.4 },
  { day: "Sun", hours: 1.6 },
];

/** Mock analytics — productivity stats + a lightweight weekly activity placeholder chart. */
export function CalendarInsights() {
  const maxHours = Math.max(...WEEKLY_ACTIVITY.map((d) => d.hours));

  return (
    <div className="space-y-5">
      <ContentGrid columns={4} gap="md">
        <StatCard label="Most productive day" value="Thursday" icon={<Flame className="h-4 w-4" />} />
        <StatCard label="Average meetings" value="3.4" unit="/ day" icon={<Users2 className="h-4 w-4" />} />
        <StatCard label="Free hours" value="18.5" unit="this week" icon={<Coffee className="h-4 w-4" />} />
        <StatCard label="Busy hours" value="37.6" unit="this week" icon={<TrendingUp className="h-4 w-4" />} />
      </ContentGrid>

      <PremiumCard variant="default" className="p-6">
        <p className="mb-5 text-sm font-medium text-text">Weekly activity</p>
        <div className="flex h-40 items-end justify-between gap-3">
          {WEEKLY_ACTIVITY.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end overflow-hidden rounded-sm bg-surface">
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: `${(d.hours / maxHours) * 100}%`,
                    backgroundImage: "var(--gradient-aurora)",
                    opacity: 0.85,
                  }}
                />
              </div>
              <span className="text-xs text-muted">{d.day}</span>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}
