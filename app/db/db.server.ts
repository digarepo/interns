import { createPool } from "mysql2/promise";
import type { Pool, PoolOptions } from "mysql2/promise";

interface DatabaseConfig extends PoolOptions {
  host: string;
  user: string;
  password: string;
  database: string;
}

function getDbConfig(): DatabaseConfig {
  return {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Tinsae",
    database: process.env.DB_NAME || "dreamers",
    port: parseInt(process.env.DB_PORT || "3309"),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

let pool: Pool;

export function initializePool() {
  if (!pool) {
    const config = getDbConfig();
    pool = createPool(config);
  }
  return pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  if (!pool) {
    initializePool();
  }
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results as T;
  } finally {
    connection.release();
  }
}

export async function initializeDatabase() {
  try {
    initializePool();
    await query(`
      CREATE TABLE IF NOT EXISTS shareholders (
        fn_id VARCHAR(20) NOT NULL PRIMARY KEY,
        full_name VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Shareholders table ready");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    throw error;
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
  }
}
