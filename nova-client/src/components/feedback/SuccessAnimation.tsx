"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SuccessAnimationProps {
  show: boolean;
  label?: string;
  className?: string;
}

/** A calm confirmation moment — a soft glow and checkmark, not confetti. */
export function SuccessAnimation({ show, label = "Saved", className }: SuccessAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className={cn("flex flex-col items-center gap-3 py-6", className)}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 400, damping: 18 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-success/12 text-success"
          >
            <Check className="h-7 w-7" strokeWidth={2.5} />
          </motion.div>
          <p className="text-sm font-medium text-text">{label}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
