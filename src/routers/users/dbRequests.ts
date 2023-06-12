import { ISignUpRequest, IUserData } from '../../models/apiModels';
import dbQuery from '../../db/dbQuery';

const findUserById = async (id: string): Promise<IUserData> => {
  const res = await dbQuery(
    `SELECT id, name, login
     FROM users
     WHERE id = $1;`,
    [id],
  );

  return res.rows[0];
};

const getAllUsers = async (): Promise<IUserData[]> => {
  const res = await dbQuery(
    `SELECT id, name, login
     FROM users;`,
  );

  return res.rows;
};

const deleteUser = async (id: string) => {
  await dbQuery(
    `DELETE
     FROM users
     WHERE id = $1;`,
    [id],
  );
};

const editUser = async (id: string, { name, login, password }: ISignUpRequest): Promise<ISignUpRequest> => {
  const res = await dbQuery(
    `UPDATE users
     SET name = $2,
         login = $3,
         password = $4
     WHERE id = $1
     RETURNING name, login, password;`,
    [id, name, login, password],
  );

  return res.rows[0];
};

export { findUserById, getAllUsers, deleteUser, editUser };
