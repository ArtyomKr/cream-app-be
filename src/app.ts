import * as dotenv from 'dotenv';
import express from 'express';
import dbQuery from './db';
import usersRouter from './routers/users';
import loginRouter from './routers/login';
import boardsRouter from './routers/boards';
import columnsRouter from './routers/columns';
import tasksRouter from './routers/tasks';
import fileRouter from './routers/file';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  const dbRes = await dbQuery('SELECT $1::text as message', ['Hello DB!']);
  res.send(dbRes.rows[0].message);
});

app.use(usersRouter);
app.use(loginRouter);
app.use(boardsRouter);
app.use(columnsRouter);
app.use(tasksRouter);
app.use(fileRouter);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
