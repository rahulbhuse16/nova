"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { Badge } from "../shared/Badge";

interface TransactionItemProps {
  merchant: string;
  merchantLogo?: React.ReactNode;
  category: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
  status: "completed" | "pending" | "refund";
}

export function TransactionItem({
  merchant,
  merchantLogo,
  category,
  date,
  amount,
  type,
  status,
}: TransactionItemProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statusConfig = {
    completed: { label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    pending: { label: "Pending", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    refund: { label: "Refund", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-slate-700/30 hover:border-slate-700/50"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
          {merchantLogo || (
            <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center">
              <span className="text-sm font-semibold text-indigo-300">
                {merchant.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div>
          <p className="font-medium text-white">{merchant}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="neutral" className="text-xs">
              {category}
            </Badge>
            <span className="text-xs text-slate-500">{date}</span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className={`flex items-center gap-1 ${
          type === "credit" ? "text-emerald-400" : "text-white"
        }`}>
          {type === "credit" ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          <span className="font-semibold">
            {type === "credit" ? "+" : "-"}
            {formatCurrency(amount)}
          </span>
        </div>
        <div className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs border ${statusConfig[status].color}`}>
          {status === "pending" && <Clock className="h-3 w-3" />}
          {statusConfig[status].label}
        </div>
      </div>
    </motion.div>
  );
}
