import express from 'express';

const authRouter = express.Router();

authRouter.get('/signin', (req, res) => {
  res.send('Signin functionality will be here');
});

authRouter.get('/signup', (req, res) => {
  res.send('Signup functionality will be here');
});

export default authRouter;
