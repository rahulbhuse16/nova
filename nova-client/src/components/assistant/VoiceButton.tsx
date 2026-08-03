"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";

interface VoiceButtonProps {
  isRecording: boolean;
  isListening: boolean;
  onToggle: () => void;
  onStop?: () => void;
}

export function VoiceButton({ isRecording, isListening, onToggle, onStop }: VoiceButtonProps) {
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all",
          isRecording
            ? "bg-rose-500/20 border-2 border-rose-500 text-rose-400"
            : "bg-indigo-500/20 border-2 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/30"
        )}
      >
        {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </motion.button>

      <AnimatePresence>
        {isRecording && (
          <>
            <motion.div
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-full bg-rose-500/30"
            />
            <motion.div
              initial={{ scale: 1, opacity: 0.3 }}
              animate={{ scale: 1.3, opacity: 0 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
              className="absolute inset-0 rounded-full bg-rose-500/20"
            />
          </>
        )}
      </AnimatePresence>

      {isListening && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              animate={{
                height: [8, 20, 8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              className="w-1 bg-indigo-400 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";
