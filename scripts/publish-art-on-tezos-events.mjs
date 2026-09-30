import { createHash } from "node:crypto";
import { createConnection } from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const url = new URL(databaseUrl);
const connection = await createConnection({
  host: url.hostname,
  port: Number(url.port || 3306),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1).split("?")[0],
  ssl: { rejectUnauthorized: false },
});

const sourceKey = "xtz-news-editorial-art-recap-2026-09";
const sourceCheckedAt = new Date("2026-09-30T15:45:00.000Z");
const reviewedNote = "Editor-published from the cited primary organiser source on 30 September 2026. Timing and availability should be confirmed with the organiser.";

const events = [
  {
    sourceEventId: "terms-of-agreement-momi-2026",
    sourceUrl: "https://movingimage.org/event/terms-of-agreement/",
    title: "Terms of Agreement 🐳",
    description: "A Museum of the Moving Image commission by Jonas Lund and Yoshi Sodeoka, presented within the museum’s year-long partnership with the Tezos Foundation. The live work combines Tezos network data with tracked cetacean data in a triptych of autonomous simulations.",
    startAt: "2026-08-06T00:00:00-04:00",
    endAt: "2026-10-25T23:59:59-04:00",
    location: "Museum of the Moving Image, Astoria, New York, United States",
    timezone: "America/New_York",
    speakers: ["Jonas Lund", "Yoshi Sodeoka"],
    topics: ["Art on Tezos", "Digital Art", "Interactive Art", "Exhibitions"],
    eventType: "exhibition",
  },
  {
    sourceEventId: "responsive-signals-momi-2026",
    sourceUrl: "https://movingimage.org/event/responsive-signals/",
    title: "Responsive Signals",
    description: "Museum of the Moving Image and Art on Tezos presented an evening of artist talks and interactive installations featuring Jonas Lund, Yoshi Sodeoka, Kat Zhang and Nick Fox-Gieg. The event formed part of MoMI’s Open Worlds 2026 programme and its annual partnership with the Tezos Foundation.",
    startAt: "2026-09-22T18:00:00-04:00",
    endAt: "2026-09-22T21:00:00-04:00",
    location: "William Fox Amphitheater, Museum of the Moving Image, Astoria, New York, United States",
    timezone: "America/New_York",
    speakers: ["Jonas Lund", "Yoshi Sodeoka", "Kat Zhang", "Nick Fox-Gieg"],
    topics: ["Art on Tezos", "Digital Art", "Interactive Art", "Artist Talks", "Exhibitions"],
    eventType: "exhibition",
  },
  {
    sourceEventId: "stories-we-tell-online-vienna-2026",
    sourceUrl: "https://x.com/artontezos_/status/2102674387048800679",
    title: "Stories We Tell Online",
    description: "A one-night Art on Tezos exhibition at Vienna internet café Click-Net, where work by 22 artists took over the venue’s screens. The event explored online worlds, conspiracies, fandoms, archives, identities, myths and collective fictions.",
    startAt: "2026-09-23T18:00:00+02:00",
    endAt: "2026-09-23T22:00:00+02:00",
    location: "Click-Net, Martinstraße 91, 1180 Vienna, Austria",
    timezone: "Europe/Vienna",
    speakers: ["Postanika", "Kika Nicolela", "Micol"],
    topics: ["Art on Tezos", "Digital Art", "Internet Art", "Exhibitions"],
    eventType: "exhibition",
  },
];

for (const event of events) {
  const sourceHash = createHash("sha256").update(JSON.stringify(event)).digest("hex");
  await connection.execute(
    `INSERT INTO tezos_event_candidates
      (sourceKey, sourceEventId, sourceUrl, title, description, startAt, endAt, location, timezone, speakers, topics, eventType, agreedToReview, sourceHash, sourceCheckedAt, status, adminNotes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, 'published', ?)
     ON DUPLICATE KEY UPDATE
      sourceUrl = VALUES(sourceUrl),
      title = VALUES(title),
      description = VALUES(description),
      startAt = VALUES(startAt),
      endAt = VALUES(endAt),
      location = VALUES(location),
      timezone = VALUES(timezone),
      speakers = VALUES(speakers),
      topics = VALUES(topics),
      eventType = VALUES(eventType),
      agreedToReview = VALUES(agreedToReview),
      sourceHash = VALUES(sourceHash),
      sourceCheckedAt = VALUES(sourceCheckedAt),
      status = 'published',
      adminNotes = VALUES(adminNotes)`,
    [
      sourceKey,
      event.sourceEventId,
      event.sourceUrl,
      event.title,
      event.description,
      new Date(event.startAt),
      new Date(event.endAt),
      event.location,
      event.timezone,
      JSON.stringify(event.speakers),
      JSON.stringify(event.topics),
      event.eventType,
      sourceHash,
      sourceCheckedAt,
      reviewedNote,
    ],
  );
}

const [published] = await connection.execute(
  "SELECT id, title, startAt, endAt, location, eventType, status FROM tezos_event_candidates WHERE sourceKey = ? ORDER BY startAt ASC",
  [sourceKey],
);

console.log(JSON.stringify({ published }, null, 2));
await connection.end();
