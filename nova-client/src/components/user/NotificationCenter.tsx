"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Dropdown } from "../overlays/Dropdown";
import { EmptyState } from "../feedback/EmptyState";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read?: boolean;
}

export interface NotificationCenterProps {
  notifications: NotificationItem[];
  onOpenItem?: (id: string) => void;
}

export function NotificationCenter({ notifications, onOpenItem }: NotificationCenterProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Dropdown
      align="right"
      trigger={
        <button
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
          )}
        </button>
      }
    >
      <div className="w-80 bg-black/60">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-text">Notifications</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <EmptyState
              icon={<Bell className="h-5 w-5" />}
              title="All quiet"
              description="Nova will let you know when something needs your attention."
            />
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => onOpenItem?.(n.id)}
                className={cn(
                  "block w-full border-b border-border/60 px-4 py-3 text-left last:border-0 hover:bg-surface",
                  !n.read && "bg-primary/5"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-text">{n.title}</p>
                  {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                </div>
                <p className="mt-0.5 text-xs text-text-secondary">{n.body}</p>
                <p className="mt-1 text-[11px] text-muted">{n.time}</p>
              </button>
            ))
          )}
        </div>
      </div>
    </Dropdown>
  );
}
