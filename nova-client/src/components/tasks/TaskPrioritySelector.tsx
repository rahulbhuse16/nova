"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Flag } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

type Priority = "low" | "medium" | "high" | "urgent";

interface TaskPrioritySelectorProps {
  priority: Priority;
  onPriorityChange: (priority: Priority) => void;
}

const priorityConfig: Record<
  Priority,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  low: {
    label: "Low",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  medium: {
    label: "Medium",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  high: {
    label: "High",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
  urgent: {
    label: "Urgent",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
};

export function TaskPrioritySelector({
  priority,
  onPriorityChange,
}: TaskPrioritySelectorProps) {
  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <Flag className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Priority</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(priorityConfig) as Priority[]).map((p) => (
          <motion.button
            key={p}
            onClick={() => onPriorityChange(p)}
            className={`px-4 py-3 rounded-xl border-2 transition-all ${
              priority === p
                ? `${priorityConfig[p].bgColor} ${priorityConfig[p].borderColor} ${priorityConfig[p].color}`
                : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-medium">{priorityConfig[p].label}</span>
          </motion.button>
        ))}
      </div>
    </PremiumCard>
  );
}
