
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  badge?: string | number;
  onClick?: () => void;
  href?: string;
}

/**
 * A single nav entry. The active state is shown with a shared-layout
 * gradient pill (see `layoutId="nav-active-pill"`) so it glides between
 * items instead of snapping — the signature Sidebar interaction.
 */
export function NavItem({ icon, label, active, collapsed, badge, onClick, href }: NavItemProps) {
  const Comp: any = href ? "a" : "button";

  return (
    <Comp
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active ? "text-primary-foreground" : "text-text-secondary hover:text-text"
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="absolute inset-0 rounded-md shadow-glow"
          style={{ backgroundImage: "var(--gradient-aurora)" }}
        />
      )}
      <span className="relative z-10 shrink-0">{icon}</span>
      {!collapsed && <span className="relative z-10 truncate">{label}</span>}
      {!collapsed && badge != null && (
        <span
          className={cn(
            "relative z-10 ml-auto rounded-pill px-2 py-0.5 text-xs font-semibold",
            active ? "bg-white/20 text-white" : "bg-surface text-muted"
          )}
        >
          {badge}
        </span>
      )}
    </Comp>
  );
}
