"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Timer, Globe } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { Chip } from "../shared/Chip";

interface TaskScheduleCardProps {
  dueDate: string;
  startTime: string;
  endTime: string;
  estimatedDuration: string;
  timeZone: string;
  onDueDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onEstimatedDurationChange: (duration: string) => void;
  onTimeZoneChange: (zone: string) => void;
}

const quickDateOptions = [
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "weekend", label: "This Weekend" },
  { id: "nextWeek", label: "Next Week" },
];

export function TaskScheduleCard({
  dueDate,
  startTime,
  endTime,
  estimatedDuration,
  timeZone,
  onDueDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onEstimatedDurationChange,
  onTimeZoneChange,
}: TaskScheduleCardProps) {
  const handleQuickDateSelect = (option: string) => {
    const today = new Date();
    let newDate = today;

    switch (option) {
      case "today":
        newDate = today;
        break;
      case "tomorrow":
        newDate = new Date(today);
        newDate.setDate(today.getDate() + 1);
        break;
      case "weekend":
        newDate = new Date(today);
        const day = today.getDay();
        const diff = 6 - day;
        newDate.setDate(today.getDate() + diff);
        break;
      case "nextWeek":
        newDate = new Date(today);
        newDate.setDate(today.getDate() + 7);
        break;
    }

    onDueDateChange(newDate.toISOString().split('T')[0]);
  };

  return (
    <PremiumCard className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Due Date
        </label>
        <div className="flex gap-3">
          <motion.input
            type="date"
            value={dueDate}
            onChange={(e) => onDueDateChange(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            whileFocus={{ scale: 1.01 }}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {quickDateOptions.map((option) => (
            <Chip
              key={option.id}
              label={option.label}
              selected={false}
              onSelect={() => handleQuickDateSelect(option.id)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Clock className="h-4 w-4" />
            Start Time
          </label>
          <motion.input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            whileFocus={{ scale: 1.01 }}
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Clock className="h-4 w-4" />
            End Time
          </label>
          <motion.input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            whileFocus={{ scale: 1.01 }}
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <Timer className="h-4 w-4" />
          Estimated Duration
        </label>
        <motion.input
          type="text"
          value={estimatedDuration}
          onChange={(e) => onEstimatedDurationChange(e.target.value)}
          placeholder="e.g., 2 hours"
          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          whileFocus={{ scale: 1.01 }}
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          <Globe className="h-4 w-4" />
          Time Zone
        </label>
        <motion.select
          value={timeZone}
          onChange={(e) => onTimeZoneChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
          whileFocus={{ scale: 1.01 }}
        >
          <option value="UTC">UTC (Universal Time)</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="Europe/London">London (GMT)</option>
          <option value="Europe/Paris">Central European (CET)</option>
          <option value="Asia/Tokyo">Japan (JST)</option>
          <option value="Asia/Shanghai">China (CST)</option>
          <option value="Asia/Kolkata">India (IST)</option>
        </motion.select>
      </div>
    </PremiumCard>
  );
}
