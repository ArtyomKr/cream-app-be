import { Pool } from 'pg';

const pool = new Pool({ ssl: true });

const dbQuery = (text: string, params?: string[]) => pool.query(text, params);

const createTables = async () =>
  dbQuery(
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
     CREATE TABLE IF NOT EXISTS "users" (
       "id" uuid DEFAULT uuid_generate_v4(), 
       "name" VARCHAR (25) NOT NULL, 
       "login" VARCHAR (25) UNIQUE NOT NULL, 
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

const createUser = async () => dbQuery(``);

export { dbQuery, createTables, createUser };
