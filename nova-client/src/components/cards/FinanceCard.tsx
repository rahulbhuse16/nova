import * as React from "react";
import { DollarSign, TrendingDown, Calendar, AlertCircle } from "lucide-react";
import { PremiumCard } from "./PremiumCard";
import { StatCard } from "./StatCard";

interface FinanceCardProps {
  todaySpending: number;
  monthlyBudget: number;
  budgetUsed: number;
  upcomingBills: number;
}

export function FinanceCard({
  todaySpending,
  monthlyBudget,
  budgetUsed,
  upcomingBills,
}: FinanceCardProps) {
  const budgetPercentage = Math.min((budgetUsed / monthlyBudget) * 100, 100);
  const isOverBudget = budgetUsed > monthlyBudget;

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Finance Snapshot</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Today's Spending"
          value={`$${todaySpending}`}
          icon={<TrendingDown className="h-4 w-4" />}
          trend={{ direction: "down", value: "Under budget" }}
        />
        <StatCard
          label="Upcoming Bills"
          value={upcomingBills.toString()}
          unit="bills"
          icon={<Calendar className="h-4 w-4" />}
          trend={{ direction: "up", value: "Next: 3 days" }}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Monthly Budget</span>
          <span className={`text-sm font-medium ${isOverBudget ? "text-rose-400" : "text-emerald-400"}`}>
            ${budgetUsed} / ${monthlyBudget}
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget ? "bg-rose-500" : "bg-gradient-to-r from-emerald-500 to-teal-500"
            }`}
            style={{ width: `${budgetPercentage}%` }}
          />
        </div>
        {isOverBudget && (
          <div className="flex items-center gap-2 text-xs text-rose-400">
            <AlertCircle className="h-3 w-3" />
            <span>Over budget by ${(budgetUsed - monthlyBudget).toFixed(2)}</span>
          </div>
        )}
      </div>
    </PremiumCard>
  );
}
