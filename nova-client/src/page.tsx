"use client";

import * as React from "react";
import {
  Flame,
  HeartPulse,
  BookHeart,
  Target,
  Mic,
  ArrowUpRight,
  Smile,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageSection } from "@/components/layout/PageSection";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import { PremiumCard } from "@/components/cards/PremiumCard";
import { InsightCard } from "@/components/cards/InsightCard";
import { StatCard } from "@/components/cards/StatCard";
import { EmptyCard } from "@/components/cards/EmptyCard";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { Badge } from "@/components/shared/Badge";
import { Chip } from "@/components/shared/Chip";
import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";

export default function TodayPage() {
  const [route, setRoute] = React.useState("today");
  const [moodFilter, setMoodFilter] = React.useState("calm");

  return (
    <AppShell
      pageTitle="Today"
      activeRoute={route}
      onNavigate={setRoute}
      userName="Alex Rivera"
      userEmail="alex@nova.app"
      onQuickAdd={() => {}}
      notifications={[
        {
          id: "1",
          title: "Evening reflection",
          body: "Nova put together a short prompt based on your day.",
          time: "2h ago",
        },
        {
          id: "2",
          title: "Goal streak",
          body: "7 days of morning walks — your longest streak yet.",
          time: "Yesterday",
          read: true,
        },
      ]}
    >
      <PageContainer>
        <GreetingHeader
          name="Alex"
          subtitle="Here's a quiet look at how things are going, and a few things worth your attention."
          action={
            <PrimaryButton variant="gradient" icon={<Mic className="h-4 w-4" />}>
              Start check-in
            </PrimaryButton>
          }
        />

        <PageSection>
          <ContentGrid columns={4} gap="md">
            <StatCard
              label="Mood, 7-day avg"
              value="7.8"
              unit="/ 10"
              icon={<Smile className="h-4 w-4" />}
              trend={{ direction: "up", value: "+0.6 this week" }}
            />
            <StatCard
              label="Journal streak"
              value="12"
              unit="days"
              icon={<BookHeart className="h-4 w-4" />}
              trend={{ direction: "up", value: "Personal best" }}
            />
            <StatCard
              label="Goals on track"
              value="4"
              unit="of 5"
              icon={<Target className="h-4 w-4" />}
            />
            <StatCard
              label="Resting heart rate"
              value="58"
              unit="bpm"
              icon={<HeartPulse className="h-4 w-4" />}
              trend={{ direction: "down", value: "-2 vs last month", positiveIsGood: false }}
            />
          </ContentGrid>
        </PageSection>

        <PageSection
          title="From Nova"
          description="Gentle observations, not verdicts."
          emphasis
        >
          <ContentGrid columns={2} gap="md">
            <InsightCard
              title="Your evenings feel steadier lately"
              body="Entries after 8pm have used calmer language for six days straight — since you started the wind-down reminder."
              onAction={() => {}}
            />
            <InsightCard
              title="A goal might need a smaller step"
              body="\u201CRun 5k\u201D has slipped three weeks in a row. Want to try a smaller version for a while?"
              tag="Worth a look"
              actionLabel="Adjust goal"
              onAction={() => {}}
            />
          </ContentGrid>
        </PageSection>

        <PageSection title="How are you feeling right now?">
          <div className="flex flex-wrap gap-2">
            {["calm", "energized", "tired", "anxious", "grateful", "low"].map((mood) => (
              <Chip
                key={mood}
                label={mood}
                selected={moodFilter === mood}
                onSelect={() => setMoodFilter(mood)}
              />
            ))}
          </div>
        </PageSection>

        <PageSection
          title="Recent journal entries"
          action={<SecondaryButton size="sm">View all</SecondaryButton>}
        >
          <AnimatedSection kind="stagger-children" className="space-y-3">
            {[
              { title: "A slower Sunday", tag: "Reflection", time: "Today, 9:12 AM" },
              { title: "Coffee with Maya", tag: "Connection", time: "Yesterday, 6:40 PM" },
            ].map((entry) => (
              <AnimatedItem key={entry.title}>
                <PremiumCard variant="interactive" onClick={() => {}} className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-text">{entry.title}</h3>
                      <Badge variant="primary">{entry.tag}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">{entry.time}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted" />
                </PremiumCard>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        </PageSection>

        <PageSection title="Upcoming memories">
          <EmptyCard
            icon={<Flame className="h-5 w-5" />}
            title="Nothing scheduled yet"
            description="Save a memory today, and Nova will bring it back to you on a day like this one, next year."
            actionLabel="Add a memory"
            onAction={() => {}}
          />
        </PageSection>
      </PageContainer>
    </AppShell>
  );
}
