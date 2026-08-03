"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Zap } from "lucide-react";
import { PremiumCard } from "../cards/PremiumCard";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { Suggestion } from "../../types/assistant.types";
import { SuggestedPrompts } from "./SuggestedPrompts";

interface ConversationEmptyProps {
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: string) => void;
  onNewChat?: () => void;
}

export function ConversationEmpty({ suggestions, onSuggestionClick, onNewChat }: ConversationEmptyProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <PremiumCard className="max-w-2xl w-full p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-10 w-10 text-white" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Welcome to Nova AI</h2>
            <p className="text-slate-400">
              Your intelligent personal assistant. Ask me anything or let me help you manage your day.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Zap className="h-4 w-4" />
            <span>Powered by advanced AI</span>
          </div>

          <div className="pt-4">
            <p className="text-sm font-medium text-slate-300 mb-3">Try these prompts:</p>
            <SuggestedPrompts suggestions={suggestions} onSuggestionClick={onSuggestionClick} />
          </div>

          <div className="pt-6 border-t border-slate-700/50 flex items-center justify-center gap-3">
            <PrimaryButton icon={<MessageSquare className="h-4 w-4" />} onClick={onNewChat}>
              Start Conversation
            </PrimaryButton>
          </div>
        </motion.div>
      </PremiumCard>
    </div>
  );
}
