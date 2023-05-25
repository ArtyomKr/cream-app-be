import { Pool } from 'pg';

const pool = new Pool({ ssl: true });

const dbQuery = (text: string, params?: string[]) => pool.query(text, params);

const createTables = async () => {
  const res = await dbQuery(
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
     CREATE TABLE IF NOT EXISTS "users" (
       "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(), 
       "name" VARCHAR (25) NOT NULL, 
       "login" VARCHAR (25) UNIQUE NOT NULL, 
       "password" VARCHAR (25) NOT NULL
     )`,
  );
  console.log(res);
};

export { dbQuery, createTables };
