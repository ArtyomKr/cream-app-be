import express from 'express';

const boardsRouter = express.Router();

boardsRouter.get('/boards', (req, res) => {
  res.send('Board list will be here');
});

export default boardsRouter;
