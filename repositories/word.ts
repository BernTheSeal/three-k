import { query } from "@/lib/db";
import { GetByWord, GetAll } from "@/schemas/validators/word";
import { GetWordsInput } from "@/schemas/validators/word";

export const wordRepository = {
  async getAll(
    filters: Omit<GetWordsInput, "offset">,
    paginate: { offset: number; limit: number },
  ) {
    const { search } = filters;

    const { offset, limit } = paginate;

    const pos = filters.pos ? filters.pos : null;
    const levels = filters.levels ? filters.levels : null;

    const result = await query<GetAll>(
      `
      SELECT * , COUNT(*) OVER() total_words FROM (
        SELECT 
          w.word, 
          array_agg(DISTINCT p.pos) as pos,
          array_agg(DISTINCT l.level) as levels
        FROM words w
        JOIN word_pos_levels wpl ON w.word_id = wpl.word_id
        JOIN pos p ON p.pos_id = wpl.pos_id
        JOIN levels l ON l.level_id = wpl.level_id
        GROUP BY w.word
        ORDER BY w.word ASC
      )
      WHERE 
      ($1::varchar[] IS NULL OR pos && $1::varchar[]) AND 
      ($2::varchar[] IS NULL OR levels && $2::varchar[]) AND
      ($3::text IS NULL OR word ILIKE '%' || $3 || '%')

      LIMIT $4 OFFSET $5
    `,
      [pos, levels, search, limit + 1, offset],
    );

    return result.rows;
  },

  async getByWord(word: string) {
    const result = await query<GetByWord>(
      `
        SELECT 
          w.word_id, w.word, wp.locale, wp.text, wp.mp3, p.pos, l.level 
        FROM words w
        JOIN word_phonetics wp ON w.word_id = wp.word_id 
        JOIN word_pos_levels wps ON wps.word_id = w.word_id
        JOIN pos p ON wps.pos_id = p.pos_id
        JOIN levels l ON wps.level_id = l.level_id
        WHERE w.word = $1
        `,
      [word],
    );

    return result.rows;
  },
};
