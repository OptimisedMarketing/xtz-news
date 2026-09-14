# Advertiser Enquiries and Campaign Expiry Validation

**Validated:** 14 September 2026

## Advertising page

`/advertise` now separates the available placement types from their starting-price or quote-based status. The page documents homepage and article companion banners, newsletter sponsorship, sponsored articles, featured directory listings, creative requirements, first-party labelling, and automatic campaign expiry. The pricing table is horizontally scrollable on narrow screens rather than compressing its content.

## Private enquiry workflow

The enquiry form collects contact name, email, company/project, optional website, requested placement, campaign details, and explicit consent to be contacted. Requests create private `advertiser_enquiries` review records; no placement, payment, or public content is created automatically. The associated mailbox notification is sent to `info@optimised.marketing`, with regression coverage confirming the destination. Administrators can search, filter, add notes, select visible records, and update individual or selected enquiries through the protected `/admin/advertiser-enquiries` queue.

## Campaign end date

The first-party promotion editor now provides `Image banner campaign` controls. An administrator can set a UTC end date or manually hide the banner. The shared banner queries this public campaign state and checks time locally once per minute, allowing it to disappear without a scheduled job when a campaign expires.

## Validation

Desktop and 390px mobile checks confirmed the public page, table, form, campaign settings, and private review queue remain readable and usable. The full regression suite passed with **169 tests across 61 files**, and TypeScript validation passed.
