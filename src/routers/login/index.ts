import express from 'express';

const loginRouter = express.Router();

loginRouter.get('/login', (req, res) => {
  res.send('Login functionality will be here');
});

export default loginRouter;
