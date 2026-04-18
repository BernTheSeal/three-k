import { query } from "@/lib/db";

const migration = {
  version: 4,

  up: async () => {
    await query(`
        DO $$ BEGIN     
            CREATE TYPE status_enum AS ENUM ('learning', 'known');
        EXCEPTION   
            WHEN duplicate_object THEN NULL; 
        END $$;

        CREATE TABLE IF NOT EXISTS user_words (
            user_id VARCHAR,
            word_id INTEGER,
            status status_enum DEFAULT 'learning',
            note TEXT,
            is_favorite BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP  DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            
            CONSTRAINT pk_user_words PRIMARY KEY (user_id, word_id),
            CONSTRAINT fk_user_words_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
            CONSTRAINT fk_user_words_word FOREIGN KEY (word_id) REFERENCES words(word_id) ON DELETE CASCADE
        );
    `);
  },

  down: async () => {
    await query(`
        DROP TABLE IF EXISTS user_words CASCADE;
        DROP TYPE IF EXISTS status_enum;
    `);
  },
};

export default migration;
