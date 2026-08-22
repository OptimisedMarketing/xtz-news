# Ganesha Reader Guidance and Newsletter Confirmation — Validation Record

## Technical definitions and reading progress

On 22 August 2026, the refreshed Ganesha article was browser-validated. The rendered reader output includes the accessible top-level progress announcement, **0% of this article read**, and exposes EVM and Michelson definitions in the article content. The definition markup provides a hover-and-keyboard-focus treatment through `role="term"`, an explicit accessible label, and a tooltip element.

## Resend-connected newsletter confirmation

The newsletter subscription procedure persists or reactivates the subscription before requesting the existing Resend welcome email. Its response now includes `welcomeEmailRequested`, allowing the mid-article success state to distinguish a successfully requested Resend welcome email from a saved subscription where delivery was not requested. In both cases the confirmation points readers to the welcome email’s secure preference-management and unsubscribe links. No live email was submitted during validation.

The live reader progress changed from **0%** to **2%** after a browser reading interaction, and the article metadata updated with the same percentage. This confirms the visible top indicator and the article’s textual reading feedback share the scroll-driven state. The full regression suite passes: **58 tests across 20 files**, including dedicated tests for term annotation, reading-progress accessibility, and Resend confirmation copy. TypeScript checks pass.

## Completion checks

The final live NAC anchor check renders **NAC** with the same definition treatment as EVM and Michelson: *Native Atomic Composability: cross-interface actions succeed together or revert together.* During that anchored reading journey, the top accessible indicator and article metadata advanced to **10%**, confirming meaningful scroll-driven progress.

The animated newsletter confirmation has rendered component coverage that invokes the successful Resend-aware outcome without inserting a test subscriber or sending an email. It verifies the success headline, Resend welcome-email message, and preference-management guidance. Final desktop and 390px mobile captures confirm the article remains readable, the tooltip treatment is available by hover/focus without forcing visible copy into the layout, and the mid-article newsletter invitation fits the single-column mobile flow.

## Safe success-preview validation

The development-only `?newsletterPreview=success` route rendered the in-article confirmation without submitting any data. Its browser output contains **You’re subscribed**, the Resend welcome-email statement from `newsletter@xtz.news`, and the secure preference-management/unsubscribe guidance. The same live anchored reading journey confirmed the corrected NAC definition and the article-body reading progress reached 10% after entering the **What NAC changes** section.

The refined article-body calculation was browser-validated at the final Ganesha section: the Technical Guide’s **A foundation for Tezos X** target showed **77% of this article read**, a substantial late-stage advance from the starting 0%. The development-only success-preview card was then captured at 1280px and 390px. In both layouts, the animated success-state container remains within the article column and its Resend-aware confirmation copy is available without any email submission.

The browser was then taken to the bottom of the page. The progress indicator and its matching reader metadata reached **100% of this article read**, completing the 0% → 10% → 77% → 100% article-body journey. This confirms that the visual top bar and assistive label track article reading through to completion while the non-article footer remains visible below.
