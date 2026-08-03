"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { PieChart, Utensils, ShoppingBag, Plane, FileText, Heart, Film, MoreHorizontal } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  amount: number;
  percentage: number;
  trend: "up" | "down";
  color: string;
}

interface ExpenseAnalyticsProps {
  categories: Category[];
  totalExpenses: number;
}

export function ExpenseAnalytics({ categories, totalExpenses }: ExpenseAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PremiumCard className="space-y-5">
      <div className="flex items-center gap-2">
        <PieChart className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Expense Analytics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart Placeholder */}
        <div className="flex items-center justify-center p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {categories.map((category, index) => {
                const offset = categories.slice(0, index).reduce((acc, cat) => acc + cat.percentage, 0);
                return (
                  <circle
                    key={category.id}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={category.color}
                    strokeWidth="20"
                    strokeDasharray={`${category.percentage * 2.51} 251`}
                    strokeDashoffset={-offset * 2.51}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-lg font-bold text-white">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}
                >
                  {category.icon}
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{category.name}</p>
                  <p className="text-xs text-slate-500">{category.percentage.toFixed(0)}% of total</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white text-sm">{formatCurrency(category.amount)}</p>
                <div className={`flex items-center gap-1 text-xs ${
                  category.trend === "up" ? "text-rose-400" : "text-emerald-400"
                }`}>
                  {category.trend === "up" ? "↑" : "↓"}
                  <span>vs last month</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PremiumCard>
  );
}
