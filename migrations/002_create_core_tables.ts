import { query } from "../lib/db";

const migration = {
  version: 2,

  up: async () => {
    await query(`
        CREATE TABLE IF NOT EXISTS words (
            word_id serial PRIMARY KEY,
            word varchar UNIQUE NOT NULL
        );

        CREATE TABLE IF NOT EXISTS pos (
            pos_id serial PRIMARY KEY,
            pos varchar UNIQUE NOT NULL
        );


        CREATE TABLE IF NOT EXISTS levels (
            level_id serial PRIMARY KEY,
            level varchar UNIQUE NOT NULL
        );
    `);
  },

  down: async () => {
    await query(`
        DROP TABLE IF EXISTS levels CASCADE;
        DROP TABLE IF EXISTS pos CASCADE;
        DROP TABLE IF EXISTS words CASCADE;    
    `);
  },
};

export default migration;
