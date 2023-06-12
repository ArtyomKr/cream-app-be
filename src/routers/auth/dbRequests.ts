import { ISignUpRequest } from '../../models/apiModels';
import dbQuery from '../../db/dbQuery';

const createUser = async (name: string, login: string, password: string): Promise<ISignUpRequest> => {
  const res = await dbQuery(
    `INSERT INTO users (name, login, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, login;`,
    [name, login, password],
  );

  return res.rows[0];
};

const findUserByLogin = async (login: string): Promise<{ id: string; password: string }> => {
  const res = await dbQuery(
    `SELECT id, password
     FROM users
     WHERE login = $1;`,
    [login],
  );

  return res.rows[0];
};

export { createUser, findUserByLogin };
