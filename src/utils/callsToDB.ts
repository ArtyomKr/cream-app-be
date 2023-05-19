import { getDB } from './saveLoadDB';

async function getAllUsers() {
  const db = await getDB();

  return db.users;
}
