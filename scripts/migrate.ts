import fs from "fs";
import path from "path";
import { query } from "../lib/db";
import { pathToFileURL } from "url";

interface Migration {
  version: number;
  up: () => Promise<void>;
  down?: () => Promise<void>;
}

async function migrate() {
  console.log("Migration starting...\n");

  await query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      version INTEGER UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT NOW()
    )
  `);

  const executed = await query<{ version: number }>(
    "SELECT version FROM migrations ORDER BY version",
  );
  const executedVersions = executed.rows.map((r) => r.version);

  const migrationsDir = path.join(__dirname, "../", "migrations");

  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".ts"))
    .sort();

  for (const file of migrationFiles) {
    const version = parseInt(file.split("_")[0]);

    if (!executedVersions.includes(version)) {
      console.log(`Running...: ${file}`);

      try {
        const migrationPath = path.join(__dirname, "../", "migrations", file);
        const migrationModule = await import(pathToFileURL(migrationPath).href);
        const migration = migrationModule.default as Migration;
        const migrationName = file.replace(".ts", "");

        await query("BEGIN");

        await migration.up();

        await query("INSERT INTO migrations (version, name) VALUES ($1, $2)", [
          version,
          migrationName,
        ]);

        await query("COMMIT");

        console.log(`${file} completed successfully`);
      } catch (error) {
        await query("ROLLBACK");
        console.error(
          `${file} failed:`,
          error instanceof Error ? error.message : error,
        );
        process.exit(1);
      }
    } else {
      console.log(`-> Skipping ${file} (already executed)`);
    }
  }

  console.log("Migration completed successfully!");
  process.exit(0);
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
