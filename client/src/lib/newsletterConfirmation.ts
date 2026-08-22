export function getNewsletterConfirmationCopy(welcomeEmailRequested: boolean) {
  return {
    headline: "You’re subscribed.",
    description: welcomeEmailRequested
      ? "Your Resend welcome email is on its way from newsletter@xtz.news."
      : "Your subscription has been saved. Your newsletter will arrive at the next scheduled send.",
    preferenceNote: "Your welcome email includes secure links to manage preferences or unsubscribe at any time.",
  };
}
