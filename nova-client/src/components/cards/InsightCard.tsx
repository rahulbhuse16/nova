
import * as React from "react";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { PremiumCard } from "./PremiumCard";
import { cn } from "@/lib/utils";

export interface InsightCardProps {
  title: string;
  body: string;
  tag?: string;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

/**
 * Surfaces something Nova noticed or suggests — always framed as an
 * observation the person can act on or dismiss, never a command.
 */
export function InsightCard({
  title,
  body,
  tag = "Nova noticed",
  onAction,
  actionLabel = "Explore",
  className,
}: InsightCardProps) {
  return (
    <PremiumCard variant="glass" className={cn("overflow-hidden", className)}>
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundImage: "var(--gradient-aurora)" }}
        >
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">{tag}</p>
          <h3 className="mt-1 text-base font-semibold text-text">{title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{body}</p>
          {onAction && (
            <button
              onClick={onAction}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {actionLabel}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </PremiumCard>
  );
}
