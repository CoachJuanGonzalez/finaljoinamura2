import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

function parseAndEncodePostgresUrl(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Extract and re-encode password if it contains special characters
    if (parsed.password) {
      const encodedPassword = encodeURIComponent(parsed.password);
      // Reconstruct URL with properly encoded password
      return url.replace(`:${parsed.password}@`, `:${encodedPassword}@`);
    }
    
    return url;
  } catch (error) {
    console.error("Error parsing DATABASE_URL:", error);
    return url;
  }
}

const connectionUrl = parseAndEncodePostgresUrl(process.env.DATABASE_URL);

// Disable prepared statements for Supabase transaction pooler compatibility
export const client = postgres(connectionUrl, { prepare: false });
export const db = drizzle(client, { schema });
