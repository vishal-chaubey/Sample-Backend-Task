import { validationResult } from 'express-validator';
import { appResponseMessage } from "../utils/appResponseMessage";
import { appResponseStatus } from "../utils/appResponseStatus";
import { TaskService } from '../services/task.service';

export const createTask = async (req: any, res: any) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
        const taskService = new TaskService();
        const payload = req.body;
        const args = await taskService.createTask(payload);
        res.status(args.status).json(args);
    } catch (error) {
        res.status(appResponseStatus.BadRequest).json({ 
            success: false, 
            status: appResponseStatus.BadRequest, 
            message: appResponseMessage.EXCEPTION 
        })
    }
}

export const updateTask = async (req: any, res: any) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }
        const taskService = new TaskService();
        const args = await taskService.updateTask(req.body, req.params.task_id);
        res.status(args.status).json(args);
    } catch (error) {
        res.status(appResponseStatus.BadRequest).json({ 
            success: false, 
            status: appResponseStatus.BadRequest, 
            message: appResponseMessage.EXCEPTION 
        })
    }
}

export const deleteTask = async (req: any, res: any) => {
    try {
        const taskService = new TaskService();
        const args = await taskService.deleteTask(req.params.task_id);
        res.status(args.status).json(args);
    } catch (error) {
        res.status(appResponseStatus.BadRequest).json({ 
            success: false, 
            status: appResponseStatus.BadRequest, 
            message: appResponseMessage.EXCEPTION 
        })
    }
}

export const listTask = async (req: any, res: any) => {
    try {
        const taskService = new TaskService();
        const args = await taskService.listTask(req.query);
        res.status(args.status).json(args);
    } catch (error) {
        res.status(appResponseStatus.BadRequest).json({ 
            success: false, 
            status: appResponseStatus.BadRequest, 
            message: appResponseMessage.EXCEPTION 
        })
    }
}

export const taskMetrics = async (req: any, res: any) => {
    try {
        const taskService = new TaskService();
        const args = await taskService.taskMetrics(req.query);
        res.status(args.status).json(args);
    } catch (error) {
        res.status(appResponseStatus.BadRequest).json({ 
            success: false, 
            status: appResponseStatus.BadRequest, 
            message: appResponseMessage.EXCEPTION 
        })
    }
}
