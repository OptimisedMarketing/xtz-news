export type RelatedStory = {
  title: string;
  publishedAt?: Date | string | null;
  categories?: Array<{ slug: string }> | null;
};

export const POST_QUANTUM_STORY_SLUG = "tezos-post-quantum-previewnet-why-now";

export function isPostQuantumStory(slug: string | null | undefined) {
  return slug === POST_QUANTUM_STORY_SLUG;
}

function postQuantumRelevanceScore(story: RelatedStory) {
  const categories = story.categories?.map((category) => category.slug.toLowerCase()) ?? [];
  const title = story.title.toLowerCase();
  let score = 0;

  if (categories.includes("infrastructure")) score += 8;
  if (categories.includes("latest-news")) score += 2;

  for (const keyword of ["post-quantum", "quantum", "cryptography", "ushuaia", "tz5", "ml-dsa", "data availability", "protocol", "tezos x"]) {
    if (title.includes(keyword)) score += 9;
  }

  return score;
}

/** Keeps the selected server candidates, promoting Tezos cryptography and protocol context for post-quantum readers. */
export function prioritisePostQuantumRelatedStories<T extends RelatedStory>(stories: T[]) {
  return [...stories].sort((left, right) => {
    const relevance = postQuantumRelevanceScore(right) - postQuantumRelevanceScore(left);
    if (relevance !== 0) return relevance;

    const rightDate = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
    const leftDate = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
    return rightDate - leftDate;
  });
}
