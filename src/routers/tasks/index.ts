import express from 'express';

const tasksRouter = express.Router();

tasksRouter.get('/tasks', (req, res) => {
  res.send('Task list will be here');
});

export default tasksRouter;
