import { Pool } from 'pg';
import { ISignUpRequest, IUserData, IBoardResponse, IBoardData } from '../models/apiModels';

const pool = new Pool({ ssl: true });

const dbQuery = (text: string, params?: string[]) => pool.query(text, params ?? []);

const createTables = async () =>
  dbQuery(
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
     CREATE TABLE IF NOT EXISTS "users" (
       "id" uuid DEFAULT uuid_generate_v4(), 
       "name" VARCHAR (50) NOT NULL, 
       "login" VARCHAR (50) UNIQUE NOT NULL, 
       "password" VARCHAR (25) NOT NULL,
       PRIMARY KEY ("id")
     );
     CREATE TABLE IF NOT EXISTS "boards" (
       "id" uuid DEFAULT uuid_generate_v4(),
       "title" VARCHAR NOT NULL,
       "description" VARCHAR NOT NULL,
       PRIMARY KEY ("id")
     );
     CREATE TABLE IF NOT EXISTS "columns" (
       "id" uuid DEFAULT uuid_generate_v4(),
       "title" VARCHAR NOT NULL,
       "order" SMALLINT NOT NULL,
       "boardId" uuid REFERENCES "boards" ("id")
         ON DELETE CASCADE ON UPDATE CASCADE,
       PRIMARY KEY ("id")
     );
     CREATE TABLE IF NOT EXISTS "tasks" (
       "id" uuid DEFAULT uuid_generate_v4(),
       "title" VARCHAR NOT NULL,
       "order" SMALLINT NOT NULL,
       "description" VARCHAR NOT NULL,
       "userId" uuid REFERENCES "users" ("id")
         ON DELETE SET NULL ON UPDATE CASCADE,
       "boardId" uuid REFERENCES "boards" ("id")
         ON DELETE CASCADE ON UPDATE CASCADE,
       "columnId" uuid REFERENCES "columns" ("id")
         ON DELETE CASCADE ON UPDATE CASCADE,
       PRIMARY KEY ("id")
     );
     CREATE TABLE IF NOT EXISTS "files" (
       "filename" VARCHAR UNIQUE NOT NULL,
       "fileId" VARCHAR NOT NULL,
       "fileSize" INTEGER NOT NULL,
       "taskId" uuid REFERENCES "tasks" ("id")
         ON DELETE CASCADE ON UPDATE CASCADE,
       PRIMARY KEY ("fileId")
     );`,
  );

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

const createBoard = async (title: string, description: string): Promise<IBoardResponse> => {
  const res = await dbQuery(
    `INSERT INTO boards (title, description)
         VALUES ($1, $2)
         RETURNING *;`,
    [title, description],
  );

  return res.rows[0];
};

const getAllBoards = async (): Promise<IBoardResponse[]> => {
  const res = await dbQuery(
    `SELECT *
         FROM boards;`,
  );

  return res.rows;
};

const findBoardById = async (id: string): Promise<IBoardData[]> => {
  const res = await dbQuery(
    `SELECT b.*, c.*
         FROM boards b
         LEFT JOIN columns c
         ON (b.id = c."boardId")
         WHERE b.id = $1;`,
    [id],
  );

  return res.rows[0];
};

export {
  dbQuery,
  createTables,
  createUser,
  findUserByLogin,
  findUserById,
  getAllUsers,
  deleteUser,
  editUser,
  createBoard,
  getAllBoards,
  findBoardById,
};
