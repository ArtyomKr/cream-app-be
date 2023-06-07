import express from 'express';
import auth from '../../middleware/auth';
import isBoardRequestBody from './typeGuards';
import errorConstructor from '../../utils/errorConstructor';
import { createBoard, deleteBoard, editBoard, findBoardById, getAllBoards } from '../../db';

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

boardsRouter.get('/boards', auth, async (req, res) => {
  try {
    const boards = await getAllBoards();

    res.status(201).json(boards);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

boardsRouter.get('/boards/:id', auth, async (req, res) => {
  try {
    const board = await findBoardById(req.params.id);

    if (!board) {
      const status = 404;
      res.status(status).json(errorConstructor({ status, message: 'Board was not found' }));
      return;
    }
    res.status(200).json(board);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

boardsRouter.delete('/boards/:id', auth, async (req, res) => {
  try {
    await deleteBoard(req.params.id);
    res.status(204).send();
  } catch (err) {
    const status = 404;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

boardsRouter.put('/boards/:id', auth, async (req, res) => {
  if (!isBoardRequestBody(req.body)) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, message: 'Invalid request body' }));
    return;
  }

  try {
    const updatedBoard = await editBoard(req.params.id, req.body);

    res.status(200).json(updatedBoard);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

export default boardsRouter;
