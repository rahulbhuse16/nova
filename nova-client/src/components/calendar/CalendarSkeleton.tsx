import * as React from "react";
import { PremiumCard } from "@/components/cards/PremiumCard";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { LoadingCard } from "@/components/feedback/LoadingCard";
import { Skeleton } from "@/components/feedback/Skeleton";

/** Full-page loading placeholder shown while calendar data is (mock) loading. */
export function CalendarSkeleton() {
  return (
    <div className="space-y-8">
      <ContentGrid columns={3} gap="md">
        {Array.from({ length: 6 }).map((_, i) => (
          <PremiumCard key={i} variant="loading" loadingRows={2} />
        ))}
      </ContentGrid>

      <PremiumCard variant="default" className="p-6">
        <Skeleton shape="line" className="mb-4 h-6 w-40" />
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} shape="block" className="aspect-square h-auto" />
          ))}
        </div>
      </PremiumCard>

      <div className="grid gap-5 md:grid-cols-2">
        <LoadingCard lines={4} />
        <LoadingCard lines={4} />
      </div>
    </div>
  );
}
