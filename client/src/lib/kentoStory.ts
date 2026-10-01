import type { RelatedStory } from "./ganeshaStory";

export const KENTO_STORY_SLUG = "kento-objkt-physical-digital-art-cards-kickstarter";
export const KENTO_FUNDING_FOLLOW_UP_SLUG = "kento-season-one-funded-951-backers-215920";

export function isKentoStory(slug: string | null | undefined) {
  return slug === KENTO_STORY_SLUG || slug === KENTO_FUNDING_FOLLOW_UP_SLUG;
}

function kentoArtScore(story: RelatedStory) {
  const categories = story.categories?.map((category) => category.slug.toLowerCase()) ?? [];
  const title = story.title.toLowerCase();
  let score = 0;

  if (categories.includes("art")) score += 16;
  if (categories.includes("nfts")) score += 10;
  if (categories.includes("exhibition")) score += 8;

  for (const keyword of ["art", "artist", "collect", "collector", "digital art", "nft", "objkt", "teia", "exhibition", "gallery", "mint"]) {
    if (title.includes(keyword)) score += 4;
  }

  return score;
}

/** Keeps the existing Art-related candidate set, but puts collecting and creator context first for Kento readers. */
export function prioritiseKentoRelatedStories<T extends RelatedStory>(stories: T[]) {
  return [...stories].sort((left, right) => {
    const relevance = kentoArtScore(right) - kentoArtScore(left);
    if (relevance !== 0) return relevance;

    const rightDate = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
    const leftDate = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
    return rightDate - leftDate;
  });
}
