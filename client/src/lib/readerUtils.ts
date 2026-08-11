export function getLocaleFromPath(pathname: string): string {
  return pathname.split("/").filter(Boolean)[0] ?? "";
}

export function getTranslatedSlugFromPath(pathname: string): string {
  return pathname
    .split("/")
    .filter(Boolean)
    .slice(1)
    .map((segment) => decodeURIComponent(segment))
    .join("/");
}

export function compactTakeaway(value: string, limit = 156): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;

  const abbreviated = normalized.slice(0, limit - 1).replace(/\s+\S*$/, "").trim();
  return `${abbreviated}…`;
}
