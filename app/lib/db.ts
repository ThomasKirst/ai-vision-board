import { Database } from "sqlite3";
import { open, Database as SqliteDatabase } from "sqlite";

let db: SqliteDatabase | null = null;

export async function openDb() {
  if (!db) {
    db = await open({
      filename: "./prompts.sqlite",
      driver: Database,
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS prompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt TEXT,
        resolution TEXT,
        quality INTEGER,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.exec(`
      CREATE TABLE IF NOT EXISTS vision_board (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt_id INTEGER,
        position INTEGER,
        FOREIGN KEY (prompt_id) REFERENCES prompts (id)
      )
    `);
  }
  return db;
}

export async function getAllPrompts() {
  const db = await openDb();
  return db.all("SELECT * FROM prompts ORDER BY created_at DESC");
}
