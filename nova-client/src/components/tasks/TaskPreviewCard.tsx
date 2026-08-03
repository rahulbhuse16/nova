"use client";

import * as React from "react";
import { CheckSquare, Calendar, Clock, Flag } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface TaskPreviewCardProps {
  title: string;
  description: string;
  category: string;
  priority: string;
  dueDate: string;
  startTime: string;
  subtasks: Array<{ id: string; title: string; completed: boolean }>;
  tags: string[];
}

const priorityConfig: Record<string, { color: string; label: string }> = {
  low: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Low" },
  medium: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Medium" },
  high: { color: "bg-rose-500/10 text-rose-400 border-rose-500/20", label: "High" },
  urgent: { color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Urgent" },
};

export function TaskPreviewCard({
  title,
  description,
  category,
  priority,
  dueDate,
  startTime,
  subtasks,
  tags,
}: TaskPreviewCardProps) {
  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckSquare className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Task Preview</h3>
      </div>

      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-1">{title || "Untitled Task"}</h4>
            {description && <p className="text-sm text-slate-400 line-clamp-2">{description}</p>}
          </div>
          {priority && (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-md border ${priorityConfig[priority]?.color}`}
            >
              {priorityConfig[priority]?.label}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          {category && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Category:</span>
              <span className="text-slate-400">{category}</span>
            </div>
          )}
          {dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className="text-slate-400">{dueDate}</span>
            </div>
          )}
          {startTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="text-slate-400">{startTime}</span>
            </div>
          )}
        </div>

        {subtasks.length > 0 && (
          <div className="pt-2 border-t border-slate-700/50">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckSquare className="h-3 w-3" />
              <span>
                {completedSubtasks} of {subtasks.length} subtasks
              </span>
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 text-center">
        This is how your task will appear on the Today page
      </p>
    </PremiumCard>
  );
}
