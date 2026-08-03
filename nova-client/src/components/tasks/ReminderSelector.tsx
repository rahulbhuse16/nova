"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Chip } from "../shared/Chip";

interface ReminderSelectorProps {
  reminder: string;
  onReminderChange: (reminder: string) => void;
  customReminder: string;
  onCustomReminderChange: (reminder: string) => void;
}

const reminderOptions = [
  { id: "10min", label: "10 minutes before" },
  { id: "30min", label: "30 minutes before" },
  { id: "1hour", label: "1 hour before" },
  { id: "tomorrow", label: "Tomorrow morning" },
  { id: "custom", label: "Custom" },
];

export function ReminderSelector({
  reminder,
  onReminderChange,
  customReminder,
  onCustomReminderChange,
}: ReminderSelectorProps) {
  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Reminder</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {reminderOptions.map((option) => (
          <Chip
            key={option.id}
            label={option.label}
            selected={reminder === option.id}
            onSelect={() => onReminderChange(option.id)}
          />
        ))}
      </div>
      {reminder === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <motion.input
            type="text"
            value={customReminder}
            onChange={(e) => onCustomReminderChange(e.target.value)}
            placeholder="e.g., 2 days before at 9:00 AM"
            className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            whileFocus={{ scale: 1.01 }}
          />
        </motion.div>
      )}
    </PremiumCard>
  );
}
