
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({ checked, onChange, label, description, disabled, className }: SwitchProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-4",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {(label || description) && (
        <span>
          {label && <span className="block text-sm font-medium text-text">{label}</span>}
          {description && <span className="block text-xs text-text-secondary">{description}</span>}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-pill transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
          checked ? "bg-primary" : "bg-border-strong"
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-soft"
          style={{ left: checked ? "calc(100% - 24px)" : "4px" }}
        />
      </button>
    </label>
  );
}
