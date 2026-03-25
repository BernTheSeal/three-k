import { query } from "@/lib/db";

type GetByWord = {
  word_id: number;
  word: string;
  locale: "uk" | "us";
  text: string;
  mp3: string;
  pos: string;
  level: string;
};

const getByWord = async (word: string) => {
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
};

export default { getByWord };
