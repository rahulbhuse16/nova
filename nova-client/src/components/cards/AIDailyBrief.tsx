import * as React from "react";
import { Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
import { PremiumCard } from "./PremiumCard";

interface Insight {
  id: string;
  type: "alert" | "suggestion" | "reminder";
  content: string;
  priority: "high" | "medium" | "low";
}

interface AIDailyBriefProps {
  insights: Insight[];
}

export function AIDailyBrief({ insights }: AIDailyBriefProps) {
  const getInsightIcon = (type: Insight["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4" />;
      case "suggestion":
        return <Sparkles className="h-4 w-4" />;
      case "reminder":
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: Insight["type"]) => {
    switch (type) {
      case "alert":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "suggestion":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "reminder":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  };

  const getPriorityBorder = (priority: Insight["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-rose-500";
      case "medium":
        return "border-l-amber-500";
      case "low":
        return "border-l-emerald-500";
    }
  };

  return (
    <PremiumCard className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">AI Daily Brief</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-xl bg-slate-800/50 border border-l-4 ${getInsightColor(
              insight.type
            )} ${getPriorityBorder(insight.priority)}`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${getInsightColor(insight.type).split(" ")[1]}`}>
                {getInsightIcon(insight.type)}
              </div>
              <p className="text-sm text-slate-200">{insight.content}</p>
            </div>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}
