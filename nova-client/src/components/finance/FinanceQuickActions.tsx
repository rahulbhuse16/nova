"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Wallet, ArrowRightLeft, FileText, Sparkles } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

interface FinanceQuickActionsProps {
  actions?: QuickAction[];
}

export function FinanceQuickActions({ actions }: FinanceQuickActionsProps) {
  const defaultActions: QuickAction[] = [
    {
      id: "add-expense",
      label: "Add Expense",
      icon: <Plus className="h-5 w-5" />,
      color: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20",
      onClick: () => console.log("Add expense"),
    },
    {
      id: "add-income",
      label: "Add Income",
      icon: <Minus className="h-5 w-5" />,
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
      onClick: () => console.log("Add income"),
    },
    {
      id: "create-budget",
      label: "Create Budget",
      icon: <Wallet className="h-5 w-5" />,
      color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20",
      onClick: () => console.log("Create budget"),
    },
    {
      id: "transfer",
      label: "Transfer Money",
      icon: <ArrowRightLeft className="h-5 w-5" />,
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
      onClick: () => console.log("Transfer money"),
    },
    {
      id: "export",
      label: "Export Report",
      icon: <FileText className="h-5 w-5" />,
      color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20",
      onClick: () => console.log("Export report"),
    },
    {
      id: "ai-analysis",
      label: "AI Analysis",
      icon: <Sparkles className="h-5 w-5" />,
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
      onClick: () => console.log("AI analysis"),
    },
  ];

  const actionsToRender = actions || defaultActions;

  return (
    <PremiumCard className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Quick Actions</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actionsToRender.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={action.onClick}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105 ${action.color}`}
          >
            {action.icon}
            <span className="text-sm font-medium text-white">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </PremiumCard>
  );
}
