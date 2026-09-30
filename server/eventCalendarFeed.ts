export type CalendarFeedEvent = {
  id: number | string;
  title: string;
  description?: string | null;
  startAt: Date | string;
  endAt?: Date | string | null;
  location?: string | null;
  sourceUrl: string;
  updatedAt?: Date | string | null;
};

function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function formatUtc(value: Date | string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function foldIcsLine(line: string) {
  const chunks: string[] = [];
  let remainder = line;
  while (remainder.length > 75) {
    chunks.push(remainder.slice(0, 75));
    remainder = ` ${remainder.slice(75)}`;
  }
  chunks.push(remainder);
  return chunks.join("\r\n");
}

/** Renders a subscribable, UTC-based feed of editor-published future events. */
export function renderEventsCalendarFeed(events: CalendarFeedEvent[], options: { baseUrl: string; now?: Date } ) {
  const now = options.now ?? new Date();
  const upcoming = events
    .filter((event) => new Date(event.endAt ?? event.startAt).getTime() >= now.getTime())
    .sort((left, right) => new Date(left.startAt).getTime() - new Date(right.startAt).getTime());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//XTZ.News//Tezos Events Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText("XTZ.News Tezos Events")}`,
    `X-WR-CALDESC:${escapeIcsText("Editor-reviewed upcoming Tezos events from XTZ.News")}`,
    `URL:${options.baseUrl}/events`,
    `REFRESH-INTERVAL;VALUE=DURATION:PT6H`,
    "X-PUBLISHED-TTL:PT6H",
  ];

  for (const event of upcoming) {
    const description = [event.description?.trim(), `Source: ${event.sourceUrl}`, `Calendar: ${options.baseUrl}/events`].filter(Boolean).join("\n\n");
    lines.push(
      "BEGIN:VEVENT",
      `UID:xtz-news-event-${event.id}@xtz.news`,
      `DTSTAMP:${formatUtc(event.updatedAt ?? now)}`,
      `DTSTART:${formatUtc(event.startAt)}`,
      `DTEND:${formatUtc(event.endAt ?? event.startAt)}`,
      `SUMMARY:${escapeIcsText(event.title)}`,
      event.location ? `LOCATION:${escapeIcsText(event.location)}` : "",
      description ? `DESCRIPTION:${escapeIcsText(description)}` : "",
      `URL:${event.sourceUrl}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR", "");
  return lines.filter(Boolean).map(foldIcsLine).join("\r\n");
}
