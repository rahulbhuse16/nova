
import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dropdown } from "../overlays/Dropdown";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Select({ label, options, value, onChange, placeholder = "Select…", className }: SelectProps) {
  const selected = options.find((o) => o.value === value);

  return (
    <div className={cn("w-full", className)}>
      {label && <p className="mb-1.5 text-sm font-medium text-text">{label}</p>}
      <Dropdown
        trigger={
          <button
            type="button"
            className="flex h-12 w-full items-center justify-between rounded-md border border-border bg-surface px-4 text-sm text-text transition-colors hover:bg-card-elevated focus-visible:border-primary"
          >
            <span className={cn(!selected && "text-muted")}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown className="h-4 w-4 text-muted" />
          </button>
        }
      >
        <div className="w-[--radix-popper-anchor-width, 100%] min-w-[200px] py-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-text hover:bg-surface"
            >
              {option.label}
              {option.value === value && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      </Dropdown>
    </div>
  );
}
