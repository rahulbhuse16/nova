
import * as React from "react";
import { Settings } from "lucide-react";
import { Avatar } from "../user/Avatar";
import { cn } from "@/lib/utils";

export interface UserProfileCardProps {
  name: string;
  subtitle?: string;
  avatarSrc?: string;
  collapsed?: boolean;
  onClick?: () => void;
}

/** The sidebar footer identity card — opens Settings or a full UserMenu. */
export function UserProfileCard({ name, subtitle, avatarSrc, collapsed, onClick }: UserProfileCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-md border border-border bg-surface p-2.5 transition-colors hover:bg-card-elevated",
        collapsed && "justify-center"
      )}
    >
      <Avatar name={name} src={avatarSrc} size="sm" status="online" />
      {!collapsed && (
        <>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium text-text">{name}</p>
            {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
          </div>
          <Settings className="h-4 w-4 shrink-0 text-muted" />
        </>
      )}
    </button>
  );
}
