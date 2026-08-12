/**
 * The hosting edge treats /manus-storage as a redirect endpoint on custom domains.
 * Route browser image requests through the app relay so the app streams bytes from
 * storage instead of relying on a signed cross-origin redirect.
 */
export function getMediaUrl(source: string | null | undefined): string {
  if (!source) return "";
  if (source.startsWith("/manus-storage/")) {
    return `/media/${source.slice("/manus-storage/".length)}`;
  }
  return source.replace(/^https?:\/\/(?:www\.)?xtz\.news\/manus-storage\//, "/media/");
}
