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
- [x] Validate signed-in category follow and unfollow persistence in the browser
- [x] Verify the signed-in For You feed and its no-matching-stories empty state

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
- [x] Add coverage and validate the expanded topic-selection and For You feed journeys
- [x] Browser-verify authenticated follow and unfollow persistence across refresh
- [x] Browser-verify the authenticated Etherlink For You feed and no-matching-stories state
- [x] Add focused automated coverage for expanded topic choices and personalised feed selection
- [x] Browser-validate expanded signed-in topic selection, including selecting and deselecting an added category
- [x] Add automated coverage for personalised feed results across followed categories
- [x] Add reader-facing topic selection coverage for selecting and deselecting expanded topics
- [x] Browser-test signed-in follow, unfollow, refresh, and persistence without retaining unwanted preference changes
- [x] Add focused UI coverage for the signed-in For You no-matching-stories state
- [x] Browser-verify signed-in no-matching-stories state and restore the reader’s chosen topics
- [x] Add focused UI coverage for selecting and deselecting topics in the reader-facing manager
- [x] Add rendered ForYouFeed tests for signed-in empty and expanded topic-manager states
- [x] Add rendered-component tests for signed-in empty feed and topic-manager selection state

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
- [x] Verify the repaired logo on live custom-domain headers after release
- [x] Capture explicit live desktop and mobile header screenshots showing the logo image on xtz.news
- [x] Verify the logo media relay resolves on both xtz.news and www.xtz.news
- [x] Capture and record an explicit live mobile header screenshot showing the repaired logo
- [x] Record explicit desktop and mobile preview evidence of the visible header logo

## Phase 22: Homepage Newsletter Consolidation
- [x] Retain the primary “Stay ahead of Tezos” newsletter signup
- [x] Remove the duplicate “Stay up to date with Tezos” newsletter block from the homepage
- [x] Verify the homepage-to-footer transition remains clean on desktop and mobile
- [x] Record desktop and mobile visual evidence that only the primary newsletter signup remains
- [x] Capture published mobile bottom-of-page evidence showing the retained newsletter and direct footer transition

## Phase 23: Usability and Accessibility Enhancements
- [x] Audit semantic landmarks, heading structure, keyboard paths, focus indicators, and media alternatives
- [x] Add a skip link, predictable focus treatments, and semantic main-content landmarks
- [x] Improve accessible names, descriptions, and status feedback for reader controls
- [x] Improve article image alternatives and semantic content structure for assistive technology
- [x] Add accessibility-focused tests and validate keyboard and mobile reader journeys
- [x] Add explicit accessibility labels, relationships, and status feedback for article reading and sharing controls
- [x] Strengthen article-page landmarks, labelled sections, and documented image alternative fallbacks
- [x] Add labelled article body, related-content, and supporting-content regions with regression coverage
- [x] Add an accessible global scroll-to-top control across all reader pages
- [x] Add regression coverage and keyboard/mobile validation for the scroll-to-top control
- [x] Browser-test visible scroll-to-top focus and activation on desktop
- [x] Browser-test visible scroll-to-top focus and activation on mobile
- [x] Capture explicit desktop evidence of the revealed scroll-to-top control
- [x] Capture explicit mobile evidence of the revealed scroll-to-top control
- [x] Capture mobile before-and-after evidence that activating the revealed control returns the page to the top
- [x] Capture explicit keyboard Enter or Space activation evidence for the revealed scroll-to-top control

## Phase 24: Etherlink Ganesha and Native Atomic Composability Story
- [x] Verify the supplied Etherlink, Tezos, transaction, and announcement sources
- [x] Write a source-grounded Ganesha article with concise bullet Key Takeaways and SEO metadata
- [x] Create a publication-ready Etherlink-logo-led featured image
- [x] Publish the story with relevant categories, tags, source links, and the featured image
- [x] Run the existing regression suite and verify the published article experience

## Phase 25: Ganesha Story Discovery and Gateway Explainer
- [x] Review the current article page, related-post matching, and sharing components
- [x] Add a Ganesha-specific related-articles section prioritising Etherlink and Tezos coverage
- [x] Add accessible X and LinkedIn sharing controls for the Ganesha story
- [x] Build an accessible interactive explainer for the EVM and Michelson gateway flow
- [x] Add focused tests and validate the enhanced article on desktop and mobile
- [x] Verify and standardise the Ganesha X share endpoint, then validate the X and LinkedIn links
- [x] Ensure the Ganesha related-story ordering test runs under the configured Vitest include pattern
- [x] Add responsive interaction coverage for the gateway controls and record the mobile validation basis
- [x] Browser-test the Ganesha X and LinkedIn share links after endpoint standardisation

## Phase 26: Arthur Breitman Tweet Visual
- [x] Store the supplied cross-runtime-transaction tweet screenshot through project media storage
- [x] Insert the visual tweet card and original-post link into the Ganesha article
- [x] Validate the visual card and link rendering on desktop and mobile
- [x] Route the Arthur Breitman tweet screenshot through the same-origin media relay
- [x] Browser-confirm the visible tweet card on desktop and mobile
- [x] Browser-test the in-article Arthur Breitman original-post link without submitting content
- [x] Inspect the relayed tweet visual in the desktop and mobile article renders and record visible-load evidence
- [x] Inspect the rendered in-article Arthur Breitman anchor href and record its destination

## Phase 27: Ganesha Technical Navigation and Reader Conversion
- [x] Inspect the article layout and verify the official Tezos post content for a second visual card
- [x] Add a sticky, accessible technical table of contents to the Ganesha article sidebar
- [x] Add a branded XTZ.News newsletter CTA in the middle of the Ganesha article
- [x] Add an official Tezos visual source card with a durable linked source
- [x] Add focused tests and validate the enhanced experience on desktop and mobile
- [x] Create a media-backed official Tezos visual source card and route it through the same-origin relay
- [x] Browser-verify the rendered Tezos visual source card on desktop and mobile
- [x] Explicitly inspect the Tezos visual source-card image in desktop and mobile article renders
- [x] Explicitly inspect and record the Tezos source-card image in the desktop article render
- [x] Explicitly inspect and record the Tezos source-card image in the 390px mobile article render
- [x] Perform a final screenshot-assisted desktop and mobile inspection of the Tezos source-card image
- [x] Verify the article DOM references the Tezos source-card media asset and the relay serves it successfully
- [x] Inspect the final desktop and mobile captures alongside the relayed Tezos visual asset, then record the completed evidence
- [x] Obtain an independent desktop and mobile visual review of the Tezos source-card render

## Phase 28: Ganesha Reader Guidance and Newsletter Confirmation
- [x] Inspect the current progress indicator, article-term rendering, and Resend newsletter subscription flow
- [x] Add accessible hover-and-focus explanations for EVM, Michelson, and NAC in the Ganesha article
- [x] Refine and verify the technical-reading progress feedback at the top of the article page
- [x] Add an animated newsletter success state that confirms the Resend-backed subscription outcome
- [x] Add focused regression coverage and validate the enhanced experience on desktop and mobile
- [x] Browser-verify that NAC receives the same accessible tooltip treatment as EVM and Michelson
- [x] Exercise the reading-progress indicator across a real article scroll journey and verify meaningful advancement
- [x] Add rendered coverage for the Resend-aware newsletter success state without sending a live email
- [x] Validate the new tooltips, progress indicator, and newsletter confirmation on desktop and mobile
- [x] Make reading progress track the article body rather than overall document scroll and cover the calculation
- [x] Add a safe development-only newsletter success preview for browser validation without submitting email
- [x] Browser-validate near-complete article progress and the Resend-aware success state on desktop and mobile

## Phase 29: Homepage Newsletter Confirmation and Extended Technical Terms
- [x] Inspect the homepage newsletter form and the Ganesha article passages containing EIP-1271 and KT1 references
- [x] Add accessible hover-and-focus explanations for EIP-1271 and KT1 addresses in the Ganesha article
- [x] Apply the Resend-aware animated newsletter success confirmation to the homepage form
- [x] Add focused tests and validate the new homepage confirmation and tooltips on desktop and mobile

## Phase 30: Tezos Source Card De-duplication
- [x] Inspect the Ganesha article’s stored Tezos source-card markup to identify duplicate content
- [x] Remove the redundant Tezos text/card content and correct the source-card layout
- [x] Test and visually validate the repaired Tezos source card on desktop and mobile

## Phase 31: Footer Logo Repair
- [x] Inspect the footer logo component and media reference that produces the broken-image display
- [x] Route the footer logo through the reliable XTZ.News media treatment and responsive dimensions
- [x] Run regression checks and visually validate the footer logo on desktop and mobile

## Phase 32: Media Relay and Footer Navigation
- [x] Audit all client and server source for legacy first-party `/manus-storage/` media references
- [x] Migrate remaining eligible media paths to the same-origin relay without changing external-source URLs
- [x] Add a reduced-motion-safe hover treatment to the footer logo
- [x] Add an accessible smooth-scrolling back-to-top control beside the footer logo
- [x] Add focused tests and validate media, footer interaction, and responsive behavior

## Phase 34: GitHub-Triggered Deployment Sync
- [x] Verify GitHub push-webhook capabilities and inspect available project deployment controls
- [x] Compare secure automation approaches and confirm the chosen deployment model
- [x] Defer the approved push-triggered deployment workflow at the user’s request; retain manual GitHub backup releases
- [x] Document the supported release-flow assessment and defer trigger testing pending a future request

## Phase 37: Approved GitHub Release Bridge
- [x] Define the signed webhook payload, delivery-deduplication, and release-approval data model
- [x] Defer credentials and release-bridge build at the user’s request; manual GitHub backup remains the chosen workflow
- [x] Defer the verified GitHub push receiver and reviewer-controlled publish action pending a future request
- [x] Defer webhook configuration and signed-delivery validation pending a future request

## Phase 40: Cloud Translation Import Pipeline
- [x] Define the signed cloud-to-site payload, authentication, replay-protection, and idempotent import contract
- [x] Replace the unavailable shared-secret transfer with a cloud-held asymmetric signing key and site-held public key
- [x] Build the server-side signed import endpoint and translated Key Takeaways persistence
- [x] Update the cloud worker to generate direct-provider translated Key Takeaways and import signed batches
- [x] Defer the first live production-target batch and remaining backlog at the user’s request; no provider capacity was restored and no live results were imported

## Phase 41: Cloud-Held Translation Signing Key
- [x] Generate an owner-only cloud signing key and register the non-secret public key with XTZ.News
- [x] Replace HMAC verification with signature verification against the registered cloud public key

## Phase 42: Cloud Translation Job Retrieval
- [x] Add a signed endpoint that returns bounded live untranslated article jobs to the cloud worker
- [x] Update the cloud worker to fetch only signed live jobs rather than its isolated recovery database

## Phase 43: Direct Translation Cost Estimate
- [x] Measure the remaining translation workload and estimate direct-provider input/output token cost

## Phase 35: Optimised Marketing Footer Credit
- [x] Inspect the footer layout and existing external-link conventions
- [x] Add the do-follow “Built by Optimised Marketing” link to https://optimised.marketing
- [x] Test and validate the footer credit on desktop and mobile

## Phase 36: Optimised Marketing Partial-Link Refinement
- [x] Inspect the current footer credit markup and its regression test
- [x] Keep “Built by” as plain text and link only “Optimised Marketing” to https://optimised.marketing
- [x] Run regression checks and visually validate the refined footer credit

## Phase 38: Translation-Focused Reader Experience Assessment
- [x] Inspect the current translation routes, language selector, and translated-article state
- [x] Assess the broader reader journey for the ten highest-value usability improvements
- [x] Document a prioritised translation-first improvement roadmap

## Phase 39: Tezos Systems Research and Translation Improvements
- [x] Review Tezos Systems and identify reputable homepage information or linking opportunities
- [x] Add an above-fold, availability-aware language chooser to English article pages
- [x] Ensure article translation links only lead to published translations and add a useful unavailable-translation recovery state
- [x] Defer the cloud translation backlog and translated Key Takeaways run at the user’s request; retain the completed zero-Manus-credit pipeline for a future restart
- [x] Reconnect the persistent cloud translation workspace so the requested backlog run can begin
- [x] Perform the bounded signed cloud job validation; the first live provider call was blocked before import by insufficient direct-provider balance
- [x] Verify the cloud translation runner targets the current XTZ.News production dataset before it writes translations
- [x] Choose and establish a secure cloud-to-production translation sync path
- [x] Add a reader-controlled remembered language preference without forced redirects
- [x] Add focused tests and validate the enhanced translation experience on desktop and mobile
- [x] Repair the restored preview’s database client initialization so published article lookups work during translation validation

## Phase 44: Tezos Systems Homepage Integration
- [x] Research Tezos Systems and define homepage integration options
- [x] Select the Tezos Systems Network Pulse homepage module before implementation
- [x] Resolve the remaining preview article-rendering gap that prevents live language-preference validation
- [x] Determine the precise homepage module placement and interaction design
- [x] Build the attributed Tezos Systems Network Pulse module with durable outbound links
- [x] Add focused tests and validate the module on desktop and mobile
