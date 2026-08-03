"use client";

import * as React from "react";
import { BalanceCard } from "./BalanceCard";
import { BudgetCard } from "./BudgetCard";

interface FinanceOverviewProps {
  currentBalance: number;
  incomeThisMonth: number;
  expensesThisMonth: number;
  savings: number;
  monthlyBudget: number;
  netCashFlow: number;
  remainingBudget: number;
  dailySpendingTarget: number;
  savingsGoal: number;
  savingsProgress: number;
}

export function FinanceOverview({
  currentBalance,
  incomeThisMonth,
  expensesThisMonth,
  savings,
  monthlyBudget,
  netCashFlow,
  remainingBudget,
  dailySpendingTarget,
  savingsGoal,
  savingsProgress,
}: FinanceOverviewProps) {
  return (
    <div className="space-y-6">
      <BalanceCard
        currentBalance={currentBalance}
        incomeThisMonth={incomeThisMonth}
        expensesThisMonth={expensesThisMonth}
        savings={savings}
        monthlyBudget={monthlyBudget}
        netCashFlow={netCashFlow}
      />

      <BudgetCard
        monthlyBudget={monthlyBudget}
        remainingBudget={remainingBudget}
        dailySpendingTarget={dailySpendingTarget}
        savingsGoal={savingsGoal}
        savingsProgress={savingsProgress}
      />
    </div>
  );
}
