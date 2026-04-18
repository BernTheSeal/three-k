import { query } from "@/lib/db";

const migration = {
  version: 1,

  up: async () => {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(128) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  },

  down: async () => {
    await query(`DROP TABLE IF EXISTS users CASCADE`);
  },
};

export default migration;
