import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** "strong" for overlays/sidebar that need to stay legible over content behind them. */
  intensity?: "regular" | "strong";
  radius?: "sm" | "md" | "lg" | "pill";
  bordered?: boolean;
  floating?: boolean;
}

const radiusMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  pill: "rounded-pill",
};

/**
 * The base frosted-glass surface every floating panel in Nova sits on:
 * Sidebar, TopHeader, Sheet, Modal, Dropdown, GlassCard all compose this.
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    { className, intensity = "regular", radius = "lg", bordered = true, floating = false, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          intensity === "strong" ? "glass-strong" : "glass",
          radiusMap[radius],
          bordered && "border border-border",
          floating && "shadow-float",
          className
        )}
        {...props}
      />
    );
  }
);
GlassPanel.displayName = "GlassPanel";
