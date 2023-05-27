import { Pool } from 'pg';

const pool = new Pool({ ssl: true });

const dbQuery = (text: string, params?: string[]) => pool.query(text, params);

const createTables = async () => {
  const res = await dbQuery(
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
     CREATE TABLE IF NOT EXISTS "users" (
       "id" uuid PRIMARY KEY GENERATED ALWAYS AS (uuid_generate_v4()), 
       "name" VARCHAR (25) NOT NULL, 
       "login" VARCHAR (25) UNIQUE NOT NULL, 
       "password" VARCHAR (25) NOT NULL
     );
     CREATE TABLE IF NOT EXISTS "boards" (
       "id" uuid PRIMARY KEY GENERATED ALWAYS AS (uuid_generate_v4()),
       "title" character varying NOT NULL,
       "description" character varying NOT NULL
     );`,
  );
  console.log(res);
};

export { dbQuery, createTables };
