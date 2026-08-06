/**
 * goal.model.ts
 * ---------------------------------------------------------------------------
 * Mongoose model backing the Goals feature shown in GoalsPage.tsx /
 * goalSlice.ts. Field names and enums are matched 1:1 to what the frontend
 * already reads/writes so the REST layer needs no field-mapping shims:
 *
 *   - category:  "career" | "learning" | "fitness" | "finance" | "travel" | "personal"
 *   - priority:  "urgent" | "high" | "medium" | "low"
 *   - status:    "not_started" | "in_progress" | "completed" | "archived"
 *   - milestones[]: { id, title, completed, dueDate, completedAt? }
 *   - tags: string[]
 *   - favorite, color, icon, progress, deadline, description, title
 *
 * NOTE on `id`: the frontend's Goal.id (mock data uses "1", "2", ...) maps
 * to Mongo's `_id` once this is wired to the API — serialize with
 * `goal._id.toString()` as `id` in your response layer (see toGoalDTO()
 * below), rather than storing a redundant custom id field.
 * ---------------------------------------------------------------------------
 */

import { Schema, model, Document, Types, Model } from "mongoose";

/* ============================================================================
 * Milestone subdocument
 * ==========================================================================*/

export interface IMilestone {
  id: string; // UI-facing id (e.g. "m1") — kept as a plain string, not an ObjectId,
              // because the frontend addresses milestones by this value directly.
  title: string;
  completed: boolean;
  dueDate: string; // ISO date (yyyy-mm-dd), stored as string to match frontend usage
  completedAt?: string;
}

const milestoneSchema = new Schema<IMilestone>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, required: true, default: false },
    dueDate: { type: String, required: true },
    completedAt: { type: String },
  },
  { _id: false }
);

/* ============================================================================
 * Goal document
 * ==========================================================================*/

export type GoalCategory =
  | "career"
  | "learning"
  | "fitness"
  | "finance"
  | "travel"
  | "personal";

export type GoalPriority = "urgent" | "high" | "medium" | "low";

export type GoalStatus = "not_started" | "in_progress" | "completed" | "archived";

export interface IGoal extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number; // 0-100
  deadline: string; // ISO date, string to match frontend's date-input/Date.parse usage
  favorite: boolean;
  color: string; // tailwind class, e.g. "bg-indigo-500/20"
  icon: string; // emoji, e.g. "🚀"
  milestones: IMilestone[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const goalSchema = new Schema<IGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "", maxlength: 2000 },
    category: {
      type: String,
      required: true,
      enum: ["career", "learning", "fitness", "finance", "travel", "personal"],
    },
    priority: {
      type: String,
      required: true,
      enum: ["urgent", "high", "medium", "low"],
      default: "medium",
    },
    status: {
      type: String,
      required: true,
      enum: ["not_started", "in_progress", "completed", "archived"],
      default: "not_started",
      index: true,
    },
    progress: { type: Number, required: true, min: 0, max: 100, default: 0 },
    deadline: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    color: { type: String, default: "bg-indigo-500/20" },
    icon: { type: String, default: "🎯" },
    milestones: { type: [milestoneSchema], default: [] },
    tags: { type: [String], default: [] },
  },
  {
    // Mongoose will manage createdAt/updatedAt as real Dates internally;
    // toGoalDTO() below formats them back to yyyy-mm-dd strings for the
    // frontend, matching the mock data's format exactly.
    timestamps: true,
  }
);

goalSchema.index({ userId: 1, status: 1, deadline: 1 });

export const GoalModel: Model<IGoal> =
  (global as any).__NovaGoalModel__ ||
  model<IGoal>("Goal", goalSchema);

// Prevents OverwriteModelError on hot-reload in dev.
if (process.env.NODE_ENV !== "production") {
  (global as any).__NovaGoalModel__ = GoalModel;
}

/* ============================================================================
 * DTO mapper — shapes a Mongo document exactly like the frontend's Goal type
 * ==========================================================================*/

export interface GoalDTO {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number;
  deadline: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  color: string;
  icon: string;
  milestones: IMilestone[];
  tags: string[];
}

export function toGoalDTO(goal: IGoal): GoalDTO {
  return {
    id: goal._id.toString(),
    title: goal.title,
    description: goal.description,
    category: goal.category,
    priority: goal.priority,
    status: goal.status,
    progress: goal.progress,
    deadline: goal.deadline,
    favorite: goal.favorite,
    createdAt: new Date(goal.createdAt).toISOString().split("T")[0],
    updatedAt: new Date(goal.updatedAt).toISOString().split("T")[0],
    color: goal.color,
    icon: goal.icon,
    milestones: goal.milestones,
    tags: goal.tags,
  };
}