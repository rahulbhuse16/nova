"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Suggestion } from "../../types/assistant.types";
import { cn } from "@/lib/utils";

interface SuggestedPromptsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: string) => void;
}

const categoryColors: Record<Suggestion["category"], string> = {
  planning: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  productivity: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  review: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  creation: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  analysis: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

export function SuggestedPrompts({ suggestions, onSuggestionClick }: SuggestedPromptsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.slice(0, 6).map((suggestion, index) => (
        <motion.button
          key={suggestion.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSuggestionClick(suggestion.text)}
          className={cn(
            "px-4 py-2.5 rounded-xl border-2 flex items-center gap-2 transition-all",
            categoryColors[suggestion.category]
          )}
        >
          <span className="text-lg">{suggestion.icon}</span>
          <span className="text-sm font-medium">{suggestion.text}</span>
        </motion.button>
      ))}
    </div>
  );
}
