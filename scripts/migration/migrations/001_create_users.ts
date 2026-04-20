import { PoolClient } from "pg";

const migration = {
  version: 1,

  up: async (client: PoolClient) => {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(128) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  },

  down: async (client: PoolClient) => {
    await client.query(`DROP TABLE IF EXISTS users CASCADE`);
  },
};

export default migration;
