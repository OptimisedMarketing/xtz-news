export const GANESHA_STORY_SLUG = "etherlink-ganesha-native-atomic-composability-gateway-on-chain";

export type RelatedStory = {
  id: number;
  title: string;
  categories?: Array<{ slug: string; name: string }> | null;
  publishedAt?: Date | string | null;
};

export function isGaneshaStory(slug: string | null | undefined) {
  return slug === GANESHA_STORY_SLUG;
}

function relatedStoryScore(story: RelatedStory) {
  const categories = story.categories?.map((category) => category.slug.toLowerCase()) ?? [];
  const title = story.title.toLowerCase();
  let score = 0;

  if (categories.includes("etherlink")) score += 12;
  if (categories.includes("tezos")) score += 8;
  if (title.includes("etherlink")) score += 6;
  if (title.includes("tezos")) score += 3;
  return score;
}

export function prioritiseGaneshaRelatedStories<T extends RelatedStory>(stories: T[]) {
  return [...stories].sort((left, right) => {
    const relevance = relatedStoryScore(right) - relatedStoryScore(left);
    if (relevance !== 0) return relevance;

    const rightDate = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
    const leftDate = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
    return rightDate - leftDate;
  });
}
