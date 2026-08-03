"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Lightbulb, CheckCircle, Link2, BookOpen, MessageSquare } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface AIInsight {
  id: string;
  type: "insight" | "suggestion" | "connection";
  icon: React.ReactNode;
  content: string;
  color: string;
}

interface AINoteInsightsProps {
  insights: AIInsight[];
  onSummarize?: () => void;
  onGenerateTasks?: () => void;
  onFindRelated?: () => void;
}

export function AINoteInsights({
  insights,
  onSummarize,
  onGenerateTasks,
  onFindRelated,
}: AINoteInsightsProps) {
  return (
    <PremiumCard className="p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">AI Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn("p-4 rounded-xl border flex items-start gap-3", insight.color)}
          >
            <div className="flex-shrink-0 mt-0.5">{insight.icon}</div>
            <p className="text-sm text-slate-200 flex-1">{insight.content}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <PrimaryButton
          icon={<MessageSquare className="h-4 w-4" />}
          onClick={onSummarize}
          variant="glass"
        >
          Summarize
        </PrimaryButton>
        <SecondaryButton
          icon={<CheckCircle className="h-4 w-4" />}
          onClick={onGenerateTasks}
        >
          Generate Tasks
        </SecondaryButton>
        <SecondaryButton
          icon={<Link2 className="h-4 w-4" />}
          onClick={onFindRelated}
        >
          Find Related
        </SecondaryButton>
      </div>
    </PremiumCard>
  );
}

import { cn } from "@/lib/utils";
