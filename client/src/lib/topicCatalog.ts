export type FollowableTopic = {
  id: number;
  name: string;
  slug: string;
  postCount: number | null;
};

const TOPIC_PRIORITY = [
  "etherlink", "tokenization", "stablecoins", "payments", "lending", "dao",
  "wallets", "authentication", "acurast", "quipuswap", "plenty", "youves-news",
  "objkt-news", "hicetnunc-news", "games", "art", "adoption", "environmental",
];

const HIDDEN_TOPIC_SLUGS = new Set(["latest-news"]);

/**
 * Keeps the topic selector useful: editorial landing pages stay out, while every
 * category with published coverage remains available for a reader to follow.
 */
export function getFollowableTopics<T extends FollowableTopic>(categories: T[]): T[] {
  const priority = new Map(TOPIC_PRIORITY.map((slug, index) => [slug, index]));
  return categories
    .filter((category) => (category.postCount ?? 0) > 0 && !HIDDEN_TOPIC_SLUGS.has(category.slug))
    .sort((a, b) => {
      const aRank = priority.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
      const bRank = priority.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
      if (aRank !== bRank) return aRank - bRank;
      return (b.postCount ?? 0) - (a.postCount ?? 0);
    });
}
