import { describe, expect, it } from "vitest";
import { getFollowableTopics } from "../client/src/lib/topicCatalog";

describe("getFollowableTopics", () => {
  it("prioritises core crypto topics while keeping every covered category followable", () => {
    const topics = getFollowableTopics([
      { id: 1, name: "Latest News", slug: "latest-news", postCount: 900 },
      { id: 2, name: "Art", slug: "art", postCount: 6 },
      { id: 3, name: "Etherlink", slug: "etherlink", postCount: 9 },
      { id: 4, name: "Payments", slug: "payments", postCount: 9 },
      { id: 5, name: "Museums", slug: "museums", postCount: 2 },
      { id: 6, name: "Empty", slug: "empty", postCount: 0 },
    ]);

    expect(topics.map((topic) => topic.slug)).toEqual(["etherlink", "payments", "art", "museums"]);
  });
});
