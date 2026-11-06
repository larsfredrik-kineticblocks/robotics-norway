import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { members } from "@/lib/db/schema";

const globalForDb = globalThis as unknown as { pool?: Pool };

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  if (!globalForDb.pool) {
    globalForDb.pool = new Pool({
      connectionString,
      max: 3,
      connectionTimeoutMillis: 8000,
      idleTimeoutMillis: 10000,
    });
  }
  return drizzle(globalForDb.pool, { schema: { members } });
}

export type Database = NonNullable<ReturnType<typeof getDb>>;
