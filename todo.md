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
