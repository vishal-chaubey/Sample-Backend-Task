import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon, { SinonStub } from 'sinon';
import { Task } from '../models/task.seq.model';
import { TaskService } from '../services/task.service';
import { appResponseMessage } from '../utils/appResponseMessage';
import { appResponseStatus } from '../utils/appResponseStatus';
import { STATUS, PRIORITY } from '../constants';
import { Op } from 'sequelize';


describe('Task Service', () => {
    let service: TaskService;
    let TaskCreateStub: SinonStub;
    let TaskFindOneStub: SinonStub;
    let TaskFindByPkStub: SinonStub;
    let TaskUpdateStub: SinonStub;
    let TaskDestroyStub: SinonStub;
    let TaskFindAllStub: SinonStub;
    let TaskFindAndCountAllStub: SinonStub;

    beforeEach(() => {
        service = new TaskService();
        TaskCreateStub = sinon.stub(Task, 'create');
        TaskFindOneStub = sinon.stub(Task, 'findOne');
        TaskFindByPkStub = sinon.stub(Task, 'findByPk');
        TaskDestroyStub = sinon.stub(Task, 'destroy');
        TaskUpdateStub = sinon.stub(Task, 'update');
        TaskFindAllStub = sinon.stub(Task, 'findAll');
        TaskFindAndCountAllStub = sinon.stub(Task, 'findAndCountAll');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('Task  Service - createTask', () => {
        it('should create a task', async () => {
            const payload = {
                "id": 1,
                "title": "Vishal",
                "description": "Testing desc",
                "timeline": new Date()
            } as any;

            TaskFindOneStub.resolves(null);
            TaskCreateStub.resolves(payload);

            const result = await service.createTask(payload);

            expect(TaskFindOneStub.calledOnce).to.be.true;
            expect(TaskCreateStub.calledOnce).to.be.true;
            expect(result.success).to.be.true;
            expect(result.status).to.equal(appResponseStatus.OK);
            expect(result.message).to.equal(appResponseMessage.SUCCESS);
        });

        it('should return an error when the title is already taken while creating a task', async () => {
            const payload = {
                "title": "Vishal",
                "description": "Testing desc",
                "timeline": new Date()
            };

            TaskFindOneStub.resolves({
                id: 1,
                "title": "Vishal",
            } as any);

            const result = await service.createTask(payload);

            expect(result.success).to.be.false;
            expect(result.status).to.equal(appResponseStatus.BadRequest);

            sinon.assert.notCalled(TaskCreateStub);
            return Promise.resolve();
        });

    });

    describe('Task  Service - updateTask', () => {

        it('should update a task successfully', async () => {
            const task_id = 2;
            const payload = {
                "title": "1",
                "description": "Testing desc",
                "timeline": new Date()
            };
            TaskFindByPkStub.resolves({ id: task_id });
            TaskUpdateStub.resolves(1);

            const result = await service.updateTask(payload, task_id);
            expect(result.success).to.be.true;
            expect(result.status).to.equal(appResponseStatus.OK);
            expect(result.message).to.equal(appResponseMessage.SUCCESS);
        });

        it('should return an error when the task does not exist', async () => {
            const task_id = 2;
            const payload = {
            };
            TaskFindByPkStub.resolves(null);

            const result = await service.updateTask(payload, task_id);

            expect(TaskFindByPkStub.calledOnce).to.be.true;
            expect(TaskUpdateStub.called).to.be.false;

            expect(result.success).to.be.false;
            expect(result.status).to.equal(appResponseStatus.BadRequest);
            expect(result.message).to.equal(appResponseMessage.TASK_NOT_EXIST);
        });

    });

    describe('Task  Service - deleteTask', () => {

        it('should delete a task', async () => {
            const task_id = 1;
            TaskFindByPkStub.resolves({ id: task_id });
            TaskDestroyStub.resolves(1);

            const result = await service.deleteTask(task_id);

            expect(TaskFindByPkStub.calledOnce).to.be.true;
            expect(TaskDestroyStub.calledOnce).to.be.true;
            expect(result.success).to.be.true;
            expect(result.status).to.equal(appResponseStatus.OK);
            expect(result.message).to.equal(appResponseMessage.SUCCESS);
        });

        it('should return an error when the task does not exist', async () => {
            const task_id = 2;
            TaskFindByPkStub.resolves(null);

            const result = await service.deleteTask(task_id);

            expect(TaskFindByPkStub.calledOnce).to.be.true;
            expect(TaskDestroyStub.called).to.be.false;

            expect(result.success).to.be.false;
            expect(result.status).to.equal(appResponseStatus.BadRequest);
            expect(result.message).to.equal(appResponseMessage.TASK_NOT_EXIST);
        });
    });

    describe('Task  Service - listTask', () => {

        it('should list tasks successfully', async () => {
            const payload = {
                page: 1,
                limit: 10,
            };

            const taskData = [
                { id: 1 },
                { id: 2 },
            ];
            const totalCount = 2;
            TaskFindAndCountAllStub.resolves({ rows: taskData, count: totalCount });

            const result = await service.listTask(payload);

            expect(TaskFindAndCountAllStub.calledOnce).to.be.true;
            expect(result.success).to.be.true;
            expect(result.status).to.equal(appResponseStatus.OK);
            expect(result.message).to.equal(appResponseMessage.SUCCESS);
        });

        it('should list tasks with filters', async () => {
            const payload = {
                page: 2,
                limit: 20,
            };
            const filteredTaskData = [
                { id: 3 },
                { id: 4 },
            ];
            const filteredTotalCount = 2;
            TaskFindAndCountAllStub.resolves({ rows: filteredTaskData, count: filteredTotalCount });
            const result = await service.listTask(payload);
            expect(TaskFindAndCountAllStub.calledOnce).to.be.true;
            expect(result.success).to.be.true;
            expect(result.status).to.equal(appResponseStatus.OK);
            expect(result.message).to.equal(appResponseMessage.SUCCESS);
        });

        it('should handle pagination', async () => {
            const payload = {
                page: 3,
                limit: 10,
            };
            const paginatedTaskData = [
                { task_id: 11 },
                { task_id: 12 },
            ];
            const totalCount = 30;

            TaskFindAndCountAllStub.resolves({ rows: paginatedTaskData, count: totalCount });

            const result = await service.listTask(payload);

            expect(TaskFindAndCountAllStub.calledOnce).to.be.true;
            expect(result.success).to.be.true;
            expect(result.status).to.equal(appResponseStatus.OK);
            expect(result.message).to.equal(appResponseMessage.SUCCESS);
        });

    });

});

