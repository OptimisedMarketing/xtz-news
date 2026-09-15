# XTZ.News Workload Reduction Validation

**Validated:** 15 September 2026

## Implemented reduction actions

| Area | Applied change | Retained path |
| --- | --- | --- |
| Legacy subscriber scheduling | Paused the duplicate `xtz-weekly-digest` Heartbeat (`aMagPEZyYGZGbmoHjf3dmA`). | The signed `xtz-monthly-digest.timer` remains active for the intended monthly delivery. |
| Translation and generation jobs | Disabled `xtz-translate.timer`, `xtz-art-recap.timer`, and `xtz-spotlight-sync.timer`. | The scripts remain available for deliberate editor-run work. |
| Continuous cloud services | Disabled `xtz-prerender.service` and `xtz-audio-video.service`. | The site no longer needs their local listeners; re-enable only after a verified regression. |
| Canonical sitemap | Removed translated URL generation and duplicated News tags from the primary sitemap, then added a one-hour process cache. | Canonical article, category, tag, and static paths remain present. |
| Google News sitemap | Added a 15-minute process cache to the dedicated recent-news feed. | Recent `NewsArticle` URLs remain in `/news-sitemap.xml`. |
| Translation sitemap | Added `/translations-sitemap.xml` with a separate six-hour cache. | Published translated article URLs remain crawlable through `robots.txt`. |

## Verification

The cloud units that were intended to stop all report `disabled` and `inactive`. The intended monthly digest, TezOracle monitor, and reviewed events-discovery timers remain `enabled` and `active`. A live Googlebot-style request after retiring the pre-render service continued to return the Kento article canonical URL, `NewsArticle` schema, and author `Person` schema.

Local sitemap checks confirmed `Cache-Control: public, max-age=3600` on `/sitemap.xml`, `max-age=900` on `/news-sitemap.xml`, and `max-age=21600` on `/translations-sitemap.xml`. The primary sitemap no longer includes translation paths; the separate translation sitemap returned 6,406 published URL entries and is declared in `robots.txt`. The full regression suite passed with **174 tests across 62 files**, and TypeScript validation passed.

## Rollback notes

The legacy weekly digest can be restored only with `manus-heartbeat resume --task-uid aMagPEZyYGZGbmoHjf3dmA` from the project workspace. Any cloud timer or service described above can be restored individually with `sudo systemctl enable --now <unit>`. The system-level changes and exact rollback commands are recorded in the cloud computer’s `AGENTS.md`.
