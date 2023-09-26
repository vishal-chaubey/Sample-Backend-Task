import { Task } from '../models/task.seq.model';
import { Op, col, fn, literal } from 'sequelize';
import { appConfig } from "../config/app.config";
import { appResponseMessage } from "../utils/appResponseMessage";
import { appResponseStatus } from "../utils/appResponseStatus";
import logger from "../utils/winston-logger";
import { STATUS, PRIORITY } from '../constants';

export class TaskService {

    /**
     * INFO: Create Task
     * @param payload 
     * @returns 
     */
    async createTask(payload: any) {
        try {
            const task: any = await Task.findOne({
                where: {
                    title: payload.title
                },
                paranoid: false,
            });
            if (task) {
                return {
                    success: false,
                    status: appResponseStatus.BadRequest,
                    message: appResponseMessage.TASK_EXIST
                }
            }
            const createdTask: any = await Task.create(payload);

            return {
                success: true,
                status: appResponseStatus.OK,
                message: appResponseMessage.SUCCESS,
                task_id: createdTask?.id
            }
        } catch (error) {
            logger.info("createTask error: -------", error)
            throw error;
        }
    }

    /**
     * INFO: Update task
     * @param payload 
     * @param task_id 
     * @returns 
     */
    async updateTask(payload: any, task_id: any) {
        try {
            const checkExists: any = await Task.findByPk(task_id);
            if (!checkExists) {
                return {
                    success: false,
                    status: appResponseStatus.BadRequest,
                    message: appResponseMessage.TASK_NOT_EXIST
                }
            }
            const task: any = await Task.findOne({
                where: {
                    title: payload.title,
                    id: { [Op.ne]: task_id }
                },
                paranoid: false,
            });
            if (task) {
                return {
                    success: false,
                    status: appResponseStatus.BadRequest,
                    message: appResponseMessage.TASK_EXIST
                }
            }
            await Task.update(payload, { where: { id: task_id } })
            return {
                success: true,
                status: appResponseStatus.OK,
                message: appResponseMessage.SUCCESS
            }
        } catch (error) {
            logger.info("updateTask error: -------", error)
            throw error;
        }
    }

    /**
     * INFO: Delete task
     * @param task_id 
     * @returns 
     */
    async deleteTask(task_id: any) {
        try {
            const checkExists: any = await Task.findByPk(task_id);
            if (!checkExists) {
                return {
                    success: false,
                    status: appResponseStatus.BadRequest,
                    message: appResponseMessage.TASK_NOT_EXIST
                }
            }

            await Task.destroy({ where: { id: task_id }, force: true })
            return {
                success: true,
                status: appResponseStatus.OK,
                message: appResponseMessage.SUCCESS
            }
        } catch (error) {
            logger.info("deleteTask error: -------", error)
            throw error;
        }
    }

    /**
     * INFO: List Task
     * @param payload 
     * @returns 
     */
    async listTask(payload: any) {
        try {
            let where = {
                deletedAt: {
                    [Op.is]: null,
                }
            } as any;
            let { searchTerm, page, limit } = payload;
            if (searchTerm) {
                where = {
                    ...where,
                    [Op.or]: [
                        {
                            title: {
                                [Op.iLike]: `%${searchTerm}%`,
                            },
                        },
                        {
                            description: {
                                [Op.iLike]: `%${searchTerm}%`,
                            },
                        }
                    ],
                }
            }

            page = page ? Number(page) : 1;
            const perPage = limit ? Number(limit) : 10;
            const offset = (page - 1) * perPage;

            const { rows: data, count } = await Task.findAndCountAll({
                where,
                paranoid: false,
                order: [['createdAt', 'DESC']],
                limit: perPage,
                offset: offset,
            });

            return {
                success: true,
                status: appResponseStatus.OK,
                message: appResponseMessage.SUCCESS,
                data,
                count
            }
        } catch (error) {
            logger.info("listTask error: -------", error)
            throw error;
        }
    }

    /**
     * INFO: Task Metrics
     * @param payload 
     * @returns 
     */
    async taskMetrics(payload: any) {
        try {
            let where = {
                deletedAt: {
                    [Op.is]: null,
                }
            } as any;
            let { searchTerm } = payload;
            if (searchTerm) {
                where = {
                    ...where,
                    [Op.or]: [
                        {
                            title: {
                                [Op.iLike]: `%${searchTerm}%`,
                            },
                        },
                        {
                            description: {
                                [Op.iLike]: `%${searchTerm}%`,
                            },
                        }
                    ],
                }
            }

            const groupedData = await Task.findAll({
                attributes: [
                    [fn('date_trunc', 'month', col('createdAt')), 'date'],
                    [fn('COUNT', col('*')), 'count'],
                    [col('status'), 'status'],
                ],
                where,
                group: [fn('date_trunc', 'month', col('createdAt')), 'status'],
                raw: true,
                order: [fn('date_trunc', 'month', col('createdAt'))],
            });

            const metricsByMonth: { [key: string]: { date: string; metrics: any } } = {};

            groupedData.forEach((group: any) => {
                const date = group.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                });

                if (!metricsByMonth[date]) {
                    metricsByMonth[date] = {
                        date,
                        metrics: {},
                    };
                }

                metricsByMonth[date].metrics[group.status] = group.count;
            });
            const data = Object.values(metricsByMonth);

            return {
                success: true,
                status: appResponseStatus.OK,
                message: appResponseMessage.SUCCESS,
                data
            }
        } catch (error) {
            logger.info("taskMetrics error: -------", error)
            throw error;
        }
    }



}