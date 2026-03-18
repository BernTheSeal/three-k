import first_3000_word from "../import/first_3000_words.json";
import { query } from "@/lib/db";

export const seedWords = async () => {
  console.log("📝 Seeding words...");

  const words = first_3000_word.map((w) => w.word);
  const total = words.length;

  for (let i = 0; i < total; i++) {
    await query(`INSERT INTO words (word) VALUES($1)`, [words[i]]);

    process.stdout.write(`\r ${i + 1}/${total} words inserted...`);
  }

  console.log("✅ Words seeded!");
};
