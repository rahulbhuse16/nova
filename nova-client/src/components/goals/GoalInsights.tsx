"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Target, Zap, Lightbulb } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface GoalInsight {
  id: string;
  type: "achievement" | "warning" | "suggestion";
  icon: React.ReactNode;
  content: string;
  color: string;
}

interface GoalInsightsProps {
  insights: GoalInsight[];
  onGeneratePlan?: () => void;
  onSuggestMilestones?: () => void;
  onOptimizeTimeline?: () => void;
}

export function GoalInsights({
  insights,
  onGeneratePlan,
  onSuggestMilestones,
  onOptimizeTimeline,
}: GoalInsightsProps) {
  return (
    <PremiumCard className="p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">AI Goal Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "p-4 rounded-xl border flex items-start gap-3",
              insight.color
            )}
          >
            <div className="flex-shrink-0 mt-0.5">{insight.icon}</div>
            <p className="text-sm text-slate-200 flex-1">{insight.content}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <PrimaryButton
          icon={<Lightbulb className="h-4 w-4" />}
          onClick={onGeneratePlan}
          variant="glass"
        >
          Generate Plan
        </PrimaryButton>
        <SecondaryButton
          icon={<Target className="h-4 w-4" />}
          onClick={onSuggestMilestones}
        >
          Suggest Milestones
        </SecondaryButton>
        <SecondaryButton
          icon={<Zap className="h-4 w-4" />}
          onClick={onOptimizeTimeline}
        >
          Optimize Timeline
        </SecondaryButton>
      </div>
    </PremiumCard>
  );
}

import { cn } from "@/lib/utils";
