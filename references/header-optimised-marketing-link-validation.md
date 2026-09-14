# Header Optimised Marketing Link Validation

**Validated:** 14 September 2026  
**Scope:** Responsive external Optimised Marketing discovery link in the shared XTZ.News header.

The desktop utility bar now includes a clearly visible **OPTIMISED MARKETING** link between the XTZ.News label and Tezos Token Tracker. It links directly to `https://optimised.marketing`, opens in a new tab with `noopener noreferrer`, and has an accessible destination label identifying Optimised Marketing as the team building XTZ.News.

At 1280 px, the link is aligned with the existing utility controls without colliding with Donate XTZ, XTZ.News, token-tracker, account, or language controls. At 390 px, the primary header remains compact and uncluttered; the equivalent **Built by Optimised Marketing** external link is exposed after the mobile menu opens, below the donation control.

`pnpm test` passed with **158 tests across 59 files**, and `pnpm check` passed. Header navigation regression coverage verifies the shared external destination.
