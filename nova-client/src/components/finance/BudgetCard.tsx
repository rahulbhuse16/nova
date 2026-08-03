"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Wallet, Target, TrendingUp, AlertCircle } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface BudgetCardProps {
  monthlyBudget: number;
  remainingBudget: number;
  dailySpendingTarget: number;
  savingsGoal: number;
  savingsProgress: number;
}

export function BudgetCard({
  monthlyBudget,
  remainingBudget,
  dailySpendingTarget,
  savingsGoal,
  savingsProgress,
}: BudgetCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const budgetUsedPercentage = ((monthlyBudget - remainingBudget) / monthlyBudget) * 100;
  const isOverBudget = remainingBudget < 0;

  return (
    <PremiumCard className="space-y-5">
      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Budget Progress</h3>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Monthly Budget</span>
            <span className="text-sm font-medium text-white">{formatCurrency(monthlyBudget)}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${
                isOverBudget ? "bg-rose-500" : budgetUsedPercentage > 80 ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-slate-500">{budgetUsedPercentage.toFixed(0)}% used</span>
            <span className={`text-xs font-medium ${isOverBudget ? "text-rose-400" : "text-emerald-400"}`}>
              {formatCurrency(remainingBudget)} remaining
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Daily Spending Target</span>
            <span className="text-sm font-medium text-white">{formatCurrency(dailySpendingTarget)}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-500 mt-1 block">65% of daily limit used today</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-slate-300">Savings Goal</span>
            </div>
            <span className="text-sm font-medium text-white">{formatCurrency(savingsGoal)}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${savingsProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-slate-500">{savingsProgress.toFixed(0)}% achieved</span>
            <span className="text-xs text-indigo-400">
              {formatCurrency(savingsGoal * (1 - savingsProgress / 100))} to go
            </span>
          </div>
        </div>

        {isOverBudget && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20"
          >
            <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-rose-400">Over Budget</p>
              <p className="text-xs text-rose-300/70">
                You've exceeded your monthly budget by {formatCurrency(Math.abs(remainingBudget))}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </PremiumCard>
  );
}
