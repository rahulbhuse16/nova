"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart, TrendingUp, AlertTriangle } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface FinancialHealthCardProps {
  score: number;
}

export function FinancialHealthCard({ score }: FinancialHealthCardProps) {
  const getHealthColor = (Score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getHealthLabel = (Score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Attention";
  };

  const getHealthIcon = (Score: number) => {
    if (score >= 60) return <Heart className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Financial Health</h3>
      </div>

      <div className="flex items-center justify-center p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`text-5xl font-bold ${getHealthColor(score)}`}
          >
            {score}
          </motion.div>
          <p className="text-sm text-slate-500 mt-2">out of 100</p>
          <div className={`flex items-center justify-center gap-1 mt-2 ${getHealthColor(score)}`}>
            {getHealthIcon(score)}
            <span className="text-sm font-medium">{getHealthLabel(score)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 rounded-full bg-slate-700/50 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${
              score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500"
            }`}
          />
        </div>
        <p className="text-xs text-slate-500 text-center">Based on your spending habits</p>
      </div>
    </PremiumCard>
  );
}
