import express, { Request, Response } from 'express';
import { ISignUpRequest, ISignUpResponse } from '../../models/apiModels';
import { isSigninBody, isSignupBody } from './typeguards';
import { createUser, findUser } from '../../db';
import errorConstructor from '../../utils/errorConstructor';

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  if (!isSignupBody(req.body)) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, message: 'Invalid request body' }));
  }

  const { name, login, password } = req.body;

  try {
    const newUser = await createUser(name, login, password);
    res.status(201).json(newUser);
  } catch (err) {
    const status = 400;
    const wrappedError = errorConstructor({ status, err });
    res.status(status).json(wrappedError);
  }
});

authRouter.post('/signin', async (req, res) => {
  if (!isSigninBody(req.body)) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, message: 'Invalid request body' }));
  }

  const { login, password } = req.body;
  // TODO
  try {
    const user = await findUser(login);
    if (!user) {
      const status = 403;
      res.status(status).send(errorConstructor({ status, message: 'User not found' }));
    }
    res.status(201).json(user);
  } catch (err) {
    const status = 400;
    const wrappedError = errorConstructor({ status, err });
    res.status(status).json(wrappedError);
  }
});

export default authRouter;
