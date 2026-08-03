
import * as React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { PremiumCard } from "./PremiumCard";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: { direction: "up" | "down"; value: string; positiveIsGood?: boolean };
  className?: string;
}

export function StatCard({ label, value, unit, icon, trend, className }: StatCardProps) {
  const trendGood = trend
    ? trend.positiveIsGood === false
      ? trend.direction === "down"
      : trend.direction === "up"
    : null;

  return (
    <PremiumCard variant="default" className={cn("p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{label}</p>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-3xl tracking-tight text-text">{value}</span>
        {unit && <span className="text-sm text-muted">{unit}</span>}
      </div>
      {trend && (
        <div
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-xs font-medium",
            trendGood ? "text-success" : "text-error"
          )}
        >
          {trend.direction === "up" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          {trend.value}
        </div>
      )}
    </PremiumCard>
  );
}
