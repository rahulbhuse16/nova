
import * as React from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../shared/GlassPanel";
import { IconButton } from "../buttons/IconButton";
import { NotificationCenter, type NotificationItem } from "../user/NotificationCenter";
import { UserMenu } from "../user/UserMenu";
import { useTheme } from "@/lib/theme";

export interface TopHeaderProps {
  pageTitle: string;
  quickActions?: React.ReactNode;
  notifications: NotificationItem[];
  userName: string;
  userEmail?: string;
  onMobileMenuClick?: () => void;
  onOpenNotification?: (id: string) => void;
  onSettings?: () => void;
  onProfile?: () => void;
  onSignOut?: () => void;
  className?: string;
}

/**
 * Sticky, blurred header. Reused verbatim on every page — only
 * `pageTitle` and `quickActions` change per screen.
 */
export function TopHeader({
  pageTitle,
  quickActions,
  notifications,
  userName,
  userEmail,
  onMobileMenuClick,
  onOpenNotification,
  onSettings,
  onProfile,
  onSignOut,
  className,
}: TopHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <GlassPanel
      radius="lg"
      floating
      className={cn("sticky top-4 z-30 flex items-center justify-between gap-4 px-4 py-3 md:px-5", className)}
    >
      <div className="flex min-w-0 items-center gap-3">
        <IconButton
          icon={<Menu className="h-4 w-4" />}
          label="Open menu"
          onClick={onMobileMenuClick}
          className="md:hidden"
        />
        <h1 className="truncate text-base font-semibold text-text md:text-lg">{pageTitle}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        {quickActions}
        <IconButton
          icon={theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          label="Toggle theme"
          onClick={toggleTheme}
        />
        <NotificationCenter notifications={notifications} onOpenItem={onOpenNotification} />
        <UserMenu
          name={userName}
          email={userEmail}
          onSettings={onSettings}
          onProfile={onProfile}
          onSignOut={onSignOut}
        />
      </div>
    </GlassPanel>
  );
}
