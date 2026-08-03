import * as React from "react";
import { CalendarClock, ArrowUpRight, ListChecks, Coffee, BrainCircuit, Users } from "lucide-react";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { StatCard } from "@/components/cards/StatCard";
import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { useAppSelector } from "@/redux/hooks";
import { selectOverview } from "@/redux/calendarSelectors";

export function CalendarOverview() {
  const overview = useAppSelector(selectOverview);

  const cards = [
    { label: "Today's Events", value: overview.todayCount, icon: <CalendarClock className="h-4 w-4" /> },
    { label: "Upcoming", value: overview.upcomingCount, icon: <ArrowUpRight className="h-4 w-4" /> },
    { label: "Tasks Scheduled", value: overview.tasksScheduled, icon: <ListChecks className="h-4 w-4" /> },
    { label: "Free Time", value: overview.freeHours, unit: "hrs", icon: <Coffee className="h-4 w-4" /> },
    { label: "Focus Hours", value: overview.focusHours, unit: "hrs", icon: <BrainCircuit className="h-4 w-4" /> },
    { label: "Meetings", value: overview.meetingsCount, icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <AnimatedSection kind="stagger-children">
      <ContentGrid columns={3} gap="md">
        {cards.map((card) => (
          <AnimatedItem key={card.label}>
            <StatCard label={card.label} value={card.value} unit={card.unit} icon={card.icon} />
          </AnimatedItem>
        ))}
      </ContentGrid>
    </AnimatedSection>
  );
}
