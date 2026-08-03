import * as React from "react";
import { Target, TrendingUp } from "lucide-react";
import { PremiumCard } from "./PremiumCard";

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  unit: string;
}

interface GoalProgressCardProps {
  goals: Goal[];
}

export function GoalProgressCard({ goals }: GoalProgressCardProps) {
  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Weekly Goals</h3>
        </div>
        <span className="text-xs text-slate-500">This week</span>
      </div>
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-200">{goal.title}</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <span className="text-xs text-slate-400">
                  {goal.progress} / {goal.target} {goal.unit}
                </span>
              </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${(goal.progress / goal.target) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-500">
              {Math.round((goal.progress / goal.target) * 100)}% complete
            </span>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}
