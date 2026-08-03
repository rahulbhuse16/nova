"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles, Mic } from "lucide-react";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

interface NotesHeaderProps {
  onNewNote?: () => void;
  onQuickCapture?: () => void;
  onAIAssistant?: () => void;
}

export function NotesHeader({ onNewNote, onQuickCapture, onAIAssistant }: NotesHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Notes</h1>
        <p className="text-slate-400">Capture ideas before they're forgotten.</p>
      </div>

      <div className="flex items-center gap-3">
        <PrimaryButton icon={<Plus className="h-4 w-4" />} onClick={onNewNote}>
          New Note
        </PrimaryButton>
        <SecondaryButton icon={<Sparkles className="h-4 w-4" />} onClick={onQuickCapture}>
          Quick Capture
        </SecondaryButton>
        <SecondaryButton icon={<Mic className="h-4 w-4" />} variant="outline" onClick={onAIAssistant}>
          AI Assistant
        </SecondaryButton>
      </div>
    </motion.div>
  );
}
