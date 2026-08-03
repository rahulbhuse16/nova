"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <span className="text-white text-sm">N</span>
      </div>
      <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 rounded-full bg-indigo-400"
        />
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-indigo-400"
        />
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-indigo-400"
        />
      </div>
    </div>
  );
}
