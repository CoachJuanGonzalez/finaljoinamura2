import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Fix special characters in password by URL encoding
function fixDatabaseUrl(url: string): string {
  try {
    // Parse the URL manually - match everything between user: and the LAST @ (before host)
    const match = url.match(/^(postgres(?:ql)?):\/\/([^:]+):(.+)@([^@]+)$/);
    if (!match) return url;
    
    const [, protocol, user, password, hostAndDb] = match;
    const encodedPassword = encodeURIComponent(password);
    return `${protocol}://${user}:${encodedPassword}@${hostAndDb}`;
  } catch {
    return url;
  }
}

// Disable prepared statements for Supabase transaction pooler compatibility
export const client = postgres(fixDatabaseUrl(process.env.DATABASE_URL), { prepare: false });
export const db = drizzle(client, { schema });
