import * as React from "react";
import { Check, Plus } from "lucide-react";
import { PremiumCard } from "./PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  time?: string;
}

interface PriorityTaskCardProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: () => void;
}

export function PriorityTaskCard({ tasks, onToggleTask, onAddTask }: PriorityTaskCardProps) {
  const priorityColors = {
    high: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Priority Tasks</h3>
        <PrimaryButton size="sm" icon={<Plus className="h-4 w-4" />} onClick={onAddTask}>
          Add Task
        </PrimaryButton>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
          >
            <button
              onClick={() => onToggleTask(task.id)}
              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? "bg-indigo-500 border-indigo-500"
                  : "border-slate-500 hover:border-indigo-400"
              }`}
            >
              {task.completed && <Check className="h-3 w-3 text-white" />}
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium ${
                  task.completed ? "text-slate-500 line-through" : "text-slate-200"
                }`}
              >
                {task.title}
              </p>
              {task.time && <p className="text-xs text-slate-500 mt-1">{task.time}</p>}
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-md border ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}
