import express from 'express';
import auth from '../../middleware/auth';
import errorConstructor from '../../utils/errorConstructor';
import isColumnRequestBody from './typeGuards';
import { createColumn, deleteColumn, editColumn, findColumnById, getAllColumns } from '../../db';

const columnsRouter = express.Router();

columnsRouter.post('/boards/:id/columns', auth, async (req, res) => {
  if (!isColumnRequestBody(req.body)) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, message: 'Invalid request body' }));
    return;
  }

  const { title, order } = req.body;

  try {
    const newColumn = await createColumn(req.params.id, title, order);

    res.status(201).json(newColumn);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

columnsRouter.get('/boards/:id/columns', auth, async (req, res) => {
  try {
    const columns = await getAllColumns(req.params.id);

    res.status(201).json(columns);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

columnsRouter.get('/boards/:boardId/columns/:columnId', auth, async (req, res) => {
  const { boardId, columnId } = req.params;

  try {
    const column = await findColumnById(boardId, columnId);

    if (!column) {
      const status = 404;
      res.status(status).json(errorConstructor({ status, message: 'Column was not found' }));
      return;
    }
    res.status(200).json(column);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

columnsRouter.delete('/boards/:boardId/columns/:columnId', auth, async (req, res) => {
  const { boardId, columnId } = req.params;

  try {
    await deleteColumn(boardId, columnId);
    res.status(204).send();
  } catch (err) {
    const status = 404;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

columnsRouter.put('/boards/:boardId/columns/:columnId', auth, async (req, res) => {
  if (!isColumnRequestBody(req.body)) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, message: 'Invalid request body' }));
    return;
  }

  const { boardId, columnId } = req.params;

  try {
    const updatedColumn = await editColumn(boardId, columnId, req.body);

    res.status(201).json(updatedColumn);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

export default columnsRouter;
