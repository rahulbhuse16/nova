
import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../shared/GlassPanel";
import { NavGroup } from "../navigation/NavGroup";
import { NavItem, type NavItemProps } from "../navigation/NavItem";
import { ProjectSwitcher, type Space } from "../navigation/ProjectSwitcher";
import { SearchCommand } from "../navigation/SearchCommand";
import { UserProfileCard } from "../navigation/UserProfileCard";

export interface SidebarNavGroup {
  label?: string;
  items: Array<Omit<NavItemProps, "collapsed">>;
  icon?: React.ReactNode;
}

export interface SidebarProps {
  groups: SidebarNavGroup[];
  spaces: Space[];
  activeSpaceId: string;
  onSpaceChange: (id: string) => void;
  onSearchOpen: () => void;
  userName: string;
  userSubtitle?: string;
  onProfileClick?: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

/**
 * Desktop/tablet floating sidebar. Renders nothing on mobile — see
 * MobileNavigation for that breakpoint. AppShell composes this.
 */
export function Sidebar({
  groups,
  spaces,
  activeSpaceId,
  onSpaceChange,
  onSearchOpen,
  userName,
  userSubtitle,
  onProfileClick,
  collapsed,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 84 : 272 }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
      className="sticky top-4 hidden h-[calc(100vh-32px)] shrink-0 md:block"
    >
      <GlassPanel
        radius="lg"
        floating
        className="flex h-full flex-col p-3"
      >
        {/* Brand */}
       <div
  className={cn(
    "flex items-center px-3 py-2",
    collapsed ? "justify-center" : "justify-start"
  )}
>
  <div
    className={cn(
      "overflow-hidden",
      collapsed ? "h-11 w-11" : "h-12 w-44"
    )}
  >
    <img
      src="/nova_login.png"
      alt="Nova"
      draggable={false}
      className={cn(
        "object-contain select-none transition-all duration-300 self-center",
        collapsed
          ? "h-full w-full scale-[1.8]"
          : "h-full w-full scale-[1.45]"
      )}
    />
  </div>
</div>

        {/* <div className="mt-3">
          <ProjectSwitcher spaces={spaces} activeId={activeSpaceId} onChange={onSpaceChange} collapsed={collapsed} />
        </div> */}

        <div className="mt-2">
          <SearchCommand onOpen={onSearchOpen} collapsed={collapsed} />
        </div>

        <nav className="mt-2 flex-1 overflow-y-auto no-scrollbar">
          {groups.map((group, i) => (
            <NavGroup icon={group.icon} key={i} label={group.label} collapsed={collapsed}>
              {group.items.map((item) => (
                <NavItem key={item.label} {...item} href={item.href} collapsed={collapsed} />
              ))}
            </NavGroup>
          ))}
        </nav>

        <div className="mt-2 space-y-2 border-t border-border pt-3">
          <UserProfileCard
            name={userName}
            subtitle={userSubtitle}
            collapsed={collapsed}
            onClick={onProfileClick}
          />
          <button
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex w-full items-center justify-center rounded-md py-1.5 text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>
      </GlassPanel>
    </motion.aside>
  );
}
