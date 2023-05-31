import express, { Request, Response } from 'express';
import { ISignUpRequest, ISignUpResponse } from '../../models/apiModels';
import { createUser } from '../../db';

const authRouter = express.Router();

function isSignupBody(body: object): body is ISignUpRequest {
  return (
    'name' in body &&
    'login' in body &&
    'password' in body &&
    typeof body.name === 'string' &&
    typeof body.login === 'string' &&
    typeof body.password === 'string'
  );
}

authRouter.post('/signup', async (req, res) => {
  if (!isSignupBody(req.body)) {
    res.status(400).json({ error: 'Invalid request body' });
  }

  const { name, login, password } = req.body;

  try {
    const newUser = await createUser(name, login, password);
    res.status(201).json(newUser);
  } catch (err) {
    const message = typeof err === 'object' && err !== null && 'message' in err ? err.message : 'unknown error occured';
    res.status(400).json(message);
  }
});

authRouter.get('/signin', (req, res) => {
  res.send('Signin functionality will be here');
});

export default authRouter;
