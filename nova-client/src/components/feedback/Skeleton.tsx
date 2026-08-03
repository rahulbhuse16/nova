import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: "line" | "circle" | "block";
}

export function Skeleton({ className, shape = "line", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "bg-gradient-to-r from-surface via-card-elevated to-surface bg-[length:800px_100%] animate-shimmer",
        shape === "line" && "h-4 w-full rounded-full",
        shape === "circle" && "h-10 w-10 rounded-full",
        shape === "block" && "h-24 w-full rounded-md",
        className
      )}
      {...props}
    />
  );
}
