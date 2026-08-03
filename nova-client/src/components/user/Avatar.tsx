import * as React from "react";
import { cn, getInitials } from "@/lib/utils";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "away" | "offline";
  className?: string;
}

const sizeMap = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-base" };
const statusColor = { online: "bg-success", away: "bg-warning", offline: "bg-muted" };

export function Avatar({ name, src, size = "md", status, className }: AvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className={cn("rounded-full object-cover", sizeMap[size])}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-full font-semibold text-white",
            sizeMap[size]
          )}
          style={{ backgroundImage: "var(--gradient-aurora)" }}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-background",
            statusColor[status]
          )}
        />
      )}
    </div>
  );
}
