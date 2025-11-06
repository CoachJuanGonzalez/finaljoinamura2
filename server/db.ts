import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Postgres library can handle URL-encoded passwords correctly
// Just pass the DATABASE_URL directly - the library will parse it
export const client = postgres(process.env.DATABASE_URL, { 
  prepare: false  // Disable prepared statements for Supabase transaction pooler compatibility
});
export const db = drizzle(client, { schema });
