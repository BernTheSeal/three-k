import first_3000_word from "../import/first_3000_words.json";
import { query } from "@/lib/db";

export const seedWordPhonetics = async () => {
  console.log("📝 Seeding words phonetics...");

  const words = first_3000_word;
  let total = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i].word;

    const result = await query(`SELECT word_id FROM words WHERE word = $1`, [
      word,
    ]);

    const word_id = result.rows[0].word_id;

    for (const [locale, val] of Object.entries(words[i].phonetics)) {
      await query(
        `INSERT INTO word_phonetics (word_id, locale, text, mp3) VALUES($1, $2, $3, $4)`,
        [word_id, locale, val.text, val.mp3],
      );
      total++;
      process.stdout.write(`\r ${total} phonetics inserted...`);
    }
  }

  console.log("✅ Words phonetics seeded!");
};
