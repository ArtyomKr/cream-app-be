import express from 'express';
import auth from '../../middleware/auth';
import { deleteUser, editUser, findUserById, getAllUsers } from './dbRequests';
import errorConstructor from '../../utils/errorConstructor';
import { isSignupBody } from '../auth/typeGuards';

const usersRouter = express.Router();

usersRouter.get('/users', auth, async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users);
  } catch (err) {
    const status = 500;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

usersRouter.get('/users/:id', auth, async (req, res) => {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      const status = 404;
      res.status(status).json(errorConstructor({ status, message: 'User was not found' }));
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

usersRouter.delete('/users/:id', auth, async (req, res) => {
  if (res.locals.userId !== req.params.id) {
    const status = 403;
    res.status(status).json(errorConstructor({ status, message: 'You cannot delete other users' }));
    return;
  }

  try {
    await deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    const status = 404;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

usersRouter.put('/users/:id', auth, async (req, res) => {
  if (res.locals.userId !== req.params.id) {
    const status = 403;
    res.status(status).json(errorConstructor({ status, message: 'You cannot edit other users' }));
  } else if (!isSignupBody(req.body)) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, message: 'Invalid request body' }));
  } else
    try {
      const updatedUser = await editUser(req.params.id, req.body);
      res.status(200).json(updatedUser);
    } catch (err) {
      const status = 400;
      res.status(status).json(errorConstructor({ status, err }));
    }
});

export default usersRouter;
