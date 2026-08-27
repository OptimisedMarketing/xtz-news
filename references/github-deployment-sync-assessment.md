# GitHub-Triggered Deployment Sync — Assessment

## Confirmed capabilities

GitHub supports repository push webhooks and sends a payload to a configured endpoint. Its current documentation requires a webhook secret and validation of the `X-Hub-Signature-256` HMAC-SHA256 signature using a constant-time comparison. The GitHub connector is enabled for this project.

Manus exposes a website publication API, but it deploys **only the latest Manus checkpoint**. It does not accept a GitHub commit reference or pull GitHub repository source into the managed web project. Therefore, a GitHub push webhook alone cannot safely or truthfully make a pushed external commit live on the existing Manus-hosted site.

## Design implication

The existing GitHub repository is a one-way backup/export target. A true GitHub push-to-production pipeline requires either moving the production deployment to a GitHub-native hosting provider, or building a separate controlled release bridge that turns an approved GitHub commit into a reviewed Manus checkpoint before invoking the Manus publish API. The latter must keep deployment credentials server-side, verify GitHub signatures, reject replays, and avoid publishing arbitrary unreviewed commits.

## Primary references

- https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries
- https://open.manus.ai/docs/v2/website.publish
- https://open.manus.ai/docs/v2/website
