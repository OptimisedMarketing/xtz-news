import { createConnection } from "mysql2/promise";

const databaseUrl = new URL(process.env.DATABASE_URL);
const connection = await createConnection({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.slice(1).split("?")[0],
  ssl: { rejectUnauthorized: false },
});

const featuredImageUrl = "/manus-storage/Screenshot2026-10-01at19.00.21_0a21db48.webp";
const featuredImageAlt = "Tezos Encrypted Ledger: Private. Post-quantum. Now.";

try {
  const [result] = await connection.execute(
    `UPDATE projects
     SET featuredImageUrl = ?, featuredImageAlt = ?, updatedAt = NOW()
     WHERE slug = 'tzel'`,
    [featuredImageUrl, featuredImageAlt],
  );

  if (result.affectedRows !== 1) {
    throw new Error(`Expected one TzEL project to update, received ${result.affectedRows}.`);
  }

  const [[project]] = await connection.execute(
    `SELECT id, title, slug, featuredImageUrl, featuredImageAlt, updatedAt
     FROM projects WHERE slug = 'tzel'`,
  );

  if (!project || project.featuredImageUrl !== featuredImageUrl || project.featuredImageAlt !== featuredImageAlt) {
    throw new Error("TzEL image verification failed after update.");
  }

  console.log(JSON.stringify({ project }, null, 2));
} finally {
  await connection.end();
}
