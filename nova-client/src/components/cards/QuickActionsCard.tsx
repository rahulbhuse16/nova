import * as React from "react";
import { Plus, FileText, Calendar, DollarSign, Sparkles } from "lucide-react";
import { PremiumCard } from "./PremiumCard";

interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface QuickActionsCardProps {
  actions: Action[];
}

export function QuickActionsCard({ actions }: QuickActionsCardProps) {
  return (
    <PremiumCard className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
              {action.icon}
            </div>
            <span className="text-xs font-medium text-slate-300">{action.label}</span>
          </button>
        ))}
      </div>
    </PremiumCard>
  );
}
