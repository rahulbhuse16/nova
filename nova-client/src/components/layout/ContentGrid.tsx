import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContentGridProps {
  children: React.ReactNode;
  /** Column count at the desktop breakpoint; scales down automatically. */
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const columnsMap = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

const gapMap = { sm: "gap-3", md: "gap-5", lg: "gap-6" };

/** Responsive grid for cards/stats — always 1 column on mobile. */
export function ContentGrid({ children, columns = 3, gap = "md", className }: ContentGridProps) {
  return (
    <div className={cn("grid grid-cols-1", columnsMap[columns], gapMap[gap], className)}>
      {children}
    </div>
  );
}
