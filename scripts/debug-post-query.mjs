import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { and, eq } from "drizzle-orm";
import { posts } from "../drizzle/schema.ts";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not available to the diagnostic.");
}

const pool = mysql.createPool(databaseUrl);
const db = drizzle(pool);

try {
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, "art-on-tezos-weekly-recap-2026-08-21"), eq(posts.status, "publish")))
    .limit(1);
  console.log(JSON.stringify({ result: "ok", count: rows.length }));
} catch (error) {
  const safeError = error instanceof Error ? error : new Error(String(error));
  console.error(JSON.stringify({
    result: "error",
    name: safeError.name,
    message: safeError.message,
    code: "code" in safeError ? safeError.code : undefined,
    cause: safeError.cause instanceof Error ? safeError.cause.message : safeError.cause,
  }));
} finally {
  await pool.end();
}
