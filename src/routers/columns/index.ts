import express from 'express';

const columnsRouter = express.Router();

columnsRouter.get('/columns', (req, res) => {
  res.send('Column list will be here');
});

export default columnsRouter;
