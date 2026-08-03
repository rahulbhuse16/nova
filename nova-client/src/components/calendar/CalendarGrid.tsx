import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PremiumCard } from "@/components/cards/PremiumCard";
import { CalendarToolbar } from "./CalendarToolbar";
import { CalendarMonthView } from "./CalendarMonthView";
import { CalendarWeekView } from "./CalendarWeekView";
import { CalendarDayView } from "./CalendarDayView";
import { CalendarAgendaView } from "./CalendarAgendaView";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCurrentView, selectSelectedDate } from "@/redux/calendarSelectors";
import { changeView, nextMonth, previousMonth, goToday } from "@/redux/calendarSlice";

export interface CalendarGridProps {
  onAddEvent?: () => void;
}

/**
 * The main premium calendar surface. Owns the toolbar and animates between
 * Month / Week / Day / Agenda without the page around it re-mounting.
 */
export function CalendarGrid({ onAddEvent }: CalendarGridProps) {
  const dispatch = useAppDispatch();
  const currentView = useAppSelector(selectCurrentView);
  const selectedDate = useAppSelector(selectSelectedDate);

  function handlePrevious() {
    if (currentView === "month") dispatch(previousMonth());
  }

  function handleNext() {
    if (currentView === "month") dispatch(nextMonth());
  }

  return (
    <PremiumCard variant="default" className="p-5 md:p-6">
      <CalendarToolbar
        currentView={currentView}
        onViewChange={(v) => dispatch(changeView(v))}
        selectedDate={selectedDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={() => dispatch(goToday())}
      />

      <div className="relative mt-5 min-h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
          >
            {currentView === "month" && <CalendarMonthView />}
            {currentView === "week" && <CalendarWeekView />}
            {currentView === "day" && <CalendarDayView onAddEvent={onAddEvent} />}
            {currentView === "agenda" && <CalendarAgendaView onAddEvent={onAddEvent} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </PremiumCard>
  );
}
