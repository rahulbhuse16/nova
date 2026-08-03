import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Save, X } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageSection } from "@/components/layout/PageSection";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { AppShell } from "../components/layout/AppShell";
import { TaskDetailsCard } from "@/components/tasks/TaskDetailsCard";
import { TaskScheduleCard } from "@/components/tasks/TaskScheduleCard";
import { TaskPrioritySelector } from "@/components/tasks/TaskPrioritySelector";
import { ReminderSelector } from "@/components/tasks/ReminderSelector";
import { RepeatSelector } from "@/components/tasks/RepeatSelector";
import { SubtaskList } from "@/components/tasks/SubtaskList";
import { TagInput } from "@/components/tasks/TagInput";
import { AITaskAssistant } from "@/components/tasks/AITaskAssistant";
import { TaskPreviewCard } from "@/components/tasks/TaskPreviewCard";
import { TaskActionBar } from "@/components/tasks/TaskActionBar";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";

import {
  createTask,
  saveDraft,
  generateSubtasks,
  optimizeSchedule,
  generateTaskSuggestions,
  clearTaskError,
} from "@/redux/taskSlice";
import { TaskInput, TaskPriority } from "@/services/task";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function AddTaskPage() {
  const [route, setRoute] = React.useState("add-task");
  const dispatch = useAppDispatch();

  // Pull live status from the task slice instead of local fake-loading state.
  const { creating, savingDraft, currentTask, error, ai } = useAppSelector(
    (state) => state.tasks
  );

  // Task form state — stays local until submitted to the API.
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState(
    ""
  );
  const [category, setCategory] = React.useState("work");
  const [dueDate, setDueDate] = React.useState(() => new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = React.useState("14:00");
  const [endTime, setEndTime] = React.useState("17:00");
  const [estimatedDuration, setEstimatedDuration] = React.useState("3 hours");
  const [timeZone, setTimeZone] = React.useState("America/New_York");
  const [priority, setPriority] = React.useState<TaskPriority>("high");
  const [reminder, setReminder] = React.useState("30min");
  const [customReminder, setCustomReminder] = React.useState("");
  const [repeat, setRepeat] = React.useState("never");
  const [subtasks, setSubtasks] = React.useState([
   
  ]);
  const [tags, setTags] = React.useState([]);

  // Tracks the persisted task id once it exists on the server — required
  // before any AI endpoint (they operate on an existing task document).
  const [savedTaskId, setSavedTaskId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (currentTask?._id) setSavedTaskId(currentTask._id);
  }, [currentTask]);

  const buildPayload = (status: TaskInput["status"]): TaskInput => ({
    title,
    description,
    category,
    priority,
    status,
    dueDate,
    startTime,
    endTime,
    estimatedDuration,
    timezone: timeZone,
    repeat,
    reminder,
    customReminder,
    subtasks: subtasks.map((s) => ({
      title: s.title,
      completed: s.completed,
    })),
    tags,
  });

  const handleCreateTask = async () => {
    const result = await dispatch(createTask(buildPayload("pending")));
    if (createTask.fulfilled.match(result)) {
      setSavedTaskId(result.payload._id);
    }
  };

  const handleSaveDraft = async () => {
    const result = await dispatch(saveDraft(buildPayload("draft")));
    if (saveDraft.fulfilled.match(result)) {
      setSavedTaskId(result.payload._id);
    }
  };

  const handleCancel = () => {
    dispatch(clearTaskError());
    // Wire this up to your router — e.g. navigate(-1) or navigate("/tasks")
  };

  const handleApplySuggestion = (suggestionId: string) => {
    const suggestion = ai.lastSuggestionsResult?.suggestions.find(
      (_, idx) => String(idx) === suggestionId
    );
    if (!suggestion) return;
    setSubtasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: suggestion.title, completed: false },
    ]);
  };

  // AI actions require a persisted task. If one doesn't exist yet, create
  // a draft first so the AI endpoints (which operate on a taskId) have
  // something to act on.
  const ensureSavedTask = async (): Promise<string | null> => {
    if (savedTaskId) return savedTaskId;
    const result = await dispatch(saveDraft(buildPayload("draft")));
    if (saveDraft.fulfilled.match(result)) {
      setSavedTaskId(result.payload._id);
      return result.payload._id;
    }
    return null;
  };

  const handleGenerateSubtasks = async () => {
    const taskId = await ensureSavedTask();
    if (!taskId) return;
    const result = await dispatch(generateSubtasks(taskId));
    if (generateSubtasks.fulfilled.match(result)) {
      const generated = result.payload.subtasks.map((s) => ({
        id: crypto.randomUUID(),
        title: s.title,
        completed: false,
      }));
      setSubtasks((prev) => [...prev, ...generated]);
    }
  };

  const handleOptimizeSchedule = async () => {
    const taskId = await ensureSavedTask();
    if (!taskId) return;
    const result = await dispatch(optimizeSchedule(taskId));
    if (optimizeSchedule.fulfilled.match(result)) {
      setStartTime(result.payload.recommendedStartTime || startTime);
      setEndTime(result.payload.recommendedEndTime || endTime);
      setEstimatedDuration(result.payload.estimatedDuration || estimatedDuration);
    }
  };

  const handleGenerateSuggestions = async () => {
    const taskId = await ensureSavedTask();
    if (!taskId) return;
    await dispatch(generateTaskSuggestions(taskId));
  };

  return (
    <AppShell
      pageTitle="Add Task"
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
              <h1 className="text-3xl font-bold text-white mb-2">Add New Task</h1>
              <p className="text-slate-400">
                Plan your work, organize your day, and let Nova help you stay on track.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SecondaryButton icon={<Save className="h-4 w-4" />} onClick={handleSaveDraft}>
                {savingDraft ? "Saving..." : "Save Draft"}
              </SecondaryButton>
              <SecondaryButton icon={<X className="h-4 w-4" />} onClick={handleCancel}>
                Discard
              </SecondaryButton>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </PageSection>

        <ContentGrid columns={3} gap="lg">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <TaskDetailsCard
              title={title}
              description={description}
              category={category}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onCategoryChange={setCategory}
            />

            <TaskScheduleCard
              dueDate={dueDate}
              startTime={startTime}
              endTime={endTime}
              estimatedDuration={estimatedDuration}
              timeZone={timeZone}
              onDueDateChange={setDueDate}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
              onEstimatedDurationChange={setEstimatedDuration}
              onTimeZoneChange={setTimeZone}
            />

            <ContentGrid columns={2} gap="lg">
              <TaskPrioritySelector priority={priority} onPriorityChange={setPriority} />
              <ReminderSelector
                reminder={reminder}
                onReminderChange={setReminder}
                customReminder={customReminder}
                onCustomReminderChange={setCustomReminder}
              />
            </ContentGrid>

            <RepeatSelector repeat={repeat} onRepeatChange={setRepeat} />

            <SubtaskList subtasks={subtasks} onSubtasksChange={setSubtasks} />

            <TagInput tags={tags} onTagsChange={setTags} />
          </div>

          {/* Right Column - AI Assistant & Preview */}
          <div className="space-y-6">
            <AITaskAssistant
              taskTitle={title}
              suggestions={ai.lastSuggestionsResult?.suggestions}
              isGeneratingSubtasks={ai.subtasksLoading}
              isOptimizingSchedule={ai.scheduleLoading}
              isGeneratingSuggestions={ai.suggestionsLoading}
              aiError={ai.error}
              onApplySuggestion={handleApplySuggestion}
              onGenerateSubtasks={handleGenerateSubtasks}
              onOptimizeSchedule={handleOptimizeSchedule}
              onGenerateSuggestions={handleGenerateSuggestions}
            />

            <TaskPreviewCard
              title={title}
              description={description}
              category={category}
              priority={priority}
              dueDate={dueDate}
              startTime={startTime}
              subtasks={subtasks}
              tags={tags}
            />
          </div>
        </ContentGrid>

        {/* Action Bar */}
        <TaskActionBar
          onCreateTask={handleCreateTask}
          onSaveDraft={handleSaveDraft}
          onCancel={handleCancel}
          isCreating={creating}
          isSaving={savingDraft}
        />
      </PageContainer>
    </AppShell>
  );
}