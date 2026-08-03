"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingDown, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface Insight {
  id: string;
  type: "savings" | "spending" | "alert" | "tip";
  icon: React.ReactNode;
  content: string;
  color: string;
}

interface FinanceInsightsProps {
  insights: Insight[];
  onOptimizeBudget?: () => void;
  onAnalyzeSpending?: () => void;
  onViewSuggestions?: () => void;
}

export function FinanceInsights({
  insights,
  onOptimizeBudget,
  onAnalyzeSpending,
  onViewSuggestions,
}: FinanceInsightsProps) {
  const getInsightColor = (type: Insight["type"]) => {
    switch (type) {
      case "savings":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "spending":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "alert":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "tip":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
  };

  return (
    <PremiumCard className="space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">AI Finance Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-start gap-3 p-4 rounded-xl border ${getInsightColor(insight.type)}`}
          >
            <div className={`mt-0.5 ${getInsightColor(insight.type).split(" ")[1]}`}>
              {insight.icon}
            </div>
            <p className="text-sm text-slate-200 flex-1">{insight.content}</p>
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-700/50 space-y-3">
        <SecondaryButton
          className="w-full"
          icon={<TrendingUp className="h-4 w-4" />}
          onClick={onOptimizeBudget}
        >
          Optimize Budget
        </SecondaryButton>
        <SecondaryButton
          className="w-full"
          icon={<Lightbulb className="h-4 w-4" />}
          onClick={onAnalyzeSpending}
        >
          Analyze Spending
        </SecondaryButton>
        <PrimaryButton
          className="w-full"
          icon={<Sparkles className="h-4 w-4" />}
          onClick={onViewSuggestions}
        >
          View Suggestions
        </PrimaryButton>
      </div>
    </PremiumCard>
  );
}
