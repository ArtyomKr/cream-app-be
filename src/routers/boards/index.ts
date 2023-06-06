import express from 'express';
import auth from '../../middleware/auth';
import isBoardRequestBody from './typeGuards';
import errorConstructor from '../../utils/errorConstructor';
import { createBoard } from '../../db';

const boardsRouter = express.Router();

boardsRouter.post('/boards', auth, async (req, res) => {
  if (!isBoardRequestBody(req.body)) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, message: 'Invalid request body' }));
    return;
  }

  const { title, description = '' } = req.body;

  try {
    const newBoard = await createBoard(title, description);
    res.status(201).json(newBoard);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

export default boardsRouter;
