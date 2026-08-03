"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Upload, Scan, FolderPlus, Search, FolderOpen } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

interface DocumentQuickActionsProps {
  actions: QuickAction[];
}

export function DocumentQuickActions({ actions }: DocumentQuickActionsProps) {
  return (
    <PremiumCard className="p-5">
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className={cn(
              "p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all",
              action.color
            )}
          >
            <div className="flex-shrink-0">{action.icon}</div>
            <span className="text-sm font-medium text-white">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </PremiumCard>
  );
}

import { cn } from "@/lib/utils";
