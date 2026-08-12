export function getSafeReturnTo(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export function getReaderLoginUrl(returnTo?: string) {
  const current = typeof window === "undefined" ? "/" : `${window.location.pathname}${window.location.search}`;
  return `/login?returnTo=${encodeURIComponent(getSafeReturnTo(returnTo ?? current))}`;
}

export function goToReaderLogin(returnTo?: string) {
  window.location.href = getReaderLoginUrl(returnTo);
}
