import { Pool, QueryResult, QueryResultRow } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

/**
 * @template T
 */

export const query = async <T extends QueryResultRow>(
  text: string,
  params?: any[],
): Promise<QueryResult<T>> => {
  try {
    const res = await pool.query<T>(text, params);
    return res;
  } catch (error) {
    console.error("Database Error:", error);
    throw error;
  }
};
