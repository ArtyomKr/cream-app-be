import * as dotenv from 'dotenv';
import express from 'express';
import { dbQuery, createTables } from './db';
import { usersRouter, loginRouter, boardsRouter, columnsRouter, tasksRouter, fileRouter } from './routers';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

createTables();

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
