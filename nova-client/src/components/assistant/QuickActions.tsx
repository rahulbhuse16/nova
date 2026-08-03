"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { QuickAction } from "../../types/assistant.types";
import { PremiumCard } from "../cards/PremiumCard";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  actions: QuickAction[];
  onActionClick: (action: string) => void;
}

export function QuickActions({ actions, onActionClick }: QuickActionsProps) {
  return (
    <PremiumCard className="p-5">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onActionClick(action.action)}
            className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all text-left"
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <div className="text-sm font-medium text-white mb-1">{action.label}</div>
            <div className="text-xs text-slate-400 line-clamp-2">{action.description}</div>
          </motion.button>
        ))}
      </div>
    </PremiumCard>
  );
}
