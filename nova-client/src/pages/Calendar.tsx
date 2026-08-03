import * as React from "react";
import {
  BrainCircuit,
  Users,
  GraduationCap,
  Dumbbell,
  Heart,
  ListChecks,
  Target,
  Receipt,
  Repeat,
  Cake,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageSection } from "@/components/layout/PageSection";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { PremiumCard } from "@/components/cards/PremiumCard";
import { Badge } from "@/components/shared/Badge";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";

import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarOverview } from "@/components/calendar/CalendarOverview";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { CalendarFilters } from "@/components/calendar/CalendarFilters";
import { CalendarSearch } from "@/components/calendar/CalendarSearch";
import { TodayTimeline } from "@/components/calendar/TodayTimeline";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import { AIDailyPlanner } from "@/components/calendar/AIDailyPlanner";
import { CalendarInsights } from "@/components/calendar/CalendarInsights";
import { CalendarQuickActions } from "@/components/calendar/CalendarQuickActions";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { CalendarSkeleton } from "@/components/calendar/CalendarSkeleton";
import { QuickAddEvent } from "@/components/calendar/QuickAddEvent";
import { EventDetailsDrawer } from "@/components/calendar/EventDetailsDrawer";

import { selectLoading } from "@/redux/calendarSelectors";
import { setLoading, goToday, changeView } from "@/redux/calendarSlice";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const FOCUS_BLOCKS = [
  { label: "Deep Work", hours: 8.5, icon: BrainCircuit, color: "#7C6CF6" },
  { label: "Meetings", hours: 6.0, icon: Users, color: "#FF8B6B" },
  { label: "Learning", hours: 3.2, icon: GraduationCap, color: "#4FD1C5" },
  { label: "Exercise", hours: 4.5, icon: Dumbbell, color: "#6FCF97" },
  { label: "Family", hours: 5.0, icon: Heart, color: "#EF5D6F" },
];

const UPCOMING_DEADLINES = [
  { label: "Finish onboarding flow spec", kind: "Task", icon: ListChecks, daysLeft: 1 },
  { label: "Run a 5K", kind: "Goal", icon: Target, daysLeft: 4 },
  { label: "Electricity bill", kind: "Bill", icon: Receipt, daysLeft: 3 },
  { label: "Adobe Creative Cloud", kind: "Subscription", icon: Repeat, daysLeft: 19 },
  { label: "Sara's birthday", kind: "Birthday", icon: Cake, daysLeft: 5 },
];

export function CalendarPage() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const quickAdd = useDisclosure();
  const search = useDisclosure();

  // Simulate an initial mock fetch so CalendarSkeleton has a moment to show.
  React.useEffect(() => {
    dispatch(setLoading(true));
    const timer = setTimeout(() => dispatch(setLoading(false)), 500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <AppShell
      pageTitle="Calendar"
      activeRoute="calendar"
      onNavigate={() => {}}
      userName="Alex Rivera"
      userEmail="alex@nova.app"
    >
      <PageContainer>
        <CalendarHeader
          onNewEvent={quickAdd.onOpen}
          onOpenAIPlanner={() => document.getElementById("ai-daily-planner")?.scrollIntoView({ behavior: "smooth" })}
          onToday={() => dispatch(goToday())}
          onSearchOpen={search.onOpen}
        />

        {loading ? (
          <CalendarSkeleton />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              <PageSection animate={false}>
                <CalendarOverview />
              </PageSection>

              <PageSection
                title="Your calendar"
                description="Month, week, day, or agenda — however you like to see your time."
                action={<CalendarFilters />}
              >
                <CalendarGrid onAddEvent={quickAdd.onOpen} />
              </PageSection>

              <ContentGrid columns={2} gap="lg">
                <PageSection title="Today's timeline" animate={false}>
                  <PremiumCard variant="default" className="p-5">
                    <TodayTimeline onAddEvent={quickAdd.onOpen} />
                  </PremiumCard>
                </PageSection>

                <PageSection
                  title="Upcoming events"
                  animate={false}
                  action={
                    <SecondaryButton size="sm" variant="ghost" onClick={() => dispatch(changeView("agenda"))}>
                      View all
                    </SecondaryButton>
                  }
                >
                  <UpcomingEvents onAddEvent={quickAdd.onOpen} limit={3} />
                </PageSection>
              </ContentGrid>

              <PageSection title="AI Daily Planner" emphasis>
                <div id="ai-daily-planner">
                  <AIDailyPlanner />
                </div>
              </PageSection>

              <PageSection title="Focus blocks" description="Where your hours went this week.">
                <ContentGrid columns={3} gap="md">
                  {FOCUS_BLOCKS.map((block) => (
                    <PremiumCard key={block.label} variant="outlined" className="flex items-center gap-3 p-4">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                        style={{ backgroundColor: `${block.color}1A`, color: block.color }}
                      >
                        <block.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-text">{block.label}</p>
                        <p className="text-xs text-muted">{block.hours}h this week</p>
                      </div>
                    </PremiumCard>
                  ))}
                </ContentGrid>
              </PageSection>

              <PageSection title="Upcoming deadlines" description="Tasks, goals, bills, subscriptions, and birthdays.">
                <PremiumCard variant="default" className="divide-y divide-border p-0">
                  {UPCOMING_DEADLINES.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 px-5 py-3.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-surface text-text-secondary">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text">{item.label}</p>
                        <Badge variant="neutral" className="mt-0.5">{item.kind}</Badge>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-muted">
                        {item.daysLeft === 1 ? "Tomorrow" : `In ${item.daysLeft} days`}
                      </span>
                    </div>
                  ))}
                </PremiumCard>
              </PageSection>

              <PageSection title="Calendar insights" description="How your time has actually been spent.">
                <CalendarInsights />
              </PageSection>

              <PageSection title="Quick actions">
                <CalendarQuickActions
                  onCreateEvent={quickAdd.onOpen}
                  onOpenAIPlanner={() => document.getElementById("ai-daily-planner")?.scrollIntoView({ behavior: "smooth" })}
                />
              </PageSection>
            </div>

            <aside className="hidden lg:block">
              <CalendarSidebar />
            </aside>
          </div>
        )}
      </PageContainer>

      <QuickAddEvent isOpen={quickAdd.isOpen} onClose={quickAdd.onClose} />
      <EventDetailsDrawer />
      <CalendarSearch isOpen={search.isOpen} onClose={search.onClose} />
    </AppShell>
  );
}
