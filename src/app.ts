import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { usersRouter, authRouter, boardsRouter, columnsRouter, tasksRouter } from './routers';
import errorConstructor from './utils/errorConstructor';

dotenv.config();

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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const status = 500;
  res.status(status).json(errorConstructor({ status, err }));
});

app.listen(port, () => {
  return console.log(`Express is listening at the following port: ${port}`);
});
