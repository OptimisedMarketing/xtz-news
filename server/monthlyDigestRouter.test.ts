import { describe, expect, it } from "vitest";
import { renderMonthlyDigestEmail } from "./monthlyDigestRouter";

const pastEvent = {
  title: "Stories We Tell Online",
  startAt: new Date("2026-09-23T16:00:00.000Z"),
  endAt: new Date("2026-09-23T20:00:00.000Z"),
  location: "Vienna, Austria",
  timezone: "Europe/Vienna",
  eventType: "exhibition",
  sourceUrl: "https://example.test/stories",
};

const upcomingEvent = {
  title: "Quantum: An Existential Threat to Crypto?",
  startAt: new Date("2026-10-07T08:20:00.000Z"),
  endAt: new Date("2026-10-07T08:50:00.000Z"),
  location: "TOKEN2049 Singapore",
  timezone: "Asia/Singapore",
  eventType: "conference",
  sourceUrl: "https://example.test/quantum",
};

describe("monthly digest newsletter rendering", () => {
  it("renders past-month and upcoming event sections alongside news", () => {
    const html = renderMonthlyDigestEmail({
      label: "September 2026",
      posts: [{
        id: 1,
        title: "A <safe> Tezos story",
        slug: "safe-story",
        excerpt: "A useful summary.",
        featuredImageUrl: "/manus-storage/example.png",
      }],
      pastEvents: [pastEvent],
      upcomingEvents: [upcomingEvent],
      token: "subscriber-token",
    });

    expect(html).toContain("News published in September 2026");
    expect(html).toContain("Events from September 2026");
    expect(html).toContain("Upcoming Tezos events");
    expect(html).toContain("Stories We Tell Online");
    expect(html).toContain("Quantum: An Existential Threat to Crypto?");
    expect(html).toContain("https://xtz.news/events");
    expect(html).toContain("Event of the month");
    expect(html).toContain(">Art<");
    expect(html).toContain(">Conference<");
    expect(html).toContain("A &lt;safe&gt; Tezos story");
    expect(html).toContain("https://xtz.news/media/example.png");
  });

  it("supports an events-only month without an empty news heading", () => {
    const html = renderMonthlyDigestEmail({
      label: "September 2026",
      posts: [],
      pastEvents: [pastEvent],
      upcomingEvents: [],
      token: null,
    });

    expect(html).toContain("Events from September 2026");
    expect(html).not.toContain("News published in September 2026");
    expect(html).not.toContain("Upcoming Tezos events");
  });

  it("renders the events-only edition without news stories", () => {
    const html = renderMonthlyDigestEmail({
      label: "September 2026",
      posts: [],
      pastEvents: [pastEvent],
      upcomingEvents: [upcomingEvent],
      eventsOnly: true,
      token: "subscriber-token",
    });

    expect(html).toContain("events-only preference is active");
    expect(html).toContain("Verified Tezos events for September 2026");
    expect(html).not.toContain("News published in September 2026");
    expect(html).toContain("Event of the month");
  });
});
