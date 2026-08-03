import { Router } from "express";
import generateTravelPlan from "../controller/travel-planner";
export const travelPlannerRouter = Router();

travelPlannerRouter.post("/", generateTravelPlan)