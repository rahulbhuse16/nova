"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Flame, Target, Award, Zap } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  unlockedAt?: string;
}

interface GoalAchievementsProps {
  achievements: Achievement[];
}

export function GoalAchievements({ achievements }: GoalAchievementsProps) {
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <PremiumCard className="p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-400" />
        <h3 className="text-lg font-semibold text-white">Achievements</h3>
        <span className="text-sm text-slate-400">({unlocked.length}/{achievements.length})</span>
      </div>

      <div className="space-y-3">
        {unlocked.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Unlocked</p>
            {unlocked.map((achievement) => (
              <AchievementItem key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}

        {locked.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Locked</p>
            {locked.map((achievement) => (
              <AchievementItem key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}

        {achievements.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No achievements yet</p>
            <p className="text-xs mt-1">Complete goals to earn achievements</p>
          </div>
        )}
      </div>
    </PremiumCard>
  );
}

interface AchievementItemProps {
  achievement: Achievement;
}

function AchievementItem({ achievement }: AchievementItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "p-3 rounded-xl border flex items-center gap-3",
        achievement.unlocked
          ? achievement.color
          : "bg-slate-800/30 border-slate-700/50 opacity-60"
      )}
    >
      <div className={cn("flex-shrink-0", achievement.unlocked ? "" : "grayscale opacity-50")}>
        {achievement.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", achievement.unlocked ? "text-white" : "text-slate-400")}>
          {achievement.title}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{achievement.description}</p>
      </div>
      {achievement.unlocked && (
        <div className="flex-shrink-0">
          <Star className="h-4 w-4 text-amber-400 fill-current" />
        </div>
      )}
    </motion.div>
  );
}

import { cn } from "@/lib/utils";
