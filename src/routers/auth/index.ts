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

authRouter.post('/signup', (req, res) => {
  if (!isSignupBody(req.body)) {
    res.status(400).send({ error: 'Invalid request body' });
  }

  const { name, login, password } = req.body;
  createUser();

  res.status(201).send();
});

authRouter.get('/signin', (req, res) => {
  res.send('Signin functionality will be here');
});

export default authRouter;
