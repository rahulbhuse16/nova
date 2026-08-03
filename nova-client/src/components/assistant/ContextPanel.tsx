"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Target, Calendar, FileText, DollarSign, Brain, X } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { ConversationContext } from "../../types/assistant.types";

interface ContextPanelProps {
  context: ConversationContext;
  onClose: () => void;
}

interface ContextItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

export function ContextPanel({ context, onClose }: ContextPanelProps) {
  const contextItems: ContextItem[] = [
    {
      id: "tasks",
      title: "Today's Tasks",
      subtitle: `${context.tasks?.length || 0} active tasks`,
      icon: <CheckCircle className="h-4 w-4" />,
      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      id: "goals",
      title: "Active Goals",
      subtitle: `${context.goals?.length || 0} goals in progress`,
      icon: <Target className="h-4 w-4" />,
      color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    },
    {
      id: "calendar",
      title: "Calendar Events",
      subtitle: `${context.calendarEvents?.length || 0} upcoming events`,
      icon: <Calendar className="h-4 w-4" />,
      color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    },
    {
      id: "notes",
      title: "Recent Notes",
      subtitle: `${context.notes?.length || 0} notes`,
      icon: <FileText className="h-4 w-4" />,
      color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      id: "documents",
      title: "Recent Documents",
      subtitle: `${context.documents?.length || 0} documents`,
      icon: <FileText className="h-4 w-4" />,
      color: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    },
  ];

  const hasContext = Object.values(context).some((items) => items && items.length > 0);

  return (
    <div className="hidden xl:block w-80 border-l border-slate-700/50 flex flex-col bg-slate-900/50">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Current Context</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!hasContext ? (
          <PremiumCard className="p-6 text-center">
            <Brain className="h-8 w-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No active context</p>
            <p className="text-xs text-slate-500 mt-1">Nova will use relevant information from your data</p>
          </PremiumCard>
        ) : (
          contextItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PremiumCard className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg border-2", item.color)}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.subtitle}</p>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Brain className="h-3 w-3" />
          <span>Context-aware responses</span>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
