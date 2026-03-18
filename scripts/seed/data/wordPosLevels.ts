import first_3000_word from "../import/first_3000_words.json";
import { query } from "@/lib/db";

export const seedWordPosLevels = async () => {
  console.log("📝 Seeding word pos levels...");

  const wordsRes = await query(`SELECT word_id, word FROM words`);
  const posRes = await query(`SELECT pos_id, pos FROM pos`);
  const levelsRes = await query(`SELECT level_id, level FROM levels`);

  const wordMap = Object.fromEntries(
    wordsRes.rows.map((r) => [r.word, r.word_id]),
  );
  const posMap = Object.fromEntries(posRes.rows.map((r) => [r.pos, r.pos_id]));
  const levelMap = Object.fromEntries(
    levelsRes.rows.map((r) => [r.level, r.level_id]),
  );

  const words = first_3000_word;
  let total = 0;

  for (const word of words) {
    const word_id = wordMap[word.word];

    for (const detail of word.details) {
      const pos_id = posMap[detail.pos];
      const level_id = levelMap[detail.level];

      await query(
        `INSERT INTO word_pos_levels (word_id, pos_id, level_id) VALUES($1, $2, $3)`,
        [word_id, pos_id, level_id],
      );

      total++;
      process.stdout.write(`\r ${total} word pos levels inserted...`);
    }
  }

  console.log(`\n✅ Word pos levels seeded!`);
};
