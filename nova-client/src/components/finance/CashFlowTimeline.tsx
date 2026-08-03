"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface CashFlowEvent {
  id: string;
  type: "income" | "expense" | "bill" | "investment";
  title: string;
  amount: number;
  date: string;
  icon?: React.ReactNode;
}

interface CashFlowTimelineProps {
  events: CashFlowEvent[];
}

export function CashFlowTimeline({ events }: CashFlowTimelineProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getEventConfig = (type: CashFlowEvent["type"]) => {
    switch (type) {
      case "income":
        return {
          icon: <TrendingUp className="h-4 w-4" />,
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          lineColor: "bg-emerald-500",
        };
      case "expense":
        return {
          icon: <TrendingDown className="h-4 w-4" />,
          color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          lineColor: "bg-rose-500",
        };
      case "bill":
        return {
          icon: <Wallet className="h-4 w-4" />,
          color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          lineColor: "bg-amber-500",
        };
      case "investment":
        return {
          icon: <TrendingUp className="h-4 w-4" />,
          color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
          lineColor: "bg-indigo-500",
        };
    }
  };

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <ArrowRight className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Cash Flow Timeline</h3>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700/50" />

        <div className="space-y-4">
          {events.map((event, index) => {
            const config = getEventConfig(event.type);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex items-start gap-4 pl-12"
              >
                {/* Timeline Dot */}
                <div className="absolute left-[19px] top-2 w-3 h-3 rounded-full border-2 border-slate-900 bg-slate-700" />

                <div className="flex-1 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${config.color}`}>
                        {config.icon}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{event.title}</p>
                        <p className="text-xs text-slate-500">{event.date}</p>
                      </div>
                    </div>
                    <span
                      className={`font-semibold text-sm ${
                        event.type === "income" || event.type === "investment"
                          ? "text-emerald-400"
                          : "text-white"
                      }`}
                    >
                      {event.type === "income" || event.type === "investment" ? "+" : "-"}
                      {formatCurrency(event.amount)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PremiumCard>
  );
}
