import * as React from "react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../shared/GlassPanel";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * The plain frosted-glass card. Prefer PremiumCard for anything with
 * status/emphasis; reach for GlassCard when you just need a quiet
 * translucent container (e.g. inside a Modal or Sheet body).
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, padding = "md", ...props }, ref) => (
    <GlassPanel
      ref={ref}
      radius="lg"
      className={cn(paddingMap[padding], className)}
      {...props}
    />
  )
);
GlassCard.displayName = "GlassCard";
