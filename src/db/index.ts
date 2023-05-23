import { Pool } from 'pg';

const pool = new Pool({ ssl: true });

const dbQuery = (text: string, params: string[]) => pool.query(text, params);

export default dbQuery;
