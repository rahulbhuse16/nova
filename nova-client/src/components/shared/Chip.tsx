"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { pressableSubtle } from "./AnimatedSection";

export interface ChipProps {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function Chip({ label, selected, onSelect, onRemove, icon, className }: ChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      {...pressableSubtle}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-colors",
        selected
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-surface text-text-secondary hover:bg-card-elevated",
        className
      )}
    >
      {icon}
      {label}
      {onRemove && (
        <span
          role="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </motion.button>
  );
}
