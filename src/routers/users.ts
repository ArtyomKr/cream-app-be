import express from 'express';

const usersRouter = express.Router();

usersRouter.get('/users', (req, res) => {
  res.send('User list will be here');
});

export default usersRouter;
