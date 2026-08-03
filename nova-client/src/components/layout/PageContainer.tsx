import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Cap content width for reading-heavy pages like Journal entries. */
  narrow?: boolean;
}

/**
 * Wraps the content of every page rendered inside AppShell. Guarantees
 * consistent max-width, horizontal padding, and vertical rhythm between
 * sections — pages never hand-roll their own spacing.
 */
export function PageContainer({ children, className, narrow = false }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full space-y-8 px-4 pb-28 pt-6 md:px-6 md:pb-10",
        narrow ? "max-w-3xl" : "max-w-6xl",
        className
      )}
    >
      {children}
    </div>
  );
}
