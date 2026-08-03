"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Bell } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";

interface Subscription {
  id: string;
  name: string;
  monthlyCost: number;
  renewalDate: string;
  icon?: React.ReactNode;
  color: string;
}

interface SubscriptionCardProps {
  subscriptions: Subscription[];
  onSetReminder?: (subscriptionId: string) => void;
  onCancel?: (subscriptionId: string) => void;
}

export function SubscriptionCard({
  subscriptions,
  onSetReminder,
  onCancel,
}: SubscriptionCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalMonthlyCost = subscriptions.reduce((sum, sub) => sum + sub.monthlyCost, 0);

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Subscriptions</h3>
        </div>
        <span className="text-sm text-slate-400">
          {formatCurrency(totalMonthlyCost)}/month
        </span>
      </div>

      <div className="space-y-3">
        {subscriptions.map((subscription, index) => (
          <motion.div
            key={subscription.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${subscription.color} flex items-center justify-center`}
              >
                {subscription.icon || (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {subscription.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-white">{subscription.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">
                    Renews: {subscription.renewalDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-white">{formatCurrency(subscription.monthlyCost)}/mo</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => onSetReminder?.(subscription.id)}
                  className="p-1.5 rounded-lg bg-slate-700/50 border border-slate-700/50 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 transition-colors"
                  title="Set reminder"
                >
                  <Bell className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onCancel?.(subscription.id)}
                  className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PremiumCard>
  );
}
