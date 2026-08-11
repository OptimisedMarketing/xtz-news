# XTZ.News — Top 10 Reader Usability Improvements

## Scope

This prioritised review covers the live homepage, Latest News archive, a representative article page, and a translated article route on 11 August 2026. The site has strong editorial foundations — rich Tezos coverage, visual article cards, readable article pages, Key Takeaways, audio, and category archives — but the reader experience would benefit most from clearer hierarchy, better discovery, and repairing the international reading flow.

| Rank | Improvement | Why it matters for readers | Expected impact | Relative effort |
|---:|---|---|---|---|
| 1 | **Repair all translated article routes and page metadata.** | The tested `/zh/...` article route currently leads to an “Invalid language code” state and an undefined title. Readers who choose a language expect the complete story immediately. | Very high | Low–medium |
| 2 | **Make the editorial story the first priority on the homepage.** | The breaking strip, token ticker, utility bar, main navigation, hero, secondary ticker, and live network tiles arrive before the main reading task. Add a reader-focused mode or compact these layers into one collapsible market/status strip. | Very high | Medium |
| 3 | **Create a prominent global search experience.** | The current search affordance is secondary. A keyboard-accessible search overlay with instant results, recent searches, category shortcuts, and clear empty states would be the fastest route to older Tezos coverage. | High | Medium |
| 4 | **Simplify the primary navigation and make mobile navigation task-led.** | The menu currently exposes many destinations at once. Group less-frequent destinations under “Explore,” reserve the main row for Latest News, Categories, Projects, and Tools, and provide a mobile menu with large tap targets and a visible search action. | High | Medium |
| 5 | **Improve archive scanning with consistent article-card metadata.** | Latest News already has useful in-category search and sorting. Add a consistent read time, one-line summary, publication time, and a more visible active sort/filter state; this lets readers choose quickly without opening multiple stories. | High | Low–medium |
| 6 | **Make article reading mode calmer and more purposeful.** | Audio, font controls, light mode, sharing, disclaimers, donation prompts, price cards, and related content all compete near the start of an article. Collapse secondary utilities behind one “Reading options” control and keep a compact sticky progress/share bar. | High | Medium |
| 7 | **Make Key Takeaways genuinely scannable.** | The section is valuable, but several bullets are sentence-length. Limit every item to roughly 12–18 words, emphasise entities/numbers, and add a “Why it matters” final line for complex upgrades. | High | Low |
| 8 | **Add contextual continuation paths after every article.** | Replace generic related cards with “Next in Etherlink,” “Background reading,” and “What changed since…” groups. Pair each recommendation with one short relevance label and offer previous/next links within the current category. | Medium–high | Medium |
| 9 | **Let readers follow topics and control their feed.** | A lightweight “Follow Etherlink / Tokenization / DeFi” action on articles and archives would turn one-off visits into returning readers. Use this to power a personalised homepage strip or a weekly topic digest. | Medium–high | Medium–high |
| 10 | **Use newsletter prompts as a benefit-led journey, not repeated forms.** | The page has multiple newsletter entry points. Standardise them around a concise promise, show topic options, and display a clear confirmation state so the request feels useful rather than interruptive. | Medium | Low–medium |

## Suggested rollout order

**First:** repair translations, compress the homepage chrome, and make Key Takeaways shorter. These changes remove a broken promise, improve first impressions, and make the primary content more useful.

**Second:** build global search, improve article-card metadata, and streamline reading controls. Together they improve both discovery and sustained reading without changing the publication workflow.

**Third:** introduce contextual recommendations, topic following, and a better newsletter journey. These are the retention layer once the core experience is simpler.

## Specific evidence from the live review

The Chinese version of the tested Etherlink 7.0 article returned an “Invalid language code” page, despite translation functionality being visible in the site structure. The homepage also places several live-market and navigation layers ahead of editorial content, while the article page presents numerous utility controls before the reader reaches the body. In contrast, the Latest News archive has a strong starting point: category search plus newest, oldest, and popular sorting controls.
