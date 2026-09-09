# Tezos Events Submission, Filter, and Bulk Review Validation

Desktop and mobile checks confirmed that the public `/events` page presents a reader-facing location selector, event-type selector, explicit reset control, and a review-only event submission form. The form labels the organiser link as an official event link, requires review consent, and makes clear that submissions do not publish automatically.

The administrator queue at `/admin/tezos-event-candidates` now supports select-visible and individual selection, a shared optional editorial note, and bulk reviewed, publish, and reject actions. Publishing and rejecting selected candidates require an administrator confirmation in the browser. The initial 390px review exposed cramped candidate text because the desktop action row consumed the available width. The cards were changed to a mobile-first vertical structure so the candidate detail and controls occupy the full available width, while retaining a compact desktop row.

Focused automated tests cover public consented submission, non-administrator rejection of bulk publish, bounded administrator batch updates, event type/location option derivation, and combined filtering. TypeScript validation passes.

The full suite passed with **138 tests across 54 files**, and the TypeScript check passed. Database verification confirmed that the three cloud-derived candidates remain `pending` with the default `community` type and that no submitted contact record or reader-facing event was created during development validation.
