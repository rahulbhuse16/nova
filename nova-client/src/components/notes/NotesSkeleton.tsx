"use client";

import * as React from "react";
import { PremiumCard } from "../cards/PremiumCard";

export function NotesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <PremiumCard key={i} className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-700/50 animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-3/4 bg-slate-700/50 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-700/50 rounded animate-pulse" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-slate-700/50 rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-slate-700/50 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center justify-between pt-3">
                <div className="h-4 w-20 bg-slate-700/50 rounded animate-pulse" />
                <div className="h-4 w-24 bg-slate-700/50 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </PremiumCard>
      ))}
    </div>
  );
}
