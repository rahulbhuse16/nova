"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Suggestion } from "../../types/assistant.types";
import { cn } from "@/lib/utils";

interface PromptSuggestionsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: string) => void;
  maxSuggestions?: number;
}

const categoryIcons: Record<Suggestion["category"], string> = {
  planning: "📅",
  productivity: "✅",
  review: "📊",
  creation: "✨",
  analysis: "🔍",
};

export function PromptSuggestions({ suggestions, onSuggestionClick, maxSuggestions = 6 }: PromptSuggestionsProps) {
  const displaySuggestions = suggestions.slice(0, maxSuggestions);

  return (
    <div className="flex flex-wrap gap-2">
      {displaySuggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSuggestionClick(suggestion.text)}
          className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all flex items-center gap-2"
        >
          <span className="text-lg">{categoryIcons[suggestion.category]}</span>
          <span className="text-sm text-slate-200">{suggestion.text}</span>
        </motion.button>
      ))}
    </div>
  );
}
