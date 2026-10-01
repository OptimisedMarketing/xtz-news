export const ONCHAIN_COMMUNITY_ARCHIVE_PROJECT_SLUGS = [
  "the-wall-today",
  "teia",
  "objkt",
  "hek-tezos-digital-art",
  "kento",
] as const;

export const ONCHAIN_COMMUNITY_ARCHIVE_ARTICLE_SLUGS = [
  "the-wall-today-freezes-genesis-board-tezos-archive",
  "tezos-art-recap-responsive-signals-vienna-digital-works",
  "kento-objkt-physical-digital-art-cards-kickstarter",
] as const;

const projectOrder = new Map<string, number>(ONCHAIN_COMMUNITY_ARCHIVE_PROJECT_SLUGS.map((slug, index) => [slug, index]));
const articleOrder = new Map<string, number>(ONCHAIN_COMMUNITY_ARCHIVE_ARTICLE_SLUGS.map((slug, index) => [slug, index]));

export function selectOnchainArchiveProjects<T extends { slug: string }>(projects: T[]): T[] {
  return projects
    .filter((project) => projectOrder.has(project.slug))
    .sort((a, b) => (projectOrder.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (projectOrder.get(b.slug) ?? Number.MAX_SAFE_INTEGER));
}

export function selectOnchainArchiveArticles<T extends { slug: string }>(articles: T[]): T[] {
  return articles
    .filter((article) => articleOrder.has(article.slug))
    .sort((a, b) => (articleOrder.get(a.slug) ?? Number.MAX_SAFE_INTEGER) - (articleOrder.get(b.slug) ?? Number.MAX_SAFE_INTEGER));
}
