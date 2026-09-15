# XTZ.News Technical Workload and Efficiency Audit

**Audit date:** 15 September 2026  
**Scope:** Code paths, configured schedules, and the attached cloud computer. This is a technical workload review, **not** a billing or provider-usage attribution report. No timers or services were changed during this audit.

## Executive summary

The strongest technical candidates for reducing avoidable persistent work are two always-on cloud services that appear unreferenced by the current XTZ.News application and cloud reverse-proxy configuration: the legacy crawler pre-render proxy and the audio-to-video service. The next highest priority is the **active legacy weekly-digest platform schedule**, which conflicts with the intended monthly-digest cadence and still returns successful callbacks each week.

The attached cloud also runs several short scheduled tasks. Most of the daily checks completed in one to five seconds on the latest run, so their direct compute footprint appears small. The material variable-cost candidates are the workflows that can invoke generation APIs: translations, weekly art recap generation, monthly Spotlight sync, and audio generation for newly published stories.

| Priority | Finding | Technical rationale | Recommended action |
| --- | --- | --- | --- |
| **1** | Legacy weekly digest platform schedule is enabled | The project still has an enabled `xtz-weekly-digest` callback job, despite the intended monthly cadence. Its three latest callbacks returned HTTP 200. | Pause it after confirming the monthly digest is the only desired subscriber send. |
| **2** | Two idle always-on cloud services appear unreferenced | `xtz-prerender.service` and `xtz-audio-video.service` are enabled and running continuously. The attached cloud reverse proxy has no references to ports 8082/8085, and the XTZ.News code has no reference to the local services. | Stage a controlled pause of each service, validate public crawler metadata and audio export, then disable if no regression occurs. |
| **3** | Daily translation timer remains active | It ran with a limit of 50 articles across 10 languages. The latest run found zero candidates, but a future backlog can invoke large batches of text-generation requests. | Pause while translations remain deferred, or reduce to an editor-triggered job. |
| **4** | Recap and Spotlight jobs can call text and image generation | The weekly Art recap and monthly Spotlight sync scripts use the generation endpoints; the latest Spotlight run also failed. | Keep only if editorially required; otherwise pause Spotlight until repaired and move Art recap to editor-triggered publication. |
| **5** | Sitemap routes rebuild large XML documents on cache expiry | `/sitemap.xml` selects up to 2,000 posts and 20,000 translations, then builds XML on request. `/news-sitemap.xml` selects 500 posts every 15 minutes. | Cache generated XML in memory or regenerate only after publication/translation changes; split translation sitemap output. |

## Confirmed active workload inventory

The following inventory is derived from currently enabled timer and service units on the attached cloud computer, plus the live project-level schedule list.

| Workload | Cadence / state | Latest observed behaviour | Work type | Technical assessment |
| --- | --- | --- | --- | --- |
| `xtz-prerender.service` | **Always running** | About 19 MB service memory; listens on port 8082 | Crawler HTML/meta proxy | Appears unreferenced by the cloud reverse proxy. The live site now emits crawler metadata itself. Highest-confidence retirement candidate after a controlled check. |
| `xtz-audio-video.service` | **Always running** | About 17 MB service memory; listens on port 8085 | Audio-to-MP4 conversion API | The website route targets a different IP address, not this attached cloud service. Highest-confidence retirement candidate after a conversion-path check. |
| `xtz-translate.timer` | Daily, 06:00 UTC | Latest run: zero articles selected; three seconds | Database check plus optional text generation | Low while idle; potentially high when backlog exists because the configured limit is 50 articles and ten locales. |
| `xtz-audio-generate.timer` | Daily, 07:00 UTC | Latest run: zero articles selected; two seconds | Database check plus optional TTS | Low while idle; variable work when new stories need audio. |
| `xtz-seo-ping.timer` | Daily, 08:00 UTC | Latest run: no new URLs; submitted sitemap to IndexNow; three seconds | Search-engine notification | Low compute; weekly cadence would normally be sufficient unless same-day URL discovery is a priority. |
| `xtz-governance-alert.timer` | Daily, 09:00 UTC | Latest run exited with status 1 in one second | Governance check | A failed recurring job produces no useful result. Inspect/fix or pause. |
| `xtz-tezoracle-status.timer` | Daily, around 03:15 UTC | Latest run completed in one second | Official-source status check | Lightweight; retain only if its status card is operationally valuable. |
| `xtz-art-recap.timer` | Weekly, Friday | Latest run completed in 15 seconds | Source fetch, text generation, image generation, article write | Generation-capable workflow; convert to editor-triggered if recap publication is not essential every week. |
| `xtz-events-discovery.timer` | Weekly, Sunday | Latest run completed in two seconds | Two public source checks, signed candidate intake | Lightweight and review-only; retain if the event queue is used. |
| `xtz-spotlight-sync.timer` | Monthly, first day | Latest run failed in three seconds | Sitemap/page fetch, text generation, image generation, direct database write | Failed job with optional generation work. Pause pending repair or restrict it to approved stories. |
| `xtz-monthly-digest.timer` | Monthly, first day | Next scheduled for 1 October | Signed request to site delivery workflow | Intended subscriber cadence. Keep only after legacy weekly job is paused. |
| `xtz-weekly-digest` platform callback | **Enabled**, weekly | Latest three callbacks returned HTTP 200 | Site callback schedule | This is separate from the cloud timer and is the clearest duplicate cadence finding. |

## Application-level review

### Dynamic sitemap generation

The full sitemap route performs multiple database reads every time its cache expires: up to 2,000 published posts, all categories, all tags, and up to 20,000 published translations. It then serializes every selected record into one XML response. The News sitemap similarly reads 500 published posts on a 15-minute public cache window. This is bounded rather than unbounded, but it can become noticeable during crawler bursts. [1]

The preferred change is to maintain a cached XML payload that is invalidated after a published post, translation, category, or tag changes. A second pragmatic improvement is to keep translations in a separate sitemap, avoiding a 20,000-record translated-page query on every full sitemap refresh. This improves database and response work without reducing crawl discovery.

### Price widgets

Three reader components query the same `prices.tezosTokens` procedure every 90 seconds. The browser query client and server cache reduce duplicate work, and the backend cache has a 90-second lifetime, so this is not three independent upstream requests per page. At scale, however, autoscaled instances can still refresh independently. Moving the shared refresh window to three or five minutes would reduce upstream CoinGecko traffic with little visible impact for a news site. [2]

### Media proxy and video conversion

The same-origin media relay makes a presign request and then retrieves the media object for each cache miss. The route sets a one-year immutable cache header, so retaining this pattern is appropriate for first-party media provided browser/CDN caching is effective. [3]

The audio-to-video endpoint is different: it allows a ten-minute upstream request and buffers the full resulting MP4 into application memory before returning it. It is request-driven rather than a background loop, but it can be expensive when used. The active local cloud converter appears unrelated to the configured upstream target, which is a different host. [4]

### Client-side timers

The page-local banner expiry check runs once per minute and the owner-promotion rotation runs every eight seconds; neither produces repeated backend requests. The price widgets are the only identified recurring client requests. [2]

## Recommended sequence

> **No change was applied by this audit.** The following steps are ordered to reduce technically unnecessary work while preserving the site’s established functions.

| Step | Change | Expected technical effect | Validation before permanent change |
| --- | --- | --- | --- |
| **A** | Pause the legacy weekly digest platform callback | Removes a weekly site invocation and prevents overlap with the monthly cadence | Confirm the monthly digest timer remains enabled and the next run is correct. |
| **B** | Temporarily stop `xtz-audio-video.service` for a short test window | Removes one continuous Node process and listener | Test an admin audio-to-video request; if no route relies on it, disable permanently. |
| **C** | Temporarily stop `xtz-prerender.service` for a short test window | Removes one continuous Node process and listener | Request a Googlebot-style article page and confirm canonical metadata and `NewsArticle` JSON-LD remain present. |
| **D** | Pause `xtz-translate.timer` while translation work is deferred | Prevents daily checks and any future automatic text-generation backlog | Confirm translations are intentionally editor-triggered or paused. |
| **E** | Pause or repair `xtz-governance-alert.timer` and `xtz-spotlight-sync.timer` | Eliminates repeated failed executions | Review the actual alert requirement and recent error cause before re-enabling. |
| **F** | Implement sitemap payload caching and translation sitemap splitting | Reduces repeated database reads and XML construction on crawler requests | Compare generated URLs and News sitemap inclusion before and after. |
| **G** | Move price polling to three to five minutes | Reduces external price refreshes under reader traffic | Check ticker freshness and mobile rendering. |

## Important distinctions

The review found **no confirmed unbounded server loop** in the XTZ.News application. The primary recurring work is explicit timer/schedule configuration, not an accidental in-process interval. It also found no evidence that the current daily audio or translation checks invoked generation on their latest runs: both selected zero articles.

This report does **not** establish what the hosting platform billed, nor whether a persistent cloud computer, managed website hosting, scheduled callback, or another external host explains a given amount. Only provider telemetry can make that attribution. The findings above identify the technical workloads that exist and the ones that are most plausible to remove or consolidate.

## References

1. [Dynamic sitemap and News sitemap handlers](../server/_core/index.ts)
2. [Token-price cache and client polling components](../server/routers.ts)
3. [First-party media relay](../server/_core/index.ts)
4. [Audio-to-video proxy](../server/_core/index.ts)
5. [Cloud workload operational record](../../../../mnt/6ydxq3gh8fypgg3v0mjhzkv0j/ubuntu/AGENTS.md)
