import { Pool } from 'pg';

const pool = new Pool({ ssl: true });

const dbQuery = (text: string, params?: string[]) => pool.query(text, params);

const createTables = async () => {
  const res = await dbQuery(
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
     CREATE TABLE IF NOT EXISTS "users" (
       "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
       "name" character varying NOT NULL, 
       "login" character varying NOT NULL, 
       "password" character varying NOT NULL, 
       CONSTRAINT "UQ_2d443082eccd5198f95f2a36e2c" UNIQUE ("login"),
       CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
     )`,
  );
  console.log(res);
};

export { dbQuery, createTables };
