import express from 'express';

const fileRouter = express.Router();

fileRouter.get('/file', (req, res) => {
  res.send('File funtionality will be here');
});

export default fileRouter;
