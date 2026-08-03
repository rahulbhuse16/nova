import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassPanel } from "@/components/shared/GlassPanel";
import { SearchInput } from "@/components/inputs/SearchInput";
import { resolveEventIcon } from "./iconMap";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectFilteredEvents, selectSearch } from "@/redux/calendarSelectors";
import { setSearch, selectEvent, selectDate } from "@/redux/calendarSlice";
import { formatTime } from "@/lib/date";

export interface CalendarSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarSearch({ isOpen, onClose }: CalendarSearchProps) {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch);
  const results = useAppSelector(selectFilteredEvents).slice(0, 8);

  React.useEffect(() => {
    if (isOpen) {
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/35 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative z-10 w-full max-w-lg px-4"
          >
            <GlassPanel intensity="strong" radius="md" floating className="overflow-hidden">
              <div className="p-3">
                <SearchInput
                  autoFocus
                  value={search}
                  onChange={(e) => dispatch(setSearch(e.target.value))}
                  onClear={() => dispatch(setSearch(""))}
                  placeholder="Search events, categories, locations…"
                />
              </div>
              <div className="max-h-80 overflow-y-auto border-t border-border p-2">
                {search && results.length === 0 && (
                  <p className="px-3 py-6 text-center text-sm text-muted">No events match "{search}".</p>
                )}
                {results.map((event) => {
                  const Icon = resolveEventIcon(event.icon);
                  return (
                    <button
                      key={event.id}
                      onClick={() => {
                        dispatch(selectDate(event.startDate.slice(0, 10)));
                        dispatch(selectEvent(event.id));
                        onClose();
                      }}
                      className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-sm hover:bg-surface"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm"
                        style={{ backgroundColor: `${event.color}1A`, color: event.color }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-text">{event.title}</span>
                        <span className="block truncate text-xs text-muted">
                          {event.allDay ? "All day" : formatTime(event.startDate)} · {event.category}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
