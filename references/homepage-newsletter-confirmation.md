# Homepage Newsletter Confirmation — Validation Record

The homepage was opened with the development-only `?newsletterPreview=success` parameter, which creates no subscriber and sends no email. The rendered homepage output confirms that the primary **Stay ahead of Tezos** banner shows the same success treatment as the article CTA: **You’re subscribed**, the Resend welcome-email message from `newsletter@xtz.news`, and secure preference-management/unsubscribe guidance. The production form remains unchanged until a real successful subscription response is returned.

A 390px full-page capture confirms the homepage success card remains within the single-column newsletter banner and its confirmation copy stays readable on mobile.
