import { query } from "@/lib/db";
import {
  CreateUserWordInput,
  GetUserWordInput,
  UpdateUserWordInput,
} from "@/schemas/validators/userWord";

import {
  GetByUserIdAndWordId,
  GetByUserId,
} from "@/schemas/validators/userWord";

export const userWordRepository = {
  async create(user_id: string, data: CreateUserWordInput) {
    const { word_id, status, note, is_favorite } = data;
    await query(
      `
        INSERT INTO user_words (user_id, word_id, status, note, is_favorite)
        VALUES($1, $2, $3, $4, $5)    
    `,
      [user_id, word_id, status, note, is_favorite],
    );
  },
  async update(user_id: string, word_id: number, data: UpdateUserWordInput) {
    const { note, status, is_favorite } = data;
    const fields: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (note !== undefined) {
      fields.push(`note = $${index}`);
      values.push(note);
      index++;
    }

    if (status !== undefined) {
      fields.push(`status = $${index}`);
      values.push(status);
      index++;
    }

    if (is_favorite !== undefined) {
      fields.push(`is_favorite = $${index}`);
      values.push(is_favorite);
      index++;
    }

    values.push(user_id);
    values.push(word_id);

    const updateQuery = `
        UPDATE user_words
        SET ${fields.join(", ")} , updated_at = NOW()
        WHERE user_id = $${index} AND word_id = $${index + 1}
        RETURNING *
    `;

    const result = await query(updateQuery, values);

    return result.rows[0];
  },

  async delete(user_id: string, word_id: number) {
    const result = await query(
      `
      DELETE FROM user_words
      WHERE user_id = $1 AND word_id = $2
      RETURNING word_id
    `,
      [user_id, word_id],
    );

    return result.rows[0];
  },

  async getByUserIdAndWordId(user_id: string, word_id: number) {
    const result = await query<GetByUserIdAndWordId>(
      `
      SELECT 
        status, 
        note, 
        is_favorite, 
        created_at, 
        updated_at
      FROM user_words
      WHERE user_id = $1 AND word_id = $2  
    `,
      [user_id, word_id],
    );

    return result.rows[0] ?? null;
  },

  async getByUserId(
    user_id: string,
    filters: Omit<GetUserWordInput, "offset">,
    paginate: { limit: number; offset: number },
  ) {
    const { limit, offset } = paginate;

    const search = filters.search ? filters.search : null;
    const status = filters.status ? filters.status : null;
    const is_favorite = filters.is_favorite ? filters.is_favorite : null;

    const result = await query<GetByUserId>(
      `
      SELECT  
        w.word,
        uw.word_id,
        uw.status, 
        uw.is_favorite, 
        uw.created_at,
        COUNT(*) OVER() total_words
      FROM user_words uw
      JOIN words w ON uw.word_id = w.word_id 
      WHERE user_id = $1 AND 
      ($2::text IS NULL OR w.word ILIKE '%' || $2 || '%') AND 
      ($3::status_enum IS NULL OR uw.status = $3) AND
      ($4::boolean IS NULL OR uw.is_favorite = $4)
      ORDER BY w.word 
      LIMIT $5 OFFSET $6
    `,
      [user_id, search, status, is_favorite, limit + 1, offset],
    );

    return result.rows;
  },
};
