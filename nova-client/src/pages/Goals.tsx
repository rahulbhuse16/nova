
import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageSection } from "@/components/layout/PageSection";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { AppShell } from "../components/layout/AppShell";
import { GoalOverview } from "@/components/goals/GoalOverview";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalCategoryFilter } from "@/components/goals/GoalCategoryFilter";
import { GoalInsights } from "@/components/goals/GoalInsights";
import { GoalTimeline } from "@/components/goals/GoalTimeline";
import { GoalAchievements } from "@/components/goals/GoalAchievements";
import { GoalQuickActions } from "@/components/goals/GoalQuickActions";
import { GoalSidebar } from "@/components/goals/GoalSidebar";
import { GoalEmptyState } from "@/components/goals/GoalEmptyState";
import { GoalProgressCard } from "@/components/goals/GoalProgressCard";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { PremiumCard } from "@/components/cards/PremiumCard";
import { Plus, Sparkles, Search, Filter as FilterIcon, X, Calendar, Loader2, AlertTriangle, CheckCircle2, Target, Trophy, Flame, Award, Flag, TrendingUp } from "lucide-react";
import {
  selectGoal,
  toggleFavorite,
  toggleCompleted,
  setCategory,
  setSearch,
  setSort,
  resetFilters,
  addGoal,
  generateGoalPlan,
  clearAiPlan,
  applyAiMilestones,
} from "../redux/goalSlice";
import type { AppDispatch } from "../store/store";
import type { RootState } from "../store/store";
import type { GoalCategory, GoalSortBy, GoalPriority } from "../types/goal.types";

export default function GoalsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { goals, categoryFilter, search, sortBy, overview, selectedGoal, ai } = useSelector(
    (state: RootState) => state.goals
  );
  const [route, setRoute] = React.useState("goals");
  const [addGoalOpen, setAddGoalOpen] = React.useState(false);
  const [aiPlanOpen, setAiPlanOpen] = React.useState(false);
  const [newGoal, setNewGoal] = React.useState({
    title: "",
    description: "",
    category: "career" as GoalCategory,
    priority: "medium" as GoalPriority,
    deadline: "",
    icon: "🎯",
    color: "bg-indigo-500/20",
  });

  // Filter goals
  const filteredGoals = React.useMemo(() => {
    return goals.filter((goal: any) => {
      const matchesCategory = categoryFilter === "all" || goal.category === categoryFilter;
      const matchesSearch = search === "" || 
        goal.title.toLowerCase().includes(search.toLowerCase()) ||
        goal.description.toLowerCase().includes(search.toLowerCase()) ||
        goal.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = goal.status !== "archived";
      return matchesCategory && matchesSearch && matchesStatus;
    });
  }, [goals, categoryFilter, search]);

  // Sort goals
  const sortedGoals = React.useMemo(() => {
    return [...filteredGoals].sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case "priority":
          const priorityOrder: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "progress":
          return b.progress - a.progress;
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [filteredGoals, sortBy]);

  const handleSelectGoal = (id: string) => {
    dispatch(selectGoal(id));
  };

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavorite(id));
  };

  const handleToggleComplete = (id: string) => {
    dispatch(toggleCompleted(id));
  };

  const handleEdit = (id: string) => {
    console.log("Edit goal:", id);
  };

  const handleArchive = (id: string) => {
    console.log("Archive goal:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete goal:", id);
  };

  const handleCategoryChange = (category: GoalCategory | "all") => {
    dispatch(setCategory(category));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  };

  const handleSortChange = (sort: GoalSortBy) => {
    dispatch(setSort(sort));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) return;

    const goal = {
      id: `goal-${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      priority: newGoal.priority,
      status: "not_started" as const,
      progress: 0,
      deadline: newGoal.deadline,
      favorite: false,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      color: newGoal.color,
      icon: newGoal.icon,
      milestones: [],
      tags: [],
    };

    dispatch(addGoal(goal));
    setAddGoalOpen(false);
    setNewGoal({
      title: "",
      description: "",
      category: "career" as GoalCategory,
      priority: "medium" as GoalPriority,
      deadline: "",
      icon: "🎯",
      color: "bg-indigo-500/20",
    });
  };

  const handleAIPlanner = () => {
    const target = selectedGoal || sortedGoals[0];
    if (!target) return;
    if (!selectedGoal) dispatch(selectGoal(target.id));
    setAiPlanOpen(true);
    dispatch(generateGoalPlan(target));
  };

  const handleGeneratePlan = () => {
    const target = selectedGoal || sortedGoals[0];
    if (!target) return;
    if (!selectedGoal) dispatch(selectGoal(target.id));
    setAiPlanOpen(true);
    dispatch(generateGoalPlan(target));
  };

  const handleCloseAiPlan = () => {
    setAiPlanOpen(false);
    dispatch(clearAiPlan());
  };

  const handleApplyMilestones = () => {
    dispatch(applyAiMilestones());
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "medium": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  // Today's Focus - Top 3 goals needing attention
  const todayFocus = React.useMemo(() => {
    return sortedGoals
      .filter((g) => g.status === "in_progress")
      .sort((a, b) => {
        // Prioritize by deadline, then by priority
        const deadlineDiff = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        if (deadlineDiff !== 0) return deadlineDiff;
        const priorityOrder: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 3);
  }, [sortedGoals]);

  // AI Insights — use coaching insights from plan when available
  const insights = ai.plan
    ? ai.plan.coachingInsights.map((content, i) => ({
        id: String(i + 1),
        type: "suggestion" as const,
        icon: <span className="text-lg">💡</span>,
        content,
        color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      }))
    : [
    {
      id: "1",
      type: "achievement" as const,
      icon: <span className="text-lg">🎉</span>,
      content: "You've completed 80% of your learning goals this month!",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      id: "2",
      type: "suggestion" as const,
      icon: <span className="text-lg">🚀</span>,
      content: "Launch Nova MVP is ahead of schedule. Consider adding stretch goals.",
      color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
    {
      id: "3",
      type: "achievement" as const,
      icon: <span className="text-lg">🔥</span>,
      content: "Your workout streak reached 9 days. Keep it up!",
      color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
  ];

  // Achievements
  const achievements = [
    {
      id: "1",
      title: "First Goal",
      description: "Created your first goal",
      icon: <Target className="h-5 w-5 text-amber-400" />,
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      unlocked: true,
      unlockedAt: "2025-12-01",
    },
    {
      id: "2",
      title: "7 Day Streak",
      description: "Maintained a 7-day goal streak",
      icon: <Flame className="h-5 w-5 text-rose-400" />,
      color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      unlocked: true,
      unlockedAt: "2026-01-20",
    },
    {
      id: "3",
      title: "10 Goals Completed",
      description: "Completed 10 goals total",
      icon: <Trophy className="h-5 w-5 text-emerald-400" />,
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      unlocked: false,
    },
    {
      id: "4",
      title: "Consistency Master",
      description: "Complete goals for 30 consecutive days",
      icon: <Award className="h-5 w-5 text-purple-400" />,
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      unlocked: false,
    },
  ];

  // Quick Actions
  const quickActions = [
    {
      id: "create-goal",
      label: "Create Goal",
      icon: <Plus className="h-5 w-5" />,
      color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/30",
      onClick: () => console.log("Create goal"),
    },
    {
      id: "create-milestone",
      label: "Create Milestone",
      icon: <Flag className="h-5 w-5" />,
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/30",
      onClick: () => console.log("Create milestone"),
    },
    {
      id: "review-progress",
      label: "Review Progress",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-amber-500/20 text-amber-400 border-amber-500/20 hover:bg-amber-500/30",
      onClick: () => console.log("Review progress"),
    },
    {
      id: "ai-planner",
      label: "AI Planner",
      icon: <Sparkles className="h-5 w-5" />,
      color: "bg-purple-500/20 text-purple-400 border-purple-500/20 hover:bg-purple-500/30",
      onClick: handleAIPlanner,
    },
  ];

  return (
    <AppShell
      pageTitle="Goals"
      activeRoute={route}
      onNavigate={setRoute}
      userName="Alex Rivera"
      userEmail="alex@nova.app"
      onQuickAdd={() => {}}
      notifications={[]}
    >
      <PageContainer>
        {/* Header */}
        <PageSection>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Goals</h1>
              <p className="text-slate-400">Track meaningful progress and let Nova guide your journey.</p>
            </div>
            <div className="flex items-center gap-3">
              <SecondaryButton icon={<Sparkles className="h-4 w-4" />} onClick={handleAIPlanner}>
                AI Goal Planner
              </SecondaryButton>
              <PrimaryButton icon={<Plus className="h-4 w-4" />} onClick={() => setAddGoalOpen(true)}>
                Create Goal
              </PrimaryButton>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search goals..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as GoalSortBy)}
              className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="priority">Sort by Priority</option>
              <option value="progress">Sort by Progress</option>
              <option value="created">Sort by Created</option>
              <option value="title">Sort by Title</option>
            </select>
            {(search !== "" || categoryFilter !== "all" || sortBy !== "deadline") && (
              <SecondaryButton icon={<FilterIcon className="h-4 w-4" />} onClick={handleResetFilters}>
                Reset
              </SecondaryButton>
            )}
          </div>
        </PageSection>

        {/* Add Goal Modal */}
        {addGoalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <PremiumCard className="w-full max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Create New Goal</h2>
                <button
                  onClick={() => setAddGoalOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g., Learn TypeScript"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Describe your goal..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as GoalCategory })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
                    >
                      <option value="career">Career</option>
                      <option value="learning">Learning</option>
                      <option value="fitness">Fitness</option>
                      <option value="finance">Finance</option>
                      <option value="travel">Travel</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as GoalPriority })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors cursor-pointer"
                    >
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Deadline</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <SecondaryButton onClick={() => setAddGoalOpen(false)} className="flex-1">
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton onClick={handleCreateGoal} className="flex-1">
                    Create Goal
                  </PrimaryButton>
                </div>
              </div>
            </PremiumCard>
          </div>
        )}

        {/* Overview */}
        <PageSection>
          <GoalOverview
            activeGoals={overview.activeGoals}
            completedGoals={overview.completedGoals}
            weeklyProgress={overview.weeklyProgress}
            currentStreak={overview.currentStreak}
            successRate={overview.successRate}
          />
        </PageSection>

        {/* Category Filter */}
        <PageSection>
          <GoalCategoryFilter selectedCategory={categoryFilter} onSelect={handleCategoryChange} />
        </PageSection>

        <ContentGrid columns={3} gap="lg">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Focus */}
            {todayFocus.length > 0 && (
              <PageSection>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white mb-1">Today's Focus</h2>
                  <p className="text-sm text-slate-400">Top goals requiring your attention</p>
                </div>
                <ContentGrid columns={3} gap="md">
                  {todayFocus.map((goal) => (
                    <GoalProgressCard
                      key={goal.id}
                      title={goal.title}
                      progress={goal.progress}
                      subtitle={goal.description}
                      icon={<span className="text-2xl">{goal.icon}</span>}
                      color={goal.color}
                      deadline={goal.deadline}
                    />
                  ))}
                </ContentGrid>
              </PageSection>
            )}

            {/* Goal Cards */}
            <PageSection>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">All Goals</h2>
                <span className="text-sm text-slate-400">{sortedGoals.length} goals</span>
              </div>
              
              {sortedGoals.length === 0 ? (
                <GoalEmptyState
                  message={search !== "" || categoryFilter !== "all" ? "No goals match your filters" : "No goals yet"}
                  onCreateGoal={() => console.log("Create goal")}
                />
              ) : (
                <ContentGrid columns={2} gap="md">
                  {sortedGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onSelect={handleSelectGoal}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEdit}
                      onArchive={handleArchive}
                      onDelete={handleDelete}
                    />
                  ))}
                </ContentGrid>
              )}
            </PageSection>

            {/* Milestone Timeline */}
            {selectedGoal && (
              <PageSection>
                <GoalTimeline milestones={selectedGoal.milestones} />
              </PageSection>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <GoalInsights
              insights={insights}
              onGeneratePlan={handleGeneratePlan}
              onSuggestMilestones={handleGeneratePlan}
              onOptimizeTimeline={handleGeneratePlan}
            />

            <GoalAchievements achievements={achievements} />

            <GoalSidebar
              overallScore={87}
              upcomingDeadline="Feb 15, 2026"
              currentStreak={overview.currentStreak}
              nextMilestone={selectedGoal?.milestones.find((m) => !m.completed)?.title || "Set a milestone"}
              aiTip={ai.plan?.coachMessage || "Select a goal and use AI Goal Planner to get personalized coaching."}
            />

            <GoalQuickActions actions={quickActions} />
          </div>
        </ContentGrid>

        {/* AI Goal Plan Modal */}
        {aiPlanOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <PremiumCard className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-900/95 backdrop-blur-sm pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-xl font-semibold text-white">
                    AI Goal Plan{selectedGoal ? `: ${selectedGoal.title}` : ""}
                  </h2>
                </div>
                <button
                  onClick={handleCloseAiPlan}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {ai.plannerLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
                  <p className="text-slate-400">Nova is analyzing your goal and building your plan...</p>
                </div>
              )}

              {ai.error && !ai.plannerLoading && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm mb-4">
                  {ai.error}
                </div>
              )}

              {ai.plan && !ai.plannerLoading && (
                <div className="space-y-6">
                  {/* Coach Message */}
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <p className="text-sm font-medium text-indigo-300 mb-1">Coach Message</p>
                    <p className="text-white">{ai.plan.coachMessage}</p>
                  </div>

                  {/* Analysis */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Analysis</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{ai.plan.analysis}</p>
                  </div>

                  {/* Deadline Feasibility */}
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      {ai.plan.deadlineFeasibility.feasible ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      )}
                      <span className="text-sm font-medium text-white">
                        Deadline {ai.plan.deadlineFeasibility.feasible ? "Feasible" : "At Risk"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{ai.plan.deadlineFeasibility.assessment}</p>
                    {ai.plan.deadlineFeasibility.recommendedDeadline && (
                      <p className="text-xs text-indigo-400 mt-2">
                        Recommended: {ai.plan.deadlineFeasibility.recommendedDeadline}
                      </p>
                    )}
                  </div>

                  {/* Strengths & Risks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-400 mb-2">Strengths</h3>
                      <ul className="space-y-1">
                        {ai.plan.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-rose-400 mb-2">Risks</h3>
                      <div className="space-y-2">
                        {ai.plan.risks.map((risk, i) => (
                          <div key={i} className={`p-3 rounded-lg border text-sm ${severityColor(risk.severity)}`}>
                            <p className="font-medium">{risk.title}</p>
                            <p className="text-xs mt-1 opacity-80">{risk.mitigation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">Milestones</h3>
                      <SecondaryButton onClick={handleApplyMilestones}>Apply to Goal</SecondaryButton>
                    </div>
                    <div className="space-y-2">
                      {ai.plan.milestones.map((m) => (
                        <div key={m.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">{m.title}</p>
                            {m.description && <p className="text-xs text-slate-400 mt-0.5">{m.description}</p>}
                          </div>
                          <span className="text-xs text-slate-500">{m.dueDate}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Daily Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ai.plan.dailyActions.map((day) => (
                        <div key={day.day} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                          <p className="text-sm font-medium text-indigo-300 mb-2">{day.day}</p>
                          <ul className="space-y-1">
                            {day.actions.map((action, i) => (
                              <li key={i} className="text-xs text-slate-300">• {action}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Execution Strategy */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Execution Strategy</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{ai.plan.executionStrategy}</p>
                  </div>
                </div>
              )}
            </PremiumCard>
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}
