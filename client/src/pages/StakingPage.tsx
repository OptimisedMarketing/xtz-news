import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ExternalLink, Search, Copy, ChevronRight, Home, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const templeDelegate = (address: string) =>
  `https://templewallet.com/delegating?baker=${address}`;

export default function StakingPage() {
  const { data: bakers = [], isLoading } = trpc.explorer.bakers.useQuery({ limit: 50 });

  const [xtzAmount, setXtzAmount] = useState("1000");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [searchBaker, setSearchBaker] = useState("");
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const amount = parseFloat(xtzAmount) || 0;

  // All bakers with real APY, sorted by APY desc
  const allBakers = useMemo(() =>
    bakers.filter((b: any) => b.apy != null).sort((a: any, b: any) => (b.apy ?? 0) - (a.apy ?? 0)),
    [bakers]
  );

  const selectedBaker = selectedAddress ? allBakers.find((b: any) => b.address === selectedAddress) : null;
  const displayBaker = selectedBaker || allBakers[0];

  const filteredBakers = useMemo(() =>
    searchBaker.trim()
      ? allBakers.filter((b: any) =>
          (b.alias || "").toLowerCase().includes(searchBaker.toLowerCase()) ||
          b.address.toLowerCase().includes(searchBaker.toLowerCase()))
      : allBakers,
    [allBakers, searchBaker]
  );

  const chartBakers = useMemo(() => {
    if (selectedBaker) return [selectedBaker, ...allBakers.filter((b: any) => b.address !== selectedAddress).slice(0, 2)];
    return allBakers.slice(0, 3);
  }, [selectedBaker, allBakers, selectedAddress]);

  const copyResults = () => {
    if (!displayBaker || amount === 0) return;
    const apy = displayBaker.apy as number;
    const annual = (amount * (Math.pow(1 + apy / 100 / 12, 12) - 1)).toFixed(2);
    const monthly = (amount * (Math.pow(1 + apy / 100 / 12, 1) - 1)).toFixed(2);
    const daily = (amount * apy / 100 / 365).toFixed(2);
    const text = `XTZ Staking Projections (${displayBaker.alias || displayBaker.address.slice(0, 12)})\n` +
      `Amount: ${amount.toLocaleString()} XTZ | APY: ${apy.toFixed(2)}%\n` +
      `Daily: +${daily} XTZ | Monthly: +${monthly} XTZ | Annual: +${annual} XTZ\n` +
      `Source: https://xtz.news/staking`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2.5rem 0 2rem" }}>
        <div className="container">
          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.25rem", fontSize: "0.75rem", fontWeight: 600 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", textDecoration: "none" }}><Home size={12} /></Link>
            <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Staking Calculator</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div style={{ width: "42px", height: "42px", background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>🧭</div>
                <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>XTZ Staking Calculator</h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", margin: 0 }}>
                Calculate your projected earnings from delegating or staking Tezos. Real APY from on-chain data.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/explorer/bakers" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.1rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.8rem", fontWeight: 700 }}>
                Baker Leaderboard →
              </Link>
              <a href="https://templewallet.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.1rem", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.35)", borderRadius: "6px", color: "#f97316", textDecoration: "none", fontSize: "0.8rem", fontWeight: 700 }}>
                <ExternalLink size={13} /> Get Temple Wallet
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2.5rem 1.25rem 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: "2.5rem", alignItems: "start" }}>

          {/* ── Main calculator ── */}
          <div>
            {/* Amount input */}
            <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Your XTZ Amount</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input type="number" min="0" value={xtzAmount} onChange={(e) => setXtzAmount(e.target.value)}
                    style={{ padding: "0.75rem 3rem 0.75rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "8px", color: "#fff", fontSize: "1.3rem", fontWeight: 900, outline: "none", width: "180px", fontFamily: "inherit", transition: "border-color 0.15s" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,125,247,0.3)")} />
                  <span style={{ position: "absolute", right: "0.875rem", color: "rgba(255,255,255,0.4)", fontSize: "1rem", fontWeight: 700, pointerEvents: "none" }}>ꜩ</span>
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {[100, 500, 1000, 5000, 10000, 50000].map(v => (
                    <button key={v} onClick={() => setXtzAmount(String(v))}
                      style={{ padding: "0.45rem 0.875rem", background: parseFloat(xtzAmount) === v ? "rgba(44,125,247,0.25)" : "rgba(255,255,255,0.05)", border: `1px solid ${parseFloat(xtzAmount) === v ? "rgba(44,125,247,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: "6px", color: parseFloat(xtzAmount) === v ? "#2c7df7" : "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
                      {v.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Baker selector */}
            <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Choose Your Baker</div>

              {/* Quick select pills */}
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.875rem" }}>
                {[
                  { label: "⭐ Best APY", baker: allBakers[0] },
                  { label: "👥 Most Delegators", baker: [...allBakers].sort((a: any, b: any) => b.numDelegators - a.numDelegators)[0] },
                  { label: "🟢 Most Space", baker: [...allBakers].filter((b: any) => b.availableSpace != null).sort((a: any, b: any) => (b.availableSpace ?? 0) - (a.availableSpace ?? 0))[0] },
                ].filter(q => q.baker).map(q => (
                  <button key={q.label} onClick={() => { setSelectedAddress(q.baker.address); setSearchBaker(""); setShowDropdown(false); }}
                    style={{ padding: "0.4rem 0.875rem", background: selectedAddress === q.baker.address ? "rgba(44,125,247,0.25)" : "rgba(255,255,255,0.05)", border: `1px solid ${selectedAddress === q.baker.address ? "rgba(44,125,247,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: "20px", color: selectedAddress === q.baker.address ? "#2c7df7" : "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                <input value={searchBaker} onChange={(e) => { setSearchBaker(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search baker by name or address…"
                  style={{ width: "100%", padding: "0.6rem 0.875rem 0.6rem 2.25rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "#fff", fontSize: "0.85rem", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" }}
                  onBlur={(e) => { setTimeout(() => setShowDropdown(false), 200); }}
                  onKeyDown={(e) => { if (e.key === "Escape") setShowDropdown(false); }} />
                {searchBaker && <button onClick={() => { setSearchBaker(""); setShowDropdown(false); }} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}><X size={14} /></button>}
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div style={{ marginTop: "0.4rem", maxHeight: "240px", overflowY: "auto", background: "rgba(5,21,46,0.98)", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                  {filteredBakers.slice(0, 40).map((baker: any, i: number) => {
                    const isSelected = selectedAddress === baker.address;
                    const apy = baker.apy as number;
                    const annual = amount > 0 ? (amount * (Math.pow(1 + apy / 100 / 12, 12) - 1)).toFixed(2) : null;
                    return (
                      <button key={baker.address} onMouseDown={() => { setSelectedAddress(baker.address); setSearchBaker(""); setShowDropdown(false); }}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.7rem 1rem", background: isSelected ? "rgba(44,125,247,0.15)" : "transparent", border: "none", borderBottom: i < filteredBakers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor: "pointer", textAlign: "left" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: isSelected ? "#5a9fff" : "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {i === 0 && !searchBaker && <span style={{ marginRight: "0.3rem" }}>⭐</span>}{baker.alias || "Unknown Baker"}
                          </div>
                          <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{baker.address.slice(0, 20)}…</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#22c55e" }}>{apy.toFixed(2)}%</div>
                          {annual && amount > 0 && <div style={{ fontSize: "0.65rem", color: "#f97316", fontWeight: 600 }}>+{annual} ꜩ/yr</div>}
                        </div>
                      </button>
                    );
                  })}
                  {filteredBakers.length === 0 && <div style={{ padding: "1.25rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>No bakers found</div>}
                </div>
              )}
            </div>

            {/* Results card */}
            {displayBaker && amount > 0 && (() => {
              const apy = displayBaker.apy as number;
              const annual = amount * (Math.pow(1 + apy / 100 / 12, 12) - 1);
              const monthly = amount * (Math.pow(1 + apy / 100 / 12, 1) - 1);
              const daily = amount * apy / 100 / 365;
              return (
                <div style={{ background: "linear-gradient(135deg, rgba(44,125,247,0.12) 0%, rgba(44,125,247,0.04) 100%)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff", marginBottom: "0.2rem" }}>{displayBaker.alias || "Unknown Baker"}</div>
                      <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{displayBaker.address.slice(0, 24)}…</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={copyResults}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 1rem", background: copied ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)", border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.15)"}`, borderRadius: "6px", color: copied ? "#22c55e" : "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", transition: "all 0.2s" }}>
                        <Copy size={13} /> {copied ? "Copied!" : "Copy Results"}
                      </button>
                      <a href={templeDelegate(displayBaker.address)} target="_blank" rel="nofollow noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 1rem", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.35)", borderRadius: "6px", color: "#f97316", fontWeight: 700, fontSize: "0.78rem", textDecoration: "none" }}>
                        <ExternalLink size={13} /> Delegate Now
                      </a>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                    {[
                      { label: "APY", value: `${apy.toFixed(2)}%`, color: "#22c55e", big: true },
                      { label: "Daily", value: `+${daily < 0.01 ? "<0.01" : daily.toFixed(3)} ꜩ`, color: "#f97316", big: false },
                      { label: "Monthly", value: `+${monthly.toFixed(2)} ꜩ`, color: "#f97316", big: false },
                      { label: "Annual (compound)", value: `+${annual.toFixed(2)} ꜩ`, color: "#f97316", big: false },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "0.875rem 0.5rem" }}>
                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>{s.label}</div>
                        <div style={{ fontSize: s.big ? "1.4rem" : "0.95rem", fontWeight: 900, color: s.color }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Baker meta */}
                  <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", paddingTop: "0.875rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>👥 {displayBaker.numDelegators.toLocaleString()} delegators</span>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>💰 {displayBaker.stakingBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} ꜩ staking balance</span>
                    {displayBaker.availableSpace != null ? (
                      <span style={{ fontSize: "0.72rem", color: displayBaker.availableSpace > 1_000_000 ? "#22c55e" : "#f59e0b" }}>
                        🟢 {displayBaker.availableSpace > 1_000_000 ? `${(displayBaker.availableSpace / 1e6).toFixed(1)}M` : `${(displayBaker.availableSpace / 1e3).toFixed(0)}K`} ꜩ space available
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>Delegation only</span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* 12-month chart */}
            {chartBakers.length > 0 && amount > 0 && (
              <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>📈 12-Month Cumulative Returns</div>
                  <button onClick={() => {
                    const topBaker = chartBakers[0];
                    const annual = (amount * (Math.pow(1 + (topBaker.apy as number) / 100 / 12, 12) - 1)).toFixed(2);
                    const text = `📈 Staking ${amount.toLocaleString()} XTZ with ${topBaker.alias || 'top baker'} (${(topBaker.apy as number).toFixed(2)}% APY) = +${annual} XTZ in 12 months! Check the XTZ.News Staking Calculator:`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent("https://xtz.news/staking")}`, "_blank");
                  }} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.85rem", background: "rgba(29,161,242,0.15)", border: "1px solid rgba(29,161,242,0.35)", borderRadius: "20px", color: "#1DA1F2", fontWeight: 700, fontSize: "0.7rem", cursor: "pointer" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Share on X
                  </button>
                </div>
                {/* Legend */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  {chartBakers.slice(0, 3).map((baker: any, idx: number) => (
                    <div key={baker.address} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: ["#2c7df7", "#22c55e", "#f59e0b"][idx] }} />
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)" }}>{baker.alias || "Unknown"} ({(baker.apy as number).toFixed(1)}%)</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "1rem 0.75rem 0.5rem" }}>
                  <svg width="100%" height="140" viewBox="0 0 600 140" preserveAspectRatio="none">
                    {chartBakers.slice(0, 3).map((baker: any, bakerIdx: number) => {
                      const apy = baker.apy as number;
                      const colors = ["#2c7df7", "#22c55e", "#f59e0b"];
                      const monthlyRate = apy / 100 / 12;
                      const months = Array.from({ length: 12 }, (_, m) => amount * (Math.pow(1 + monthlyRate, m + 1) - 1));
                      const maxVal = amount * (Math.pow(1 + (chartBakers[0].apy as number) / 100 / 12, 12) - 1);
                      const barW = 600 / 12 / 3 - 2;
                      const barOffset = bakerIdx * (barW + 1);
                      return months.map((val, m) => {
                        const x = m * (600 / 12) + barOffset + 4;
                        const barH = maxVal > 0 ? Math.max(3, (val / maxVal) * 110) : 3;
                        const y = 125 - barH;
                        return (
                          <rect key={`${bakerIdx}-${m}`} x={x} y={y} width={barW} height={barH} fill={colors[bakerIdx]} opacity={0.85} rx={1}>
                            <title>{baker.alias || "Baker"}: +{val.toFixed(2)} ꜩ after month {m + 1}</title>
                          </rect>
                        );
                      });
                    })}
                    {Array.from({ length: 12 }, (_, m) => (
                      <text key={m} x={m * (600 / 12) + 600 / 24} y={138} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)">M{m + 1}</text>
                    ))}
                  </svg>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)" }}>Month 1</span>
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", fontWeight: 700 }}>
                      After 12 months: +{(amount * (Math.pow(1 + (chartBakers[0].apy as number) / 100 / 12, 12) - 1)).toFixed(2)} ꜩ
                    </span>
                    <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)" }}>Month 12</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", margin: "0.75rem 0 0" }}>Estimates based on 30-day APY with monthly compounding. Actual rewards vary. Not financial advice.</p>
              </div>
            )}
          </div>

          {/* ── Sidebar: top bakers comparison ── */}
          <div style={{ position: "sticky", top: "80px" }}>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: "3px", height: "16px", background: "#2c7df7", borderRadius: "2px" }} />
                <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)" }}>Top Bakers by APY</span>
              </div>
              {isLoading ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>Loading…</div>
              ) : (
                allBakers.slice(0, 10).map((baker: any, i: number) => {
                  const isSelected = selectedAddress === baker.address;
                  const apy = baker.apy as number;
                  const annual = amount > 0 ? (amount * (Math.pow(1 + apy / 100 / 12, 12) - 1)).toFixed(2) : null;
                  return (
                    <button key={baker.address} onClick={() => setSelectedAddress(baker.address)}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", background: isSelected ? "rgba(44,125,247,0.12)" : "transparent", border: "none", borderBottom: i < 9 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor: "pointer", textAlign: "left", transition: "background 0.12s" }}
                      onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                      onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: isSelected ? "#2c7df7" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800, color: isSelected ? "#fff" : "rgba(255,255,255,0.4)", flexShrink: 0 }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: isSelected ? "#5a9fff" : "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{baker.alias || "Unknown Baker"}</div>
                        {annual && amount > 0 && <div style={{ fontSize: "0.62rem", color: "#f97316", fontWeight: 600 }}>+{annual} ꜩ/yr</div>}
                      </div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#22c55e", flexShrink: 0 }}>{apy.toFixed(2)}%</div>
                    </button>
                  );
                })
              )}
              <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Link href="/explorer/bakers" style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2c7df7", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  View full leaderboard →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
