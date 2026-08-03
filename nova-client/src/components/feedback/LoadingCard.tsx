import * as React from "react";
import { PremiumCard } from "../cards/PremiumCard";
import { Skeleton } from "./Skeleton";

export interface LoadingCardProps {
  withAvatar?: boolean;
  lines?: number;
  className?: string;
}

/** Drop-in replacement for a PremiumCard while its data is loading. */
export function LoadingCard({ withAvatar = false, lines = 3, className }: LoadingCardProps) {
  return (
    <PremiumCard variant="default" className={className}>
      <div className="flex items-start gap-3">
        {withAvatar && <Skeleton shape="circle" />}
        <div className="flex-1 space-y-2.5">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton key={i} style={{ width: i === lines - 1 ? "55%" : "100%" }} />
          ))}
        </div>
      </div>
    </PremiumCard>
  );
}
