import * as React from "react";
import { PremiumCard } from "./PremiumCard";
import { EmptyState, type EmptyStateProps } from "../feedback/EmptyState";
import { cn } from "@/lib/utils";

export interface EmptyCardProps extends EmptyStateProps {
  className?: string;
}

/** An EmptyState dressed in card chrome, for when a section itself is empty. */
export function EmptyCard({ className, ...emptyStateProps }: EmptyCardProps) {
  return (
    <PremiumCard variant="outlined" className={cn("py-10", className)}>
      <EmptyState {...emptyStateProps} />
    </PremiumCard>
  );
}
