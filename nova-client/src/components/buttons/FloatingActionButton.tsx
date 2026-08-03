
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FloatingActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

/**
 * A single floating gradient action button, anchored bottom-right.
 * Reserve for the one thing worth reaching for from anywhere — starting
 * a check-in, capturing a memory, opening voice.
 */
export function FloatingActionButton({
  icon,
  label,
  onClick,
  className,
}: FloatingActionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      style={{ backgroundImage: "var(--gradient-aurora)" }}
      className={cn(
        "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-glow md:bottom-8 md:right-8",
        className
      )}
    >
      {icon}
    </motion.button>
  );
}
