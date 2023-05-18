import fs from 'fs/promises';

const dbPath = '../db/mockDB.json';

async function getDB() {
  const json = await fs.readFile(dbPath, 'utf8');

  return JSON.parse(json);
}
