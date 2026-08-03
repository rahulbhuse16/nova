"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain } from "lucide-react";

export function ThinkingAnimation() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <Brain className="h-5 w-5 text-white" />
      </div>
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-4 w-4 text-indigo-400" />
        </motion.div>
        <span className="text-sm text-slate-300">Thinking...</span>
      </div>
    </div>
  );
}
