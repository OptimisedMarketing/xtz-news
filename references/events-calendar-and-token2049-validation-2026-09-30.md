# Events Calendar and TOKEN2049 Publication Validation

**Validated:** 30 September 2026

## Calendar discovery

- `/events` now offers a **Show** control for **All event records**, **Current & upcoming**, **Future scheduled**, and **Past events**.
- Optional **Starts on or after** and **Starts on or before** controls combine with existing location and event-type filters. Date-only selections are persisted in the URL as `when`, `from`, and `to` query parameters.
- The page retains past records as an explicitly labelled editorial archive. Current and future records remain distinct from past listings when the full calendar is selected.
- Each card displays its organiser timezone, primary source link, and downloadable calendar file.
- The homepage sidebar selects the nearest future editor-published record, then falls back to an ongoing event only if no future record exists. It shows the event’s organiser timezone and links to both the calendar and official listing.

## TOKEN2049 article and event

- Published article: `/arthur-breitman-token2049-quantum-risks-crypto`
- Article is assigned to **Latest News** and **Infrastructure**, with Tezos, Post-Quantum, Cryptography, Quantum Computing and Arthur Breitman tags.
- The article has four bullet-form Key Takeaways, a source-grounded account of the session, clear event details, direct links to the official TOKEN2049 agenda and Tezos announcement, and a featured image taken from Tezos’ official announcement image.
- Published calendar record: **Quantum: An Existential Threat to Crypto?** — BingX Labs Stage, TOKEN2049 Singapore, 7 October 2026, 4:20–4:50pm SGT.
- Primary sources checked: Tezos announcement on X and the TOKEN2049 Singapore official agenda. The agenda confirms the panel title, speakers, moderator, BingX Labs Stage and scheduled time.

## Crawlability and media

- Googlebot output includes the article canonical URL and `NewsArticle` structured data.
- The dynamic News sitemap includes the new article URL, title and publication date.
- The official announcement visual is stored in project media and confirmed at both `/manus-storage/...` and same-origin `/media/...` paths; the rendered article uses the project media relay.

## Validation run

- `pnpm check` passed.
- Full regression suite passed: **64 files / 193 tests**.
- `git diff --check` passed.
- Desktop and mobile captures confirmed the calendar’s date controls, current/future and past sections, the article featured image and responsive layout.
- Browser-level homepage verification confirmed the next-event widget selects and renders the 7 October TOKEN2049 event without a date-formatting error.
