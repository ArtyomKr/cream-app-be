import { Pool } from 'pg';
import {
  ISignUpRequest,
  IUserData,
  IBoardResponse,
  IBoardData,
  IBoardRequest,
  IColumn,
  IColumnData,
  ITaskRequest,
  ITask,
} from '../models/apiModels';

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
// TODO
const findBoardById = async (id: string): Promise<IBoardData[]> => {
  const res = await dbQuery(
    `SELECT b.*, to_jsonb(c.*) - 'boardId' columns
     FROM boards b
     LEFT JOIN columns c ON (b.id = c."boardId")
     WHERE b.id = $1;`,
    [id],
  );

  return res.rows[0];
};

const deleteBoard = async (id: string) => {
  await dbQuery(
    `DELETE
     FROM boards
     WHERE id = $1;`,
    [id],
  );
};

const editBoard = async (id: string, { title, description }: IBoardRequest): Promise<IBoardResponse> => {
  const res = await dbQuery(
    `UPDATE boards
     SET title = $2,
         description = $3
     WHERE id = $1
     RETURNING *;`,
    [id, title, description ?? ''],
  );

  return res.rows[0];
};

const createColumn = async (boardId: string, title: string, order: number): Promise<IColumn> => {
  const res = await dbQuery(
    `INSERT INTO columns ("boardId", title, "order")
     VALUES ($1, $2, $3)
     RETURNING id, title, "order";`,
    [boardId, title, order.toString()],
  );

  return res.rows[0];
};

const getAllColumns = async (boardId: string): Promise<IColumn[]> => {
  const res = await dbQuery(
    `SELECT id, title, "order"
     FROM columns
     WHERE "boardId" = $1;`,
    [boardId],
  );

  return res.rows;
};

const findColumnById = async (boardId: string, columnId: string): Promise<IColumnData> => {
  const res = await dbQuery(
    `WITH task_files as (
       SELECT "taskId", json_agg(to_jsonb(f.*) - 'fileId' - 'taskId') files
       FROM files f
       GROUP BY "taskId"
     )

     SELECT c.*, 
            json_agg(to_jsonb(t.*) - 'boardId' - 'columnId'|| jsonb_build_object('files', coalesce(f.files, '[]'))) tasks
     FROM columns c
     LEFT JOIN tasks t ON (c.id = t."columnId")
     LEFT JOIN task_files f ON (t.id = f."taskId")
     WHERE c."boardId" = $1 AND c.id = $2
     GROUP BY c.id;`,
    [boardId, columnId],
  );

  return res.rows[0];
};

const deleteColumn = async (boardId: string, columnId: string) => {
  await dbQuery(
    `DELETE
     FROM columns
     WHERE "boardId" = $1 AND id = $2;`,
    [boardId, columnId],
  );
};

const editColumn = async (
  boardId: string,
  columnId: string,
  { title, order }: Omit<IColumn, 'id'>,
): Promise<IColumn> => {
  const res = await dbQuery(
    `UPDATE columns
     SET title = $3, 
         "order" = $4
     WHERE "boardId" = $1 AND id = $2
     RETURNING id, title, "order";`,
    [boardId, columnId, title, order.toString()],
  );

  return res.rows[0];
};

const createTask = async (
  boardId: string,
  columnId: string,
  userId: string,
  { title, order, description }: ITaskRequest,
): Promise<ITask> => {
  const res = await dbQuery(
    `INSERT INTO tasks ("boardId", "columnId", "userId", title, "order", description)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *;`,
    [boardId, columnId, userId, title, order.toString(), description],
  );

  return res.rows[0];
};

const getAllTasks = async (boardId: string, columnId: string): Promise<ITask[]> => {
  const res = await dbQuery(
    `SELECT *
     FROM tasks
     WHERE "boardId" = $1 and "columnId" = $2;`,
    [boardId, columnId],
  );

  return res.rows;
};

const findTaskById = async (boardId: string, columnId: string, taskId: string): Promise<IColumnData> => {
  const res = await dbQuery(
    `WITH task_files as (
       SELECT "taskId", json_agg(to_jsonb(f.*) - 'fileId' - 'taskId') files
       FROM files f
       GROUP BY "taskId"
     )
      
     SELECT t.*, 
            coalesce(f.files, '[]') files
     FROM tasks t
     LEFT JOIN task_files f ON (t.id = f."taskId")
     WHERE t."boardId" = $1 AND t."columnId" = $2 AND t.id = $3;`,
    [boardId, columnId, taskId],
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
  deleteBoard,
  editBoard,
  createColumn,
  getAllColumns,
  findColumnById,
  deleteColumn,
  editColumn,
  createTask,
  getAllTasks,
  findTaskById,
};
