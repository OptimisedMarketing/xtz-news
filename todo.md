# XTZ.News Migration TODO

## Phase 3: Database Schema & Design System
- [x] Define full database schema (posts, categories, tags, projects, events, media, submissions)
- [x] Apply database migrations
- [x] Set up global CSS design system (dark navy palette, Barlow font, CSS variables)
- [x] Build Header component (dual-tone, logo, nav, dark mode toggle, search icon)
- [x] Build Footer component (logo, nav links, social icons)
- [x] Build Layout wrapper with scroll-to-top

## Phase 4: Core Pages
- [x] Homepage (hero slider, Latest News carousel, Most Read tab, Featured News grid)
- [x] News article single page (full content, featured image, categories, tags, social sharing, related posts)
- [x] Category archive page (filtered posts, pagination)
- [x] Tag archive page (filtered posts, pagination)
- [x] Latest News listing page

## Phase 5: Additional Pages
- [x] Tezos Projects directory (filterable cards by category)
- [x] Individual project detail page
- [x] Timeline page
- [x] Watch page
- [x] Contact page
- [x] Advertise page
- [x] Submit Article page (form with file upload, S3 storage for files/images, owner email notification)
- [x] Search results page

## Phase 6: Admin CMS & Data Import
- [x] Admin dashboard (protected, owner only)
- [x] Admin: Posts management (list, create, edit, delete, feature toggle)
- [x] Admin: Categories management
- [x] Admin: Tags management
- [x] Admin: Projects management
- [x] Admin: Article submissions inbox (with approve/reject/review actions)
- [x] Seed script: import 888 posts from WordPress extract
- [x] Seed script: import clean categories (no WPML translations) — 228 categories
- [x] Seed script: import 212 tags
- [x] Seed script: import 37 projects
- [x] Seed script: import 10 events
- [x] Seed script: media URLs stored directly on posts

## Phase 7: Interactive Features
- [x] Dark mode toggle (persisted in localStorage)
- [x] Full-text search (posts, pages, projects)
- [x] Social sharing buttons (Facebook, Twitter, LinkedIn, Telegram, Copy Link)
- [x] Related posts section on article pages
- [x] Scroll-to-top arrow on all pages
- [x] Scroll position reset on page navigation
- [x] Mobile responsive design (all pages)

## Phase 8: Testing & Delivery
- [x] Vitest unit tests for key procedures (20 tests passing)
- [x] Cross-browser check
- [x] Final checkpoint and deliver

## Phase 9: Blockchain Explorer
- [x] explorerRouter.ts — TzKT + CoinGecko tRPC endpoints (networkStats, latestBlocks, blockByLevel, blockByHash, latestTransactions, transactionByHash, accountByAddress, bakers, search, tokenTransfers, governance)
- [x] ExplorerPage.tsx — Dashboard with search, network stats, latest blocks/txs, token transfers
- [x] BlockPage.tsx — Block detail page (level/hash lookup, operations list)
- [x] TxPage.tsx — Transaction detail page
- [x] AddressPage.tsx — Address/account detail with balance, delegations, recent txs
- [x] BakersPage.tsx — Baker leaderboard (top 50 by balance)
- [x] App.tsx — All 5 explorer routes added
- [x] Header.tsx — EXPLORER added to nav
- [x] Fixed bakers sort: sort.desc=stakingBalance → sort.desc=balance (TzKT API constraint)
- [x] All endpoints verified working via curl tests
- [x] TypeScript check: 0 errors
- [x] All 20 tests passing

## Phase 10: Explorer Enhancements
- [x] Add "Delegate XTZ" CTA banner + per-row delegate button on baker leaderboard linking to delegation guide
- [x] Remove any dark mode toggle from explorer pages (site is permanently dark)

## Phase 11: Source Backup
- [x] Create a separate private OptimisedMarketing GitHub repository for a complete XTZ.News project backup

## Phase 12: Reader Usability Audit
- [x] Assess key reader journeys and prioritise the ten highest-impact usability improvements

## Phase 13: Reader Experience Improvements
- [x] Repair translated article routes and translated page metadata
- [x] Simplify homepage hierarchy so editorial content leads the experience
- [x] Add prominent global search with keyboard access and instant results
- [x] Simplify the mobile navigation menu and improve tap-target hierarchy
- [x] Shorten Key Takeaways into scan-friendly reader summaries
- [x] Consolidate article reading utilities into a calmer reading-controls surface
- [x] Add focused Vitest coverage and validate desktop and mobile reader journeys
- [x] Render correct project titles in global search and verify project-result matches
- [x] Validate the simplified mobile navigation and mobile article/search journeys at a mobile viewport

## Phase 14: Reader Personalisation
- [x] Add a persistent category-following preference model for signed-in readers
- [x] Add reader controls to follow and unfollow categories from category pages
- [x] Build a compact personalised For You feed from followed categories
- [x] Provide a clear visitor state and a safe empty state for readers without preferences
- [x] Add Vitest coverage and validate the personalised reader journeys
- [ ] Validate signed-in category follow and unfollow persistence in the browser
- [ ] Verify the signed-in For You feed and its no-matching-stories empty state

## Phase 16: Custom Reader Authentication
- [x] Add secure custom email-and-password registration and login for readers
- [x] Provide email verification and password-reset flows without relying on Manus OAuth
- [x] Add an account entry point and replace preference-login prompts with custom sign-in
- [x] Connect custom reader sessions to followed categories and the For You feed
- [x] Add automated auth coverage and validate end-to-end reader sign-in journeys

## Phase 17: Expanded Reader Topics
- [x] Verify the current signed-in reader's Etherlink preference and personalised For You feed
- [x] Add additional crypto-relevant topic categories to the followable catalogue
- [x] Surface followed and suggested topics clearly in the reader-facing personalisation flow
- [ ] Add coverage and validate the expanded topic-selection and For You feed journeys
- [ ] Browser-verify authenticated follow and unfollow persistence across refresh
- [ ] Browser-verify the authenticated Etherlink For You feed and no-matching-stories state
- [x] Add focused automated coverage for expanded topic choices and personalised feed selection
- [ ] Browser-validate expanded signed-in topic selection, including selecting and deselecting an added category
- [x] Add automated coverage for personalised feed results across followed categories
- [ ] Add reader-facing topic selection coverage for selecting and deselecting expanded topics
- [ ] Browser-test signed-in follow, unfollow, refresh, and persistence without retaining unwanted preference changes
- [ ] Add focused UI coverage for the signed-in For You no-matching-stories state

## Phase 18: Media Delivery Repair
- [x] Identify the common failure across missing homepage and article image URLs
- [x] Repair broken image URL handling and replace unavailable media references
- [x] Verify representative hero, article-card, and article-page images load on the development preview
- [x] Verify representative hero, article-card, and article-page images load on the live custom domain after release
- [x] Remove duplicate related-article keys so article-page media validation is free of client warnings
- [x] Record post-fix browser-console verification of the media and related-article journey
- [x] Save visual evidence that a homepage card image and article hero image render through the media relay

## Phase 19: Live Custom-Domain Media Follow-up
- [x] Trace the post-deployment image failures on xtz.news and www.xtz.news
- [x] Repair any production route, deployment, or cache behaviour still bypassing the media relay
- [x] Verify restored homepage card and article hero images on the live custom domain
- [x] Save explicit live visual proof for homepage cards and article hero on both custom domains
- [x] Check live-domain console and cache headers after the image relay deployment

## Phase 20: SEO Opportunity Roadmap
- [x] Audit crawlability, structured data, sitemap, canonical, and hreflang signals
- [x] Assess search-intent coverage, content discovery, internal linking, and performance opportunities
- [x] Produce and prioritise ten SEO improvements with implementation and measurement guidance

## Phase 15: Community Spotlight — Teztree
- [x] Research the official Teztree site and verify its on-chain profile features
- [x] Write and publish a Teztree Community Spotlight article with bullet Key Takeaways, categories, tags, and source link
- [x] Verify the published Teztree article and its metadata

## Phase 21: Header Logo Repair
- [x] Identify the failing XTZ.News header logo source and its reliable replacement
- [x] Replace the header logo with a stable responsive asset path
- [x] Verify the repaired logo on desktop and mobile preview headers
- [ ] Verify the repaired logo on live custom-domain headers after release
- [x] Record explicit desktop and mobile preview evidence of the visible header logo

## Phase 22: Homepage Newsletter Consolidation
- [x] Retain the primary “Stay ahead of Tezos” newsletter signup
- [x] Remove the duplicate “Stay up to date with Tezos” newsletter block from the homepage
- [ ] Verify the homepage-to-footer transition remains clean on desktop and mobile
- [ ] Record desktop and mobile visual evidence that only the primary newsletter signup remains
