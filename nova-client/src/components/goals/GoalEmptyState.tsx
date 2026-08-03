"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Target, Sparkles, Plus } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";

interface GoalEmptyStateProps {
  onCreateGoal?: () => void;
  message?: string;
}

export function GoalEmptyState({ onCreateGoal, message = "No goals yet" }: GoalEmptyStateProps) {
  return (
    <PremiumCard className="p-12 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Target className="h-10 w-10 text-indigo-400" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{message}</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Start your journey by creating your first goal. Nova will help you track progress and achieve meaningful milestones.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <PrimaryButton
            icon={<Plus className="h-4 w-4" />}
            onClick={onCreateGoal}
          >
            Create Goal
          </PrimaryButton>
          <PrimaryButton
            icon={<Sparkles className="h-4 w-4" />}
            variant="glass"
          >
            AI Goal Planner
          </PrimaryButton>
        </div>

        <div className="pt-6 border-t border-slate-700/50">
          <p className="text-xs text-slate-500">
            💡 Tip: Break down big goals into smaller milestones for better tracking
          </p>
        </div>
      </motion.div>
    </PremiumCard>
  );
}
