
import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchCommandProps {
  onOpen: () => void;
  collapsed?: boolean;
  className?: string;
}

/** Pairs with CommandPalette — shows the ⌘K affordance in Sidebar/TopHeader. */
export function SearchCommand({ onOpen, collapsed, className }: SearchCommandProps) {
  return (
    <button
      onClick={onOpen}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-muted transition-colors hover:bg-card-elevated",
        collapsed && "justify-center px-0",
        className
      )}
    >
      <Search className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">Search Nova</span>
          <kbd className="rounded-sm border border-border bg-background px-1.5 py-0.5 font-mono-nova text-[10px] text-muted">
            ⌘K
          </kbd>
        </>
      )}
    </button>
  );
}
