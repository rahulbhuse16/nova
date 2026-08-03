"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Chip } from "../shared/Chip";

interface RepeatSelectorProps {
  repeat: string;
  onRepeatChange: (repeat: string) => void;
}

const repeatOptions = [
  { id: "never", label: "Never" },
  { id: "daily", label: "Daily" },
  { id: "weekdays", label: "Weekdays" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
  { id: "custom", label: "Custom" },
];

export function RepeatSelector({ repeat, onRepeatChange }: RepeatSelectorProps) {
  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <RotateCw className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Repeat</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {repeatOptions.map((option) => (
          <Chip
            key={option.id}
            label={option.label}
            selected={repeat === option.id}
            onSelect={() => onRepeatChange(option.id)}
          />
        ))}
      </div>
      {repeat === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
        >
          <p className="text-sm text-slate-400">Custom repeat options coming soon</p>
        </motion.div>
      )}
    </PremiumCard>
  );
}
