import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionTitleProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /** Use the serif display face for emotionally-weighted sections (Today, Journal). */
  emphasis?: boolean;
}

export function SectionTitle({
  title,
  description,
  action,
  className,
  emphasis = false,
}: SectionTitleProps) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4", className)}>
      <div>
        <h2
          className={cn(
            "text-text",
            emphasis
              ? "font-display text-2xl tracking-tight"
              : "text-lg font-semibold tracking-tight"
          )}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
