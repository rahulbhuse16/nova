import * as React from "react";
import { CheckSquare, Calendar, Clock, Target } from "lucide-react";
import { StatCard } from "./StatCard";

interface DailyOverviewCardProps {
  tasks: number;
  meetings: number;
  habits: number;
  focusTime: string;
}

export function DailyOverviewCard({ tasks, meetings, habits, focusTime }: DailyOverviewCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Tasks"
        value={tasks.toString()}
        icon={<CheckSquare className="h-4 w-4" />}
        trend={{ direction: "up", value: "3 pending" }}
      />
      <StatCard
        label="Meetings"
        value={meetings.toString()}
        icon={<Calendar className="h-4 w-4" />}
        trend={{ direction: "up", value: "Next in 2h" }}
      />
      <StatCard
        label="Habits"
        value={habits.toString()}
        unit="completed"
        icon={<Clock className="h-4 w-4" />}
        trend={{ direction: "up", value: "On track" }}
      />
      <StatCard
        label="Focus Time"
        value={focusTime}
        icon={<Target className="h-4 w-4" />}
        trend={{ direction: "up", value: "+1h vs yesterday" }}
      />
    </div>
  );
}
