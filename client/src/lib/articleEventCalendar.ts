export type ArticleEventCalendarCallout = {
  eyebrow: string;
  title: string;
  description: string;
  eventQuery: string;
};

const EVENT_CALENDAR_CALLOUTS: Record<string, ArticleEventCalendarCallout> = {
  "arthur-breitman-token2049-quantum-risks-crypto": {
    eyebrow: "Tezos events calendar",
    title: "Save the TOKEN2049 quantum panel",
    description: "View the event’s organiser details, add the panel to a personal calendar, or subscribe to future editor-reviewed Tezos events.",
    eventQuery: "?topic=Post-Quantum",
  },
  "tezos-art-recap-responsive-signals-vienna-digital-works": {
    eyebrow: "Art on Tezos calendar",
    title: "Find the next Art on Tezos event",
    description: "Browse editor-reviewed exhibitions, talks and gatherings, then add the events that matter to a personal calendar.",
    eventQuery: "?topic=Art%20on%20Tezos",
  },
};

export function getArticleEventCalendarCallout(slug: string): ArticleEventCalendarCallout | undefined {
  return EVENT_CALENDAR_CALLOUTS[slug];
}
