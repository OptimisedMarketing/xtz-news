# Community Services Landing and Navigation Validation

**Validated:** 18 September 2026

## Landing page and agency submission

A dedicated, indexable Community Services directory landing page is available at `/community-services`. It describes the category as a discovery surface for Tezos-facing agencies, development studios and marketing providers, explains the directory’s purpose and non-endorsement position, and displays the current matching project profiles. The primary **Submit your agency** action takes the reader to `/submit-project?category=Community%20Services`, which responds successfully and preselects the Community Services category in the submission form.

## Navigation and crawlability

The shared desktop header now exposes Community Services as a primary navigation item between Projects and Timeline. The shared mobile Read section contains the equivalent Community Services destination. Because every public page uses the shared Layout header, this preserves one global header/menu instance across the page.

The new route is guarded from article-slug handling, receives its own canonical crawler metadata, and is included in the canonical XML sitemap. The Googlebot response confirmed the expected title and canonical URL.

## Visual checks

At 1280 px, the landing page presents the full header, breadcrumbs, title, explanatory description, submit action and all-projects return path with a clear hierarchy. At 390 px, the shared mobile header remains singular, the title wraps cleanly, both actions stay comfortably tappable, and the overview card begins below the hero without horizontal overflow.

## Automated validation

TypeScript passes and the complete regression suite passes: **178 tests across 62 files**. Navigation coverage verifies that Community Services is configured for both desktop and mobile menus; crawler coverage verifies static sitemap inclusion, article-route protection and unique canonical metadata.

A browser-level action check confirmed that the **Submit your agency** link retains `category=Community%20Services` and opens the existing submission workflow with **Community Services already selected**. The destination still renders the same single shared site header and all standard project-submission fields.
