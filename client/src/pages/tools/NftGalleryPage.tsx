import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Search, ChevronRight, Home, ExternalLink, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ToolBreadcrumb from "@/components/ToolBreadcrumb";
import { useSEO, buildToolSchema, buildFAQSchema } from "@/hooks/useSEO";

const PAGE_SIZE = 48;

const EXAMPLE_ADDRESSES = [
  { label: "objkt.com", address: "tz1UBZUkXpKGhYsP5KtzDNqyPKP6Uq7x2ioN" },
  { label: "fxhash collector", address: "tz1WnfXMgaNpkMWCW2UgrExNaXiQpsWy6Cpe" },
];

function resolveDisplay(nft: any): string | null {
  return nft.displayUri || nft.thumbnailUri || nft.artifactUri || null;
}

function isImage(mimeType: string | null | undefined, uri: string | null | undefined) {
  if (!uri) return false;
  if (mimeType && (mimeType.startsWith("image/") || mimeType === "image")) return true;
  if (uri.startsWith("data:image")) return true;
  const lower = uri.toLowerCase();
  return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".gif") || lower.endsWith(".webp") || lower.endsWith(".svg");
}

export default function NftGalleryPage() {
  useSEO({
    title: "Tezos NFT Gallery — View Any Wallet's NFTs | XTZ.News",
    description: "View all Tezos NFTs held by any wallet address. Beautiful visual gallery with links to objkt.com. Free, no login required.",
    keywords: "Tezos NFT gallery, XTZ NFT viewer, Tezos NFT collection, objkt NFT, Tezos FA2 tokens",
    canonical: "https://xtz.news/tools/nft-gallery",
    jsonLd: [
      buildToolSchema({ name: "Tezos NFT Gallery", description: "View all Tezos NFTs held by any wallet address. Beautiful visual gallery with links to objkt.com. Free, no login required.", url: "https://xtz.news/tools/nft-gallery" }),
      buildFAQSchema([
        { question: "How do I view Tezos NFTs in a wallet?", answer: "Enter any Tezos wallet address (tz1, tz2, tz3) in the XTZ.News NFT Gallery. It automatically fetches and displays all FA2 NFTs held by that address in a visual grid, with links to each NFT on objkt.com. No wallet connection or login required." },
        { question: "What NFT marketplaces are on Tezos?", answer: "The main Tezos NFT marketplaces are objkt.com (the largest, covering all FA2 NFTs), Teia (community-run, formerly Hic et Nunc), fxhash (generative art platform), and Versum (curated digital art). All Tezos NFTs use the FA2 token standard and can be viewed in the XTZ.News NFT Gallery." },
        { question: "What is an FA2 NFT on Tezos?", answer: "FA2 is the Tezos token standard (TZIP-12) that supports both fungible and non-fungible tokens. Most Tezos NFTs are FA2 tokens stored on smart contracts. Unlike Ethereum ERC-721, FA2 supports multiple token types in a single contract, making it more gas-efficient." },
        { question: "How do I buy Tezos NFTs?", answer: "To buy Tezos NFTs, you need a Tezos wallet (Temple Wallet or Kukai), some XTZ for the purchase and gas fees, and an account on objkt.com or another Tezos marketplace. Gas fees on Tezos are typically under $0.01, making NFT trading very affordable compared to Ethereum." },
        { question: "What is objkt.com?", answer: "objkt.com is the largest Tezos NFT marketplace, supporting all FA2 token contracts. It offers buying, selling, and collecting Tezos NFTs with very low fees. The XTZ.News NFT Gallery links directly to each NFT on objkt.com for easy purchasing." },
      ]),
    ],
  });

  const search = useSearch();
  const params = new URLSearchParams(search);
  const urlAddress = params.get("address") || "";

  const [input, setInput] = useState(urlAddress);
  const [address, setAddress] = useState(urlAddress);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading } = trpc.tools.nftGallery.useQuery(
    { address, limit: PAGE_SIZE, offset: page * PAGE_SIZE },
    { enabled: !!address, staleTime: 60_000 }
  );

  const nfts = data?.nfts || [];
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleSearch = (addr?: string) => {
    const a = (addr || input).trim();
    if (!a) return;
    setAddress(a);
    setPage(0);
    if (!addr) setInput(a);
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Lightbox */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          onClick={() => setSelected(null)}>
          <div style={{ maxWidth: "600px", width: "100%", background: "#05152e", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(44,125,247,0.2)" }}
            onClick={(e) => e.stopPropagation()}>
            {/* Image */}
            <div style={{ background: "#000", maxHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {isImage(selected.mimeType, resolveDisplay(selected)) ? (
                <img src={resolveDisplay(selected)!} alt={selected.name} style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }} />
              ) : (
                <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎨</div>
                  <div style={{ fontSize: "0.8rem" }}>{selected.mimeType || "Media"}</div>
                </div>
              )}
            </div>
            {/* Info */}
            <div style={{ padding: "1.25rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff", margin: "0 0 0.4rem" }}>{selected.name}</h2>
              {selected.contractAlias && <div style={{ fontSize: "0.72rem", color: "#2c7df7", fontWeight: 700, marginBottom: "0.5rem" }}>{selected.contractAlias}</div>}
              {selected.description && <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: "0 0 1rem", lineHeight: 1.5, maxHeight: "80px", overflow: "hidden" }}>{selected.description}</p>}
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {selected.objktUrl && (
                  <a href={selected.objktUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 1rem", background: "rgba(44,125,247,0.15)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "6px", color: "#2c7df7", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700 }}>
                    <ExternalLink size={12} /> View on objkt.com
                  </a>
                )}
                <button onClick={() => setSelected(null)} style={{ padding: "0.5rem 1rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2rem 0" }}>
        <div className="container">
          <ToolBreadcrumb items={[{ label: "Tools", href: "/tools" }, { label: "NFT Gallery" }]} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🖼️</div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>NFT Gallery</h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>View all Tezos NFTs held by any address — click to inspect, link to objkt.com</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 400px" }}>
              <Search size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter Tezos address…"
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "8px", color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,125,247,0.3)")} />
            </div>
            <button onClick={() => handleSearch()} style={{ padding: "0.75rem 1.5rem", background: "#8b5cf6", border: "none", borderRadius: "8px", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
              View Gallery
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>Try:</span>
            {EXAMPLE_ADDRESSES.map(ex => (
              <button key={ex.address} onClick={() => { setInput(ex.address); handleSearch(ex.address); }}
                style={{ padding: "0.2rem 0.7rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer" }}>
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {/* Loading */}
        {isLoading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: "1", borderRadius: "8px" }} />
            ))}
          </div>
        )}

        {/* No NFTs */}
        {!isLoading && address && nfts.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", background: "#05152e", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🖼️</div>
            <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.5rem" }}>No NFTs Found</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>This address doesn't hold any Tezos NFTs, or they may not have on-chain metadata.</p>
          </div>
        )}

        {/* Gallery */}
        {!isLoading && nfts.length > 0 && (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>
                Showing <strong style={{ color: "#fff" }}>{nfts.length}</strong> NFTs for <code style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "3px" }}>{address.slice(0, 16)}…</code>
              </div>
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                    style={{ padding: "0.3rem 0.6rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: page === 0 ? "rgba(255,255,255,0.2)" : "#fff", cursor: page === 0 ? "default" : "pointer", display: "flex" }}>
                    <ChevronLeft size={14} />
                  </button>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Page {page + 1} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                    style={{ padding: "0.3rem 0.6rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: page >= totalPages - 1 ? "rgba(255,255,255,0.2)" : "#fff", cursor: page >= totalPages - 1 ? "default" : "pointer", display: "flex" }}>
                    <ChevronRightIcon size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.875rem" }}>
              {nfts.map((nft: any, i: number) => {
                const imgUri = resolveDisplay(nft);
                const showImg = imgUri && isImage(nft.mimeType, imgUri);
                return (
                  <div key={i} onClick={() => setSelected(nft)} style={{ background: "#05152e", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", transition: "transform 0.15s, border-color 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}>
                    {/* Image */}
                    <div style={{ aspectRatio: "1", background: "#0d2a5e", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {showImg ? (
                        <img src={imgUri!} alt={nft.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div style={{ fontSize: "2rem", color: "rgba(255,255,255,0.2)" }}>🎨</div>
                      )}
                    </div>
                    {/* Name */}
                    <div style={{ padding: "0.5rem 0.6rem" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nft.name}</div>
                      {nft.contractAlias && <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nft.contractAlias}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Empty state */}
        {!address && !isLoading && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🖼️</div>
            <p style={{ fontSize: "0.9rem" }}>Enter a Tezos address above to view their NFT collection</p>
          </div>
        )}
      </div>
    </div>
  );
}
