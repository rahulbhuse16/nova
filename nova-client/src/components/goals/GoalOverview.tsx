"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle, TrendingUp, Flame, Award } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { StatCard } from "../cards/StatCard";
import { ContentGrid } from "../layout/ContentGrid";

interface GoalOverviewProps {
  activeGoals: number;
  completedGoals: number;
  weeklyProgress: number;
  currentStreak: number;
  successRate: number;
}

export function GoalOverview({
  activeGoals,
  completedGoals,
  weeklyProgress,
  currentStreak,
  successRate,
}: GoalOverviewProps) {
  return (
    <ContentGrid columns={4} gap="md">
      <StatCard
        label="Active Goals"
        value={activeGoals.toString()}
        icon={<Target className="h-5 w-5 text-indigo-400" />}
        trend={{
          direction: "up" as const,
          value: "+2 this month",
          positiveIsGood: true,
        }}
      />

      <StatCard
        label="Completed"
        value={completedGoals.toString()}
        icon={<CheckCircle className="h-5 w-5 text-emerald-400" />}
        trend={{
          direction: "up" as const,
          value: "+1 this week",
          positiveIsGood: true,
        }}
      />

      <StatCard
        label="Weekly Progress"
        value={`${weeklyProgress}%`}
        icon={<TrendingUp className="h-5 w-5 text-cyan-400" />}
        trend={{
          direction: "up" as const,
          value: "+5% vs last week",
          positiveIsGood: true,
        }}
      />

      <StatCard
        label="Current Streak"
        value={`${currentStreak} days`}
        icon={<Flame className="h-5 w-5 text-rose-400" />}
        trend={{
          direction: "up" as const,
          value: "Personal best!",
          positiveIsGood: true,
        }}
      />
    </ContentGrid>
  );
}
