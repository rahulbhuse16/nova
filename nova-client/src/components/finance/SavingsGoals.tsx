"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Target, Calendar, TrendingUp } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  expectedCompletion: string;
  icon?: React.ReactNode;
  color: string;
}

interface SavingsGoalsProps {
  goals: SavingsGoal[];
}

export function SavingsGoals({ goals }: SavingsGoalsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Savings Goals</h3>
      </div>

      <div className="space-y-4">
        {goals.map((goal, index) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${goal.color} flex items-center justify-center`}
                  >
                    {goal.icon || (
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {goal.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{goal.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-500">{goal.expectedCompletion}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{formatCurrency(goal.currentAmount)}</p>
                  <p className="text-xs text-slate-500">of {formatCurrency(goal.targetAmount)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{progress.toFixed(0)}% complete</span>
                  <span className="text-indigo-400">
                    {formatCurrency(remaining)} to go
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </PremiumCard>
  );
}
