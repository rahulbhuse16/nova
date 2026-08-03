"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock, AlertTriangle, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface Suggestion {
  id: string;
  type: "time" | "conflict" | "breakdown" | "schedule" | "move";
  icon: React.ReactNode;
  content: string;
  actionLabel: string;
}

interface AITaskAssistantProps {
  taskTitle: string;
  onApplySuggestion: (suggestionId: string) => void;
  onGenerateSubtasks: () => void;
  onOptimizeSchedule: () => void;
  suggestions: Suggestion[];
}

export function AITaskAssistant({
  taskTitle,
  onApplySuggestion,
  onGenerateSubtasks,
  onOptimizeSchedule,
  suggestions,
}: AITaskAssistantProps) {
  // const [suggestions, setSuggestions] = React.useState<Suggestion[]>([
  //   {
  //     id: "1",
  //     type: "time",
  //     icon: <Clock className="h-4 w-4" />,
  //     content: "This task may take about 2 hours based on similar tasks.",
  //     actionLabel: "Apply",
  //   },
  //   {
  //     id: "2",
  //     type: "schedule",
  //     icon: <Zap className="h-4 w-4" />,
  //     content: "Best time today: 2:00 PM - 4:00 PM (no conflicts).",
  //     actionLabel: "Set Time",
  //   },
  //   {
  //     id: "3",
  //     type: "breakdown",
  //     icon: <CheckCircle className="h-4 w-4" />,
  //     content: "Break into 4 subtasks for better progress tracking?",
  //     actionLabel: "Generate",
  //   },
  //   {
  //     id: "4",
  //     type: "conflict",
  //     icon: <AlertTriangle className="h-4 w-4" />,
  //     content: "Conflicts with your meeting at 3:00 PM.",
  //     actionLabel: "Reschedule",
  //   },
  // ]);

  const getSuggestionColor = (type: Suggestion["type"]) => {
    switch (type) {
      case "time":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "conflict":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "breakdown":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "schedule":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "move":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
  };

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">AI Task Assistant</h3>
      </div>

      <div className="space-y-3">
        {suggestions?.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-xl border ${getSuggestionColor(suggestion.type)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`mt-0.5 ${getSuggestionColor(suggestion.type).split(" ")[1]}`}>
                  {suggestion.icon}
                </div>
                <p className="text-sm text-slate-200">{suggestion.content}</p>
              </div>
              <PrimaryButton
                size="sm"
                onClick={() => onApplySuggestion(suggestion.id)}
                icon={<ArrowRight className="h-3 w-3" />}
              >
                {suggestion.actionLabel}
              </PrimaryButton>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-700/50 space-y-3">
        <SecondaryButton
          className="w-full"
          icon={<CheckCircle className="h-4 w-4" />}
          onClick={onGenerateSubtasks}
        >
          Generate Subtasks
        </SecondaryButton>
        <SecondaryButton
          className="w-full"
          icon={<Zap className="h-4 w-4" />}
          onClick={onOptimizeSchedule}
        >
          Optimize Schedule
        </SecondaryButton>
      </div>
    </PremiumCard>
  );
}
