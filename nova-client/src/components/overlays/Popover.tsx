
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useClickOutside } from "@/hooks/use-click-outside";
import { GlassPanel } from "../shared/GlassPanel";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom";
  className?: string;
}

/** Contextual explanation panel — think a stat's methodology, a badge's meaning. */
export function Popover({ trigger, children, side = "bottom", className }: PopoverProps) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const ref = useClickOutside<HTMLDivElement>(onClose, isOpen);

  return (
    <div ref={ref} className="relative inline-flex">
      <span onClick={onToggle}>{trigger}</span>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: side === "bottom" ? -4 : 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: side === "bottom" ? -4 : 4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className={cn(
              "absolute left-1/2 z-50 w-64 -translate-x-1/2",
              side === "bottom" ? "top-[calc(100%+8px)]" : "bottom-[calc(100%+8px)]"
            )}
          >
            <GlassPanel intensity="strong" radius="md" floating className={cn("p-4 text-sm text-text-secondary", className)}>
              {children}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
