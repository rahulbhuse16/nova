"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function ConversationSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto space-y-6 p-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-700/50 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-slate-700/50 rounded animate-pulse" />
            <div className="h-20 w-full max-w-2xl bg-slate-700/30 rounded-2xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
