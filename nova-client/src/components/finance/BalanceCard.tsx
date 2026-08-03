"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { StatCard } from "../cards/StatCard";

interface BalanceCardProps {
  currentBalance: number;
  incomeThisMonth: number;
  expensesThisMonth: number;
  savings: number;
  monthlyBudget: number;
  netCashFlow: number;
}

export function BalanceCard({
  currentBalance,
  incomeThisMonth,
  expensesThisMonth,
  savings,
  monthlyBudget,
  netCashFlow,
}: BalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PremiumCard className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Financial Overview</h3>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Current Balance"
          value={formatCurrency(currentBalance)}
          icon={<Wallet className="h-5 w-5" />}
          trend={{
            direction: "up",
            value: "+12% vs last month",
          }}
        />
        <StatCard
          label="Income This Month"
          value={formatCurrency(incomeThisMonth)}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{
            direction: "up",
            value: "+8% vs last month",
          }}
        />
        <StatCard
          label="Expenses This Month"
          value={formatCurrency(expensesThisMonth)}
          icon={<TrendingDown className="h-5 w-5" />}
          trend={{
            direction: "down",
            value: "-5% vs last month",
            positiveIsGood: true,
          }}
        />
        <StatCard
          label="Savings"
          value={formatCurrency(savings)}
          icon={<ArrowUpRight className="h-5 w-5" />}
          trend={{
            direction: "up",
            value: "+15% vs last month",
          }}
        />
        <StatCard
          label="Monthly Budget"
          value={formatCurrency(monthlyBudget)}
          icon={<Wallet className="h-5 w-5" />}
          trend={{
            direction: "up",
            value: "70% used",
          }}
        />
        <StatCard
          label="Net Cash Flow"
          value={formatCurrency(netCashFlow)}
          icon={netCashFlow >= 0 ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
          trend={{
            direction: netCashFlow >= 0 ? "up" : "down",
            value: netCashFlow >= 0 ? "+18% vs last month" : "-2% vs last month",
          }}
        />
      </div>
    </PremiumCard>
  );
}
