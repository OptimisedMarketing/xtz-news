export function getArticleReadingProgress({
  scrollY,
  articleTop,
  articleHeight,
  viewportHeight,
}: {
  scrollY: number;
  articleTop: number;
  articleHeight: number;
  viewportHeight: number;
}) {
  const start = articleTop - viewportHeight * 0.2;
  const end = articleTop + articleHeight - viewportHeight * 0.55;
  if (end <= start) return scrollY >= end ? 100 : 0;
  return Math.max(0, Math.min(100, Math.round(((scrollY - start) / (end - start)) * 100)));
}
