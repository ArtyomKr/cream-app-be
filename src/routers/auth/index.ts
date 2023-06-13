import express from 'express';
import { compare } from 'bcrypt';
import { isSigninBody, isSignupBody } from './typeGuards';
import { createUser, findUserByLogin } from './dbRequests';
import errorConstructor from '../../utils/errorConstructor';
import generateToken from '../../utils/generateToken';
import generateHash from '../../utils/generateHash';

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  if (!isSignupBody(req.body)) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, message: 'Invalid request body' }));
    return;
  }

  const { name, login, password } = req.body;

  try {
    const hashedPassword = await generateHash(password);
    const newUser = await createUser(name, login, hashedPassword);

    res.status(201).json(newUser);
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
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
    const user = await findUserByLogin(login);
    const passwordMatch = await compare(password, user.password);

    if (!user || !passwordMatch) {
      const status = 403;
      res.status(status).send(errorConstructor({ status, message: 'User was not found' }));
    } else res.status(200).json({ token: generateToken(user.id, login) });
  } catch (err) {
    const status = 400;
    res.status(status).json(errorConstructor({ status, err }));
  }
});

export default authRouter;
