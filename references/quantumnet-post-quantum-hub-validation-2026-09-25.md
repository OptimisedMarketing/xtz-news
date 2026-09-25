# Quantumnet Featured Resource Validation

**Validated:** 25 September 2026

## Featured-resource placement

The Post-quantum hub now has a clearly labelled **Featured resources** section. It includes a dedicated **Quantumnet: experimental testnet** card immediately after the tz5 wallet guide. The card identifies the story as XTZ.News reporting on the live public testnet and makes no claim that Quantumnet is a production network or wallet migration.

The card’s **Read the Quantumnet story** action points to the current published Quantumnet article slug: `/quantumnet-live-tezos-experimental-post-quantum-testnet`. The article also continues to appear in the hub’s dynamically loaded Post-quantum reporting and context section through its existing topic tag.

## Functional, visual and SEO validation

A browser-level interaction check confirmed the featured-resource action opens the published Quantumnet story. At 1280 px, the resource card sits in the first resource row with consistent card spacing and an unambiguous action. At 390 px, the hub’s shared mobile header, hero copy, reader-status note and start of the Featured resources section remain readable and free of horizontal overflow.

The hub keeps its unique crawler title and canonical URL and remains present in the canonical XML sitemap. TypeScript passes and the full regression suite passes: **179 tests across 62 files**. A focused regression test locks the resource title, destination and action label to the published Quantumnet story.
