"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { PremiumCard } from "../cards/PremiumCard";

interface ActionCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
}

interface ActionCardsProps {
  cards: ActionCard[];
}

export function ActionCards({ cards }: ActionCardsProps) {
  return (
    <PremiumCard className="p-5">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, index) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={card.onClick}
            className={cn(
              "p-4 rounded-xl border-2 text-left transition-all",
              card.color
            )}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-sm font-medium text-white mb-1">{card.title}</div>
            <div className="text-xs text-slate-300 line-clamp-2">{card.description}</div>
          </motion.button>
        ))}
      </div>
    </PremiumCard>
  );
}

import { cn } from "@/lib/utils";
