import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ExternalLink, Search, Copy, ChevronRight, Home, X, DollarSign, TrendingUp, ChevronDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO, buildToolSchema, buildFAQSchema } from "@/hooks/useSEO";

const templeDelegate = (address: string) =>
  `https://app.templewallet.com/delegating?baker=${address}`;

type SidebarSort = "apy" | "fee" | "delegators";

export default function StakingPage() {
  useSEO({
    title: "Tezos Staking Calculator — Find the Best Baker | XTZ.News",
    description: "Compare Tezos bakers by APY, fee, and available space. Calculate your staking rewards in XTZ and USD. Find the best baker for your XTZ.",
    keywords: "Tezos staking, XTZ staking calculator, Tezos baker, Tezos delegation, XTZ APY, Tezos rewards",
    canonical: "https://xtz.news/staking",
    jsonLd: [
      buildToolSchema({ name: "Tezos Staking Calculator", description: "Compare Tezos bakers by APY, fee, and available space. Calculate your staking rewards.", url: "https://xtz.news/staking" }),
      buildFAQSchema([
        { question: "What is Tezos staking?", answer: "Tezos staking (also called delegation) lets you earn rewards by delegating your XTZ to a baker. Bakers validate transactions and share a portion of their rewards with delegators. You keep full control of your XTZ — it never leaves your wallet." },
        { question: "What APY can I earn staking Tezos?", answer: "Tezos staking APY typically ranges from 5% to 10% annually, depending on the baker you choose. The XTZ.News Staking Calculator shows real-time APY for all active bakers based on their last completed cycle rewards." },
        { question: "How do I choose the best Tezos baker?", answer: "Look for a baker with high APY (above 8% is excellent), low fee rate (under 10%), high uptime (above 99%), and available staking space. The XTZ.News Best Baker recommendation automatically scores all bakers and highlights the top choice for small delegators." },
        { question: "Is Tezos staking safe?", answer: "Yes. When you delegate XTZ, your tokens never leave your wallet. You simply assign your baking rights to a baker. There is no lock-up period — you can undelegate at any time. The baker cannot access or spend your XTZ." },
        { question: "How long does it take to start earning Tezos staking rewards?", answer: "After delegating, it takes approximately 2-3 cycles (around 5-7 days) before you start receiving rewards. Each Tezos cycle is approximately 2.8 days long (14,400 blocks at 6 seconds per block)." },
        { question: "What is the minimum amount to stake Tezos?", answer: "There is no minimum amount to delegate XTZ. You can delegate any amount, even 1 XTZ. However, some bakers may have a minimum delegation requirement. The XTZ.News Staking Calculator works for any amount." },
      ]),
    ],
  });

  const { data: bakers = [], isLoading } = trpc.explorer.bakers.useQuery({ limit: 50 });
  const { data: networkStats } = trpc.explorer.networkStats.useQuery();

  const [xtzAmount, setXtzAmount] = useState("1000");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [searchBaker, setSearchBaker] = useState("");
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currency, setCurrency] = useState<"xtz" | "usd">("xtz");
  const [sidebarSort, setSidebarSort] = useState<SidebarSort>("apy");

  const xtzUsd = networkStats?.xtzUsd ?? 0;
  const amount = parseFloat(xtzAmount) || 0;

  const fmt = (xtz: number) => {
    if (currency === "usd" && xtzUsd > 0) {
      return `$${(xtz * xtzUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${xtz < 0.01 ? "<0.01" : xtz.toFixed(2)} ꜩ`;
  };

  // All bakers with real APY, sorted by APY desc
  const allBakers = useMemo(() =>
    bakers.filter((b: any) => b.apy != null).sort((a: any, b: any) => (b.apy ?? 0) - (a.apy ?? 0)),
    [bakers]
  );

  const sidebarBakers = useMemo(() => {
    const list = [...allBakers];
    if (sidebarSort === "fee") {
      return list.filter((b: any) => b.feeRate != null).sort((a: any, b: any) => (a.feeRate ?? 100) - (b.feeRate ?? 100));
    }
    if (sidebarSort === "delegators") {
      return list.sort((a: any, b: any) => b.numDelegators - a.numDelegators);
    }
    return list; // apy desc (default)
  }, [allBakers, sidebarSort]);

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
    const annual = (amount * (Math.pow(1 + apy / 100 / 12, 12) - 1));
    const monthly = (amount * (Math.pow(1 + apy / 100 / 12, 1) - 1));
    const daily = (amount * apy / 100 / 365);
    const text = `XTZ Staking Projections (${displayBaker.alias || displayBaker.address.slice(0, 12)})\n` +
      `Amount: ${amount.toLocaleString()} XTZ | APY: ${apy.toFixed(2)}%\n` +
      `Daily: +${daily.toFixed(3)} XTZ (${xtzUsd > 0 ? '$' + (daily * xtzUsd).toFixed(2) : 'n/a'}) | Monthly: +${monthly.toFixed(2)} XTZ | Annual: +${annual.toFixed(2)} XTZ\n` +
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
          {/* tezos.systems live widgets */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <iframe src="https://tezos.systems/widgets/staking-ratio.html?theme=abyss&accent=2c7df7" width="220" height="100" frameBorder={0} scrolling="no" title="Staking ratio" style={{ borderRadius: "8px", border: "none", display: "block" }} />
            <iframe src="https://tezos.systems/widgets/baker-count.html?theme=abyss&accent=2c7df7" width="220" height="100" frameBorder={0} scrolling="no" title="Active bakers" style={{ borderRadius: "8px", border: "none", display: "block" }} />
            <iframe src="https://tezos.systems/widgets/price.html?theme=abyss&accent=2c7df7" width="220" height="100" frameBorder={0} scrolling="no" title="XTZ price" style={{ borderRadius: "8px", border: "none", display: "block" }} />
          </div>
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
              {/* XTZ / USD toggle */}
              {xtzUsd > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Show earnings in:</span>
                  <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "2px" }}>
                    {(["xtz", "usd"] as const).map(c => (
                      <button key={c} onClick={() => setCurrency(c)}
                        style={{ padding: "0.25rem 0.875rem", background: currency === c ? "#2c7df7" : "transparent", border: "none", borderRadius: "18px", color: currency === c ? "#fff" : "rgba(255,255,255,0.45)", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
                        {c === "xtz" ? "ꜩ XTZ" : `$ USD (1 XTZ = $${xtzUsd.toFixed(3)})`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                  { label: "Daily", value: `+${fmt(daily)}`, color: "#f97316", big: false },
                  { label: "Monthly", value: `+${fmt(monthly)}`, color: "#f97316", big: false },
                  { label: "Annual (compound)", value: `+${fmt(annual)}`, color: "#f97316", big: false },
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

            {/* Staking vs Holding comparison chart */}
            {displayBaker && amount > 0 && (() => {
              const apy = displayBaker.apy as number;
              const years = 5;
              const months = years * 12;
              const monthlyRate = apy / 100 / 12;
              // Staking: compound monthly
              const stakingValues = Array.from({ length: months + 1 }, (_, m) =>
                amount * Math.pow(1 + monthlyRate, m)
              );
              // Holding: flat
              const holdingValues = Array.from({ length: months + 1 }, () => amount);
              const maxVal = stakingValues[months];
              const minVal = amount;
              const range = maxVal - minVal;
              const toY = (v: number) => range > 0 ? 110 - ((v - minVal) / range) * 100 : 110;
              const stakingPath = stakingValues.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / months) * 580 + 10} ${toY(v)}`).join(" ");
              const holdingPath = `M 10 110 L 590 110`;
              const stakingFinal = stakingValues[months];
              const holdingFinal = amount;
              const gain = stakingFinal - holdingFinal;
              return (
                <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "12px", padding: "1.5rem", marginTop: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>📊 Staking vs Holding — 5 Year Projection</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginTop: "0.2rem" }}>Staking earns <span style={{ color: "#22c55e", fontWeight: 700 }}>+{fmt(gain)}</span> more than holding over 5 years</div>
                    </div>
                  </div>
                  {/* Legend */}
                  <div style={{ display: "flex", gap: "1.25rem", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ width: "20px", height: "3px", background: "#2c7df7", borderRadius: "2px" }} />
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)" }}>Staking ({apy.toFixed(1)}% APY)</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ width: "20px", height: "3px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", borderTop: "2px dashed rgba(255,255,255,0.2)" }} />
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>Holding (0% growth)</span>
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "1rem 0.5rem 0.5rem", overflow: "hidden" }}>
                    <svg width="100%" height="130" viewBox="0 0 600 130" preserveAspectRatio="none">
                      {/* Shaded area between staking and holding */}
                      <path d={`${stakingPath} L 590 110 L 10 110 Z`} fill="rgba(44,125,247,0.08)" />
                      {/* Holding line */}
                      <path d={holdingPath} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="6,4" fill="none" />
                      {/* Staking line */}
                      <path d={stakingPath} stroke="#2c7df7" strokeWidth="2.5" fill="none" />
                      {/* Year labels */}
                      {Array.from({ length: years + 1 }, (_, y) => (
                        <text key={y} x={(y / years) * 580 + 10} y={128} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)">Y{y}</text>
                      ))}
                      {/* End labels */}
                      <text x={590} y={toY(stakingFinal) - 6} textAnchor="end" fontSize="9" fill="#2c7df7" fontWeight="bold">{fmt(stakingFinal)}</text>
                      <text x={590} y={118} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)">{fmt(holdingFinal)}</text>
                    </svg>
                  </div>
                  <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", margin: "0.5rem 0 0" }}>Assumes constant APY. Actual returns vary. Not financial advice.</p>
                </div>
              );
            })()}
          </div>

          {/* ── Sidebar: top bakers comparison ── */}
          <div style={{ position: "sticky", top: "80px" }}>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
                  <div style={{ width: "3px", height: "16px", background: "#2c7df7", borderRadius: "2px" }} />
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)" }}>Baker Rankings</span>
                </div>
                {/* Sort pills */}
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  {(["apy", "fee", "delegators"] as SidebarSort[]).map(s => (
                    <button key={s} onClick={() => setSidebarSort(s)}
                      style={{ padding: "0.2rem 0.6rem", background: sidebarSort === s ? "rgba(44,125,247,0.25)" : "rgba(255,255,255,0.05)", border: `1px solid ${sidebarSort === s ? "rgba(44,125,247,0.5)" : "rgba(255,255,255,0.08)"}`, borderRadius: "12px", color: sidebarSort === s ? "#2c7df7" : "rgba(255,255,255,0.4)", fontSize: "0.62rem", fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>
                      {s === "apy" ? "⭐ APY" : s === "fee" ? "💰 Lowest Fee" : "👥 Delegators"}
                    </button>
                  ))}
                </div>
              </div>
              {isLoading ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>Loading…</div>
              ) : (
                sidebarBakers.slice(0, 10).map((baker: any, i: number) => {
                  const isSelected = selectedAddress === baker.address;
                  const apy = baker.apy as number;
                  const annual = amount > 0 ? (amount * (Math.pow(1 + apy / 100 / 12, 12) - 1)) : null;
                  const rightLabel = sidebarSort === "fee" && baker.feeRate != null
                    ? `${baker.feeRate.toFixed(1)}% fee`
                    : sidebarSort === "delegators"
                    ? `${baker.numDelegators.toLocaleString()} delegators`
                    : `${apy.toFixed(2)}% APY`;
                  const rightColor = sidebarSort === "fee" ? "#f59e0b" : sidebarSort === "delegators" ? "#2c7df7" : "#22c55e";
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
                        {annual != null && amount > 0 && <div style={{ fontSize: "0.62rem", color: "#f97316", fontWeight: 600 }}>+{fmt(annual)}/yr</div>}
                      </div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 800, color: rightColor, flexShrink: 0 }}>{rightLabel}</div>
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

      {/* FAQ Accordion Section */}
      <div className="container" style={{ padding: "3rem 1.25rem 4rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: "#2c7df7" }}>?</span> Frequently Asked Questions
          </h2>
          <FaqAccordion faqs={[
            { q: "What is Tezos staking?", a: "Tezos staking (also called delegation) lets you earn rewards by delegating your XTZ to a baker. Bakers validate transactions and share a portion of their rewards with delegators. You keep full control of your XTZ — it never leaves your wallet." },
            { q: "What APY can I earn staking Tezos?", a: "Tezos staking APY typically ranges from 5% to 10% annually, depending on the baker you choose. The XTZ.News Staking Calculator shows real-time APY for all active bakers based on their last completed cycle rewards." },
            { q: "How do I choose the best Tezos baker?", a: "Look for a baker with high APY (above 8% is excellent), low fee rate (under 10%), high uptime (above 99%), and available staking space. The XTZ.News Best Baker recommendation automatically scores all bakers and highlights the top choice for small delegators." },
            { q: "Is Tezos staking safe?", a: "Yes. When you delegate XTZ, your tokens never leave your wallet. You simply assign your baking rights to a baker. There is no lock-up period — you can undelegate at any time. The baker cannot access or spend your XTZ." },
            { q: "How long does it take to start earning Tezos staking rewards?", a: "After delegating, it takes approximately 2-3 cycles (around 5-7 days) before you start receiving rewards. Each Tezos cycle is approximately 2.8 days long (14,400 blocks at 6 seconds per block)." },
            { q: "What is the minimum amount to stake Tezos?", a: "There is no minimum amount to delegate XTZ. You can delegate any amount, even 1 XTZ. However, some bakers may have a minimum delegation requirement. The XTZ.News Staking Calculator works for any amount." },
          ]} />
        </div>
      </div>
    </div>
  );
}

function FaqAccordion({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {faqs.map((faq, i) => (
        <div key={i} style={{ background: "#05152e", border: `1px solid ${openIndex === i ? "rgba(44,125,247,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: "8px", overflow: "hidden", transition: "border-color 0.2s" }}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "1rem 1.25rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
            <span style={{ fontSize: "0.92rem", fontWeight: 700, color: openIndex === i ? "#2c7df7" : "#fff", lineHeight: 1.4 }}>{faq.q}</span>
            <ChevronDown size={16} style={{ color: openIndex === i ? "#2c7df7" : "rgba(255,255,255,0.4)", flexShrink: 0, transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
          </button>
          {openIndex === i && (
            <div style={{ padding: "0 1.25rem 1rem", fontSize: "0.88rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
