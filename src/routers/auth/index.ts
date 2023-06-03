import express from 'express';
import { isSigninBody, isSignupBody } from './typeguards';
import { createUser, findUser } from '../../db';
import errorConstructor from '../../utils/errorConstructor';
import generateToken from '../../utils/generateToken';

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  if (!isSignupBody(req.body)) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, message: 'Invalid request body' }));
    return;
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
    return;
  }

  const { login, password } = req.body;

  try {
    const user = await findUser(login);

    if (!user || password !== user.password) {
      const status = 403;
      res.status(status).send(errorConstructor({ status, message: 'User not found' }));
    } else res.status(200).json(generateToken(user.id, login));
  } catch (err) {
    const status = 400;
    const wrappedError = errorConstructor({ status, err });
    res.status(status).json(wrappedError);
  }
});

export default authRouter;
