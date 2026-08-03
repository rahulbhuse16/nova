"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Calendar, Clock } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { GoalProgressRing } from "@/components/goals/GoalProgressRing";

interface GoalProgressCardProps {
  title: string;
  progress: number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  deadline?: string;
  showRing?: boolean;
}

export function GoalProgressCard({
  title,
  progress,
  subtitle,
  icon,
  color = "bg-indigo-500/20",
  deadline,
  showRing = true,
}: GoalProgressCardProps) {
  const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const due = new Date(deadline);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = deadline ? getDaysRemaining(deadline) : null;
  const isOverdue = daysRemaining !== null && daysRemaining < 0;

  const progressColor = (progress: number) => {
    if (progress >= 75) return "text-emerald-400";
    if (progress >= 50) return "text-indigo-400";
    if (progress >= 25) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <PremiumCard className="p-5">
      <div className="flex items-start gap-4">
        {showRing && (
          <div className="flex-shrink-0">
            <GoalProgressRing progress={progress} size={64} strokeWidth={6} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {icon && <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", color)}>{icon}</div>}
            <h3 className="font-semibold text-white">{title}</h3>
          </div>
          {subtitle && <p className="text-sm text-slate-400 mb-3">{subtitle}</p>}
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <TrendingUp className={cn("h-4 w-4", progressColor(progress))} />
              <span className={cn("font-semibold", progressColor(progress))}>{progress}%</span>
            </div>
            {deadline && (
              <div className={cn("flex items-center gap-1.5", isOverdue ? "text-rose-400" : "text-slate-400")}>
                <Calendar className="h-4 w-4" />
                <span>{isOverdue ? `${Math.abs(daysRemaining!)}d overdue` : `${daysRemaining}d left`}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}

import { cn } from "@/lib/utils";
