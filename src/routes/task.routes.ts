import { Express } from 'express';
import { createTask, updateTask, deleteTask, listTask, taskMetrics } from "../controllers/task.controller";
import { validate } from '../requests/task.reques';

export const routes = (app: Express) => {
    app.post("/api/task/create", validate('task'), createTask);
    app.put("/api/task/update/:task_id", validate('task'), updateTask);
    app.delete("/api/task/delete/:task_id", deleteTask);
    app.get("/api/task/list", listTask);
    app.get("/api/task/metrics", taskMetrics);
}
