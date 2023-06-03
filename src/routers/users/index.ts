import express from 'express';
import auth from '../../middleware/auth';

const usersRouter = express.Router();

usersRouter.get('/users', auth, (req, res) => {
  res.send('User list will be here');
});

export default usersRouter;
