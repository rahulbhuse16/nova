"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart, Wallet, Calendar, Sparkles, TrendingUp } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { FinancialHealthCard } from "./FinancialHealthCard";

interface FinanceSidebarProps {
  financialHealthScore: number;
  budgetStatus: string;
  upcomingPayments: number;
  latestAITip: string;
  monthlyGoalProgress: number;
}

export function FinanceSidebar({
  financialHealthScore,
  budgetStatus,
  upcomingPayments,
  latestAITip,
  monthlyGoalProgress,
}: FinanceSidebarProps) {
  return (
    <div className="space-y-4 sticky top-6">
      <FinancialHealthCard score={financialHealthScore} />

      <PremiumCard className="space-y-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Budget Status</h3>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-2xl font-bold text-white">{budgetStatus}</p>
          <p className="text-xs text-slate-500 mt-1">This month</p>
        </div>
      </PremiumCard>

      <PremiumCard className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Upcoming Payments</h3>
        </div>
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-2xl font-bold text-white">{upcomingPayments}</p>
          <p className="text-xs text-slate-500 mt-1">Next 7 days</p>
        </div>
      </PremiumCard>

      <PremiumCard className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">AI Tip</h3>
        </div>
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-sm text-indigo-200">{latestAITip}</p>
        </div>
      </PremiumCard>

      <PremiumCard className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Monthly Goal</h3>
        </div>
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${monthlyGoalProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>
          <p className="text-xs text-slate-400 text-center">{monthlyGoalProgress.toFixed(0)}% achieved</p>
        </div>
      </PremiumCard>
    </div>
  );
}
