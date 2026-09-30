import { useMemo } from "react";
import { ArrowRight, BadgeCheck, CalendarDays, ExternalLink, Palette, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getMediaUrl } from "@/lib/mediaUrl";
import { getArtArchiveType, type ArtArchivePost } from "@/components/ArtArchiveFilters";

export const ART_ON_TEZOS_CONTRIBUTORS = [
  {
    name: "Jonas Lund",
    initials: "JL",
    role: "Artist",
    context: "Presented a MoMI commission with Yoshi Sodeoka in the Responsive Signals programme.",
    searchQuery: "Jonas Lund",
    sourceUrl: "https://movingimage.org/event/responsive-signals/",
    accent: "#8b5cf6",
  },
  {
    name: "Yoshi Sodeoka",
    initials: "YS",
    role: "Artist",
    context: "Presented the MoMI commission Terms of Agreement 🐳 with Jonas Lund.",
    searchQuery: "Yoshi Sodeoka",
    sourceUrl: "https://movingimage.org/event/responsive-signals/",
    accent: "#2dd4bf",
  },
  {
    name: "Kat Zhang",
    initials: "KZ",
    role: "Artist · The Poet Engineer",
    context: "Presented interactive works exploring gesture, coding and machine memory at MoMI.",
    searchQuery: "Kat Zhang",
    sourceUrl: "https://movingimage.org/event/responsive-signals/",
    accent: "#f59e0b",
  },
  {
    name: "Micol",
    initials: "M",
    role: "Curator",
    context: "Co-curated Stories We Tell Online and the objkt.one works highlighted in the September recap.",
    searchQuery: "Stories We Tell Online",
    sourceUrl: "https://x.com/tezos/status/2103485035299156358",
    accent: "#f472b6",
  },
] as const;

function formatDate(date: Date | string | null | undefined) {
  return date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";
}

export default function ArtOnTezosWeeklyModule() {
  const { data, isLoading } = trpc.posts.byCategory.useQuery(
    { slug: "art", limit: 100, offset: 0 },
    { staleTime: 5 * 60_000 },
  );
  const latestRecap = useMemo(
    () => (data?.posts ?? []).find((post) => getArtArchiveType(post as ArtArchivePost) === "recaps"),
    [data],
  );

  return (
    <section id="art-this-week" style={{ padding: "3.15rem 0", background: "linear-gradient(135deg, #080b1b 0%, #171035 56%, #082a31 100%)", borderTop: "1px solid rgba(249,168,212,0.18)", borderBottom: "1px solid rgba(45,212,191,0.18)" }} aria-labelledby="art-this-week-title">
      <div className="container">
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
          <div>
            <p style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", margin: 0, color: "#5eead4", fontSize: "0.66rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}><CalendarDays size={14} aria-hidden="true" /> Curated weekly update</p>
            <h2 id="art-this-week-title" style={{ margin: "0.4rem 0 0", color: "#fff", fontSize: "clamp(1.6rem, 3vw, 2.1rem)", lineHeight: 1.1 }}>Art on Tezos this week</h2>
          </div>
          <Link href="/art?type=recaps" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#5eead4", fontSize: "0.78rem", fontWeight: 800, textDecoration: "none" }}>Browse recap archive <ArrowRight size={14} /></Link>
        </div>
        <p style={{ maxWidth: "760px", margin: "0 0 1.35rem", color: "rgba(255,255,255,0.66)", fontSize: "0.9rem", lineHeight: 1.6 }}>The latest published Art on Tezos recap is surfaced here automatically. It is an editorial round-up, not a live calendar; check the linked organiser before acting on any dated event, release or call.</p>

        {isLoading ? (
          <div className="skeleton" aria-label="Loading latest Art on Tezos recap" style={{ height: "260px", borderRadius: "12px" }} />
        ) : latestRecap ? (
          <Link href={`/${latestRecap.slug}`} style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.86fr) minmax(0, 1.14fr)", overflow: "hidden", borderRadius: "12px", border: "1px solid rgba(45,212,191,0.28)", background: "rgba(4,8,22,0.75)", color: "inherit", textDecoration: "none" }} className="art-weekly-recap-card">
            <div style={{ minHeight: "240px", background: "#071a35" }}>{latestRecap.featuredImageUrl ? <img src={getMediaUrl(latestRecap.featuredImageUrl)} alt={latestRecap.featuredImageAlt || latestRecap.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <div style={{ minHeight: "240px", height: "100%", display: "grid", placeItems: "center", background: "radial-gradient(circle, #12405c, #11102b)" }}><Palette size={44} color="#5eead4" aria-hidden="true" /></div>}</div>
            <div style={{ padding: "1.4rem clamp(1.25rem, 3vw, 2.1rem)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ margin: 0, color: "#5eead4", fontSize: "0.64rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>Latest official-recap coverage</p>
              <h3 style={{ margin: "0.55rem 0", color: "#fff", fontSize: "clamp(1.35rem, 2.5vw, 1.85rem)", lineHeight: 1.14 }}>{latestRecap.title}</h3>
              <p style={{ margin: "0 0 0.9rem", color: "rgba(255,255,255,0.62)", fontSize: "0.86rem", lineHeight: 1.58 }}>{latestRecap.excerpt}</p>
              <span style={{ color: "rgba(255,255,255,0.46)", fontSize: "0.72rem", fontWeight: 700 }}>{formatDate(latestRecap.publishedAt)}</span>
              <b style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", marginTop: "1rem", color: "#5eead4", fontSize: "0.78rem" }}>Read this recap <ArrowRight size={14} /></b>
            </div>
          </Link>
        ) : (
          <div style={{ padding: "1.5rem", border: "1px dashed rgba(255,255,255,0.23)", borderRadius: "10px", color: "rgba(255,255,255,0.65)" }}>The next published Art on Tezos recap will appear here. Browse the existing archive in the meantime.</div>
        )}

        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginTop: "2.5rem", marginBottom: "1rem" }}>
          <div>
            <p style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", margin: 0, color: "#f9a8d4", fontSize: "0.65rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}><UsersRound size={14} aria-hidden="true" /> Contributor profiles</p>
            <h3 style={{ margin: "0.35rem 0 0", color: "#fff", fontSize: "1.3rem" }}>People in the current coverage</h3>
          </div>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.74rem" }}>Source-linked context, not an endorsement</span>
        </div>
        <div className="art-contributor-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.85rem" }}>
          {ART_ON_TEZOS_CONTRIBUTORS.map((contributor) => (
            <article key={contributor.name} style={{ display: "flex", flexDirection: "column", minHeight: "230px", padding: "1rem", background: "rgba(5,7,20,0.58)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                <span aria-hidden="true" style={{ display: "grid", placeItems: "center", width: "42px", height: "42px", borderRadius: "50%", color: "#06101e", background: contributor.accent, fontWeight: 950, fontSize: "0.78rem", letterSpacing: "0.02em" }}>{contributor.initials}</span>
                <div><h4 style={{ margin: 0, color: "#fff", fontSize: "0.96rem" }}>{contributor.name}</h4><p style={{ margin: "0.15rem 0 0", color: contributor.accent, fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>{contributor.role}</p></div>
              </div>
              <p style={{ margin: "0.9rem 0", color: "rgba(255,255,255,0.6)", fontSize: "0.76rem", lineHeight: 1.55 }}>{contributor.context}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginTop: "auto" }}>
                <Link href={`/search?q=${encodeURIComponent(contributor.searchQuery)}`} style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 800, textDecoration: "none" }}>Find coverage <ArrowRight size={12} style={{ display: "inline", verticalAlign: "-2px" }} /></Link>
                <a href={contributor.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open source context for ${contributor.name}`} style={{ display: "inline-flex", color: "rgba(255,255,255,0.58)", padding: "0.25rem" }}><ExternalLink size={14} /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 760px) { .art-weekly-recap-card { grid-template-columns: 1fr !important; } .art-weekly-recap-card > div:first-child { min-height: 200px !important; } .art-contributor-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } } @media (max-width: 420px) { .art-contributor-grid { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
