# XTZ.News Additional Cloud Cadence Reduction Validation

**Validated:** 16 September 2026

The owner approved a further reduction of XTZ.News recurring cloud work. Automated audio generation is paused, while the retained SEO/IndexNow, governance-alert, and TezOracle workflows have been moved from daily to weekly execution. No source code, public route, content, mail setting, or external access control was changed.

| Unit | Updated state | Next scheduled execution | Rollback |
| --- | --- | --- | --- |
| `xtz-audio-generate.timer` | Disabled and inactive. Manual selected-story generation remains available. | None. | `sudo systemctl enable --now xtz-audio-generate.timer` after explicit approval. |
| `xtz-seo-ping.timer` | Enabled and active; Monday at 08:00 UTC. | 21 September 2026 08:00 UTC. | Restore the retained daily source template, install it, reload, and restart the timer. |
| `xtz-governance-alert.timer` | Enabled and active; Wednesday at 09:00 UTC. | 23 September 2026 09:00 UTC. | Restore the retained daily source template, install it, reload, and restart the timer. |
| `xtz-tezoracle-status.timer` | Enabled and active; Thursday at 03:15 UTC, retaining up to 20 minutes randomized delay. | 17 September 2026 03:32 UTC. | Restore the retained daily source template, install it, reload, and restart the timer. |

The intended monthly digest and weekly reviewed event-discovery timer remain enabled and active. The source timer templates and installed systemd units were updated together; calendar validation confirmed all three weekly schedules before installation. Exact rollback instructions are also recorded in the cloud computer's `AGENTS.md`.
