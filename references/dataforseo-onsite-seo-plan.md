# DataForSEO-Led On-Site SEO Growth Plan for XTZ.News

## Goal

Increase qualified organic search traffic to **XTZ.News** through on-site improvements only. The work will use the enabled DataForSEO integration to select high-intent Tezos keyword opportunities, then improve the site’s crawlability, crawler-visible metadata, content hubs, and internal discovery paths. The plan deliberately excludes paid advertising, outbound social distribution, link outreach, translation-backlog work, and deployment-webhook automation.

## Planning Assumptions

The keyword research will compare **UK English** and **US English** Google data because the requested target market was not otherwise specified. The implementation will prioritise opportunities with shared English-language demand or a clearly stronger result in one of those markets. No low-value exact-match pages will be created: every selected query must map to a useful reader journey, original XTZ.News context, and a relevant existing or newly created page.

The DataForSEO connector has been confirmed enabled. Requests will be read-only and intentionally bounded to avoid unnecessary provider usage: a limited seed set, a capped suggestion set, and SERP analysis only for the shortlist.

## Phase 1 — DataForSEO Keyword Opportunity Baseline

First, collect current Google keyword metrics for a structured seed set: **Tezos**, **Tezos blockchain**, **Tezos wallet**, **Tezos wallet address**, **Tezos staking**, **Tezos price**, **Tezos explorer**, **Tezos NFT**, **Tezos DeFi**, **Etherlink**, **Tezos Smart Rollups**, **KT1 contract**, **tz1 address**, **tz5 wallet**, and **Tezos post-quantum**. For each UK/US English market, retrieve search-volume and trend data, then use keyword-suggestion, related-keyword, and question-oriented results to identify reader questions and long-tail variants.

The research will then obtain live Google SERPs for the most promising terms. The shortlist will be scored using volume, trend direction, question or transactional/informational intent, SERP composition, content freshness, and whether XTZ.News already has a credible page that can be improved. The output will be a documented keyword-to-URL map, not generic keyword stuffing.

| Research output | Decision it supports |
| --- | --- |
| Search volume and trend by UK/US English market | Which topics are large enough to prioritise first. |
| Suggestions, related searches, and question queries | What readers actually ask and the headings/FAQ coverage pages need. |
| Live SERP composition | Whether the winning format is a news report, explainer, tool, project profile, glossary entry, or topic hub. |
| XTZ.News page inventory | Whether to improve an existing URL or create one durable canonical page. |

## Phase 2 — Repair Crawlability and Crawler-Visible SEO Foundations

The current audit identified a high-impact technical issue: representative article pages delivered the homepage canonical and lacked crawler-visible `NewsArticle` JSON-LD and `hreflang`, even though the browser interface injected page-level metadata. The implementation will make these signals available in the server-delivered HTML for article routes, including accurate canonical URL, publication/modification dates, author/publisher details, featured-image URL through the reliable media relay, and only valid language alternatives. Structured data will describe visible page content and will be validated after deployment.

The dynamic sitemap will be updated to include the recently added evergreen discovery routes—`/post-quantum`, `/guides/tz5-wallet`, and `/glossary/tezos-prefixes`—and any keyword-led hubs approved in Phase 3. The route-normalisation allowlist will recognise these route families. The sitemap strategy will also be refined so thin tag archives are not promoted equivalently to useful content hubs. Existing tag URLs will remain usable for readers; the final treatment of very low-depth tags will be based on the content inventory and implemented only where it is crawler-safe.

## Phase 3 — Implement Data-Selected High-Intent Content Clusters

Based on the Phase 1 evidence, implement the highest-opportunity on-site content clusters. The initial candidates below are hypotheses only; their priority, wording, and page format will be selected by the DataForSEO results.

| Candidate cluster | Likely existing foundation | Potential on-site work |
| --- | --- | --- |
| Tezos wallet and address help | Wallet Inspector, prefix glossary, `tz5` guide | Create or improve a canonical beginner wallet guide; add prefix/tool links and visible, answer-first FAQ content where supported by page copy. |
| Tezos staking | Staking page, reward tool | Strengthen the canonical staking guide for the questions and terminology found in keyword data; cross-link to the reward calculator and suitable articles. |
| Tezos explorer and contracts | Explorer, contract inspector, KT1 glossary entry | Add an explainer or improve existing tool landing pages for the intent revealed in SERPs; connect relevant project, tool, and terminology pages. |
| Etherlink and Tezos DeFi | Existing Etherlink reporting, Ganesha article, project directory | Create or improve a focused overview/hub only if demand and SERP intent justify it; surface current, source-grounded project and guide links. |
| Post-quantum Tezos | Post-quantum hub, `tz5` guide, glossary | Expand question coverage and internal links only where DataForSEO shows reader demand, preserving the explicit experimental/testnet-stage context. |

Each selected page will receive a unique reader-first title, description, H1, concise introductory answer, meaningful section hierarchy, descriptive internal anchors, relevant visual/media treatment, and accurate canonical/structured-data handling. If FAQ schema is used, each answer will be visibly present and consistent with the page.

## Phase 4 — Strengthen Internal Discovery and On-Page Paths

Add a reusable contextual “Continue learning” component to connect news, projects, guides, tools, glossary definitions, and topic hubs based on the subject of the current page. The component will use descriptive anchors rather than repeated generic labels. Article templates will prioritise a related project, a practical guide/tool, and a topic hub where relevant, without overwhelming readers or producing unrelated links.

Enhance existing tag and category surfaces selectively: consolidate or de-emphasise thin archive pages, and strengthen pages with sufficient coverage using accurate introductions and internal routes. Homepage discovery modules may surface the top one or two evidence-supported evergreen resources without displacing timely news.

## Phase 5 — Validation and Measurement Readiness

Testing will include the complete automated suite and TypeScript validation. Browser checks will cover desktop and mobile layouts, keyboard navigation, search/filter behaviour, heading hierarchy, links, canonical URLs, and no duplicate headers. Direct crawler-style HTML checks will verify that key article pages expose their own canonical, `NewsArticle` JSON-LD, and valid language references before JavaScript executes. Sitemap and robots responses will be checked for the new canonical pages and appropriate indexation treatment.

The final delivery will include the DataForSEO keyword evidence, selected opportunities and rationale, pages changed or created, keyword-to-URL map, and a practical measurement checklist for Google Search Console: indexation, impressions, clicks, average position, query/page pairs, and internal-link engagement. A post-launch review cadence can be proposed separately, but no recurring job will be created in this work without an explicit request.

## Key Risks and Safeguards

| Risk | Safeguard |
| --- | --- |
| Search volume is inflated, irrelevant, or mismatched to reader intent | Combine keyword metrics with live SERP intent and require a useful XTZ.News page before implementation. |
| Thin content or redundant pages dilute topical authority | Improve or consolidate canonical pages rather than mass-producing keyword variants. |
| JavaScript-only metadata remains invisible to crawlers | Validate server-delivered HTML with a crawler-style request after implementing the head-output repair. |
| `tz5` terminology is misunderstood as a finished consumer wallet feature | Retain explicit testnet-stage language and link to official Tezos/Octez sources. |
| Keyword research unnecessarily consumes provider usage | Limit the initial seed set and only request SERP data for the final shortlist. |

## Definition of Done

The work is complete when DataForSEO evidence has chosen and documented the keyword targets; crawler-visible article and evergreen-page metadata have been repaired and verified; selected high-intent content clusters and internal links are live in the project; sitemap coverage reflects the approved canonical pages; all reader journeys work on desktop and mobile; and automated tests and TypeScript checks pass.
