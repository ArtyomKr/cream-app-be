import fs from 'fs/promises';
import type { IDBModel } from '../models/apiModels';

const dbPath = '../db/mockDB.json';

async function getDB() {
  const json = await fs.readFile(dbPath, 'utf8');

  return JSON.parse(json) as IDBModel;
}

async function rewriteDB(obj: IDBModel) {
  const json = JSON.stringify(obj);

  await fs.writeFile(dbPath, json);
}

export { getDB, rewriteDB };
