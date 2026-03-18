import first_3000_word from "../import/first_3000_words.json";
import { query } from "@/lib/db";

export const seedPos = async () => {
  console.log("📝 Seeding pos...");

  const pos = [
    ...new Set(first_3000_word.flatMap((w) => w.details.map((d) => d.pos))),
  ];
  const total = pos.length;

  for (let i = 0; i < total; i++) {
    await query(`INSERT INTO pos (pos) VALUES ($1)`, [pos[i]]);

    process.stdout.write(`\r ${i + 1}/${total} pos inserted...`);
  }

  console.log("✅ Pos seeded!");
};
