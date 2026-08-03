import * as React from "react";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "../buttons/PrimaryButton";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/** An empty screen is an invitation to act, not an apology. */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-4 text-center", className)}>
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface text-primary">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {actionLabel && onAction && (
        <PrimaryButton size="sm" onClick={onAction} className="mt-5">
          {actionLabel}
        </PrimaryButton>
      )}
    </div>
  );
}
