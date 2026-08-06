import { Request, Response } from "express";
import Groq from "groq-sdk";
import { Types } from "mongoose";
import { ENV } from "../config/env";
import { resolveUserId } from "../middleware/auth";
import { GoalModel, GoalCategory, GoalPriority, GoalStatus, toGoalDTO, IMilestone } from "../model/goal";

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
 * Trains Groq to behave as Nova's personal goal coach — not a chatbot.
 * =====================================================================
 */
const NOVA_GOAL_COACH_INSTRUCTION = `
You are Nova Goal Intelligence.

Nova is an AI Daily Operating System.

You are NOT ChatGPT.
You are NOT a chatbot.
You are NOT an assistant that simply answers questions.

You are a Goal Intelligence Engine.

Your responsibility is to convert human ambitions into realistic execution systems.

==========================================================
CORE IDENTITY
==========================================================

Your thinking combines the mindset of:

• Executive Coach
• Senior Project Manager
• Product Manager
• Startup Founder
• Career Mentor
• Productivity Scientist
• Habit Coach
• Systems Thinker

Your advice must always prioritize execution over inspiration.

Never generate motivational filler.

Every recommendation must be actionable.

==========================================================
PRIMARY OBJECTIVES
==========================================================

For every goal you must:

1. Understand the real objective.

2. Detect hidden assumptions.

3. Detect missing requirements.

4. Estimate execution complexity.

5. Estimate required learning.

6. Evaluate deadline realism.

7. Detect priority conflicts.

8. Detect resource limitations.

9. Detect skill gaps.

10. Build the smallest executable plan.

==========================================================
THINKING FRAMEWORK
==========================================================

Always think in this order.

STEP 1

Understand

What is the user actually trying to achieve?

What does success look like?

What outcome matters?

Never confuse tasks with goals.

==========================================================

STEP 2

Analyze

Determine

Difficulty

Time commitment

Knowledge required

External dependencies

Risk level

Probability of success

==========================================================

STEP 3

Evaluate

Ask yourself

Can this realistically be completed before the deadline?

If not

Suggest a better deadline.

Explain why.

==========================================================

STEP 4

Decompose

Break the goal into

Phases

↓

Milestones

↓

Tasks

↓

Daily Actions

Every milestone should move the user measurably closer to success.

==========================================================

STEP 5

Optimize

Always minimize

Context switching

Decision fatigue

Burnout

Overplanning

Always maximize

Consistency

Momentum

Deep work

Learning

==========================================================
GOAL CATEGORY KNOWLEDGE
==========================================================

Career

Focus on

Career growth

Portfolio

Promotion

Interview preparation

Networking

Professional branding

Leadership

==========================================================

Learning

Focus on

Skill acquisition

Projects

Practice

Revision

Knowledge retention

==========================================================

Fitness

Focus on

Exercise

Recovery

Nutrition

Sleep

Habit consistency

==========================================================

Finance

Focus on

Savings

Emergency fund

Investments

Debt reduction

Cash flow

==========================================================

Travel

Focus on

Preparation

Budget

Documents

Research

Timeline

==========================================================

Personal

Focus on

Relationships

Mental wellbeing

Lifestyle

Self improvement

==========================================================
PLANNING PRINCIPLES
==========================================================

Good plans are

Specific

Measurable

Achievable

Relevant

Time-bound

Every milestone must have

Title

Description

Due Date

Priority

Estimated effort

==========================================================
DAILY ACTION PRINCIPLES
==========================================================

Daily actions should

Require less than two hours

Be immediately executable

Avoid vague wording

Never say

"Work on project"

Instead say

"Implement authentication API"

or

"Complete React Login Screen"

==========================================================
COACHING PRINCIPLES
==========================================================

Do not praise users unnecessarily.

Do not exaggerate.

Challenge unrealistic expectations.

When necessary

recommend delaying deadlines.

Always explain your reasoning.

Support every recommendation with evidence from the goal.

==========================================================
RISK ANALYSIS
==========================================================

Always identify

Technical risks

Time risks

Motivation risks

Resource risks

Knowledge risks

Priority conflicts

Every risk must include

Severity

Impact

Mitigation

==========================================================
EXECUTION STRATEGY
==========================================================

Recommend

Execution order

Weekly priorities

Learning order

Critical path

Buffer time

Review cadence

==========================================================
STRICT OUTPUT
==========================================================

Return ONLY valid JSON.

No markdown.

No explanations.

No code blocks.

No comments.

No trailing commas.

The response MUST exactly follow this schema.

{
  "analysis": {
    "summary": "",
    "complexity": "low|medium|high",
    "successProbability": 0,
    "goalHealth": "excellent|good|warning|critical"
  },

  "deadlineFeasibility": {
    "feasible": true,
    "assessment": "",
    "recommendedDeadline": ""
  },

  "milestones": [],

  "weeklyPlan": [],

  "dailyActions": [],

  "coachingInsights": [],

  "executionStrategy": "",

  "risks": [],

  "strengths": [],

  "coachMessage": ""
}

Never invent information that was not provided.

If information is missing

state assumptions clearly inside analysis.

Your purpose is to maximize the user's probability of achieving the goal.

Always optimize for execution, consistency and long-term success.
`.trim();

/**
 * =====================================================================
 * TYPES
 * =====================================================================
 */
interface GoalContext {
  id?: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number;
  deadline: string;
  milestones: IMilestone[];
  tags: string[];
}

interface GoalPlanResult {
  analysis: string;
  deadlineFeasibility: {
    feasible: boolean;
    assessment: string;
    recommendedDeadline?: string;
  };
  milestones: { id: string; title: string; dueDate: string; description?: string }[];
  weeklyPlan: { week: number; focus: string; tasks: string[] }[];
  dailyActions: { day: string; actions: string[] }[];
  coachingInsights: string[];
  executionStrategy: string;
  risks: { title: string; severity: "low" | "medium" | "high"; mitigation: string }[];
  strengths: string[];
  coachMessage: string;
}

interface StandardResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
}

const GOAL_PLAN_JSON_SHAPE = `{
  "analysis": "",
  "deadlineFeasibility": { "feasible": true, "assessment": "", "recommendedDeadline": "" },
  "milestones": [{ "id": "m1", "title": "", "dueDate": "yyyy-mm-dd", "description": "" }],
  "weeklyPlan": [{ "week": 1, "focus": "", "tasks": [""] }],
  "dailyActions": [{ "day": "Monday", "actions": [""] }],
  "coachingInsights": [""],
  "executionStrategy": "",
  "risks": [{ "title": "", "severity": "low", "mitigation": "" }],
  "strengths": [""],
  "coachMessage": ""
}`;

/**
 * =====================================================================
 * PRIVATE HELPERS
 * =====================================================================
 */

async function generateGroqResponse(userPrompt: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: NOVA_GOAL_COACH_INSTRUCTION },
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

function safeParseGroqJson<T = unknown>(raw: string): T {
  let cleaned = raw.trim();
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]) as T;
      } catch {
        throw new Error("Failed to parse Groq response as JSON");
      }
    }
    throw new Error("Failed to parse Groq response as JSON");
  }
}

function respond<T>(res: Response, status: number, success: boolean, message: string, data: T | null = null) {
  const payload: StandardResponse<T> = { success, message, data };
  return res.status(status).json(payload);
}

function isValidGoalCategory(value: unknown): value is GoalCategory {
  return ["career", "learning", "fitness", "finance", "travel", "personal"].includes(value as string);
}

function isValidGoalPriority(value: unknown): value is GoalPriority {
  return ["urgent", "high", "medium", "low"].includes(value as string);
}

function validateGoalContext(input: unknown): { valid: boolean; errors: string[]; context?: GoalContext } {
  const errors: string[] = [];
  if (!input || typeof input !== "object") {
    return { valid: false, errors: ["Goal context is required"] };
  }

  const g = input as Record<string, unknown>;

  if (!g.title || typeof g.title !== "string" || !g.title.trim()) {
    errors.push("title is required");
  }
  if (!g.deadline || typeof g.deadline !== "string") {
    errors.push("deadline is required");
  }
  if (g.category !== undefined && !isValidGoalCategory(g.category)) {
    errors.push("category must be one of: career, learning, fitness, finance, travel, personal");
  }
  if (g.priority !== undefined && !isValidGoalPriority(g.priority)) {
    errors.push("priority must be one of: urgent, high, medium, low");
  }
  if (g.progress !== undefined && (typeof g.progress !== "number" || g.progress < 0 || g.progress > 100)) {
    errors.push("progress must be a number between 0 and 100");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    context: {
      id: typeof g.id === "string" ? g.id : undefined,
      title: (g.title as string).trim(),
      description: typeof g.description === "string" ? g.description : "",
      category: (g.category as GoalCategory) || "personal",
      priority: (g.priority as GoalPriority) || "medium",
      status: (g.status as GoalStatus) || "not_started",
      progress: typeof g.progress === "number" ? g.progress : 0,
      deadline: g.deadline as string,
      milestones: Array.isArray(g.milestones) ? (g.milestones as IMilestone[]) : [],
      tags: Array.isArray(g.tags) ? (g.tags as string[]) : [],
    },
  };
}

function validateGoalPlan(parsed: unknown): { valid: boolean; errors: string[]; plan?: GoalPlanResult } {
  const errors: string[] = [];
  if (!parsed || typeof parsed !== "object") {
    return { valid: false, errors: ["AI response was not a valid object"] };
  }

  const p = parsed as Record<string, unknown>;

  if (!p.analysis || typeof p.analysis !== "string") errors.push("analysis is required");
  if (!p.coachMessage || typeof p.coachMessage !== "string") errors.push("coachMessage is required");
  if (!p.executionStrategy || typeof p.executionStrategy !== "string") errors.push("executionStrategy is required");
  if (!Array.isArray(p.milestones)) errors.push("milestones must be an array");
  if (!Array.isArray(p.dailyActions)) errors.push("dailyActions must be an array");
  if (!Array.isArray(p.risks)) errors.push("risks must be an array");
  if (!Array.isArray(p.strengths)) errors.push("strengths must be an array");
  if (!Array.isArray(p.coachingInsights)) errors.push("coachingInsights must be an array");
  if (!Array.isArray(p.weeklyPlan)) errors.push("weeklyPlan must be an array");

  const df = p.deadlineFeasibility as Record<string, unknown> | undefined;
  if (!df || typeof df.feasible !== "boolean" || typeof df.assessment !== "string") {
    errors.push("deadlineFeasibility must include feasible (boolean) and assessment (string)");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: [], plan: parsed as GoalPlanResult };
}

function buildGoalPrompt(context: GoalContext): string {
  const daysRemaining = Math.ceil(
    (new Date(context.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const completedMilestones = context.milestones.filter((m) => m.completed).length;

  return `
Analyze this goal and create a comprehensive execution plan as a personal goal coach.

=== GOAL CONTEXT ===
Current Date: ${new Date().toISOString().split("T")[0]}
Title: ${context.title}
Description: ${context.description || "No description provided"}
Category: ${context.category}
Priority: ${context.priority}
Status: ${context.status}
Progress: ${context.progress}%
Deadline: ${context.deadline}
Days Remaining: ${isNaN(daysRemaining) ? "unknown" : daysRemaining}
Tags: ${context.tags.join(", ") || "none"}
Existing Milestones (${completedMilestones}/${context.milestones.length} completed):
${
  context.milestones.length
    ? context.milestones
        .map((m) => `- [${m.completed ? "x" : " "}] ${m.title} (due: ${m.dueDate})`)
        .join("\n")
    : "  none"
}

=== INSTRUCTIONS ===
1. Analyze the goal — what it requires, what's missing, and the path to success.
2. Evaluate deadline feasibility honestly given progress and scope.
3. Generate 3-7 milestones with realistic due dates before the deadline.
4. Create a weekly plan covering the remaining timeline.
5. Define daily actions for the next 7 days (use weekday names).
6. Identify 2-4 risks with severity and mitigation.
7. Identify 2-4 strengths the user can leverage.
8. Provide 3-5 coaching insights (specific, not generic).
9. Write an execution strategy paragraph.
10. Write a coach message — direct, motivating, personal to this goal.

Respond ONLY with JSON in this exact shape:
${GOAL_PLAN_JSON_SHAPE}
`.trim();
}

async function resolveGoalContext(
  goalId: string | undefined,
  userId: string,
  bodyGoal: unknown
): Promise<GoalContext | null> {
  if (goalId && Types.ObjectId.isValid(goalId)) {
    const dbGoal = await GoalModel.findOne({ _id: goalId, userId });
    if (dbGoal) {
      const dto = toGoalDTO(dbGoal);
      return {
        id: dto.id,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        priority: dto.priority,
        status: dto.status,
        progress: dto.progress,
        deadline: dto.deadline,
        milestones: dto.milestones,
        tags: dto.tags,
      };
    }
  }

  const validation = validateGoalContext(bodyGoal);
  return validation.valid ? validation.context! : null;
}

/**
 * =====================================================================
 * AI CONTROLLER
 * =====================================================================
 */

/** POST /plan — AI goal planner (accepts goal in body) */
export async function planGoal(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req) as string;
    if (!userId) return respond(res, 401, false, "Unauthorized");

    const validation = validateGoalContext(req.body);
    if (!validation.valid) {
      return respond(res, 400, false, `Invalid goal data: ${validation.errors.join(", ")}`);
    }

    const context = validation.context!;
    const prompt = buildGoalPrompt(context);
    const raw = await generateGroqResponse(prompt);

    let parsed: unknown;
    try {
      parsed = safeParseGroqJson(raw);
    } catch {
      return respond(res, 502, false, "AI returned an invalid response. Please try again.");
    }

    const planValidation = validateGoalPlan(parsed);
    if (!planValidation.valid) {
      return respond(res, 502, false, `AI response validation failed: ${planValidation.errors.join(", ")}`);
    }

    const plan = planValidation.plan!;

    // Persist suggested milestones if goal exists in DB
    if (context.id && Types.ObjectId.isValid(context.id)) {
      const dbGoal = await GoalModel.findOne({ _id: context.id, userId });
      if (dbGoal && plan.milestones.length > 0) {
        dbGoal.milestones = plan.milestones.map((m) => ({
          id: m.id,
          title: m.title,
          completed: false,
          dueDate: m.dueDate,
        }));
        await dbGoal.save();
      }
    }

    return respond(res, 200, true, "Goal plan generated successfully", plan);
  } catch (error) {
    console.error("planGoal error:", error);
    return respond(res, 500, false, "Failed to generate goal plan");
  }
}

/** POST /:goalId/plan — AI goal planner by ID (falls back to body.goal) */
export async function planGoalById(req: Request, res: Response) {
  try {
    const userId = resolveUserId(req) as string;
    if (!userId) return respond(res, 401, false, "Unauthorized");

    const { goalId } = req.params;
    //@ts-ignore
    const context = await resolveGoalContext(goalId, userId, req.body.goal || req.body);

    if (!context) {
      return respond(res, 400, false, "Goal not found and no valid goal context provided");
    }

    const prompt = buildGoalPrompt(context);
    const raw = await generateGroqResponse(prompt);

    let parsed: unknown;
    try {
      parsed = safeParseGroqJson(raw);
    } catch {
      return respond(res, 502, false, "AI returned an invalid response. Please try again.");
    }

    const planValidation = validateGoalPlan(parsed);
    if (!planValidation.valid) {
      return respond(res, 502, false, `AI response validation failed: ${planValidation.errors.join(", ")}`);
    }

    const plan = planValidation.plan!;
    //@ts-ignore

    if (Types.ObjectId.isValid(goalId)) {
      const dbGoal = await GoalModel.findOne({ _id: goalId, userId });
      if (dbGoal && plan.milestones.length > 0) {
        dbGoal.milestones = plan.milestones.map((m) => ({
          id: m.id,
          title: m.title,
          completed: false,
          dueDate: m.dueDate,
        }));
        await dbGoal.save();
      }
    }

    return respond(res, 200, true, "Goal plan generated successfully", plan);
  } catch (error) {
    console.error("planGoalById error:", error);
    return respond(res, 500, false, "Failed to generate goal plan");
  }
}
