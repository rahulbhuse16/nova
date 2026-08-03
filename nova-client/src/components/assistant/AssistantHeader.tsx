"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Mic, Search, Sparkles, Menu } from "lucide-react";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface AssistantHeaderProps {
  onNewChat?: () => void;
  onVoiceToggle?: () => void;
  onSearch?: () => void;
  voiceEnabled?: boolean;
  onToggleSidebar?: () => void;
}

export function AssistantHeader({
  onNewChat,
  onVoiceToggle,
  onSearch,
  voiceEnabled = false,
  onToggleSidebar,
}: AssistantHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-2xl font-bold text-white">Nova AI</h1>
          <p className="text-sm text-slate-400">Ask Nova anything or let it help manage your day.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SecondaryButton icon={<Search className="h-4 w-4" />} onClick={onSearch} className="hidden sm:flex">
          Search
        </SecondaryButton>
        <SecondaryButton
          icon={<Mic className="h-4 w-4" />}
          onClick={onVoiceToggle}
          className={voiceEnabled ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300" : ""}
        >
          <span className="hidden sm:inline">Voice</span>
        </SecondaryButton>
        <PrimaryButton icon={<Plus className="h-4 w-4" />} onClick={onNewChat} className="hidden sm:flex">
          New Chat
        </PrimaryButton>
        <button
          onClick={onNewChat}
          className="sm:hidden p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}
