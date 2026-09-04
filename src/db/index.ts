import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";


function databaseUrl() {
  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL (or POSTGRES_URL) is not set. Add the Supabase Postgres URI.",
    );
  }
  return url;
}

const client = postgres(databaseUrl(), { ssl: "require", prepare: false });

export const db = drizzle(client, {
  schema: { ...schema},
});
