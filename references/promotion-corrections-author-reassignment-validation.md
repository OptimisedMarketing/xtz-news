# Promotion Rotation, Corrections, and Author Reassignment Validation

**Validated:** 14 September 2026  
**Scope:** First-party promotion rotation, placeholder treatment, private correction reporting, notification routing, and selected article reassignment to Rossa Browne.

## Reader-facing validation

The homepage showed the clearly labelled **From our network** Optimised Marketing placement. After the configured eight-second interval, the same homepage advanced to the distinct **Future owner placement** state, labelled **Your next app** with a non-clickable **Reserved** control. This confirms that the configured live owner placement and the placeholder rotate without third-party advertising or tracking.

The newsroom editorial-policy page displayed the correction report form at desktop and 390 px mobile widths. The form requires the reporter’s name, email, canonical XTZ.News article URL, correction detail, and explicit good-faith review consent. It describes that reports are private, do not change articles automatically, and notify the newsroom mailbox at `info@optimised.marketing`.

## Editorial controls and safeguards

The protected `/admin/correction-reports` page was reviewed while signed in. It provides search, status filtering, visible-selection controls, shared internal notes, and bulk or individual reviewed, resolved, and rejected actions. Queue status changes do not modify published article content.

The protected `/admin/posts/:id` editor displayed the **Editorial byline** selector with the two declared authors, **Lee Evans** and **Rossa Browne**. The page explains that selecting a writer updates the public byline and author archive only.

## Automated validation

`pnpm test` passed with **155 tests across 58 files**. `pnpm check` passed. Regression coverage includes explicit correction-review consent, canonical XTZ.News URL validation, private administrator-only correction queue access, bounded bulk status updates, private notification delivery to `info@optimised.marketing`, valid owner-placement rotation configuration, placeholder support, and administrator-only Rossa Browne reassignment.

No real correction report was submitted during validation, so no production email was sent.
