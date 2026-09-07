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

