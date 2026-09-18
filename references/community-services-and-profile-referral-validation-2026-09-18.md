# Community Services Category and Optimised Marketing Referral Control Validation

**Validated:** 18 September 2026

## Directory category

The Tezos Projects directory now contains a dedicated **Community Services** category. It is deliberately placed after the existing Community category in the ordered filter pills and is rendered only when at least one project uses the category. Optimised Marketing is the first listing, with category data verified through both the database and public `projects.all` tRPC response.

The new category is suitable for agencies, development studios and marketing providers serving the Tezos community, while retaining the existing Community category for broader community organisations and initiatives.

## Optimised Marketing referral control

The Optimised Marketing profile now presents a compact `Copy XTZ2026` button beside the website action. It copies the referral code, provides an accessible label, switches to a green checkmarked `Copied!` confirmation for 1.8 seconds, and records the interaction using the existing privacy-preserving daily aggregate copy metric. It has no third-party tracking, cookies, visitor IDs, account IDs or session IDs.

## Visual and technical checks

Desktop and 390 px mobile captures show the Community Services badge and clearly visible copy button in the profile hero. The mobile design wraps the two actions safely, preserving the header, hero identity, first-party disclosure and responsive content. TypeScript and the full regression suite passed: 176 tests across 62 files.

A browser-level interaction check confirmed that activating the profile button changes its accessible label to **“Referral code copied”** and visibly renders the green **“Copied!”** confirmation. The profile continues to identify the listing as Community Services and keeps the full first-party offer disclosure visible.

The live directory render includes the Optimised Marketing card under **COMMUNITY SERVICES**, with its service summary and website action. The category-pill strip remains horizontally scrollable so the complete filter set stays available on narrower desktop and mobile viewports without compressing labels.
