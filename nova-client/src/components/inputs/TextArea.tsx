import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, hint, error, showCount, maxLength, id, value, ...props }, ref) => {
    const areaId = id ?? React.useId();
    const length = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={areaId} className="mb-1.5 block text-sm font-medium text-text">
            {label}
          </label>
        )}
        <textarea
          id={areaId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          aria-invalid={!!error}
          className={cn(
            "min-h-[140px] w-full resize-y rounded-md border border-border bg-surface p-4 text-sm leading-relaxed text-text placeholder:text-muted transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
            error && "border-error focus-visible:ring-error/30",
            className
          )}
          {...props}
        />
        <div className="mt-1.5 flex items-center justify-between">
          <p className="text-xs text-error">{error}</p>
          {!error && hint && <p className="text-xs text-muted">{hint}</p>}
          {showCount && maxLength && (
            <p className="ml-auto text-xs text-muted">
              {length}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
TextArea.displayName = "TextArea";
