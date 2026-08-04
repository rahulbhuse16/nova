"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  CloudSun,
  CheckSquare,
  Calendar,
  Clock,
  Target,
  Droplets,
  Dumbbell,
  BookOpen,
  Moon,
  Code,
  FileText,
  Pin,
  File,
  FileText as FileTextIcon,
  Image,
  Folder,
  Bell,
  CreditCard,
  Pill,
  Calendar as CalendarIcon,
  Cake,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageSection } from "@/components/layout/PageSection";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { GreetingHeader } from "@/components/layout/GreetingHeader";
import { PremiumCard } from "@/components/cards/PremiumCard";
import { StatCard } from "@/components/cards/StatCard";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { AnimatedSection, AnimatedItem } from "@/components/shared/AnimatedSection";
import { AppShell } from "../components/layout/AppShell";
import { DailyOverviewCard } from "@/components/cards/DailyOverviewCard";
import { PriorityTaskCard } from "@/components/cards/PriorityTaskCard";
import { ScheduleTimeline } from "@/components/cards/ScheduleTimeline";
import { AIDailyBrief } from "@/components/cards/AIDailyBrief";
import { GoalProgressCard } from "@/components/cards/GoalProgressCard";
import { HabitTracker } from "@/components/cards/HabitTracker";
import { FinanceCard } from "@/components/cards/FinanceCard";
import { QuickNotesCard } from "@/components/cards/QuickNotesCard";
import { RecentDocumentsCard } from "@/components/cards/RecentDocumentsCard";
import { ReminderCard } from "@/components/cards/ReminderCard";
import { QuickActionsCard } from "@/components/cards/QuickActionsCard";
import { loadUser } from "@/services/auth";
import { useAppSelector } from "@/store/hooks";

export default function TodayPage() {
  const navigate = useNavigate();

  const user=useAppSelector(state=>state.auth.user)


  React.useEffect(()=>{
    loadUser()
    

  },[])
  const [route, setRoute] = React.useState("today");
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);
  const [tasks, setTasks] = React.useState([
    { id: "1", title: "Complete dashboard UI design", completed: false, priority: "high" as const, time: "2:00 PM" },
    { id: "2", title: "Review pull requests", completed: false, priority: "high" as const },
    { id: "3", title: "Team standup meeting", completed: true, priority: "medium" as const, time: "10:00 AM" },
    { id: "4", title: "Update documentation", completed: false, priority: "low" as const },
  ]);
  const [habits, setHabits] = React.useState([
    { id: "1", name: "Water", icon: <Droplets className="h-4 w-4" />, completed: true, streak: 5 },
    { id: "2", name: "Workout", icon: <Dumbbell className="h-4 w-4" />, completed: false, streak: 3 },
    { id: "3", name: "Reading", icon: <BookOpen className="h-4 w-4" />, completed: true, streak: 12 },
    { id: "4", name: "Sleep", icon: <Moon className="h-4 w-4" />, completed: false, streak: 0 },
    { id: "5", name: "Coding", icon: <Code className="h-4 w-4" />, completed: true, streak: 7 },
  ]);

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleToggleHabit = (id: string) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getDateString = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
          title: "Meeting reminder",
          body: "Team standup starts in 15 minutes.",
          time: "15m ago",
        },
        {
          id: "2",
          title: "Task completed",
          body: "You've completed 3 tasks today. Great progress!",
          time: "1h ago",
          read: true,
        },
      ]}
    >
      <PageContainer>
        {/* Greeting Header */}
        <PageSection>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{getGreeting()}, {user?.name}</h1>
              <p className="text-muted-foreground">{getDateString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/50 border border-border/50">
                <CloudSun className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-foreground">72°F</span>
              </div>
              <div className="relative">
                <PrimaryButton icon={<Plus className="h-4 w-4" />} onClick={() => setQuickAddOpen(!quickAddOpen)}>
                  Quick Add
                </PrimaryButton>
                {quickAddOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-1">
                      <button
                        onClick={() => { setQuickAddOpen(false); navigate("/add-task"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-accent transition-colors"
                      >
                        <CheckSquare className="h-5 w-5 text-indigo-400" />
                        <span className="text-sm text-foreground">Add Task</span>
                      </button>
                      <button
                        onClick={() => { setQuickAddOpen(false); navigate("/notes"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-accent transition-colors"
                      >
                        <FileText className="h-5 w-5 text-indigo-400" />
                        <span className="text-sm text-foreground">Add Note</span>
                      </button>
                      <button
                        onClick={() => { setQuickAddOpen(false); navigate("/calendar"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-accent transition-colors"
                      >
                        <Calendar className="h-5 w-5 text-indigo-400" />
                        <span className="text-sm text-foreground">Create Event</span>
                      </button>
                      <button
                        onClick={() => { setQuickAddOpen(false); navigate("/finance"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-accent transition-colors"
                      >
                        <DollarSign className="h-5 w-5 text-indigo-400" />
                        <span className="text-sm text-foreground">Add Expense</span>
                      </button>
                      <button
                        onClick={() => { setQuickAddOpen(false); navigate("/assistant"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-accent transition-colors"
                      >
                        <Sparkles className="h-5 w-5 text-indigo-400" />
                        <span className="text-sm text-foreground">AI Assistant</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks, events, notes..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border transition-colors"
            />
          </div>
        </PageSection>

        {/* Daily Overview */}
        <PageSection>
          <DailyOverviewCard
            tasks={8}
            meetings={3}
            habits={4}
            focusTime="4h 30m"
          />
        </PageSection>

        <ContentGrid columns={2} gap="lg">
          {/* Priority Tasks */}
          <PageSection>
            <PriorityTaskCard
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={() => {}}
            />
          </PageSection>

          {/* Today's Schedule */}
          <PageSection>
            <ScheduleTimeline
              events={[
                { id: "1", title: "Team Standup", time: "10:00 AM", duration: "30m", type: "meeting" },
                { id: "2", title: "Design Review", time: "2:00 PM", duration: "1h", type: "meeting", location: "Conference Room A" },
                { id: "3", title: "Client Call", time: "4:00 PM", duration: "45m", type: "call" },
              ]}
            />
          </PageSection>
        </ContentGrid>

        {/* AI Daily Brief */}
        <PageSection>
          <AIDailyBrief
            insights={[
              { id: "1", type: "alert", content: "You have two overlapping meetings at 2:00 PM and 2:30 PM. Consider rescheduling one.", priority: "high" },
              { id: "2", type: "suggestion", content: "Complete the dashboard UI before 2:00 PM to stay on track with your weekly goal.", priority: "medium" },
              { id: "3", type: "reminder", content: "Leave home 15 minutes early tomorrow for your 9:00 AM dentist appointment.", priority: "medium" },
            ]}
          />
        </PageSection>

        <ContentGrid columns={2} gap="lg">
          {/* Goals Progress */}
          <PageSection>
            <GoalProgressCard
              goals={[
                { id: "1", title: "Complete project milestone", progress: 3, target: 5, unit: "tasks" },
                { id: "2", title: "Read books", progress: 2, target: 4, unit: "books" },
                { id: "3", title: "Workout sessions", progress: 4, target: 5, unit: "sessions" },
              ]}
            />
          </PageSection>

          {/* Habit Tracker */}
          <PageSection>
            <HabitTracker
              habits={habits}
              onToggleHabit={handleToggleHabit}
            />
          </PageSection>
        </ContentGrid>

        <ContentGrid columns={2} gap="lg">
          {/* Finance Snapshot */}
          <PageSection>
            <FinanceCard
              todaySpending={45}
              monthlyBudget={2000}
              budgetUsed={1250}
              upcomingBills={2}
            />
          </PageSection>

          {/* Quick Notes */}
          <PageSection>
            <QuickNotesCard
              notes={[
                { id: "1", title: "Project ideas", preview: "New feature concepts for Q4...", pinned: true, updatedAt: "2h ago" },
                { id: "2", title: "Meeting notes", preview: "Action items from standup...", pinned: false, updatedAt: "5h ago" },
                { id: "3", title: "Shopping list", preview: "Groceries for the week...", pinned: false, updatedAt: "1d ago" },
              ]}
              onAddNote={() => {}}
            />
          </PageSection>
        </ContentGrid>

        <ContentGrid columns={2} gap="lg">
          {/* Recent Documents */}
          <PageSection>
            <RecentDocumentsCard
              documents={[
                { id: "1", name: "Q4 Report.pdf", type: "document", openedAt: "2 hours ago" },
                { id: "2", name: "Design System.fig", type: "image", openedAt: "5 hours ago" },
                { id: "3", name: "Project Files", type: "folder", openedAt: "Yesterday" },
              ]}
            />
          </PageSection>

          {/* Smart Reminders */}
          <PageSection>
            <ReminderCard
              reminders={[
                { id: "1", title: "Credit Card Payment", type: "bill", dueDate: "Due in 3 days", amount: "$250" },
                { id: "2", title: "Take vitamins", type: "medicine", dueDate: "Daily at 8:00 AM" },
                { id: "3", title: "Dentist Appointment", type: "appointment", dueDate: "Tomorrow, 9:00 AM" },
                { id: "4", title: "Sarah's Birthday", type: "birthday", dueDate: "In 2 weeks" },
              ]}
            />
          </PageSection>
        </ContentGrid>

        {/* Quick Actions */}
        <PageSection>
          <QuickActionsCard
            actions={[
              { id: "1", label: "Add Task", icon: <CheckSquare className="h-5 w-5 text-indigo-400" />, onClick: () => navigate("/add-task") },
              { id: "2", label: "Add Note", icon: <FileText className="h-5 w-5 text-indigo-400" />, onClick: () => navigate("/notes") },
              { id: "3", label: "Create Event", icon: <Calendar className="h-5 w-5 text-indigo-400" />, onClick: () => navigate("/calendar") },
              { id: "4", label: "Add Expense", icon: <DollarSign className="h-5 w-5 text-indigo-400" />, onClick: () => navigate("/finance") },
              { id: "5", label: "AI Assistant", icon: <Sparkles className="h-5 w-5 text-indigo-400" />, onClick: () => navigate("/assistant") },
            ]}
          />
        </PageSection>
      </PageContainer>
    </AppShell>
  );
}
