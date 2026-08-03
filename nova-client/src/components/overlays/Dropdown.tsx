
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useClickOutside } from "@/hooks/use-click-outside";
import { GlassPanel } from "../shared/GlassPanel";

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

/** Base floating menu: click the trigger, get a glass panel anchored below it. */
export function Dropdown({ trigger, children, align = "left", className }: DropdownProps) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const ref = useClickOutside<HTMLDivElement>(onClose, isOpen);

  return (
    <div ref={ref} className="relative inline-block w-full">
      <div onClick={onToggle}>{trigger}</div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className={cn(
              "absolute top-[calc(100%+8px)] z-50",
              align === "left" ? "left-0" : "right-0"
            )}
          >
            <GlassPanel intensity='regular' radius="md" floating className={cn("overflow-hidden", className)}>
              {children}
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
