import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { usersRouter, authRouter, boardsRouter, columnsRouter, tasksRouter } from './routers';
import { createColumnsTrigger, createTables, createTasksTrigger } from './db/preFlight';

dotenv.config();

createTables()
  .then(() => createColumnsTrigger())
  .then(() => createTasksTrigger());

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(usersRouter);
app.use(authRouter);
app.use(boardsRouter);
app.use(columnsRouter);
app.use(tasksRouter);

app.listen(port, () => {
  return console.log(`Express is listening at the following port: ${port}`);
});
