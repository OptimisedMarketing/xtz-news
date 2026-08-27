# XTZ.News GitHub Release Bridge

## Purpose

The GitHub repository remains the source of release requests, while the existing Manus-hosted XTZ.News stack remains the production runtime. A push to `main` creates a pending release record; it does **not** publish automatically. An authenticated administrator reviews the requested commit and invokes the controlled release action.

## Security model

The public receiver accepts only GitHub `push` payloads for `OptimisedMarketing/XTZ.News` on `refs/heads/main`. It validates `X-Hub-Signature-256` using HMAC-SHA256 and a constant-time comparison, rejects absent or duplicated delivery IDs, and saves the received SHA and comparison metadata. The receiver does not execute shell commands, `git pull`, or code supplied by the webhook.

The reviewer action is restricted to the existing site administrator and calls the Manus website publication endpoint from server-side code using a dedicated deployment API key. It publishes only the latest already-created Manus checkpoint, which is explicitly disclosed in the review UI. GitHub commits are therefore not silently treated as deployable production code.

## Required credentials

| Environment variable | Purpose |
| --- | --- |
| `GITHUB_WEBHOOK_SECRET` | Shared, high-entropy secret used to validate inbound GitHub signatures. The same value is entered in the repository webhook settings. |
| `MANUS_DEPLOY_API_KEY` | Server-side Manus API key permitted to invoke website publication. |
| `MANUS_DEPLOY_WEBSITE_ID` | The XTZ.News website identifier used by the publication-status and publish calls. |

## Operator flow

1. A push to `main` reaches `/api/webhooks/github` over HTTPS.
2. A valid, unseen delivery creates a pending release in the admin review queue.
3. An administrator reviews the SHA and release summary, then chooses **Publish latest checkpoint**.
4. The server records the request, invokes the publication API, and shows the resulting deployment state.

This flow is intentionally a release approval bridge—not a raw GitHub runtime deployment system.
