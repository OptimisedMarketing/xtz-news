# Cloud-Only Translation Import Contract

## Purpose

The cloud worker performs all translation and translated Key Takeaways generation through its direct provider configuration. The website only validates, persists, and serves completed results. It makes **no** AI-generation requests as part of import.

## Endpoint

`POST /api/internal/translations/import`

The payload contains an idempotent batch of results: `postId`, `locale`, translated title/excerpt/content/SEO fields, and `keyTakeaways` as newline-separated bullet points. A delivery ID and sent-at timestamp are signed with HMAC-SHA256.

## Validation

The server requires a current timestamp, a unique delivery ID, the expected HMAC signature, a supported locale, an existing published source post, and non-empty translated content. It performs a transaction-safe upsert on the unique `(postId, locale)` key. No payload can create a new source post, category, tag, user, or executable content.

## Replay protection

Each accepted delivery ID is stored with its source SHA-256 signature and received timestamp. A repeat delivery ID is accepted as an idempotent acknowledgement only when the signed payload hash is identical; different content for the same ID is rejected. Expired timestamps and invalid signatures are rejected before database writes.

## Credential model

`XTZ_TRANSLATION_INGEST_SECRET` is shared only between the cloud worker’s owner-only configuration and the website’s server-side secret store. It is never embedded in client code, logs, URLs, or content records.
