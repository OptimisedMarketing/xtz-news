# Compact Banner and Advertising Enquiry Confirmation Validation

**Validated:** 15 September 2026

## Homepage banner treatment

The homepage first-party banner now uses the full available content width while its surrounding unit is more compact. The `From our network` label, top and bottom spacing, and banner container have been reduced without changing the supplied banner artwork, safe external destination, or first-party media path. The article placement remains constrained to the reading column.

Desktop and 390px mobile captures confirmed that the revised unit follows the homepage lead-story module, retains a clear first-party label, and does not interfere with the header, lead-story controls, or mobile navigation.

## Advertising enquiry acknowledgement

After a valid consented advertiser enquiry is stored, the system now attempts three independent follow-up actions: an internal owner notification, a private advertising-inbox notification to `info@optimised.marketing`, and a branded acknowledgement to the submitter's stated email address. The acknowledgement confirms receipt only; it does not promise campaign availability, pricing, placement, or publication. The advertising inbox is copied privately on the acknowledgement for continuity.

## Automated validation

The complete test suite passed with **170 tests across 61 files**, and TypeScript validation passed. Coverage verifies that advertiser alerts target the private advertising mailbox, confirmations target the enquirer with the private inbox copied, and expired or disabled image-banner campaigns do not render.
