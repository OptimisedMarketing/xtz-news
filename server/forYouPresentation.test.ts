import { describe, expect, it } from "vitest";
import { getForYouPresentationState, getTopicSelectionLabel } from "../client/src/lib/forYouPresentation";

describe("For You reader presentation", () => {
  it("selects an explicit signed-in empty state when followed topics have no matching stories", () => {
    expect(getForYouPresentationState({
      isAuthenticated: true,
      loading: false,
      feedLoading: false,
      followedCount: 1,
      postCount: 0,
    })).toBe("emptyFeed");
  });

  it("distinguishes topic selection, loading, and populated reader states", () => {
    expect(getForYouPresentationState({ isAuthenticated: true, loading: false, feedLoading: false, followedCount: 0, postCount: 0 })).toBe("chooseTopics");
    expect(getForYouPresentationState({ isAuthenticated: true, loading: false, feedLoading: true, followedCount: 1, postCount: 0 })).toBe("loading");
    expect(getForYouPresentationState({ isAuthenticated: true, loading: false, feedLoading: false, followedCount: 2, postCount: 3 })).toBe("stories");
    expect(getForYouPresentationState({ isAuthenticated: false, loading: false, feedLoading: false, followedCount: 0, postCount: 0 })).toBe("guest");
  });

  it("gives reader-facing topic controls explicit follow and unfollow names", () => {
    expect(getTopicSelectionLabel("Tokenization", false)).toBe("Follow Tokenization");
    expect(getTopicSelectionLabel("Etherlink", true)).toBe("Unfollow Etherlink");
  });
});
