"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Target, Calendar, Flame, Lightbulb, TrendingUp } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { GoalProgressRing } from "./GoalProgressRing";

interface GoalSidebarProps {
  overallScore: number;
  upcomingDeadline: string;
  currentStreak: number;
  nextMilestone: string;
  aiTip: string;
}

export function GoalSidebar({
  overallScore,
  upcomingDeadline,
  currentStreak,
  nextMilestone,
  aiTip,
}: GoalSidebarProps) {
  return (
    <div className="space-y-4 sticky top-6">
      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Overall Score</h3>
        </div>
        <div className="flex justify-center">
          <GoalProgressRing progress={overallScore} size={96} strokeWidth={8} />
        </div>
        <p className="text-center text-sm text-slate-400">Goal completion rate</p>
      </PremiumCard>

      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Upcoming Deadline</h3>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xl font-bold text-white">{upcomingDeadline}</p>
          <p className="text-xs text-slate-400 mt-1">Next due date</p>
        </div>
      </PremiumCard>

      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-rose-400" />
          <h3 className="text-lg font-semibold text-white">Current Streak</h3>
        </div>
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <p className="text-3xl font-bold text-white">{currentStreak}</p>
          <p className="text-xs text-slate-400 mt-1">days</p>
        </div>
      </PremiumCard>

      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Next Milestone</h3>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-sm font-medium text-white">{nextMilestone}</p>
          <p className="text-xs text-slate-400 mt-1">Up next</p>
        </div>
      </PremiumCard>

      <PremiumCard className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">AI Tip</h3>
        </div>
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-sm text-indigo-200">{aiTip}</p>
        </div>
      </PremiumCard>
    </div>
  );
}
