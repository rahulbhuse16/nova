
import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, placeholder = "Search Nova…", ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          ref={ref}
          value={value}
          placeholder={placeholder}
          className={cn(
            "h-10 w-full rounded-pill border border-border bg-surface pl-10 pr-9 text-sm text-text placeholder:text-muted transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/30",
            className
          )}
          {...props}
        />
        {!!value && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";
