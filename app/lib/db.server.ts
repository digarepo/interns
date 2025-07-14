// db.server.ts
// Simple SQLite database connection and query helper for demonstration purposes.
// You can replace this with your actual database logic (e.g., Prisma, Knex, etc.)

import Database from 'better-sqlite3';
import path from 'path';

// Adjust the path to your SQLite database file as needed
const dbPath = path.join(__dirname, '../db.sqlite');
const db = new Database(dbPath);

export function query(sql: string, params?: any[]): any[] {
  const stmt = db.prepare(sql);
  if (params) {
    return stmt.all(...params);
  }
  return stmt.all();
}

export default db;
