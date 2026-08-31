import type { RelatedStory } from "./ganeshaStory";

export const TEZORACLE_STORY_SLUG = "tezoracle-aims-to-restore-tezos-native-price-feeds";

export function isTezOracleStory(slug: string | null | undefined) {
  return slug === TEZORACLE_STORY_SLUG;
}

function tezosInfrastructureScore(story: RelatedStory) {
  const categories = story.categories?.map((category) => category.slug.toLowerCase()) ?? [];
  const title = story.title.toLowerCase();
  let score = 0;

  if (categories.includes("infrastructure")) score += 14;
  if (categories.includes("defi")) score += 11;
  if (categories.includes("etherlink")) score += 7;

  for (const keyword of ["oracle", "tezoracle", "price feed", "defi", "etherlink", "tezos x", "michelson", "evm"]) {
    if (title.includes(keyword)) score += 4;
  }

  return score;
}

/** Keeps the existing related-post set but puts protocol and DeFi context first for TezOracle readers. */
export function prioritiseTezOracleRelatedStories<T extends RelatedStory>(stories: T[]) {
  return [...stories].sort((left, right) => {
    const relevance = tezosInfrastructureScore(right) - tezosInfrastructureScore(left);
    if (relevance !== 0) return relevance;

    const rightDate = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
    const leftDate = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
    return rightDate - leftDate;
  });
}
