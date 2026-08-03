import express from "express";
import cors from 'cors'
import { connectDB } from "./utils/db";
import cookieParser from "cookie-parser";
import { taskRouter } from "./router/task";
import { authRouter } from "./router/auth";
import { travelPlannerRouter } from "./router/travel-planner";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/tasks", taskRouter)
app.use("/api/v1/travel-planner", travelPlannerRouter)


connectDB()


app.listen(5000, () => {
    console.log("running on port 5000");
});