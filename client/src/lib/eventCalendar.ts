export type CalendarDownloadEvent = {
  id: string;
  title: string;
  startAt: string;
  endAt?: string;
  location?: string;
  description?: string;
  sourceUrl: string;
};

function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function formatUtc(value: string) {
  const date = new Date(value);
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildEventCalendarIcs(event: CalendarDownloadEvent) {
  const stamp = formatUtc(new Date().toISOString());
  const description = `${event.description ?? ""}\n\nSource: ${event.sourceUrl}`.trim();
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//XTZ.News//Tezos Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:xtz-news-${escapeIcsText(event.id)}@xtz.news`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${formatUtc(event.startAt)}`,
    `DTEND:${formatUtc(event.endAt ?? event.startAt)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    event.location ? `LOCATION:${escapeIcsText(event.location)}` : "",
    description ? `DESCRIPTION:${escapeIcsText(description)}` : "",
    `URL:${event.sourceUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].filter(Boolean).join("\r\n");
}

export function getEventCalendarDownloadHref(event: CalendarDownloadEvent) {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(buildEventCalendarIcs(event))}`;
}
