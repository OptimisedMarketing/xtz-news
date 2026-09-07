# Monthly Subscriber Digest — Activation and Safety Validation

**Validated:** 7 September 2026  
**Cadence:** 1st of each month at 09:00 Europe/London  
**Scope:** All active XTZ.News subscribers; every article published in the preceding complete calendar month.

## Final delivery design

The cloud runner now uses a dedicated owner-only Ed25519 signing identity to call the production-reachable `monthlyDigest.run` tRPC mutation. The runner has no database or email-provider credentials. The website verifies the signed, fresh payload before selecting articles and active subscribers, and records each successful subscriber-period delivery to prevent retry duplicates. Every email includes personalised preference-management and unsubscribe links.

| Validation | Result |
| --- | --- |
| Production signed dry run | Passed. The live service returned `ok: true`, `dryRun: true`, `digestPeriod: 2026-08`, **6** articles, and **1,017** active subscribers. No email was sent by this test. |
| Article selection | Passed. The dry run selected the complete prior calendar month, from `etherlink-70-ganesha-unites-tezos-and-evm-ecosystems` through `tezoracle-aims-to-restore-tezos-native-price-feeds`. |
| Weekly retirement | Passed. `xtz-weekly-digest.timer` and `xtz-weekly-digest.service` are both disabled and inactive. |
| Monthly scheduler | Passed. `xtz-monthly-digest.timer` is enabled and active, with the next execution at **1 October 2026, 09:00 Europe/London** (08:00 UTC during British Summer Time). |
| Activation-time safety | Passed after correction. The timer now names its target through `Unit=xtz-monthly-digest.service`, has no `Requires=` dependency, and uses `Persistent=false`; enabling it leaves the service inactive rather than sending a catch-up edition. |
| Runtime hardening | Passed. The service runs as `ubuntu` with `NoNewPrivileges=true`; the runner and log are owner-only (`0700` and `0600`), the signing key is owner-only (`0600`), and no port, firewall, DNS, or TLS change was made. |
| Application validation | Passed. The full suite completed **107 tests across 44 files** and TypeScript compilation passed for the monthly digest implementation. |

## Contained activation incident

The first attempt to enable the timer incorrectly used `Requires=xtz-monthly-digest.service`. That systemd dependency started the service immediately, instead of waiting for the scheduled calendar time. The service was stopped within roughly one minute. Delivery records show **168** Resend-accepted August emails between **16:15:18 and 16:15:49 UTC**; the remaining active subscribers were not sent that partial run. No retry or compensating send was triggered.

The dependency was removed, the timer was reinstalled with `Persistent=false`, and a post-correction activation verified that the monthly timer is active while the service remains inactive. The delivery records preserve idempotency for the affected August period; the next scheduled edition will select September articles for all active subscribers.

## Operational notes

Do not manually start `xtz-monthly-digest.service` except through an explicitly approved no-send invocation using `MONTHLY_DIGEST_DRY_RUN=1`. To pause future sends, run `sudo systemctl disable --now xtz-monthly-digest.timer`. The cloud operating record in `/home/ubuntu/AGENTS.md` describes the key, runner, timer, incident, and rollback-safe shutdown path.

