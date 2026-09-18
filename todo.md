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

## Phase 45: TezOracle Story
- [x] Verify the supplied TezOracle website and announcement-source claims
- [x] Prepare a source-grounded TezOracle article with SEO fields and bullet Key Takeaways
- [x] Store the supplied TezOracle graphic through project media storage and relay it reliably
- [x] Publish the article with appropriate taxonomy and source links
- [x] Run regression checks and validate the published TezOracle story

## Phase 46: TezOracle Directory and Related Reading
- [x] Verify the TezOracle directory profile fields and inspect current TezOracle related-story matching
- [x] Add TezOracle to the project directory with its official website and supplied visual
- [x] Prioritise relevant Tezos infrastructure and DeFi stories in the TezOracle related-article section
- [x] Add focused tests and validate the directory profile and related-reading experience

## Phase 47: TezOracle Cross-Link, Updates, and Sharing
- [x] Confirm a source-safe approach for TezOracle development status and future address updates
- [x] Add an accessible direct link from the TezOracle article to its project-directory profile
- [x] Add labelled TezOracle sharing controls on the article and project-profile experiences
- [x] Build the agreed source-aware status and address-updates presentation without inventing testnet or contract data
- [x] Create an isolated cloud-held signing identity and production verification configuration for TezOracle status imports
- [x] Configure a daily cloud monitor with idempotent official-source checks, no inbound ports, and durable execution records
- [x] Add focused test coverage and validate the new TezOracle journeys on desktop and mobile

## Phase 48: Vite Preview WebSocket Repair
- [x] Diagnose the reported development-preview WebSocket connection failure
- [x] Correct the Vite HMR configuration without affecting production traffic
- [x] Validate a clean preview reconnection and record the resolution

## Phase 49: Tezos Post-Quantum Story
- [x] Verify the Arthur Breitman announcement and the supplied post-quantum source material
- [x] Draft a source-grounded Tezos post-quantum article with SEO metadata and bullet Key Takeaways
- [x] Publish the story with accurate taxonomy, tags, source links, and a durable featured visual
- [x] Run regression checks and validate the published story on desktop and mobile

## Phase 50: Post-Quantum Discovery and tz5 Guide
- [x] Locate and validate the supplied replacement visual for the post-quantum article
- [x] Add a dedicated post-quantum topic filter to sidebar discovery controls
- [x] Add post-quantum-focused related reading to the bottom of the new article
- [x] Publish a plain-English tz5 wallet guide with clear testnet-stage framing and official source links
- [x] Add a direct contextual link from the post-quantum article to the tz5 guide
- [x] Run focused and full regression checks and validate the new discovery and guide journeys on desktop and mobile

## Phase 51: Renewed Vite Preview WebSocket Repair
- [x] Inspect the active preview HMR configuration and the reported closed-before-open connection failure
- [x] Apply a proxy-compatible repair without changing published-site traffic
- [x] Verify clean preview reconnection and record the resolution

## Phase 52: tz5 Guide Editorial Redesign
- [x] Restructure the guide into a clearer reader journey with concise visual sections
- [x] Replace dense prose with scan-friendly cards, steps, and explicit decision guidance
- [x] Improve typographic hierarchy, spacing, and responsive visual formatting
- [x] Add focused regression coverage and validate the redesigned guide on desktop and mobile

## Phase 53: tz5 Guide Navigation and Timeline
- [x] Verify the main Tools menu implementation and source-grounded address-prefix milestones
- [x] Add a prominent accessible tz5 wallet guide entry in the main Tools menu
- [x] Add an accessible visual tz1-to-tz5 address-evolution timeline to the guide
- [x] Add focused regression coverage and validate the enhanced guide and navigation on desktop and mobile

## Phase 54: Main Navigation Home Entry
- [x] Add a clearly labelled Home entry to the desktop and mobile primary navigation
- [x] Validate the Home navigation entry without introducing a duplicate header or menu bar

## Phase 55: Post-Quantum Discovery Hub
- [x] Verify official prefix terminology, current post-quantum articles, and homepage integration points
- [x] Create a searchable Tezos-prefix glossary with clear Mainnet and testnet-stage context
- [x] Create a dedicated post-quantum landing page aggregating the article, tz5 guide, glossary, and official resources
- [x] Feature the tz5 wallet guide prominently on the homepage and connect the new discovery paths
- [x] Add focused regression coverage and validate the hub, glossary, and homepage feature on desktop and mobile

## Phase 56: DataForSEO-Led On-Site SEO Growth
- [x] Collect bounded UK and US English DataForSEO keyword, question, trend, and SERP evidence for core Tezos topics
- [x] Document a DataForSEO-backed keyword-to-URL map and prioritise existing-page improvements over duplicate content
- [x] Repair crawler-visible canonical, NewsArticle schema, hreflang, media, sitemap, and route-normalisation coverage for priority routes
- [x] Improve the selected high-intent Tezos content clusters and descriptive internal discovery paths
- [x] Run full regression and crawler-style validation, then record the SEO implementation and measurement hand-off

## Phase 57: Tool FAQs and Etherlink Resource Hub
- [x] Verify priority tool-page FAQ coverage and filter Etherlink keyword evidence for ecosystem relevance
- [x] Add crawler-visible FAQPage schema to the priority wallet, staking, price, and explorer routes
- [x] Create a dedicated Etherlink resource hub with real XTZ.News coverage, clear official links, and no hardware-query contamination
- [x] Connect the Etherlink hub through internal discovery paths and dynamic sitemap coverage
- [x] Run regression, crawler, desktop, and mobile validation and document the SEO changes

## Phase 58: Etherlink Bridge and Tezos Wallet Starter Hubs
- [x] Verify official Etherlink bridge and Tezos wallet guidance and map existing XTZ.News content for reuse
- [x] Publish a detailed, source-grounded Etherlink bridge explainer and link it from the Etherlink hub
- [x] Create a comprehensive Tezos wallet starter hub with safe new-user guides and clear discovery paths
- [x] Add SEO metadata, structured data, internal navigation, and sitemap coverage for both evergreen hubs
- [x] Run regression, crawler, desktop, and mobile validation and document the new guide journeys

## Phase 59: Wallet Options, Staking Starter, and Article Glossary Links
- [x] Verify current official Tezos wallet options, staking guidance, and safe automatic glossary-linking rules
- [x] Add clearly labelled official Tezos wallet options to the wallet starter hub without ranking or endorsing providers
- [x] Create a beginner-friendly Tezos staking starter hub with delegation context and clear non-advisory guidance
- [x] Implement accessible automatic glossary definitions for supported terms across article content
- [x] Add crawler metadata, internal discovery paths, focused tests, and desktop/mobile validation

## Phase 60: Baker Comparison Checklist and Newsletter Glossary Coverage
- [x] Inspect the staking starter and newsletter archive rendering paths and define non-ranking comparison rules
- [x] Add an interactive reader-side baker checklist without recommendations, scores, or investment claims
- [x] Extend glossary definitions safely to newsletter archive content without breaking newsletter components or links
- [x] Add focused regression coverage and validate the checklist and glossary treatment on desktop and mobile

## Phase 61: Recurring Vite Preview WebSocket Repair
- [x] Inspect the active HMR configuration and reproduce the proxied preview connection failure
- [x] Apply a proxy-compatible repair without altering published-site traffic
- [x] Validate the local and HTTPS preview connection and document the resolution

## Phase 62: Monthly Subscriber News Digest
- [x] Inspect the existing weekly digest endpoint, current cloud schedule, and subscriber safeguards
- [x] Replace the weekly article window and copy with a previous-calendar-month digest that includes all published monthly articles
- [x] Replace the stale legacy scheduler credential with a dedicated signed cloud authentication path
- [x] Route the signed monthly job through the production-reachable tRPC API after the new REST route fell through to the application shell
- [x] Retire the weekly schedule and activate an idempotent monthly cloud schedule at the agreed delivery time
- [x] Validate a no-send dry run, delivery guards, content selection, tests, and production scheduler status

## Phase 63: Signed-In Preview WebSocket Repair
- [x] Inspect the active signed-in preview response and Vite client injection
- [x] Apply a development-only repair that removes failed WebSocket attempts without affecting published traffic
- [x] Validate the repaired signed-in preview, document the result, and run regression checks

## Phase 64: Monthly Digest Reader-Facing Copy
- [x] Replace residual weekly-digest wording in newsletter surfaces with the approved monthly prior-calendar-month cadence
- [x] Add regression coverage and validate the corrected signed-in homepage newsletter copy

## Phase 65: Kento Art-Collecting Story
- [x] Verify the supplied objkt, Kento, Kickstarter, and social-source claims
- [x] Prepare a source-grounded Kento article with SEO metadata and bullet Key Takeaways
- [x] Use the user-supplied final Kickstarter milestone visual as the featured image through the reliable media relay
- [x] Publish the story with appropriate taxonomy, durable source links, and clear campaign-status framing
- [x] Run regression checks and validate the published article on desktop and mobile

## Phase 66: Kento Directory, Campaign Updates, and Related Reading
- [x] Verify Kento directory details, official Kickstarter campaign-update sources, and art-collecting related-story candidates
- [x] Add Kento to the Projects directory with an official link, durable visual, and direct link to the XTZ.News article
- [x] Defer the automated Kickstarter campaign tracker and homepage campaign metrics after the public source rejected unattended access; do not bypass Kickstarter controls
- [x] Tailor the Kento article bottom related-reading section to art-collecting and objkt coverage
- [x] Add focused tests and validate directory, campaign status, article links, and related reading on desktop and mobile

## Phase 67: Kento Fundraising-Led Headline
- [x] Replace the Kento article title and SEO fields with verified early-campaign milestone wording
- [x] Validate the updated headline and metadata on the published article

## Phase 68: Art on Tezos Hub and Kento Sharing
- [x] Inventory published Art on Tezos projects and articles and inspect the established sharing-control patterns
- [x] Build a dedicated Art on Tezos collection hub that groups genuine directory projects and editorial coverage
- [x] Connect the hub through relevant navigation and internal discovery paths with crawler metadata and sitemap coverage
- [x] Add accessible Kento sharing controls to the Kento article and project profile
- [x] Add focused tests and validate the hub and sharing controls on desktop and mobile

## Phase 69: Kento Milestone Attribution Correction
- [x] Revise Kento’s campaign-milestone image wording to avoid implying direct supply to XTZ.News
- [x] Validate the corrected reader-facing wording and preserve the early-milestone/live-total distinction

## Phase 70: Art on Tezos Curation, Filters, and Editorial Submissions
- [x] Verify and add three source-grounded curated Art on Tezos project profiles
- [x] Add accessible collection filters for exhibitions, marketplaces, and creator tools
- [x] Create a lightweight artist and gallery editorial-submission form with clear review expectations
- [x] Add focused tests and validate the filtered hub and submission journey on desktop and mobile

## Phase 71: Art Submission Review, Curated Hero, and Exhibition Timeline
- [x] Create a secure administrator-only review page for Art on Tezos project submissions with approve and reject actions
- [x] Add a deterministic weekly rotating hero that highlights a different curated Art on Tezos profile without a background job
- [x] Research and publish an interactive, source-grounded timeline for confirmed past and upcoming Tezos digital-art events
- [x] Add focused tests and validate the editor workspace and enhanced hub on desktop and mobile

## Phase 72: Calendar Controls, Timeline Previews, and Cloud Event Discovery
- [x] Add accessible calendar-download controls for confirmed upcoming exhibition timeline entries
- [x] Add keyboard-accessible exhibition preview interactions with event details and source links
- [x] Build a cloud-only weekly source-specific Tezos event discovery runner that creates review candidates without automatic publication
- [x] Add secure candidate intake, editorial review controls, source documentation, and validation coverage

## Phase 73: Event Submissions, Reader Filters, and Bulk Editorial Review
- [x] Add a lightweight public Tezos event-submission form with explicit review consent and no automatic publication
- [x] Add accessible location and event-type filters to the public Tezos Events page
- [x] Add protected administrator bulk review, publish, and reject actions for selected event candidates
- [x] Add focused tests and validate public and administrator event workflows on desktop and mobile

## Phase 74: HEK × Tezos Foundation Partnership Story
- [x] Research primary HEK and Tezos sources for a source-grounded partnership article
- [x] Publish the HEK × Tezos Foundation story with the user-provided featured image and clear source attribution
- [x] Check the project directory and add or update a suitable HEK × Tezos partnership profile with a direct article link
- [x] Validate article metadata, featured media, and directory discovery before release

## Phase 75: Google News Discovery for the HEK Partnership Story
- [x] Add Google News-compatible `NewsArticle` metadata for published news stories, including the HEK partnership article
- [x] Add a dynamic News sitemap XML feed for recent published XTZ.News articles and expose it in sitemap discovery
- [x] Add regression coverage and validate Googlebot-facing metadata and XML output

## Phase 76: Editorial Author Profiles and Article Revision Discovery
- [x] Create the Lee Evans and Rossa Browne author profiles with approved biographical details and Person schema
- [x] Add a visible last-updated timestamp to revised published articles without hiding the original publication date
- [x] Add accessible X and LinkedIn sharing controls and a relevant related-articles section to the HEK partnership article
- [x] Add focused tests and validate author pages, structured data, timestamps, and HEK discovery on desktop and mobile

## Phase 77: First-Party Promotion and Editorial Transparency
- [x] Add a clearly labelled, self-managed first-party promotion area for XTZ.News owner businesses and apps without third-party tracking
- [x] Publish a newsroom editorial-policy page and link it from both public author profiles
- [x] Add reusable compact author bio boxes with direct profile links to news articles
- [x] Assign eligible historic published articles to the Lee Evans author profile without overwriting any existing named attribution
- [x] Add regression coverage and validate promotional, policy, byline, and author-archive journeys on desktop and mobile

## Phase 78: Promotion Rotation, Corrections, and Editorial Reassignment
- [x] Upgrade first-party promotions to support multiple owner-managed placements, rotation, and clearly marked placeholders
- [x] Add a public correction-report form on the newsroom editorial-policy page with review-only storage and an administrator queue
- [x] Send correction-report notifications to info@optimised.marketing without exposing reporter details publicly
- [x] Add protected per-article author reassignment controls for assigning selected existing stories to Rossa Browne
- [x] Add regression coverage and validate reader and administrator workflows on desktop and mobile

## Phase 79: Hero Banner Promotion Placeholder
- [x] Add a clearly labelled first-party banner placeholder beneath the homepage hero without obscuring the lead story
- [x] Add administrator configuration guidance for future owner-supplied banner creative and links
- [x] Add regression coverage and validate the hero banner at desktop and mobile widths

## Phase 80: Supplied First-Party Banner Deployment
- [x] Store and serve the supplied Optimised Marketing × XTZ.News banner through the approved media path
- [x] Replace the homepage hero placeholder with the supplied responsive first-party banner
- [x] Add the same clearly labelled banner to news article pages without disrupting reading controls or related content
- [x] Add regression coverage and validate banner rendering at desktop and mobile widths

## Phase 81: Header Optimised Marketing Link
- [x] Add an accessible Optimised Marketing external link in the header utility bar
- [x] Preserve desktop primary navigation and mobile header clarity
- [x] Add regression coverage and validate the link at desktop and mobile widths

## Phase 82: Advertising Discovery and Header Enhancement
- [x] Replace the supplied first-party banner with the new wide Optimised Marketing × XTZ.News creative through the approved media path
- [x] Add an accessible visual icon and subtle hover state to the Optimised Marketing header link
- [x] Publish an Advertising page and link it from the shared header utility bar
- [x] Add regression coverage and validate banner, header, and advertising-page journeys on desktop and mobile

## Phase 83: Advertiser Enquiries and Campaign Expiry
- [x] Add a lightweight review-first advertiser enquiry form to the advertising page
- [x] Clarify banner-placement options and pricing on the advertising page without publishing unsupported audience claims
- [x] Add an administrator-managed campaign end date that hides expired first-party banner creatives automatically
- [x] Add regression coverage and validate advertiser and administrator workflows on desktop and mobile

## Phase 84: Compact Homepage Banner and Advertising Enquiry Confirmation
- [x] Refine the homepage banner to use the available content width with a more compact surrounding treatment
- [x] Send an automatic advertiser enquiry acknowledgement after a valid consented submission
- [x] Add regression coverage and validate the responsive banner and email workflow

## Phase 85: Homepage Banner Height Correction
- [x] Reduce the homepage first-party banner height without changing the supplied banner creative or article placement
- [x] Validate the compact banner treatment on desktop and mobile

## Phase 86: Half-Height Homepage Banner Correction
- [x] Reduce the homepage first-party banner to roughly half of its current desktop display height
- [x] Preserve the original creative and responsive mobile presentation
- [x] Validate the corrected compact strip on desktop and mobile

## Phase 87: Header Attribution Relocation
- [x] Remove the utility-bar Optimised Marketing link
- [x] Add a “Built by Optimised Marketing” external link to the right of the XTZ.News logo
- [x] Validate the unified header treatment on desktop and mobile

## Phase 88: Header Attribution Link and Color Refinement
- [x] Make only the words “Optimised Marketing” an external link beside the logo
- [x] Apply a subtler gray treatment to the “Built by Optimised Marketing” attribution
- [x] Validate accessible hover/focus behaviour and responsive header clarity

## Phase 89: Header Brand Mark and Typography Refinement
- [x] Add a subtle brand mark alongside the Optimised Marketing header link
- [x] Reduce the attribution font size on desktop while preserving mobile readability
- [x] Validate responsive header clarity and accessible link states

## Phase 90: Header Referral Tooltip and Homepage Attribution Refinement
- [x] Remove the Optimised Marketing monogram mark from the header attribution
- [x] Add an accessible referral tooltip with the stated 25% offer and copyable XTZ2026 code
- [x] Lower the homepage-only attribution contrast while preserving non-homepage readability
- [x] Refine mobile logo-row alignment and validate tooltip, copy action, and responsive header behaviour

## Phase 91: Referral Copy Usability and Aggregate Engagement Analytics
- [x] Remove the tooltip hover gap so the referral copy button is reliably reachable
- [x] Show a green-check “Copied!” state after a successful referral-code copy action
- [x] Record privacy-preserving aggregate referral-code copy events without personal identifiers or third-party scripts
- [x] Add regression coverage and validate the copy interaction, feedback state, and analytics event flow

## Phase 92: Technical Workload and Efficiency Audit
- [x] Inventory active XTZ.News scheduled and persistent-cloud workloads without estimating provider charges
- [x] Review application request paths, database usage, and automated jobs for avoidable work or duplication
- [x] Produce a prioritized technical optimization report with safe pause, consolidation, or code-improvement recommendations

## Phase 93: Approved Workload Reduction and Sitemap Optimization
- [x] Pause the duplicate weekly digest and defer translation, Art recap, and Spotlight recurring execution
- [x] Retire the unreferenced continuous pre-render and audio-video services after crawler validation
- [x] Reduce repeated sitemap work with bounded in-memory cache lifetimes and a dedicated translation sitemap
- [x] Validate retained scheduled workloads, Googlebot output, sitemap discovery, regression coverage, and TypeScript

## Phase 94: Additional Approved Cloud Cadence Reduction
- [x] Pause automated audio generation while retaining manual selected-story generation
- [x] Reduce SEO and IndexNow pings to a weekly schedule
- [x] Reduce governance alerts and TezOracle status monitoring to weekly schedules
- [x] Validate the revised unit states, retained site behavior, and documented rollback paths

## Phase 95: 0xTzKT Explorer Preview Publication
- [x] Verify the 0xTzKT teaser page and Baking Bad repository, including its in-development limitations
- [x] Publish a source-grounded 0xTzKT article with the supplied featured image, bullet Key Takeaways, Lee Evans byline, and SEO fields
- [x] Add the 0xTzKT Block Explorer project profile with official teaser, GitHub, and social links plus accurate in-development status
- [x] Synchronize existing directory presentation fields with the Drizzle schema and validate responsive article/profile rendering, Google News markup, sitemaps, media relay, TypeScript, and regression tests

## Phase 96: Anchorage Digital Etherlink Custody Publication
- [x] Verify Anchorage’s official Etherlink custody announcement, social statement, supported asset set, and xU3O8 documentation
- [x] Generate an original text-free editorial image and publish a source-grounded article with Key Takeaways, risk-aware custody context, Lee Evans byline, and SEO fields
- [x] Add a source-linked Anchorage Digital Web3 Infrastructure project profile limited to its confirmed selected Etherlink-asset support
- [x] Validate crawler metadata, Google News and canonical sitemaps, first-party media relay, desktop/mobile header coverage, TypeScript, and regression tests

## Phase 97: Google News Sitemap Resilience and Optimised Marketing Profile
- [x] Diagnose the Search Console missing-`url` error as an empty News sitemap during a 48-hour editorial gap
- [x] Add parser-safe News sitemap fallback entries without fabricating Google News recency, plus targeted regression coverage
- [x] Publish a clearly labelled first-party Optimised Marketing Community profile with website, app and marketing services plus the XTZ2026 25% offer
- [x] Validate local/current sitemap structure, media relay, public profile data, desktop/mobile display, TypeScript, and 176 regression tests

## Phase 98: Community Services Directory and Profile Referral Control
- [x] Add Community Services as a dedicated Tezos Projects filter for agencies, development studios, and marketing providers
- [x] Move Optimised Marketing into the new category while preserving its first-party disclosure and service description
- [x] Add an accessible Optimised Marketing profile button that copies XTZ2026, shows temporary green confirmation, and uses the existing aggregate-only metric
- [x] Validate category data, directory rendering, desktop/mobile profile controls, browser copy feedback, TypeScript, and 176 regression tests
