import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles, CalendarCheck, Search } from "lucide-react";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { IconButton } from "@/components/buttons/IconButton";

export interface CalendarHeaderProps {
  onNewEvent: () => void;
  onOpenAIPlanner: () => void;
  onToday: () => void;
  onSearchOpen: () => void;
}

/** Top-of-page header for the Calendar module. */
export function CalendarHeader({ onNewEvent, onOpenAIPlanner, onToday, onSearchOpen }: CalendarHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <h1 className="font-display text-3xl tracking-tight text-text md:text-4xl">Calendar</h1>
        <p className="mt-1.5 text-sm text-text-secondary">Plan smarter. Stay ahead.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <IconButton icon={<Search className="h-4 w-4" />} label="Search calendar" onClick={onSearchOpen} variant="glass" />
        <SecondaryButton variant="outline" size="sm" icon={<CalendarCheck className="h-4 w-4" />} onClick={onToday}>
          Today
        </SecondaryButton>
        <SecondaryButton variant="subtle" size="sm" icon={<Sparkles className="h-4 w-4" />} onClick={onOpenAIPlanner}>
          AI Planner
        </SecondaryButton>
        <PrimaryButton variant="gradient" size="sm" icon={<Plus className="h-4 w-4" />} onClick={onNewEvent}>
          New Event
        </PrimaryButton>
      </div>
    </motion.div>
  );
}
