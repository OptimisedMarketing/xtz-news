# Direct Anthropic Backlog Cost Estimate

## Measured workload

The live XTZ.News dataset contains **8,734** outstanding published article-language pairs across the ten supported locales. The cloud worker sends at most 12,000 article-content characters per job; applying that actual cap gives **52,386,167** source characters, or an average of 5,998 characters per outstanding pair.[1]

## Pricing basis

Claude Haiku 4.5 direct API pricing is $1 per million input tokens and $5 per million output tokens.[2] The worker adds translated SEO fields and 2–4 translated Key Takeaways to each result, so output tokens are the main cost driver.

| Scenario | Estimated input tokens | Estimated output tokens | Direct API cost | With 15% delivery/retry buffer |
| --- | ---: | ---: | ---: | ---: |
| Compact output | 16.15M | 17.15M | $101.90 | $117.18 |
| Expected output | 18.89M | 20.89M | $123.34 | $141.84 |
| Longer/CJK-heavy output | 21.61M | 27.30M | $158.11 | $181.82 |

The planning range is therefore **approximately $120–$180**, with **$150–$180** providing useful headroom. This excludes any taxes, account minimums, or unrelated Anthropic use. The estimate is for the cloud’s direct API usage only; the site-side importer makes no Manus/Forge AI call.

## References

[1] XTZ.News production workload measurement, 31 August 2026.

[2] [Claude Haiku 4.5 — Anthropic](https://www.anthropic.com/claude/haiku)
