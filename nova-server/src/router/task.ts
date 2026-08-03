import { Router } from "express";
import {
  createTask,
  updateTask,
  getTasks,
  getTask,
  deleteTask,
  saveDraft,
  toggleCompletion,
  generateSubtasks,
  optimizeSchedule,
  generateTaskSuggestions,
} from "../controller/task";
import { verifyJWT } from "../middleware/auth";

const router = Router();

// All task routes require an authenticated user.
router.use(verifyJWT);

// AI-powered task assistance
router.post("/draft", saveDraft);
router.post("/:taskId/generate-subtasks", generateSubtasks);
router.post("/:taskId/optimize-schedule", optimizeSchedule);
router.post("/:taskId/generate-suggestions", generateTaskSuggestions);

// Core CRUD
router.get("/", getTasks);
router.get("/:taskId", getTask);
router.post("/", createTask);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);
router.patch("/:taskId/toggle", toggleCompletion);



export const taskRouter =router;