
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "../buttons/IconButton";
import { useIsMobile } from "@/hooks/use-media-query";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "right" | "bottom-on-mobile";
}

/**
 * Slides in from the right on desktop/tablet; becomes a bottom sheet on
 * mobile automatically. Use for detail views and forms that need more
 * room than a Popover but shouldn't fully interrupt like a Modal.
 */
export function Sheet({ isOpen, onClose, title, children, side = "bottom-on-mobile" }: SheetProps) {
  const isMobile = useIsMobile();
  const fromBottom = side === "bottom-on-mobile" && isMobile;

  React.useEffect(() => {
    if (isOpen) {
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={fromBottom ? { y: "100%" } : { x: "100%" }}
            animate={fromBottom ? { y: 0 } : { x: 0 }}
            exit={fromBottom ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className={cn(
              "glass-strong fixed z-50 flex flex-col border-border shadow-float",
              fromBottom
                ? "inset-x-0 bottom-0 max-h-[85vh] rounded-t-lg border-t"
                : "inset-y-0 right-0 w-full max-w-md rounded-l-lg border-l"
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="text-lg font-semibold text-text">{title}</h2>
              <IconButton icon={<X className="h-4 w-4" />} label="Close" onClick={onClose} />
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
