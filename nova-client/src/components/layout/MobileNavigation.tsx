
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../shared/GlassPanel";
import { IconButton } from "../buttons/IconButton";
import type { NavItemProps } from "../navigation/NavItem";

export interface MobileTab {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export interface MobileNavigationProps {
  /** Up to 5 primary destinations shown as a floating bottom bar. */
  tabs: MobileTab[];
  /** Full nav (all groups) shown in the "More" drawer. */
  allItems: Array<Omit<NavItemProps, "collapsed">>;
  drawerOpen: boolean;
  onDrawerClose: () => void;
}

/** Mobile-only floating tab bar + full-nav drawer. AppShell renders this under md breakpoint. */
export function MobileNavigation({ tabs, allItems, drawerOpen, onDrawerClose }: MobileNavigationProps) {
  return (
    <>
      <nav className="fixed inset-x-4 bottom-4 z-30 md:hidden">
        <GlassPanel radius="pill" floating className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={tab.onClick}
              aria-current={tab.active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-pill py-1.5 text-[11px] font-medium transition-colors",
                tab.active ? "text-primary" : "text-muted"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </GlassPanel>
      </nav>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onDrawerClose}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="glass-strong fixed inset-y-0 left-0 z-50 w-72 border-r border-border p-4 md:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2 font-display text-lg text-text">
                  <Sparkles className="h-4 w-4 text-primary" /> Nova
                </span>
                <IconButton icon={<X className="h-4 w-4" />} label="Close menu" onClick={onDrawerClose} />
              </div>
              <div className="space-y-1">
                {allItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.onClick?.();
                      onDrawerClose();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium",
                      item.active ? "bg-primary/10 text-primary" : "text-text-secondary"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
