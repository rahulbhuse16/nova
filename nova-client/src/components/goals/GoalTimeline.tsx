"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Milestone } from "../../types/goal.types";
import { cn } from "@/lib/utils";

interface GoalTimelineProps {
  milestones: Milestone[];
  title?: string;
}

export function GoalTimeline({ milestones, title = "Milestone Timeline" }: GoalTimelineProps) {
  const upcoming = milestones.filter((m) => !m.completed);
  const completed = milestones.filter((m) => m.completed);
  const overdue = upcoming.filter((m) => m.dueDate && new Date(m.dueDate) < new Date());

  return (
    <PremiumCard className="p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      {overdue.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-rose-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Overdue ({overdue.length})
          </p>
          {overdue.map((milestone) => (
            <TimelineItem key={milestone.id} milestone={milestone} status="overdue" />
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcoming.length})
          </p>
          {upcoming.map((milestone) => (
            <TimelineItem key={milestone.id} milestone={milestone} status="upcoming" />
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-emerald-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completed.length})
          </p>
          {completed.map((milestone) => (
            <TimelineItem key={milestone.id} milestone={milestone} status="completed" />
          ))}
        </div>
      )}

      {milestones.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No milestones yet</p>
        </div>
      )}
    </PremiumCard>
  );
}

interface TimelineItemProps {
  milestone: Milestone;
  status: "upcoming" | "completed" | "overdue";
}

function TimelineItem({ milestone, status }: TimelineItemProps) {
  const statusColors = {
    upcoming: "bg-slate-700/50 border-slate-600/50",
    completed: "bg-emerald-500/10 border-emerald-500/20",
    overdue: "bg-rose-500/10 border-rose-500/20",
  };

  const statusIcon = {
    upcoming: <Calendar className="h-4 w-4 text-slate-400" />,
    completed: <CheckCircle className="h-4 w-4 text-emerald-400" />,
    overdue: <AlertCircle className="h-4 w-4 text-rose-400" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("p-3 rounded-lg border flex items-center gap-3", statusColors[status])}
    >
      <div className="flex-shrink-0">{statusIcon[status]}</div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", status === "completed" ? "text-emerald-300 line-through" : "text-white")}>
          {milestone.title}
        </p>
        {milestone.dueDate && (
          <p className="text-xs text-slate-400 mt-0.5">
            {status === "completed" && milestone.completedAt
              ? `Completed: ${milestone.completedAt}`
              : `Due: ${milestone.dueDate}`}
          </p>
        )}
      </div>
    </motion.div>
  );
}
