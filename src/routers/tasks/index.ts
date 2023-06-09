import express from 'express';
import auth from '../../middleware/auth';
import errorConstructor from '../../utils/errorConstructor';
import isTaskRequestBody from './typeGuards';
import { createTask, findTaskById, getAllTasks } from '../../db';

const tasksRouter = express.Router();

tasksRouter.post('/boards/:boardId/columns/:columnId/tasks', auth, async (req, res) => {
  if (!isTaskRequestBody(req.body)) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, message: 'Invalid request body' }));
    return;
  }

  const { boardId, columnId } = req.params;

  try {
    const newTask = await createTask(boardId, columnId, res.locals.userId, req.body);

    res.status(201).json(newTask);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

tasksRouter.get('/boards/:boardId/columns/:columnId/tasks', auth, async (req, res) => {
  const { boardId, columnId } = req.params;

  try {
    const tasks = await getAllTasks(boardId, columnId);

    res.status(201).json(tasks);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

tasksRouter.get('/boards/:boardId/columns/:columnId/tasks/:taskId', auth, async (req, res) => {
  const { boardId, columnId, taskId } = req.params;

  try {
    const task = await findTaskById(boardId, columnId, taskId);

    res.status(201).json(task);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

export default tasksRouter;
