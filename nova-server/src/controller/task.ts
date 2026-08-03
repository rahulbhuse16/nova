import { Request, Response } from "express";
import Groq from "groq-sdk";
import TaskModel, { ITask } from "../model/task";
import { ENV } from "../config/env";
import { resolveUserId } from "../middleware/auth";
import { StringExpression, StringExpressionOperator } from "mongoose";

/**
 * =====================================================================
 * GROQ CLIENT SETUP
 * =====================================================================
 */
const groq = new Groq({ apiKey: ENV.GROQ_API_KEY as string });
const GROQ_MODEL = "llama-3.3-70b-versatile";

/**
 * =====================================================================
 * SYSTEM INSTRUCTION
 * Trains Groq (Llama) to behave as Nova's intelligent task planner.
 * Nova is NOT a chatbot — it is an AI Daily Operating System.
 * =====================================================================
 */
const NOVA_SYSTEM_INSTRUCTION = `
You are Nova, an AI Daily Operating System — not a chatbot.

Your responsibility is to act as an intelligent task planner that helps users
run their day efficiently. You must:

- Plan tasks realistically based on the information provided.
- Break down complex work into small, actionable subtasks.
- Estimate effort and duration honestly, never optimistically.
- Optimize schedules around existing commitments and energy levels.
- Reduce overload by flagging when a plan is unrealistic.
- Respect stated priorities and deadlines above all else.
- Encourage productivity with practical, achievable guidance.
- Never suggest vague or generic advice — always be specific to the task given.

STRICT OUTPUT RULES:
- You must return structured JSON ONLY.
- Never return Markdown.
- Never wrap the JSON inside code blocks (no \`\`\`).
- Never include explanations, reasoning, or commentary outside the JSON object.
- The JSON must be syntactically valid and parseable with JSON.parse().

Tone: professional, helpful, action-oriented, clear, and practical.
`.trim();

/**
 * =====================================================================
 * TYPES
 * =====================================================================
 */
interface AiContext {
  currentTask: {
    title: string;
    description: string;
    priority: string;
    category: string;
    dueDate: string;
    startTime: string;
    estimatedDuration: string;
    subtasks: { title: string; description?: string; completed?: boolean }[];
    tags: string[];
  };
  currentDate: string;
  timezone: string;
  // Placeholders — to be wired up to real data sources later.
  existingTasks: unknown[];
  currentGoals: unknown[];
  todaysCalendar: unknown[];
  userPreferences: Record<string, unknown>;
  productivityPreferences: Record<string, unknown>;
}

interface StandardResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

/**
 * =====================================================================
 * PRIVATE HELPERS
 * (Kept inside the controller per project constraints — no service files)
 * =====================================================================
 */

/**
 * Sends a prompt to Groq using the Nova system instruction and returns
 * the raw text response. Centralizes all Groq SDK usage so every AI
 * feature in this controller calls through one place.
 */
async function generateGroqResponse(userPrompt: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: NOVA_SYSTEM_INSTRUCTION },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.4,
    response_format: { type: "json_object" },
  });

  const text = response.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Groq returned an empty response");
  }
  return text;
}

/**
 * Robustly parses JSON returned by Groq. Even though we request
 * json_object response_format, we defensively strip code fences
 * and locate the first valid JSON object/array in case the model
 * misbehaves.
 */
function safeParseGroqJson<T = unknown>(raw: string): T {
  let cleaned = raw.trim();

  // Strip markdown code fences if Groq added them despite instructions.
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Fallback: try to extract the first {...} or [...] block.
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    const candidate = objectMatch?.[0] || arrayMatch?.[0];

    if (candidate) {
      try {
        return JSON.parse(candidate) as T;
      } catch {
        throw new Error("Failed to parse Groq response as JSON");
      }
    }
    throw new Error("Failed to parse Groq response as JSON");
  }
}

/**
 * Builds the rich AI context object from a task document plus
 * (currently placeholder) surrounding user context.
 */
function buildAiContext(task: ITask): AiContext {
  return {
    currentTask: {
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      category: task.category || "general",
      dueDate: task.dueDate ? task.dueDate.toISOString() : "",
      startTime: task.startTime || "",
      estimatedDuration: task.estimatedDuration || "",
      subtasks: (task.subtasks || []).map((s) => ({
        title: s.title,
        description: s.description,
        completed: s.completed,
      })),
      tags: task.tags || [],
    },
    currentDate: new Date().toISOString(),
    timezone: task.timezone || "UTC",
    // Placeholders — intended to be populated from other collections/services later.
    existingTasks: [],
    currentGoals: [],
    todaysCalendar: [],
    userPreferences: {},
    productivityPreferences: {},
  };
}

/**
 * Converts the AI context object into a readable natural-language prompt
 * that Groq can reason over.
 */
function buildPromptFromContext(context: AiContext, instruction: string): string {
  return `
${instruction}

=== CONTEXT ===

Current Date: ${context.currentDate}
Timezone: ${context.timezone}

Current Task:
- Title: ${context.currentTask.title}
- Description: ${context.currentTask.description}
- Priority: ${context.currentTask.priority}
- Category: ${context.currentTask.category}
- Due Date: ${context.currentTask.dueDate}
- Start Time: ${context.currentTask.startTime}
- Estimated Duration: ${context.currentTask.estimatedDuration}
- Tags: ${context.currentTask.tags.join(", ") || "none"}
- Existing Subtasks: ${
    context.currentTask.subtasks.length
      ? context.currentTask.subtasks.map((s) => `"${s.title}"`).join(", ")
      : "none"
  }

Existing Tasks: ${JSON.stringify(context.existingTasks)}
Current Goals: ${JSON.stringify(context.currentGoals)}
Today's Calendar: ${JSON.stringify(context.todaysCalendar)}
User Preferences: ${JSON.stringify(context.userPreferences)}
Productivity Preferences: ${JSON.stringify(context.productivityPreferences)}
`.trim();
}

/** Sends a consistent { success, message, data } response shape. */
function respond<T>(res: Response, status: number, success: boolean, message: string, data: T | null = null) {
  const payload: StandardResponse<T> = { success, message, data };
  return res.status(status).json(payload);
}

/**
 * =====================================================================
 * CRUD CONTROLLERS
 * =====================================================================
 */

/** POST / — create a new task */
export async function createTask(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req);
    if (!userId) return respond(res, 401, false, "Unauthorized");

    const task = await TaskModel.create({
      ...req.body,
      user: userId,
      status: req.body.status || "pending",
    });

    return respond(res, 201, true, "Task created successfully", task);
  } catch (error) {
    console.error("createTask error:", error);
    return respond(res, 500, false, "Failed to create task");
  }
}

/** PATCH /:taskId — update an existing task */
export async function updateTask(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req) as string;
    const { taskId } = req.params;
    if (!userId) return respond(res, 401, false, "Unauthorized");

    const task = await TaskModel.findOneAndUpdate(
      { _id: taskId, user: userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) return respond(res, 404, false, "Task not found");

    return respond(res, 200, true, "Task updated successfully", task);
  } catch (error) {
    console.error("updateTask error:", error);
    return respond(res, 500, false, "Failed to update task");
  }
}

/** GET / — list tasks for the authenticated user */
export async function getTasks(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req);
    if (!userId) return respond(res, 401, false, "Unauthorized");

    const { status, priority, category, completed } = req.query;

    const filter: Record<string, unknown> = { user: userId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (completed !== undefined) filter.completed = completed === "true";

    const tasks = await TaskModel.find(filter).sort({ dueDate: 1, createdAt: -1 });

    return respond(res, 200, true, "Tasks fetched successfully", tasks);
  } catch (error) {
    console.error("getTasks error:", error);
    return respond(res, 500, false, "Failed to fetch tasks");
  }
}

/** GET /:taskId — fetch a single task */
export async function getTask(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req) as string;
    const { taskId } = req.params;
    if (!userId) return respond(res, 401, false, "Unauthorized");

    const task = await TaskModel.findOne({ _id: taskId, user: userId });
    if (!task) return respond(res, 404, false, "Task not found");

    return respond(res, 200, true, "Task fetched successfully", task);
  } catch (error) {
    console.error("getTask error:", error);
    return respond(res, 500, false, "Failed to fetch task");
  }
}

/** DELETE /:taskId — delete a task */
export async function deleteTask(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req) as string;
    const { taskId } = req.params;
    if (!userId) return respond(res, 401, false, "Unauthorized");

    const task = await TaskModel.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) return respond(res, 404, false, "Task not found");

    return respond(res, 200, true, "Task deleted successfully", { _id: taskId });
  } catch (error) {
    console.error("deleteTask error:", error);
    return respond(res, 500, false, "Failed to delete task");
  }
}

/** POST /draft — save a task as a draft */
export async function saveDraft(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req) as string;
    if (!userId) return respond(res, 401, false, "Unauthorized");

    const draft = await TaskModel.create({
      ...req.body,
      user: userId,
      status: "draft",
    });

    return respond(res, 201, true, "Draft saved successfully", draft);
  } catch (error) {
    console.error("saveDraft error:", error);
    return respond(res, 500, false, "Failed to save draft");
  }
}

/** PATCH /:taskId/toggle — toggle task completion */
export async function toggleCompletion(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req) as string;

    const { taskId } = req.params;
    if (!userId) return respond(res, 401, false, "Unauthorized");

    const task = await TaskModel.findOne({ _id: taskId, user: userId });
    if (!task) return respond(res, 404, false, "Task not found");

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : undefined;
    task.status = task.completed ? "completed" : "pending";
    await task.save();

    return respond(res, 200, true, "Task completion toggled", task);
  } catch (error) {
    console.error("toggleCompletion error:", error);
    return respond(res, 500, false, "Failed to toggle task completion");
  }
}

/**
 * =====================================================================
 * AI CONTROLLERS
 * =====================================================================
 */

/** POST /:taskId/generate-subtasks — AI-generated subtask breakdown */
export async function generateSubtasks(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req) as string;

    const { taskId } = req.params;
    if (!userId) return respond(res, 401, false, "Unauthorized");

    const task = await TaskModel.findOne({ _id: taskId, user: userId });
    if (!task) return respond(res, 404, false, "Task not found");

    const context = buildAiContext(task);
    const prompt = buildPromptFromContext(
      context,
      `Break this task down into realistic, actionable subtasks. Respond ONLY with JSON in this exact shape:
{"subtasks":[{"title":"","description":""}]}`
    );

    const raw = await generateGroqResponse(prompt);

    let parsed: { subtasks?: { title: string; description?: string }[] };
    try {
      parsed = safeParseGroqJson(raw);
    } catch {
      return respond(res, 502, false, "AI returned an invalid response. Please try again.");
    }

    if (!parsed.subtasks || !Array.isArray(parsed.subtasks)) {
      return respond(res, 502, false, "AI response did not contain valid subtasks.");
    }

    // Persist generated subtasks onto the task.
    task.subtasks.push(
      ...parsed.subtasks.map((s) => ({
        title: s.title,
        description: s.description || "",
        completed: false,
      }))
    );
    await task.save();

    return respond(res, 200, true, "Subtasks generated successfully", {
      subtasks: parsed.subtasks,
      task,
    });
  } catch (error) {
    console.error("generateSubtasks error:", error);
    return respond(res, 500, false, "Failed to generate subtasks");
  }
}

/** POST /:taskId/optimize-schedule — AI-recommended schedule */
export async function optimizeSchedule(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req) as string;

    const { taskId } = req.params;
    if (!userId) return respond(res, 401, false, "Unauthorized");

    const task = await TaskModel.findOne({ _id: taskId, user: userId });
    if (!task) return respond(res, 404, false, "Task not found");

    const context = buildAiContext(task);
    const prompt = buildPromptFromContext(
      context,
      `Recommend the optimal start/end time for this task given its priority, due date, and estimated duration.
Respond ONLY with JSON in this exact shape:
{"recommendedStartTime":"","recommendedEndTime":"","estimatedDuration":"","reason":""}`
    );

    const raw = await generateGroqResponse(prompt);

    let parsed: {
      recommendedStartTime?: string;
      recommendedEndTime?: string;
      estimatedDuration?: string;
      reason?: string;
    };
    try {
      parsed = safeParseGroqJson(raw);
    } catch {
      return respond(res, 502, false, "AI returned an invalid response. Please try again.");
    }

    // Persist the optimized schedule onto the task.
    task.startTime = parsed.recommendedStartTime || task.startTime;
    task.endTime = parsed.recommendedEndTime || task.endTime;
    task.estimatedDuration = parsed.estimatedDuration || task.estimatedDuration;
    task.aiOptimized = true;
    await task.save();

    return respond(res, 200, true, "Schedule optimized successfully", {
      ...parsed,
      task,
    });
  } catch (error) {
    console.error("optimizeSchedule error:", error);
    return respond(res, 500, false, "Failed to optimize schedule");
  }
}

/** POST /:taskId/generate-suggestions — AI summary, priority & suggestions */
export async function generateTaskSuggestions(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req) as string;
    const { taskId } = req.params;
    if (!userId) return respond(res, 401, false, "Unauthorized");

    const task = await TaskModel.findOne({ _id: taskId, user: userId });
    if (!task) return respond(res, 404, false, "Task not found");

    const context = buildAiContext(task);
    const prompt = buildPromptFromContext(
      context,
      `Analyze this task and provide a summary, a recommended priority, an estimated hours figure,
and actionable suggestions to help the user complete it effectively.
Respond ONLY with JSON in this exact shape:
{"summary":"","priority":"","estimatedHours":2,"suggestions":[{"title":"","description":"","confidence":0.95}]}`
    );

    const raw = await generateGroqResponse(prompt);

    let parsed: {
      summary?: string;
      priority?: string;
      estimatedHours?: number;
      suggestions?: { title: string; description: string; confidence: number }[];
    };
    try {
      parsed = safeParseGroqJson(raw);
    } catch {
      return respond(res, 502, false, "AI returned an invalid response. Please try again.");
    }

    // Persist AI summary/suggestions onto the task.
    task.aiSummary = parsed.summary || task.aiSummary;
    task.aiSuggestions = parsed as unknown as Record<string, unknown>;
    await task.save();

    return respond(res, 200, true, "Task suggestions generated successfully", {
      ...parsed,
      task,
    });
  } catch (error) {
    console.error("generateTaskSuggestions error:", error);
    return respond(res, 500, false, "Failed to generate task suggestions");
  }
}