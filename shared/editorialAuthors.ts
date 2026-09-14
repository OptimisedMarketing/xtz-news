export type EditorialAuthor = {
  slug: string;
  name: string;
  jobTitle: string;
  location: string;
  description: string;
  imageUrl?: string;
  websiteUrl?: string;
  initials: string;
};

export const editorialAuthors: EditorialAuthor[] = [
  {
    slug: "lee-evans",
    name: "Lee Evans",
    jobTitle: "Writer",
    location: "United Kingdom",
    description: "Lee Evans is a UK-based writer for XTZ.News. His coverage follows Tezos technology, ecosystem projects, digital art, and the people building around the protocol, with an emphasis on clear context and direct source links.",
    imageUrl: "/manus-storage/lee-evans-xtz-news-author_7f0b6eaf.png",
    websiteUrl: "https://optimised.marketing",
    initials: "LE",
  },
  {
    slug: "rossa-browne",
    name: "Rossa Browne",
    jobTitle: "Writer",
    location: "Ireland",
    description: "Rossa Browne is an Ireland-based writer for XTZ.News. He follows Tezos news, digital culture, community developments, and practical reader context, with a focus on accessible editorial coverage.",
    initials: "RB",
  },
];

export function getEditorialAuthor(slug: string | null | undefined): EditorialAuthor | undefined {
  return editorialAuthors.find((author) => author.slug === slug);
}

export function getEditorialAuthorFromPath(pathname: string): EditorialAuthor | undefined {
  const match = pathname.match(/^\/authors\/([^/]+)\/?$/);
  return match ? getEditorialAuthor(match[1]) : undefined;
}
