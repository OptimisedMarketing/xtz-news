# Monthly Subscriber Digest — Implementation Record

**Implemented:** 7 September 2026

The former weekly subscriber endpoint has been replaced with `POST /api/scheduled/monthly-digest`. On the first of a month, it selects **every published post** whose `publishedAt` falls within the complete prior UTC calendar month. It does not select a rolling 30-day window or an incomplete current month.

| Protection | Implementation |
| --- | --- |
| Subscriber selection | Sends only to records with `newsletter_subscribers.status = 'active'`. |
| Content selection | Uses inclusive month-start and exclusive next-month-start timestamps against published posts. |
| Safe dry run | `?dry_run=1` returns the planned month, article count, subscriber count, and content bounds without calling the email provider. |
| Retry safety | A unique `subscriberId` + `digestPeriod` delivery record prevents a confirmed recipient from receiving the same month twice. The Resend request also uses a stable monthly idempotency key. |
| Subscriber controls | Each message retains personalised Manage preferences and Unsubscribe links. |
| Failure visibility | Partial email-provider failures return a non-2xx response with counts, while already delivered subscribers remain safely excluded from a later rerun. |

The message subject is **“XTZ.News Monthly Digest — <Month Year>”** and the email body includes the complete prior-month article list rather than a five-story weekly selection.

## Automated checks

`pnpm test` completed with **105 tests across 43 files**, including calendar-month boundaries. `pnpm check` completed successfully.



## Events extension — 1 October 2026

The existing signed first-of-month monthly digest now adds two event sections to the same subscriber email. It does not create a second schedule, extra cloud process, AI task, or additional email send.

| Section | Selection rule | Reader treatment |
| --- | --- | --- |
| **Events from the month** | Editor-published event records that overlap the preceding complete UTC calendar month. A multi-day exhibition active during that month is included; an event that ended exactly at the month boundary is excluded. | Source-linked title, organiser-local date/time, location and event type. |
| **Upcoming Tezos events** | The nearest eight editor-published events with a start time at or after the digest run time. | Source-linked details, organiser-local date/time, location and event type, plus a link to the full XTZ.News Events calendar. |

The event list is read from the existing reviewed `tezos_event_candidates` records at send time. Pending, reviewed-but-unpublished and rejected candidates never enter the newsletter. If a month contains events but no articles, the digest still sends an events-only edition; if it contains neither, it skips delivery as before. Existing subscriber-status checks, delivery records, Resend idempotency keys, preference links and unsubscribe links remain unchanged.

**Dry-run verification:** a simulated 1 October 2026 run for the September edition selected **8** articles, **3** past editor-published events, **1** upcoming confirmed event and **1,017** active subscribers. It made no email-provider call. The cloud timer and signed runner were not modified.
