import { Router } from "express";
import { planGoal, planGoalById } from "../controller/goal";
import { verifyJWT } from "../middleware/auth";

const router = Router();

router.use(verifyJWT);

// AI goal planner
router.post("/plan", planGoal);
router.post("/:goalId/plan", planGoalById);

export const goalRouter = router;
