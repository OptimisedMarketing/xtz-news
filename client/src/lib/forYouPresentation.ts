export type ForYouPresentationState = "guest" | "loading" | "chooseTopics" | "emptyFeed" | "stories";

export function getForYouPresentationState(input: {
  isAuthenticated: boolean;
  loading: boolean;
  feedLoading: boolean;
  followedCount: number;
  postCount: number;
}): ForYouPresentationState {
  if (!input.isAuthenticated && !input.loading) return "guest";
  if (input.feedLoading) return "loading";
  if (input.followedCount === 0) return "chooseTopics";
  return input.postCount === 0 ? "emptyFeed" : "stories";
}

export function getTopicSelectionLabel(topicName: string, isFollowing: boolean): string {
  return `${isFollowing ? "Unfollow" : "Follow"} ${topicName}`;
}
