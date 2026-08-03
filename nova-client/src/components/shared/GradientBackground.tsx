"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GradientBackgroundProps {
  className?: string;
  /** Show the slow "breathing" aurora orb — Nova's ambient presence. */
  breathing?: boolean;
}

/**
 * Fixed ambient backdrop: a soft mesh gradient plus an optional slow-pulsing
 * aurora orb, evoking a companion that is quietly "present" rather than a
 * static dashboard background. Mount once near the root of AppShell.
 */
export function GradientBackground({ className, breathing = true }: GradientBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 mesh-bg overflow-hidden",
        className
      )}
    >
      {breathing && (
        <motion.div
          className="absolute -top-32 left-1/3 h-[560px] w-[560px] rounded-full blur-3xl"
          style={{ background: "var(--gradient-aurora)", opacity: 0.16 }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="absolute inset-0 bg-background/60" />
    </div>
  );
}
