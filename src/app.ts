import * as dotenv from 'dotenv';
import express, { Request, Response, Application } from 'express';
import dbQuery from './db';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.get('/', async (req: Request, res: Response) => {
  const dbRes = await dbQuery('SELECT $1::text as message', ['Hello DB!']);
  res.send(dbRes.rows[0].message);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
