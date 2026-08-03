import { Schema, model, Document, Types } from "mongoose";

/**
 * Subtask sub-document interface
 */
export interface ISubtask {
  title: string;
  description?: string;
  completed: boolean;
}

/**
 * Task document interface
 */
export interface ITask extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  category?: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "draft" | "pending" | "in-progress" | "completed" | "cancelled";
  dueDate?: Date;
  startTime?: string;
  endTime?: string;
  estimatedDuration?: string;
  timezone?: string;
  repeat?: "never" | "daily" | "weekly" | "monthly" | "yearly";
  reminder?: string;
  customReminder?: string;
  subtasks: ISubtask[];
  tags: string[];
  completed: boolean;
  completedAt?: Date;
  aiSummary?: string;
  aiSuggestions?: Record<string, unknown>;
  aiOptimized: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubtaskSchema = new Schema<ISubtask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const TaskSchema = new Schema<ITask>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },
    category: {
      type: String,
      trim: true,
      default: "general",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["draft", "pending", "in-progress", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    dueDate: {
      type: Date,
    },
    startTime: {
      type: String,
      trim: true,
    },
    endTime: {
      type: String,
      trim: true,
    },
    estimatedDuration: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      trim: true,
      default: "UTC",
    },
    repeat: {
      type: String,
      enum: ["never", "daily", "weekly", "monthly", "yearly"],
      default: "never",
    },
    reminder: {
      type: String,
      trim: true,
      default: "none",
    },
    customReminder: {
      type: String,
      trim: true,
      default: "",
    },
    subtasks: {
      type: [SubtaskSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
    },
    aiSummary: {
      type: String,
      default: "",
    },
    aiSuggestions: {
      type: Schema.Types.Mixed,
      default: null,
    },
    aiOptimized: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // adds createdAt / updatedAt automatically
  }
);

// Compound index to speed up common list queries (per-user, sorted by due date)
TaskSchema.index({ user: 1, dueDate: 1 });
TaskSchema.index({ user: 1, status: 1 });

export const TaskModel = model<ITask>("Task", TaskSchema);
export default TaskModel;