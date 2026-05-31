import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Home, Search, ExternalLink, Copy } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ToolBreadcrumb from "@/components/ToolBreadcrumb";
import { useSEO, buildToolSchema } from "@/hooks/useSEO";
import { toast } from "sonner";

function fmtXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}K ꜩ`;
  return `${v.toFixed(4)} ꜩ`;
}
function daysUntil(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  const diff = Math.floor((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
}

const EXAMPLES = [
  { label: "coinbase.tez", q: "coinbase.tez" },
  { label: "tezos.tez", q: "tezos.tez" },
];

export default function TnsLookupPage() {
  useSEO({
    title: "Tezos Name Service Lookup — .tez Domain Resolver | XTZ.News",
    description: "Resolve .tez domains to Tezos addresses, or find all .tez names owned by an address. Shows expiry dates and all domains by the same owner.",
    keywords: "Tezos domains, .tez domain lookup, TNS resolver, Tezos name service, tz1 address lookup",
    canonical: "https://xtz.news/tools/tns",
    jsonLd: buildToolSchema({ name: "Tezos Name Service Lookup", description: "Resolve .tez domains to Tezos addresses, or find all .tez names owned by an address. Shows expiry dates and all domains by the same owner.", url: "https://xtz.news/tools/tns" }),
  });

  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const { data, isLoading } = trpc.tools.tnsLookup.useQuery(
    { query },
    { enabled: !!query, staleTime: 120_000 }
  );

  const handleSearch = (q?: string) => {
    const v = (q || input).trim();
    if (!v) return;
    setQuery(v);
    if (!q) setInput(v);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2rem 0" }}>
        <div className="container">
          <ToolBreadcrumb items={[{ label: "Tools", href: "/tools" }, { label: "TNS Lookup" }]} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(44,125,247,0.2)", border: "1px solid rgba(44,125,247,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🌐</div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Tezos Name Service Lookup</h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>Resolve .tez domains to addresses, or find all .tez names owned by an address</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 400px" }}>
              <Search size={14} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter a .tez domain or tz1/tz2/tz3 address…"
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "8px", color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,125,247,0.3)")} />
            </div>
            <button onClick={() => handleSearch()} style={{ padding: "0.75rem 1.5rem", background: "#2c7df7", border: "none", borderRadius: "8px", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
              Lookup
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem" }}>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>Try:</span>
            {EXAMPLES.map(ex => (
              <button key={ex.q} onClick={() => { setInput(ex.q); handleSearch(ex.q); }}
                style={{ padding: "0.2rem 0.7rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer" }}>
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="skeleton" style={{ height: "120px", borderRadius: "10px" }} />
            <div className="skeleton" style={{ height: "200px", borderRadius: "10px" }} />
          </div>
        )}

        {!isLoading && data && !data.found && (
          <div style={{ textAlign: "center", padding: "3rem", background: "#05152e", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🌐</div>
            <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.5rem" }}>Not Found</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
              <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px" }}>{data.query}</code> — no .tez domain or address found.
            </p>
          </div>
        )}

        {/* Domain result */}
        {!isLoading && data?.type === 'domain' && data.found && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#2c7df7", marginBottom: "0.5rem" }}>{(data as any).name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Resolves to:</span>
                    <code style={{ fontSize: "0.78rem", color: "#fff", fontFamily: "monospace" }}>{(data as any).address}</code>
                    <button onClick={() => copy((data as any).address)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}><Copy size={11} /></button>
                  </div>
                  {(data as any).accountBalance != null && (
                    <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>
                      Balance: <span style={{ color: "#fff", fontWeight: 700 }}>{fmtXtz((data as any).accountBalance)}</span>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  {(data as any).expiresAt && (() => {
                    const days = daysUntil((data as any).expiresAt);
                    const expired = days !== null && days < 0;
                    const expiringSoon = days !== null && days < 30 && days >= 0;
                    return (
                      <div>
                        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.2rem" }}>
                          {expired ? "Expired" : "Expires"}
                        </div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: expired ? "#ef4444" : expiringSoon ? "#f59e0b" : "#22c55e" }}>
                          {new Date((data as any).expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        {days !== null && !expired && (
                          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>{days} days left</div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
                <Link href={`/tools/wallet?address=${(data as any).address}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.875rem", background: "rgba(44,125,247,0.1)", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "6px", color: "#2c7df7", textDecoration: "none", fontSize: "0.75rem", fontWeight: 700 }}>
                  🔍 Inspect Wallet
                </Link>
                <Link href={`/explorer/address/${(data as any).address}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.875rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.75rem", fontWeight: 700 }}>
                  Explorer →
                </Link>
                <a href={`https://tezos.domains/name/${(data as any).name}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.875rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.75rem", fontWeight: 700 }}>
                  <ExternalLink size={11} /> tezos.domains
                </a>
              </div>
            </div>

            {/* Other domains owned by same owner */}
            {(data as any).ownedDomains?.length > 1 && (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>Other domains by same owner ({(data as any).ownedDomains.length})</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0" }}>
                  {(data as any).ownedDomains.map((d: any, i: number) => {
                    const days = daysUntil(d.expiresAtUtc);
                    return (
                      <div key={d.name} style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.04)", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                        <button onClick={() => { setInput(d.name); handleSearch(d.name); }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#2c7df7", fontWeight: 700, fontSize: "0.82rem", padding: 0, textAlign: "left" }}>
                          {d.name}
                        </button>
                        {days !== null && (
                          <div style={{ fontSize: "0.6rem", color: days < 30 ? "#f59e0b" : "rgba(255,255,255,0.25)", marginTop: "0.15rem" }}>
                            {days < 0 ? "Expired" : `${days}d left`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Address result */}
        {!isLoading && data?.type === 'address' && data.found && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <code style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{(data as any).address}</code>
                <button onClick={() => copy((data as any).address)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}><Copy size={11} /></button>
              </div>
              {(data as any).accountAlias && <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>{(data as any).accountAlias}</div>}
              {(data as any).accountBalance != null && (
                <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>
                  Balance: <span style={{ color: "#fff", fontWeight: 700 }}>{fmtXtz((data as any).accountBalance)}</span>
                </div>
              )}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
                <Link href={`/tools/wallet?address=${(data as any).address}`}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.875rem", background: "rgba(44,125,247,0.1)", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "6px", color: "#2c7df7", textDecoration: "none", fontSize: "0.75rem", fontWeight: 700 }}>
                  🔍 Inspect Wallet
                </Link>
              </div>
            </div>

            {(data as any).domains?.length > 0 ? (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>🌐 .tez Domains ({(data as any).domains.length})</span>
                </div>
                {(data as any).domains.map((d: any, i: number) => {
                  const days = daysUntil(d.expiresAtUtc);
                  return (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1.25rem", borderBottom: i < (data as any).domains.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", flexWrap: "wrap", gap: "0.5rem" }}>
                      <button onClick={() => { setInput(d.name); handleSearch(d.name); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#2c7df7", fontWeight: 800, fontSize: "1rem", padding: 0 }}>
                        {d.name}
                      </button>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        {days !== null && (
                          <span style={{ fontSize: "0.7rem", color: days < 0 ? "#ef4444" : days < 30 ? "#f59e0b" : "#22c55e", fontWeight: 600 }}>
                            {days < 0 ? "Expired" : `${days}d left`}
                          </span>
                        )}
                        <a href={`https://tezos.domains/name/${d.name}`} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.3)", display: "flex" }}>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem", background: "#05152e", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
                No .tez domains found for this address.
              </div>
            )}
          </div>
        )}

        {!query && !isLoading && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌐</div>
            <p style={{ fontSize: "0.9rem" }}>Enter a .tez domain or Tezos address above</p>
            <p style={{ fontSize: "0.78rem", marginTop: "0.5rem", color: "rgba(255,255,255,0.2)" }}>Powered by the Tezos Domains API</p>
          </div>
        )}
      </div>
    </div>
  );
}
