import { query } from "@/lib/db";

export const seedLevels = async () => {
  console.log("📝 Seeding levels...");

  const levels = ["a1", "a2", "b1", "b2", "c1", "c2"];

  const total = levels.length;

  for (let i = 0; i < total; i++) {
    await query(`INSERT INTO levels (level) VALUES ($1)`, [levels[i]]);

    process.stdout.write(`\r ${i + 1}/${total} level inserted...`);
  }

  console.log("✅ Levels seeded.");
};
