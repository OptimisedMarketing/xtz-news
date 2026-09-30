# Events Calendar Subscription and Discovery Validation

**Validated:** 30 September 2026

## Calendar subscription feed

- `GET /events.ics` returns `200 OK` with `Content-Type: text/calendar; charset=utf-8`, an inline `.ics` filename and a short public cache header.
- The feed declares VCALENDAR 2.0 metadata, a named **XTZ.News Tezos Events** calendar, six-hour refresh hints, and balanced VEVENT output.
- Only currently active or future editor-published records are included; completed single-date records are excluded.
- Event descriptions preserve the organiser source link and direct readers back to the XTZ.News events calendar.
- The public Events page includes a **Subscribe** `webcal://xtz.news/events.ics` control plus a visible, standards-feed fallback at `https://xtz.news/events.ics`.

## Speaker and topic discovery

- The event data model now stores structured optional `speakers` and `topics` arrays without changing event-review status controls.
- The four existing editor-published records were populated with source-grounded labels: TOKEN2049’s published speaker panel and the published Art on Tezos / MoMI participant context.
- The Events page provides accessible select filters and keyboard-reachable chip controls for speaker and topic discovery. Selecting the **Post-Quantum** topic retains the filter in the URL and narrows the public calendar to the TOKEN2049 panel.
- Existing location, type, current/future/past and date-range filtering remain available; clear filters resets the whole discovery state.

## Article integration

- The TOKEN2049 panel article includes a branded **Save the TOKEN2049 quantum panel** calendar callout.
- The latest Art on Tezos recap includes a branded **Find the next Art on Tezos event** calendar callout.
- Both callouts route to their targeted public Events filters and include a direct calendar-feed link.

## Validation performed

- Focused feature tests: **6 files / 13 assertions** passed.
- Full suite: **198 tests across 67 files** passed.
- TypeScript: `pnpm check` passed.
- Calendar structure was independently checked for balanced VCALENDAR/VEVENT output and correct active-record inclusion.
- Desktop and 390px mobile full-page captures confirmed the subscription panel, speaker/topic filters, tagged event cards and article callouts render cleanly.
