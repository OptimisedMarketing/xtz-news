# Art on Tezos Calendar, Timeline Preview, and Event Discovery Validation

## Reader interactions

The Art on Tezos timeline now displays **Add to calendar** for entries whose confirmed date is still upcoming. The generated `.ics` file contains the title, UTC start and end time, location, source-link description, and a stable XTZ.News event identifier. Timeline cards now reveal a quick preview when hovered or keyboard-focused; the preview shows date, location, and an original source link. The expanded card remains available for touch users and includes the same source path and calendar action.

Desktop and 390px mobile screenshots confirmed that the timeline, event filters, preview behaviour, calendar control, and submission section remain readable. The new `/events` route correctly displays its editor-published empty state until an administrator publishes a reviewed candidate.

## Weekly cloud discovery

| Control | Verified outcome |
| --- | --- |
| Sources | The runner reads only the approved public TheTezosCommunity and Art on Tezos Luma calendar pages documented in [tezos-event-discovery-sources.md](./tezos-event-discovery-sources.md). |
| Bounded fetching | Each weekly run uses one ordinary HTTPS request per source, an identifying user agent, a 20-second timeout, and a 2 MB response cap. |
| Candidate safety | The signed payload is host-allowlisted, freshness-limited, size-limited, and idempotent. The cloud worker has no database credential or public-publishing ability. |
| Production validation | A signed cloud run succeeded. Eight TheTezosCommunity calendar matches collapsed into three distinct source candidates; the Art on Tezos calendar reported no current upcoming listing. All three candidates are `pending`; none was published automatically. |
| Persistent service | `xtz-events-discovery.timer` is enabled for Sunday 07:30 UTC with up to 15 minutes random delay. The service test returned success; the signing key and state file are owner-only (`0600`). |

## Automated validation

`pnpm test` passed with **129 tests across 49 files**, and `pnpm check` passed with no TypeScript errors. Focused coverage confirms ICS escaping and formatting, calendar-link availability, focus-triggered quick preview, signed source-allowlisted payload verification, reader-safe published-event access, and administrator-only candidate-status updates.
