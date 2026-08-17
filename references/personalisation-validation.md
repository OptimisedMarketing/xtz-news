# Reader Personalisation Validation

## Live signed-in observation — 13 August 2026

The connected reader session is authenticated on `xtz.news`, as confirmed by the visible **Sign out** control. The live homepage’s **For You** module renders four Etherlink-labelled stories for the reader’s selected Etherlink topic: the Ganesha article, the Etherlink 6.6 Security Hardening article, Etherlink’s EVM Bridge announcement, and the DeFiLlama integration article. The same view exposes a **Manage crypto topics (25)** control, confirming that the expanded topic catalogue is available to authenticated readers.

No reader preferences were changed during this observation.

## Follow, refresh, and empty-state validation — 14 August 2026

With the reader’s confirmation, the live topic manager was used to temporarily add **Tokenization** alongside **Etherlink**. A refresh preserved both topics and the **For You** feed updated to label content from Tokenization and Etherlink, including the metals.io Tokenization stories. Tokenization was then removed and a subsequent refresh restored the reader to an Etherlink-only feed; the preference table check confirmed that only the Etherlink follow remained.

The signed-in visitor state, populated Etherlink feed, topic-manager selection state, and no-preference empty state were also exercised through the custom email reader flow. Automated preference-router coverage checks empty preferences, multiple followed categories, category-labelled stories, and the expanded topic catalogue.

## Explicit signed-in empty-state verification — 15 August 2026

The reader temporarily removed Etherlink through the live **Manage crypto topics** flow and confirmed the signed-in no-matching-stories message was visible. Etherlink was immediately reselected and refreshed. A privacy-preserving follow-table check confirmed exactly one current follow, **etherlink**, restoring the normal personalised feed.
