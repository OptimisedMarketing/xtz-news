import React, { useMemo, useState } from "react";
import { BadgeCheck, ExternalLink, Search } from "lucide-react";
import {
  getKentoArtistDisplayName,
  KENTO_SEASON_ONE_ARTISTS,
  KENTO_SEASON_ONE_VERIFIED_OBJKT_COUNT,
  type KentoSeasonOneArtist,
} from "@/lib/kentoSeasonOneArtists";
import { getKentoArtistThumbnail } from "@/lib/kentoSeasonOneArtistThumbnails";
import { getMediaUrl } from "@/lib/mediaUrl";

type ArtistFilter = "all" | "verified" | "kento";

const filters: Array<{ id: ArtistFilter; label: string; count: number }> = [
  { id: "all", label: "All artists", count: KENTO_SEASON_ONE_ARTISTS.length },
  { id: "verified", label: "Verified Objkt", count: KENTO_SEASON_ONE_VERIFIED_OBJKT_COUNT },
  { id: "kento", label: "Kento profile", count: KENTO_SEASON_ONE_ARTISTS.length - KENTO_SEASON_ONE_VERIFIED_OBJKT_COUNT },
];

function matchesFilter(artist: KentoSeasonOneArtist, filter: ArtistFilter) {
  if (filter === "verified") return Boolean(artist.objktProfileUrl);
  if (filter === "kento") return !artist.objktProfileUrl;
  return true;
}

export default function KentoArtistDirectory() {
  const [filter, setFilter] = useState<ArtistFilter>("all");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const artists = useMemo(
    () => KENTO_SEASON_ONE_ARTISTS.filter((artist) => {
      const matchesQuery = !normalizedQuery || getKentoArtistDisplayName(artist.name).toLocaleLowerCase().includes(normalizedQuery);
      return matchesQuery && matchesFilter(artist, filter);
    }),
    [filter, normalizedQuery],
  );

  return (
    <section
      aria-labelledby="kento-artist-directory-title"
      style={{ margin: "1.2rem 0 2rem", border: "1px solid rgba(153,246,228,0.22)", borderRadius: "10px", background: "linear-gradient(145deg, rgba(7,26,53,0.92), rgba(5,21,46,0.72))", overflow: "hidden" }}
    >
      <div style={{ padding: "1.1rem 1.15rem", borderBottom: "1px solid rgba(153,246,228,0.15)" }}>
        <p style={{ margin: "0 0 0.35rem", color: "#99f6e4", fontSize: "0.66rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em" }}>Creator directory</p>
        <h3 id="kento-artist-directory-title" style={{ margin: 0, color: "#fff", fontSize: "1.08rem", lineHeight: 1.3 }}>Find Season 01 artists</h3>
        <p style={{ margin: "0.5rem 0 0", color: "rgba(255,255,255,0.62)", fontSize: "0.82rem", lineHeight: 1.55 }}>
          Direct Objkt profiles are only shown where Kento’s public artist page linked to one when checked on 1 October 2026.
        </p>
      </div>

      <div style={{ padding: "1rem 1.15rem 1.15rem" }}>
        <label style={{ display: "block", position: "relative", marginBottom: "0.85rem" }}>
          <span className="sr-only">Search Kento Season 01 artists</span>
          <Search size={15} aria-hidden="true" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.42)" }} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search an artist"
            aria-label="Search Kento Season 01 artists"
            style={{ width: "100%", minHeight: "42px", padding: "0.65rem 0.8rem 0.65rem 2.45rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.16)", background: "rgba(0,0,0,0.22)", color: "#fff", fontSize: "0.85rem" }}
          />
        </label>

        <div role="group" aria-label="Filter Kento Season 01 artists" style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.9rem" }}>
          {filters.map((option) => {
            const selected = option.id === filter;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={selected}
                style={{ padding: "0.42rem 0.7rem", borderRadius: "999px", border: selected ? "1px solid #99f6e4" : "1px solid rgba(255,255,255,0.15)", background: selected ? "rgba(153,246,228,0.16)" : "rgba(255,255,255,0.05)", color: selected ? "#bffcf0" : "rgba(255,255,255,0.72)", fontSize: "0.73rem", fontWeight: 800, cursor: "pointer" }}
              >
                {option.label} <span aria-hidden="true">({option.count})</span>
              </button>
            );
          })}
        </div>

        <p role="status" aria-live="polite" style={{ margin: "0 0 0.7rem", color: "rgba(255,255,255,0.48)", fontSize: "0.72rem", fontWeight: 700 }}>
          Showing {artists.length} {artists.length === 1 ? "artist" : "artists"}
        </p>

        {artists.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.55rem" }}>
            {artists.map((artist) => {
              const verified = Boolean(artist.objktProfileUrl);
              const destination = artist.objktProfileUrl || artist.kentoUrl;
              const thumbnail = getKentoArtistThumbnail(artist.kentoUrl);
              return (
                <a
                  key={artist.kentoUrl}
                  href={destination}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${getKentoArtistDisplayName(artist.name)} — ${verified ? "verified Objkt profile" : "official Kento artist page"}`}
                  style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.55rem", minHeight: "70px", padding: "0.55rem", borderRadius: "7px", border: verified ? "1px solid rgba(153,246,228,0.23)" : "1px solid rgba(255,255,255,0.12)", background: verified ? "rgba(153,246,228,0.055)" : "rgba(255,255,255,0.035)", color: "#fff", textDecoration: "none" }}
                >
                  <span style={{ display: "flex", minWidth: 0, gap: "0.6rem" }}>
                    <span style={{ width: "50px", height: "50px", flexShrink: 0, overflow: "hidden", borderRadius: "5px", background: "rgba(255,255,255,0.08)" }}>
                      {thumbnail && <img src={getMediaUrl(thumbnail)} alt="" loading="lazy" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontWeight: 800, fontSize: "0.82rem", overflowWrap: "anywhere" }}>{getKentoArtistDisplayName(artist.name)}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.27rem", marginTop: "0.25rem", color: verified ? "#99f6e4" : "rgba(255,255,255,0.5)", fontSize: "0.67rem", fontWeight: 700 }}>
                        {verified && <BadgeCheck size={13} aria-hidden="true" />} {verified ? "Verified Objkt profile" : "Kento artist page"}
                      </span>
                    </span>
                  </span>
                  <ExternalLink size={14} aria-hidden="true" style={{ color: verified ? "#99f6e4" : "rgba(255,255,255,0.52)", flexShrink: 0, marginTop: "0.1rem" }} />
                </a>
              );
            })}
          </div>
        ) : (
          <p style={{ margin: 0, padding: "1rem", textAlign: "center", borderRadius: "7px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.62)", fontSize: "0.82rem" }}>No Season 01 artists match that search. Try a different name or filter.</p>
        )}
      </div>
    </section>
  );
}
