"use client";

import * as React from "react";
import { ChevronsUpDown, Check, Sparkles } from "lucide-react";
import { Dropdown } from "../overlays/Dropdown";
import { cn } from "@/lib/utils";

export interface Space {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

export interface ProjectSwitcherProps {
  spaces: Space[];
  activeId: string;
  onChange: (id: string) => void;
  collapsed?: boolean;
}

/**
 * Nova's take on a project switcher: swaps between life "spaces"
 * (e.g. Personal, Family, Work) rather than codebases.
 */
export function ProjectSwitcher({ spaces, activeId, onChange, collapsed }: ProjectSwitcherProps) {
  const active = spaces.find((s) => s.id === activeId) ?? spaces[0];

  return (
    <Dropdown
      trigger={
        <button
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-2.5 text-sm transition-colors hover:bg-card-elevated",
            collapsed && "justify-center px-0"
          )}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
            {active?.icon ?? <Sparkles className="h-3.5 w-3.5" />}
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-left font-medium text-text">{active?.name}</span>
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted" />
            </>
          )}
        </button>
      }
    >
      <div className="w-64 p-1.5">
        {spaces.map((space) => (
          <button
            key={space.id}
            onClick={() => onChange(space.id)}
            className="flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left text-sm text-text hover:bg-surface"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary/10 text-primary">
              {space.icon ?? <Sparkles className="h-3 w-3" />}
            </span>
            <span className="flex-1 truncate">{space.name}</span>
            {space.id === activeId && <Check className="h-4 w-4 text-primary" />}
          </button>
        ))}
      </div>
    </Dropdown>
  );
}
