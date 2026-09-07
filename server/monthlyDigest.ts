export type MonthlyDigestWindow = {
  digestPeriod: string;
  label: string;
  start: Date;
  end: Date;
};

/**
 * Returns the complete prior UTC calendar month. The scheduled task runs on
 * the first of a month, so it never sends a partial current-month roundup.
 */
export function getPreviousCalendarMonth(now: Date = new Date()): MonthlyDigestWindow {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const digestPeriod = start.toISOString().slice(0, 7);
  const label = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(start);

  return { digestPeriod, label, start, end };
}

