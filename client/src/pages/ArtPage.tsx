import { useState } from "react";
import { Link } from "wouter";
import { ExternalLink, ArrowRight, Palette, Image, Music, Layers } from "lucide-react";
import { trpc } from "@/lib/trpc";
import PostCard from "@/components/PostCard";
import { useSEO, buildWebPageSchema } from "@/hooks/useSEO";

// ─── Ecosystem Links ──────────────────────────────────────────────────────────
const ECOSYSTEM_LINKS = [
  {
    name: "objkt.com",
    description: "The leading Tezos NFT marketplace — discover, collect, and trade digital art",
    url: "https://objkt.com",
    color: "#2c7df7",
    icon: "🖼️",
  },
  {
    name: "Teia",
    description: "Community-run Tezos art platform, successor to Hic et Nunc",
    url: "https://teia.art",
    color: "#7c3aed",
    icon: "🌿",
  },
  {
    name: "Art on Tezos",
    description: "Official Tezos Foundation art initiative — exhibitions, events, and artist support",
    url: "https://artontezos.com",
    color: "#059669",
    icon: "🎨",
  },
  {
    name: "fxhash",
    description: "Generative art platform built on Tezos — algorithmic and code-based art",
    url: "https://www.fxhash.xyz",
    color: "#d97706",
    icon: "⚡",
  },
  {
    name: "HEK Basel",
    description: "House of Electronic Arts — Tezos Foundation partner for digital art exhibitions",
    url: "https://hek.ch",
    color: "#dc2626",
    icon: "🏛️",
  },
  {
    name: "Tezos Commons",
    description: "Community hub for Tezos news, art events, and ecosystem updates",
    url: "https://tezoscommons.org",
    color: "#0891b2",
    icon: "🌐",
  },
];

// ─── Featured Exhibitions ─────────────────────────────────────────────────────
const FEATURED_EXHIBITIONS = [
  {
    title: "404_LAND",
    subtitle: "Virtual Exhibition",
    venue: "HEK Basel × Tezos Foundation",
    dates: "June 12 – August 9, 2026",
    description: "A virtual group exhibition where error becomes both metaphor and framework. Six artists explore what happens when identity, memory, and meaning break down online.",
    url: "/404-land-hek-tezos-digital-art-exhibition",
    badge: "LIVE",
    badgeColor: "#22c55e",
    artists: ["Gabriel Massan", "dmstfctn", "Varvara & Mar", "Hind Al Saad", "Kat Zhang", "Alida Sun"],
  },
  {
    title: "Quayola: En plein air",
    subtitle: "Outdoor Installation",
    venue: "HEK Basel",
    dates: "June 15–21, 2026",
    description: "An outdoor installation by artist Quayola presented during Art Basel week, in partnership with the Tezos Foundation. A new objkt.one release launches June 17.",
    url: "/art-on-tezos-friday-recap-may-29-2026",
    badge: "ART BASEL",
    badgeColor: "#f97316",
    artists: ["Quayola"],
  },
  {
    title: "Teia Cycles",
    subtitle: "Group Exhibition",
    venue: "NFC Summit, Lisbon",
    dates: "June 4–6, 2026",
    description: "20 selected artists presented by Teia Community and Art on Tezos during the NFC Summit at Unicorn Factory Lisboa.",
    url: "/art-on-tezos-friday-recap-may-29-2026",
    badge: "NFC SUMMIT",
    badgeColor: "#2c7df7",
    artists: ["20 selected artists"],
  },
];

// ─── Art Categories ───────────────────────────────────────────────────────────
const ART_CATEGORIES = [
  { label: "Art Recap", slug: "art", icon: <Palette size={16} />, color: "#2c7df7" },
  { label: "Exhibition", slug: "exhibition", icon: <Image size={16} />, color: "#7c3aed" },
  { label: "Music", slug: "music", icon: <Music size={16} />, color: "#d97706" },
  { label: "NFT", slug: "nft", icon: <Layers size={16} />, color: "#059669" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ArtPage() {
  const [activeCategory, setActiveCategory] = useState("art");

  useSEO({
    title: "Art on Tezos | XTZ.News — Digital Art, NFTs & Exhibitions",
    description: "Explore the Tezos digital art ecosystem — weekly recaps, NFT exhibitions, featured artists, and links to objkt.com, Teia, fxhash, and HEK Basel.",
    keywords: "Tezos art, Tezos NFT, objkt, Teia, fxhash, digital art Tezos, Tezos exhibitions, Art on Tezos",
    canonical: "https://xtz.news/art",
    jsonLd: buildWebPageSchema({
      title: "Art on Tezos | XTZ.News",
      description: "Explore the Tezos digital art ecosystem — weekly recaps, NFT exhibitions, featured artists, and links to objkt.com, Teia, fxhash, and HEK Basel.",
      url: "https://xtz.news/art",
      breadcrumbs: [
        { name: "Home", url: "https://xtz.news" },
        { name: "Art", url: "https://xtz.news/art" },
      ],
    }),
  });

  const { data: artPostsData } = trpc.posts.byCategory.useQuery(
    { slug: activeCategory, limit: 9, offset: 0 },
    { staleTime: 5 * 60_000 }
  );
  const artPosts = artPostsData?.posts ?? [];

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <div style={{
        background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 40%, #1a0a3e 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "4rem 0 3rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 50%, #2c7df7 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "#7c3aed" }}>
              Tezos Ecosystem
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>—</span>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Digital Art & NFTs
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "#fff",
            margin: "0 0 1rem", lineHeight: 1.1, letterSpacing: "-0.02em",
          }}>
            Art on Tezos
          </h1>
          <p style={{
            fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", maxWidth: "600px",
            margin: "0 0 2rem", lineHeight: 1.6,
          }}>
            Discover the Tezos digital art ecosystem — weekly recaps, live exhibitions,
            community events, and the platforms powering the next generation of digital creativity.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <a href="https://objkt.com" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", background: "rgba(44,125,247,0.15)", border: "1px solid rgba(44,125,247,0.4)", borderRadius: "4px", color: "#2c7df7", textDecoration: "none", fontSize: "0.82rem", fontWeight: 700, transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.25)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.15)"; }}>
              Explore objkt.com <ExternalLink size={12} />
            </a>
            <a href="https://teia.art" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: "4px", color: "#a78bfa", textDecoration: "none", fontSize: "0.82rem", fontWeight: 700, transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.25)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.15)"; }}>
              Explore Teia <ExternalLink size={12} />
            </a>
            <Link href="/art-on-tezos-friday-recap-may-29-2026"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 700 }}>
              Latest Art Recap <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Featured Exhibitions ── */}
      <section style={{ padding: "3rem 0", background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
            <div style={{ width: "4px", height: "28px", background: "#7c3aed", borderRadius: "2px" }} />
            <div>
              <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#7c3aed", marginBottom: "2px" }}>Now & Upcoming</p>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Featured Exhibitions</h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {FEATURED_EXHIBITIONS.map((ex) => (
              <Link key={ex.title} href={ex.url} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#000", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px",
                  padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column", gap: "0.75rem",
                  transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.borderColor = "rgba(124,58,237,0.4)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.borderColor = "rgba(255,255,255,0.07)"; el.style.boxShadow = "none"; }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: ex.badgeColor, background: `${ex.badgeColor}20`, padding: "2px 8px", borderRadius: "2px", border: `1px solid ${ex.badgeColor}40` }}>
                      {ex.badge}
                    </span>
                    <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>{ex.dates}</span>
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 2px", fontSize: "1.1rem", fontWeight: 900, color: "#fff" }}>{ex.title}</h3>
                    <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{ex.subtitle} · {ex.venue}</p>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, flex: 1 }}>{ex.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {ex.artists.slice(0, 3).map((a) => (
                      <span key={a} style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: "2px" }}>{a}</span>
                    ))}
                    {ex.artists.length > 3 && <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", padding: "2px 4px" }}>+{ex.artists.length - 3} more</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Art News ── */}
      <section style={{ padding: "3rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "4px", height: "28px", background: "#2c7df7", borderRadius: "2px" }} />
              <div>
                <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2c7df7", marginBottom: "2px" }}>Latest</p>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Art News & Recaps</h2>
              </div>
            </div>
            {/* Category pills */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {ART_CATEGORIES.map((cat) => (
                <button key={cat.slug} onClick={() => setActiveCategory(cat.slug)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                    padding: "0.35rem 0.875rem", borderRadius: "4px", cursor: "pointer",
                    border: activeCategory === cat.slug ? `1px solid ${cat.color}` : "1px solid rgba(255,255,255,0.12)",
                    background: activeCategory === cat.slug ? `${cat.color}20` : "transparent",
                    color: activeCategory === cat.slug ? cat.color : "rgba(255,255,255,0.5)",
                    fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                    transition: "all 0.15s",
                  }}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {artPosts.length > 0 ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
                {artPosts.map((post) => (
                  <PostCard key={post.id} post={post} variant="default" />
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Link href={`/category/${activeCategory}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem", background: "transparent", border: "2px solid rgba(44,125,247,0.5)", borderRadius: "3px", color: "#2c7df7", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "#2c7df7"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.5)"; }}>
                  View All {ART_CATEGORIES.find(c => c.slug === activeCategory)?.label} Articles <ArrowRight size={14} />
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "rgba(255,255,255,0.3)" }}>
              <p style={{ fontSize: "0.9rem" }}>No articles found in this category yet.</p>
              <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>Check back after the weekly recap publishes every Friday.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Ecosystem Links ── */}
      <section style={{ padding: "3rem 0", background: "#05152e", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
            <div style={{ width: "4px", height: "28px", background: "#059669", borderRadius: "2px" }} />
            <div>
              <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#059669", marginBottom: "2px" }}>Explore</p>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>Tezos Art Ecosystem</h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {ECOSYSTEM_LINKS.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  background: "#000", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px",
                  padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.borderColor = `${link.color}40`; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                  <span style={{ fontSize: "1.5rem", flexShrink: 0, lineHeight: 1 }}>{link.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                      <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#fff" }}>{link.name}</span>
                      <ExternalLink size={11} style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                    </div>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{link.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Weekly Recap CTA ── */}
      <section style={{ padding: "3rem 0", background: "linear-gradient(135deg, #1a0a3e 0%, #05152e 100%)", borderTop: "1px solid rgba(124,58,237,0.2)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "#7c3aed" }}>Every Friday</p>
          <h2 style={{ margin: "0 0 0.75rem", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 900, color: "#fff" }}>Art on Tezos Weekly Recap</h2>
          <p style={{ margin: "0 0 2rem", fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", maxWidth: "500px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Every Friday we publish a curated recap of the latest Tezos art events, NFT drops, exhibitions, and community highlights — automatically generated from live objkt.com and Teia data.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/category/art"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", background: "#7c3aed", border: "none", borderRadius: "4px", color: "#fff", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700, transition: "background 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#6d28d9"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#7c3aed"; }}>
              Read All Recaps <ArrowRight size={14} />
            </Link>
            <Link href="/art-on-tezos-friday-recap-may-29-2026"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", background: "transparent", border: "2px solid rgba(124,58,237,0.5)", borderRadius: "4px", color: "#a78bfa", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700, transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#7c3aed"; (e.currentTarget as HTMLElement).style.background = "rgba(124,58,237,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.5)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              Latest Recap
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
