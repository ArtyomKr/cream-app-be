import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { dbQuery, createTables } from './db';
import { usersRouter, authRouter, boardsRouter, columnsRouter, tasksRouter, fileRouter } from './routers';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

createTables();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(usersRouter);
app.use(authRouter);
app.use(boardsRouter);
app.use(columnsRouter);
app.use(tasksRouter);
app.use(fileRouter);

app.get('/', async (req, res) => {
  const dbRes = await dbQuery('SELECT $1::text as message', ['Hello DB!']);
  res.send(dbRes.rows[0].message);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
