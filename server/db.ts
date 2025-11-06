import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

/**
 * STABLE DATABASE CONNECTION - DO NOT MODIFY
 *
 * Uses DATABASE_URL directly - the postgres library handles URL parsing and encoding.
 * Requires DATABASE_URL secret in format:
 * postgresql://user:password@host:port/database
 *
 * Password should be URL-encoded if it contains special characters.
 * Example: MyPass!@# becomes MyPass%21%40%23
 */
export const client = postgres(process.env.DATABASE_URL, {
  prepare: false  // Required for Supabase transaction pooler
});
export const db = drizzle(client, { schema });
