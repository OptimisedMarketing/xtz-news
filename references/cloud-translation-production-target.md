# Cloud Translation Backlog — Production Target Check

The restored cloud translation runner has been inspected without exposing its credentials. Its configured database endpoint is loopback-only `127.0.0.1:3308`, database `xtz_news_recovery`.

This is an isolated recovery copy, not the XTZ.News managed production database. Running the existing cloud script now would spend provider usage and write translations only to that recovery copy; it would not make them visible on the live site. The cloud computer’s operating instructions also preserve this configuration as a controlled local-database staging state.

The requested production backlog therefore needs a deliberate, authenticated sync path between the cloud generator and the current managed site before the full batch begins.

## Live bridge validation — 31 August 2026

The local recovery-database design was replaced with a cloud-held Ed25519 signing key, a site-held public key, a bounded signed job endpoint, and a replay-protected signed import endpoint. A cloud dry run fetched one genuine live untranslated Chinese job—the Ganesha article—through the signed endpoint. The website performs no AI generation; the worker uses only its direct Anthropic Haiku configuration.

The first live provider call reached Anthropic but stopped before importing any record because the cloud account reported insufficient direct API balance. This does not indicate an endpoint, signature, database, or import error. No translation and no Key Takeaways were written. The full backlog awaits cloud provider capacity.
