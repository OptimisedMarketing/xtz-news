# Events Imagery Validation

**Validated:** 30 September 2026

All four current editor-published event records now carry a source-grounded visual, descriptive alternative text and a visible credit. The Terms of Agreement listing uses a Tezos / Museum of the Moving Image installation view; Responsive Signals uses the official Art on Tezos event poster; Stories We Tell Online uses the existing Art on Tezos event photograph; and the TOKEN2049 panel uses Tezos’ official announcement artwork.

Each event card loads its image through the existing same-origin `/media/*` relay and links the visual to the verified source listing. The card retains its event type, event time, location, speakers, topics and calendar actions without altered editorial status or automated publication behavior.

Desktop and 390px mobile full-page captures confirm the two-column visual-card layout reflows to single column cleanly, with credits remaining legible below every image. All four media relay endpoints returned HTTP 200, and the public event procedure exposes all four image records.

Focused visual-card, submission, calendar and filter coverage passed: **9 assertions across 4 test files**. TypeScript validation also passed.
