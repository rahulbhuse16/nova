"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface AssistantAvatarProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function AssistantAvatar({ size = "md", animated = false }: AssistantAvatarProps) {
  return (
    <div className={cn("rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30", sizeClasses[size])}>
      {animated ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="text-white font-bold"
        >
          N
        </motion.div>
      ) : (
        <span className="text-white font-bold">N</span>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";
