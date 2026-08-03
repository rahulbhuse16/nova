
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  items: CommandItem[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Global Cmd/Ctrl+K palette. Bind once near the AppShell root. */
export function CommandPalette({ items, isOpen, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);

  useKeyboardShortcut("k", () => onOpenChange(!isOpen), { meta: true });

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  React.useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      filtered[activeIndex].onSelect();
      onOpenChange(false);
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="glass-strong relative z-10 w-full max-w-lg overflow-hidden rounded-lg border border-border shadow-float"
          >
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search className="h-4 w-4 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask Nova or jump somewhere…"
                className="w-full bg-transparent text-sm text-text placeholder:text-muted focus:outline-none"
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-muted">No matches yet.</p>
              )}
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    item.onSelect();
                    onOpenChange(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left text-sm transition-colors",
                    i === activeIndex ? "bg-primary/10 text-primary" : "text-text hover:bg-surface"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    {item.label}
                  </span>
                  {i === activeIndex && <CornerDownLeft className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
