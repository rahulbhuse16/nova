"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Calendar, AlertCircle } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
  icon?: React.ReactNode;
}

interface UpcomingBillsProps {
  bills: Bill[];
  onPayBill?: (billId: string) => void;
}

export function UpcomingBills({ bills, onPayBill }: UpcomingBillsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUrgencyColor = (daysRemaining: number) => {
    if (daysRemaining <= 1) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (daysRemaining <= 3) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  };

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Upcoming Bills</h3>
      </div>

      <div className="space-y-3">
        {bills.map((bill, index) => (
          <motion.div
            key={bill.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                {bill.icon || (
                  <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center">
                    <span className="text-sm font-semibold text-indigo-300">
                      {bill.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-white">{bill.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">Due: {bill.dueDate}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs border ${getUrgencyColor(bill.daysRemaining)}`}
                  >
                    {bill.daysRemaining === 0 ? "Today" : bill.daysRemaining === 1 ? "Tomorrow" : `${bill.daysRemaining} days`}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-white">{formatCurrency(bill.amount)}</p>
              <PrimaryButton
                size="sm"
                variant="glass"
                onClick={() => onPayBill?.(bill.id)}
                className="mt-2"
              >
                Pay Now
              </PrimaryButton>
            </div>
          </motion.div>
        ))}
      </div>

      {bills.some((bill) => bill.daysRemaining <= 1) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20"
        >
          <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-rose-400">Urgent Payment</p>
            <p className="text-xs text-rose-300/70">
              You have bills due within the next 24 hours
            </p>
          </div>
        </motion.div>
      )}
    </PremiumCard>
  );
}
