import * as React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
}

export function Divider({ orientation = "horizontal", label, className }: DividerProps) {
  if (orientation === "vertical") {
    return <div className={cn("w-px self-stretch bg-border", className)} />;
  }

  if (label) {
    return (
      <div className={cn("flex items-center gap-3 text-xs text-muted", className)}>
        <span className="h-px flex-1 bg-border" />
        {label}
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return <div className={cn("h-px w-full bg-border", className)} />;
}
