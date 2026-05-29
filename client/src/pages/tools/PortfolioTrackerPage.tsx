import { useState, useMemo, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { ChevronRight, Home, Plus, X, ExternalLink, Copy, TrendingUp, Share2, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

function fmtXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}K ꜩ`;
  return `${v.toFixed(4)} ꜩ`;
}
function fmtUsd(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(2)}K`;
  return `$${v.toFixed(2)}`;
}
function fmtToken(balance: string, decimals: number) {
  const n = parseFloat(balance) / Math.pow(10, decimals);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toFixed(decimals > 0 ? 2 : 0);
}

const WALLET_COLORS = ["#2c7df7", "#22c55e", "#f97316", "#8b5cf6", "#f59e0b"];

export default function PortfolioTrackerPage() {
  const search = useSearch();

  // Parse URL params on load (e.g. ?w1=tz1...&w2=tz1...)
  const initialInputs = useMemo(() => {
    const params = new URLSearchParams(search);
    const fromUrl: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const v = params.get(`w${i}`);
      if (v) fromUrl.push(v);
    }
    return fromUrl.length > 0 ? fromUrl : ["", ""];
  }, []);

  const [inputs, setInputs] = useState<string[]>(initialInputs);
  const [addresses, setAddresses] = useState<string[]>(() => {
    const valid = initialInputs.filter(Boolean);
    return valid.length > 0 ? valid : [];
  });

  const { data, isLoading } = trpc.tools.portfolioTrack.useQuery(
    { addresses: addresses.filter(Boolean) },
    { enabled: addresses.filter(Boolean).length > 0, staleTime: 60_000 }
  );

  const handleTrack = () => {
    const valid = inputs.map(i => i.trim()).filter(Boolean);
    if (!valid.length) return;
    setAddresses(valid);
  };

  const addInput = () => {
    if (inputs.length < 5) setInputs(prev => [...prev, ""]);
  };

  const removeInput = (i: number) => {
    setInputs(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateInput = (i: number, val: string) => {
    setInputs(prev => prev.map((v, idx) => idx === i ? val : v));
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const sharePortfolio = () => {
    const valid = addresses.filter(Boolean);
    if (!valid.length) return;
    const params = new URLSearchParams();
    valid.forEach((addr, i) => params.set(`w${i + 1}`, addr));
    const url = `${window.location.origin}/tools/portfolio?${params.toString()}`;
    navigator.clipboard.writeText(url);
    toast.success("Portfolio link copied to clipboard!");
  };

  const exportCSV = () => {
    if (!wallets.length) return;
    const header = "Address,Alias,XTZ Balance,Staked XTZ,USD Value,Tokens,NFTs,Delegated To";
    const rows = wallets.map((w: any) =>
      `"${w.address}","${w.alias || ""}","${w.balance.toFixed(6)}","${w.stakedBalance.toFixed(6)}","${xtzUsd > 0 ? ((w.balance + w.stakedBalance) * xtzUsd).toFixed(2) : ""}","${w.fungibleTokens.length}","${w.nftCount}","${w.delegatedTo || ""}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `xtz_portfolio_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  };

  const removeTrackedWallet = (addr: string) => {
    const newAddresses = addresses.filter(a => a !== addr);
    const newInputs = inputs.filter(i => i.trim() !== addr);
    setAddresses(newAddresses);
    setInputs(newInputs.length > 0 ? newInputs : [""]);
  };

  const wallets = (data?.wallets || []) as any[];
  const totals = data?.totals;
  const xtzUsd = data?.xtzUsd ?? 0;
  const aggregatedTokens = data?.aggregatedTokens || [];

  // Pie chart data for XTZ distribution
  const totalXtz = wallets.reduce((s, w) => s + w.balance + w.stakedBalance, 0);
  const pieSlices = wallets.map((w, i) => ({
    label: w.alias || w.address.slice(0, 10) + "…",
    value: w.balance + w.stakedBalance,
    pct: totalXtz > 0 ? ((w.balance + w.stakedBalance) / totalXtz) * 100 : 0,
    color: WALLET_COLORS[i % WALLET_COLORS.length],
  }));

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2rem 0" }}>
        <div className="container">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1rem", fontSize: "0.75rem", fontWeight: 600 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", textDecoration: "none" }}><Home size={12} /></Link>
            <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
            <Link href="/tools" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Tools</Link>
            <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Portfolio Tracker</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📊</div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Portfolio Tracker</h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>Track up to 5 Tezos wallets — combined XTZ, tokens, NFTs, and USD value</p>
            </div>
          </div>

          {/* Address inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: "700px" }}>
            {inputs.map((val, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: WALLET_COLORS[i % WALLET_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                  {i + 1}
                </div>
                <input
                  value={val}
                  onChange={(e) => updateInput(i, e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  placeholder={`Wallet ${i + 1} address (tz1…)`}
                  style={{ flex: 1, padding: "0.6rem 0.875rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "6px", color: "#fff", fontSize: "0.85rem", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,125,247,0.25)")}
                />
                {inputs.length > 1 && (
                  <button onClick={() => removeInput(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex", padding: "4px" }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
              {inputs.length < 5 && (
                <button onClick={addInput} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.45rem 0.875rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>
                  <Plus size={12} /> Add Wallet
                </button>
              )}
              <button onClick={handleTrack} style={{ padding: "0.45rem 1.5rem", background: "#8b5cf6", border: "none", borderRadius: "6px", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", fontFamily: "inherit" }}>
                Track Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {/* Loading */}
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[300, 200, 150].map((w, i) => <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "8px" }} />)}
          </div>
        )}

        {/* Results */}
        {!isLoading && wallets.length > 0 && totals && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Share + actions bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                Tracking <strong style={{ color: "#fff" }}>{wallets.length}</strong> wallet{wallets.length !== 1 ? "s" : ""}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={sharePortfolio}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 1rem", background: "rgba(44,125,247,0.1)", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "6px", color: "#2c7df7", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.2)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.1)")}>
                  <Share2 size={13} /> Share Portfolio Link
                </button>
                <button onClick={exportCSV}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 1rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "6px", color: "#22c55e", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer" }}>
                  <Download size={13} /> Export CSV
                </button>
              </div>
            </div>

            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
              {[
                { label: "Total XTZ", value: fmtXtz(totals.xtz), sub: xtzUsd > 0 ? fmtUsd(totals.xtz * xtzUsd) : null, color: "#2c7df7", icon: "💎" },
                { label: "Staked XTZ", value: fmtXtz(totals.staked), sub: xtzUsd > 0 ? fmtUsd(totals.staked * xtzUsd) : null, color: "#f97316", icon: "🔒" },
                { label: "Total USD Value", value: xtzUsd > 0 ? fmtUsd(totals.usd) : "—", sub: xtzUsd > 0 ? `@ $${xtzUsd.toFixed(3)}/XTZ` : null, color: "#22c55e", icon: "💵" },
                { label: "Total NFTs", value: totals.nfts.toLocaleString(), sub: null, color: "#8b5cf6", icon: "🖼️" },
                { label: "Wallets Tracked", value: wallets.length.toString(), sub: null, color: "rgba(255,255,255,0.6)", icon: "👛" },
              ].map(s => (
                <div key={s.label} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1.1rem 1.25rem" }}>
                  <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>{s.icon} {s.label}</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 900, color: s.color }}>{s.value}</div>
                  {s.sub && <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "0.2rem" }}>{s.sub}</div>}
                </div>
              ))}
            </div>

            {/* XTZ distribution chart + per-wallet breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem" }}>
              {/* Pie chart (CSS-based) */}
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "1.25rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>XTZ Distribution</div>
                {/* Simple bar chart */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {pieSlices.map((slice, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: slice.color }}>{slice.label}</span>
                        <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>{slice.pct.toFixed(1)}%</span>
                      </div>
                      <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${slice.pct}%`, background: slice.color, borderRadius: "4px", transition: "width 0.5s ease" }} />
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "0.15rem" }}>{fmtXtz(slice.value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Per-wallet table */}
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>Wallet Breakdown</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Wallet", "XTZ Balance", "Staked", "USD Value", "Tokens", "NFTs", "Delegation"].map(h => (
                          <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {wallets.map((w: any, i: number) => (
                        <tr key={w.address} style={{ borderBottom: i < wallets.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: WALLET_COLORS[i % WALLET_COLORS.length], flexShrink: 0 }} />
                              <div>
                                {w.alias && <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff" }}>{w.alias}</div>}
                                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                  <code style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>{w.address.slice(0, 10)}…</code>
                                  <button onClick={() => copy(w.address)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", display: "flex", padding: "1px" }}><Copy size={10} /></button>
                                  <button onClick={() => removeTrackedWallet(w.address)}
                                    title="Remove this wallet"
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(239,68,68,0.4)", display: "flex", padding: "1px", transition: "color 0.15s" }}
                                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#ef4444")}
                                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.4)")}>
                                    <X size={10} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: WALLET_COLORS[i % WALLET_COLORS.length] }}>{fmtXtz(w.balance)}</td>
                          <td style={{ padding: "0.75rem 1rem", color: w.stakedBalance > 0 ? "#f97316" : "rgba(255,255,255,0.2)" }}>{w.stakedBalance > 0 ? fmtXtz(w.stakedBalance) : "—"}</td>
                          <td style={{ padding: "0.75rem 1rem", color: "#22c55e", fontWeight: 600 }}>{xtzUsd > 0 ? fmtUsd((w.balance + w.stakedBalance) * xtzUsd) : "—"}</td>
                          <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.6)" }}>{w.fungibleTokens.length}</td>
                          <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.6)" }}>
                            {w.nftCount > 0 ? (
                              <Link href={`/tools/nft-gallery?address=${w.address}`} style={{ color: "#8b5cf6", textDecoration: "none", fontWeight: 700 }}>{w.nftCount} →</Link>
                            ) : "0"}
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            {w.delegatedTo ? (
                              <span style={{ fontSize: "0.72rem", color: "#22c55e", fontWeight: 600 }}>✓ {w.delegatedTo.slice(0, 14)}{w.delegatedTo.length > 14 ? "…" : ""}</span>
                            ) : (
                              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)" }}>Not delegating</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Aggregated tokens */}
            {aggregatedTokens.length > 0 && (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>🪙 Combined Token Holdings</span>
                  <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginLeft: "0.5rem" }}>across all wallets</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0", padding: "0" }}>
                  {(aggregatedTokens as any[]).map((tok: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.04)", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                      {tok.thumbnailUri ? (
                        <img src={tok.thumbnailUri} alt="" style={{ width: "28px", height: "28px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", flexShrink: 0 }}>🪙</div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tok.name}</div>
                        {tok.symbol && <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)" }}>{tok.symbol}</div>}
                        {tok.wallets.length > 1 && <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.25)" }}>{tok.wallets.length} wallets</div>}
                      </div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#f97316", flexShrink: 0 }}>
                        {tok.totalBalance >= 1_000_000 ? `${(tok.totalBalance / 1_000_000).toFixed(2)}M` : tok.totalBalance >= 1_000 ? `${(tok.totalBalance / 1_000).toFixed(2)}K` : tok.totalBalance.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick links per wallet */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {wallets.map((w: any, i: number) => (
                <div key={w.address} style={{ display: "flex", gap: "0.4rem" }}>
                  <Link href={`/tools/wallet?address=${w.address}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.4rem 0.875rem", background: `${WALLET_COLORS[i % WALLET_COLORS.length]}22`, border: `1px solid ${WALLET_COLORS[i % WALLET_COLORS.length]}44`, borderRadius: "6px", color: WALLET_COLORS[i % WALLET_COLORS.length], textDecoration: "none", fontSize: "0.72rem", fontWeight: 700 }}>
                    🔍 Inspect W{i + 1}
                  </Link>
                  {w.nftCount > 0 && (
                    <Link href={`/tools/nft-gallery?address=${w.address}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.4rem 0.875rem", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "6px", color: "#8b5cf6", textDecoration: "none", fontSize: "0.72rem", fontWeight: 700 }}>
                      🖼️ NFTs
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!addresses.filter(Boolean).length && !isLoading && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
            <p style={{ fontSize: "0.9rem" }}>Enter up to 5 Tezos addresses above to track your combined portfolio</p>
          </div>
        )}
      </div>
    </div>
  );
}
