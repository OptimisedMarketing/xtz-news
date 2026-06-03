import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { Search, Layers, ArrowRightLeft, TrendingUp, TrendingDown, Users, Zap, Shield, ExternalLink, RefreshCw, ChevronRight, Vote, ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO, buildWebPageSchema, buildFAQSchema } from "@/hooks/useSEO";

function formatXtz(v: number, decimals = 2) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K ꜩ`;
  return `${v.toFixed(decimals)} ꜩ`;
}
function formatUsd(v: number) {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  return `$${v.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}
function timeAgo(ts: string) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
function shortHash(h: string, len = 8) {
  if (!h) return "";
  return `${h.slice(0, len)}...${h.slice(-4)}`;
}

// ── Protocol Upgrade History Section ─────────────────────────────────────────
function UpgradeHistorySection() {
  const { data: upgrades = [], isLoading } = trpc.explorer.upgradeHistory.useQuery(undefined, {
    staleTime: 60 * 60_000,
  });
  const [upgradeSearch, setUpgradeSearch] = useState("");
  const [upgradeSort, setUpgradeSort] = useState<"epoch" | "upvotes" | "level">("epoch");
  const [upgradeSortDir, setUpgradeSortDir] = useState<"asc" | "desc">("desc");

  const UPGRADE_COLORS: Record<string, string> = {
    "Athens A": "#8b5cf6", "Babylon": "#ec4899", "Carthage": "#f97316",
    "Delphi": "#06b6d4", "Edo": "#10b981", "Florence": "#f59e0b",
    "Granada": "#22c55e", "Hangzhou": "#2c7df7", "Ithaca": "#8b5cf6",
    "Jakarta": "#ec4899", "Kathmandu": "#f97316", "Lima": "#06b6d4",
    "Mumbai": "#10b981", "Nairobi": "#f59e0b", "Oxford": "#22c55e",
    "Paris": "#2c7df7", "Quebec": "#8b5cf6", "Rio": "#ec4899",
    "Seoul": "#f97316", "Tallinn": "#06b6d4",
  };

  const filtered = useMemo(() => {
    let list = [...upgrades] as any[];
    if (upgradeSearch.trim()) {
      const q = upgradeSearch.toLowerCase();
      list = list.filter(u =>
        (u.name || "").toLowerCase().includes(q) ||
        u.proposalHash.toLowerCase().includes(q) ||
        String(u.epoch).includes(q)
      );
    }
    list.sort((a, b) => {
      const av = upgradeSort === "epoch" ? a.epoch : upgradeSort === "upvotes" ? a.upvotes : (a.activationLevel ?? 0);
      const bv = upgradeSort === "epoch" ? b.epoch : upgradeSort === "upvotes" ? b.upvotes : (b.activationLevel ?? 0);
      return upgradeSortDir === "desc" ? bv - av : av - bv;
    });
    return list;
  }, [upgrades, upgradeSearch, upgradeSort, upgradeSortDir]);

  function toggleSort(field: typeof upgradeSort) {
    if (upgradeSort === field) setUpgradeSortDir(d => d === "desc" ? "asc" : "desc");
    else { setUpgradeSort(field); setUpgradeSortDir("desc"); }
  }

  return (
    <div style={{ marginBottom: "1.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <h2 style={{ fontSize: "0.82rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Zap size={13} style={{ color: "#f59e0b" }} /> Protocol Upgrade History
          <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.25)", textTransform: "none", letterSpacing: 0, fontSize: "0.7rem" }}>— {upgrades.length} upgrades</span>
        </h2>
        {/* Search bar */}
        <div style={{ position: "relative" }}>
          <Search size={12} style={{ position: "absolute", left: "0.6rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
          <input
            value={upgradeSearch}
            onChange={(e) => setUpgradeSearch(e.target.value)}
            placeholder="Search protocol or hash…"
            style={{ padding: "0.45rem 0.75rem 0.45rem 2rem", background: "#05152e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", color: "#fff", fontSize: "0.78rem", outline: "none", fontFamily: "inherit", width: "220px", transition: "border-color 0.15s" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
        </div>
      </div>
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "44px", borderRadius: "6px" }} />
          ))}
        </div>
      ) : (
        <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <th style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>Protocol</th>
                  <th style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>Proposal Hash</th>
                  {(["level", "epoch", "upvotes"] as const).map(f => (
                    <th key={f} onClick={() => toggleSort(f)}
                      style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", cursor: "pointer", whiteSpace: "nowrap", color: upgradeSort === f ? "#2c7df7" : "rgba(255,255,255,0.35)", userSelect: "none" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                        {f === "level" ? "Activation Level" : f.charAt(0).toUpperCase() + f.slice(1)}
                        {upgradeSort === f ? (upgradeSortDir === "desc" ? <ChevronDown size={10} /> : <ChevronUp size={10} />) : <ArrowUpDown size={9} style={{ opacity: 0.4 }} />}
                      </span>
                    </th>
                  ))}
                  <th style={{ padding: "0.6rem 1rem" }} />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>No upgrades match your search.</td></tr>
                ) : filtered.map((u: any, i: number) => {
                  const color = UPGRADE_COLORS[u.name] ?? "#2c7df7";
                  // Mark as active if it's the most recent epoch (epoch 0 in the sorted list = most recent)
                  const isActive = i === 0 && upgradeSortDir === "desc" && upgradeSort === "epoch";
                  return (
                    <tr key={u.epoch} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s", background: isActive ? "rgba(44,125,247,0.04)" : "transparent" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = isActive ? "rgba(44,125,247,0.08)" : "rgba(255,255,255,0.02)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = isActive ? "rgba(44,125,247,0.04)" : "transparent")}>
                      <td style={{ padding: "0.6rem 1rem", whiteSpace: "nowrap" }}>
                        {u.name ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                            <span style={{ fontWeight: 800, color: "#fff" }}>{u.name}</span>
                            {isActive && (
                              <span style={{ fontSize: "0.58rem", fontWeight: 800, padding: "1px 6px", borderRadius: "3px", background: "rgba(34,197,94,0.15)", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.08em", border: "1px solid rgba(34,197,94,0.3)" }}>Active</span>
                            )}
                          </span>
                        ) : (
                          <span style={{ color: "rgba(255,255,255,0.35)", fontFamily: "monospace", fontSize: "0.72rem" }}>{u.proposalHash.slice(0, 12)}…</span>
                        )}
                      </td>
                      <td style={{ padding: "0.6rem 1rem" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>{u.proposalHash.slice(0, 16)}…</span>
                      </td>
                      <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
                        {u.activationLevel ? u.activationLevel.toLocaleString() : "—"}
                      </td>
                      <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.4)" }}>#{u.epoch}</td>
                      <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.6)" }}>{u.upvotes}</td>
                      <td style={{ padding: "0.6rem 1rem" }}>
                        <a href={`https://tzkt.io/protocols/${u.proposalHash}`} target="_blank" rel="nofollow noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)")}>
                          <ExternalLink size={10} /> TzKT
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExplorerPage() {
  useSEO({
    title: "Tezos Blockchain Explorer | XTZ.News — Blocks, Transactions & Addresses",
    description: "Explore the Tezos blockchain live. Search blocks, transactions, addresses, bakers, and token transfers on the XTZ.News Tezos explorer.",
    keywords: "Tezos explorer, Tezos blockchain explorer, XTZ explorer, Tezos blocks, Tezos transactions, Tezos address lookup",
    canonical: "https://xtz.news/explorer",
    jsonLd: [
      buildWebPageSchema({ title: "Tezos Blockchain Explorer", description: "Explore the Tezos blockchain live. Search blocks, transactions, addresses, bakers, and token transfers.", url: "https://xtz.news/explorer", breadcrumbs: [{ name: "Home", url: "https://xtz.news" }, { name: "Explorer", url: "https://xtz.news/explorer" }] }),
      buildFAQSchema([
        { question: "What is a Tezos block explorer?", answer: "A Tezos block explorer is a tool that lets you view and search all public data on the Tezos blockchain, including blocks, transactions, wallet addresses, smart contracts, and token transfers. The XTZ.News Explorer shows live Tezos data including the current block height, XTZ price, active bakers, and recent transactions." },
        { question: "How do I look up a Tezos transaction?", answer: "To look up a Tezos transaction, paste the operation hash (starting with 'o') into the XTZ.News Explorer search bar. You can also search by block level (a number), block hash (starting with 'B'), or wallet address (starting with tz1, tz2, tz3, or KT1)." },
        { question: "What is a Tezos block?", answer: "A Tezos block is a batch of validated transactions added to the Tezos blockchain approximately every 6 seconds. Each block has a unique hash, level (block number), timestamp, and contains all operations (transactions, delegations, originations) included by the baker who created it." },
        { question: "What is a Tezos baker?", answer: "A Tezos baker is a node operator who validates transactions and creates new blocks on the Tezos blockchain. Bakers must hold or have delegated to them a minimum amount of XTZ (baking power). In return, they earn baking rewards that are shared with their delegators. There are currently over 300 active bakers on Tezos." },
        { question: "What is a Tezos cycle?", answer: "A Tezos cycle is a fixed period of 14,400 blocks (approximately 2.8 days at 6 seconds per block). Cycles are used to calculate baking rights, distribute rewards, and govern the Tezos protocol voting process. Staking rewards are distributed at the end of each cycle." },
        { question: "How do I search for a Tezos address?", answer: "Enter any Tezos address (tz1, tz2, tz3 for user accounts, or KT1 for smart contracts) in the XTZ.News Explorer search bar. You'll see the account balance, transaction history, delegation status, and for bakers, their staking balance and number of delegators." },
      ]),
    ],
  });

  const [, navigate] = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "governance">("dashboard");
  const [voteFilter, setVoteFilter] = useState<"all" | "yay" | "nay" | "pass">("all");
  const [showQuorumTooltip, setShowQuorumTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: governance, isLoading: govLoading } = trpc.explorer.governance.useQuery(undefined, {
    staleTime: 5 * 60_000,
    enabled: activeTab === "governance",
  });

  const { data: stats, refetch: refetchStats } = trpc.explorer.networkStats.useQuery(undefined, {
    staleTime: 30_000,
    refetchInterval: autoRefresh ? 30_000 : false,
  });
  const { data: blocks = [], refetch: refetchBlocks } = trpc.explorer.latestBlocks.useQuery({ limit: 10 }, {
    staleTime: 15_000,
    refetchInterval: autoRefresh ? 15_000 : false,
  });
  const { data: txs = [], refetch: refetchTxs } = trpc.explorer.latestTransactions.useQuery({ limit: 10 }, {
    staleTime: 15_000,
    refetchInterval: autoRefresh ? 15_000 : false,
  });
  const { data: tokenTransfers = [] } = trpc.explorer.tokenTransfers.useQuery({ limit: 8 }, {
    staleTime: 30_000,
    refetchInterval: autoRefresh ? 30_000 : false,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    if (/^\d+$/.test(q)) { navigate(`/explorer/block/${q}`); return; }
    if (q.startsWith("B") && q.length > 30) { navigate(`/explorer/block/${q}`); return; }
    if (q.startsWith("o") && q.length > 30) { navigate(`/explorer/tx/${q}`); return; }
    if (/^(tz1|tz2|tz3|KT1)/.test(q)) { navigate(`/explorer/address/${q}`); return; }
    alert("Unknown search query. Try a block level, tx hash, or address.");
  };

  const statCards = stats ? [
    { label: "Block Height", value: stats.level.toLocaleString(), icon: <Layers size={18} />, color: "#2c7df7" },
    { label: "Cycle", value: stats.cycle.toLocaleString(), icon: <RefreshCw size={18} />, color: "#8b5cf6" },
    { label: "XTZ Price", value: `$${stats.xtzUsd.toFixed(4)}`, sub: `${stats.priceChange24h >= 0 ? "+" : ""}${stats.priceChange24h.toFixed(2)}% 24h`, subColor: stats.priceChange24h >= 0 ? "#22c55e" : "#ef4444", icon: stats.priceChange24h >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />, color: stats.priceChange24h >= 0 ? "#22c55e" : "#ef4444" },
    { label: "Market Cap", value: formatUsd(stats.marketCap), icon: <TrendingUp size={18} />, color: "#f59e0b" },
    { label: "Total Supply", value: formatXtz(stats.totalSupply, 0), icon: <Zap size={18} />, color: "#06b6d4" },
    { label: "Circulating", value: formatXtz(stats.circulatingSupply, 0), icon: <Zap size={18} />, color: "#10b981" },
    { label: "Active Bakers", value: stats.totalBakers.toLocaleString(), icon: <Shield size={18} />, color: "#f97316" },
    { label: "Delegators", value: stats.totalDelegators.toLocaleString(), icon: <Users size={18} />, color: "#ec4899" },
  ] : [];

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero + Search */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "3rem 0 2.5rem" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Live · Tezos Mainnet</span>
            <button onClick={() => { refetchStats(); refetchBlocks(); refetchTxs(); }} style={{ marginLeft: "auto", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", padding: "0.3rem 0.75rem", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <RefreshCw size={11} /> Refresh
            </button>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: "#fff", margin: "0 0 0.5rem", lineHeight: 1.1 }}>
            Tezos Explorer
          </h1>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", margin: "0 0 2rem" }}>
            Search blocks, transactions, addresses, and bakers on the Tezos blockchain
          </p>
          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0", maxWidth: "680px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", pointerEvents: "none" }} />
              <input
                ref={inputRef}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Block level, tx hash (o...), address (tz1/KT1), baker..."
                style={{ width: "100%", padding: "0.875rem 1rem 0.875rem 2.75rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRight: "none", borderRadius: "4px 0 0 4px", color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)")}
              />
            </div>
            <button type="submit" style={{ padding: "0 1.5rem", background: "#2c7df7", border: "none", borderRadius: "0 4px 4px 0", color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", whiteSpace: "nowrap" }}>
              Search
            </button>
          </form>
          {/* tezos.systems live widgets */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
            <iframe src="https://tezos.systems/widgets/combo.html?theme=abyss&accent=2c7df7" width="400" height="80" frameBorder={0} scrolling="no" title="Tezos network stats" style={{ borderRadius: "8px", border: "none", display: "block" }} />
            <iframe src="https://tezos.systems/widgets/block-height.html?theme=abyss&accent=2c7df7" width="200" height="80" frameBorder={0} scrolling="no" title="Block height" style={{ borderRadius: "8px", border: "none", display: "block" }} />
            <iframe src="https://tezos.systems/widgets/staking-ratio.html?theme=abyss&accent=2c7df7" width="200" height="80" frameBorder={0} scrolling="no" title="Staking ratio" style={{ borderRadius: "8px", border: "none", display: "block" }} />
          </div>
          {/* Quick links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
            {[
              { label: "Latest Blocks", href: "/explorer" },
              { label: "Baker Leaderboard", href: "/explorer/bakers" },
              { label: "Token Transfers", href: "/explorer" },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "0.25rem 0.75rem", textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.4)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="container" style={{ display: "flex", gap: 0 }}>
          {([
            { id: "dashboard" as const, label: "Dashboard", icon: <Layers size={13} /> },
            { id: "governance" as const, label: "Governance", icon: <Vote size={13} /> },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: "0.7rem 1.25rem", background: "transparent", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? "#2c7df7" : "transparent"}`, color: activeTab === tab.id ? "#2c7df7" : "rgba(255,255,255,0.45)", fontWeight: activeTab === tab.id ? 700 : 500, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", transition: "color 0.15s, border-color 0.15s" }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem" }}>

        {/* ── Governance tab ─────────────────────────────────────────────── */}
        {activeTab === "governance" && (
          <div>
            {/* tezos.systems live governance widgets */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <iframe src="https://tezos.systems/widgets/governance.html?theme=abyss&accent=2c7df7" width="300" height="120" frameBorder={0} scrolling="no" title="Tezos governance" style={{ borderRadius: "8px", border: "none", display: "block" }} />
              <iframe src="https://tezos.systems/widgets/protocol.html?theme=abyss&accent=2c7df7" width="300" height="120" frameBorder={0} scrolling="no" title="Tezos protocol" style={{ borderRadius: "8px", border: "none", display: "block" }} />
              <iframe src="https://tezos.systems/widgets/baker-count.html?theme=abyss&accent=2c7df7" width="200" height="120" frameBorder={0} scrolling="no" title="Active bakers" style={{ borderRadius: "8px", border: "none", display: "block" }} />
            </div>
            {govLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "1.25rem" }}>
                    <div className="skeleton" style={{ height: "10px", width: "60%", marginBottom: "8px" }} />
                    <div className="skeleton" style={{ height: "22px", width: "80%" }} />
                  </div>
                ))}
              </div>
            ) : governance ? (
              <>
                {/* Epoch + period status */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1.75rem" }}>
                  {[
                    { label: "Epoch", value: `#${governance.epoch.index}`, sub: governance.epoch.status.replace(/_/g, " "), color: "#2c7df7" },
                    { label: "Current Period", value: governance.currentPeriod?.kind?.replace(/_/g, " ") ?? "—", sub: governance.currentPeriod?.status ?? "", color: governance.currentPeriod?.status === "active" ? "#22c55e" : "#f59e0b" },
                    { label: "Total Bakers", value: (governance.currentPeriod?.totalBakers ?? 0).toLocaleString(), sub: "eligible to vote", color: "#f97316" },
                    { label: "Epoch Ends", value: governance.epoch.endTime ? new Date(governance.epoch.endTime).toLocaleDateString() : "—", sub: governance.epoch.endTime ? `${Math.max(0, Math.ceil((new Date(governance.epoch.endTime).getTime() - Date.now()) / 86400000))} days left` : "", color: "#8b5cf6" },
                  ].map(c => (
                    <div key={c.label} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "1rem" }}>
                      <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>{c.label}</div>
                      <div style={{ fontSize: "1.15rem", fontWeight: 900, color: c.color, textTransform: "capitalize" }}>{c.value}</div>
                      {c.sub && <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginTop: "0.2rem", textTransform: "capitalize" }}>{c.sub}</div>}
                    </div>
                  ))}
                </div>

                {/* Active proposals */}
                {governance.proposals.length > 0 && (
                  <div style={{ marginBottom: "1.75rem" }}>
                    <h2 style={{ fontSize: "0.82rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Vote size={13} style={{ color: "#2c7df7" }} /> Active Proposals
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {governance.proposals.map((p: any) => (
                        <div key={p.hash} style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "8px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                              <span style={{ fontSize: "0.65rem", fontWeight: 800, padding: "2px 8px", borderRadius: "3px", background: p.status === "active" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)", color: p.status === "active" ? "#22c55e" : "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{p.status}</span>
                              {p.initiator && <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>by {p.initiator}</span>}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                              <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#2c7df7", wordBreak: "break-all" }}>{p.hash}</div>
                              <a
                                href={`https://research-development.nomadic-labs.com/tezos-protocol-${p.hash.slice(0, 8).toLowerCase()}.html`}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                title="View proposal documentation"
                                style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.68rem", color: "rgba(44,125,247,0.7)", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#2c7df7")}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(44,125,247,0.7)")}>
                                <ExternalLink size={10} /> Docs
                              </a>
                              <a
                                href={`https://tzkt.io/protocols/${p.hash}`}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                title="View on TzKT"
                                style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}
                                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
                                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)")}>
                                <ExternalLink size={10} /> TzKT
                              </a>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.2rem" }}>Upvotes</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff" }}>{p.upvotes}</div>
                            <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>{formatXtz(p.votingPower)} voting power</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ballot results (exploration/promotion period) */}
                {governance.ballotPeriod && (
                  <div style={{ marginBottom: "1.75rem" }}>
                    <h2 style={{ fontSize: "0.82rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <TrendingUp size={13} style={{ color: "#22c55e" }} /> {governance.ballotPeriod.kind.charAt(0).toUpperCase() + governance.ballotPeriod.kind.slice(1)} Vote Results
                    </h2>
                    <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "1.25rem" }}>
                      {/* Participation bar */}
                      <div style={{ marginBottom: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", position: "relative" }}>
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Baker Participation</span>
                            <button
                              onMouseEnter={() => setShowQuorumTooltip(true)}
                              onMouseLeave={() => setShowQuorumTooltip(false)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", padding: 0, display: "flex", alignItems: "center" }}>
                              <Users size={11} />
                            </button>
                            {showQuorumTooltip && (
                              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#0d2a5e", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", width: "260px", zIndex: 50, boxShadow: "0 8px 24px rgba(0,0,0,0.5)", fontSize: "0.72rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, pointerEvents: "none" }}>
                                <div style={{ fontWeight: 800, color: "#fff", marginBottom: "0.3rem" }}>How the quorum works</div>
                                <div>The <strong style={{ color: "#2c7df7" }}>quorum</strong> is the minimum percentage of total voting power that must cast a ballot for the vote to be valid. It is dynamically adjusted each period based on recent participation.</div>
                                <div style={{ marginTop: "0.4rem" }}>Current quorum: <strong style={{ color: "#f59e0b" }}>{governance.ballotPeriod?.ballotsQuorum ?? "?"}%</strong>. Supermajority (Yay threshold): <strong style={{ color: "#22c55e" }}>{governance.ballotPeriod?.supermajority ?? "?"}%</strong>.</div>
                              </div>
                            )}
                          </div>
                          <span style={{ fontSize: "0.82rem", fontWeight: 900, color: governance.ballotPeriod.participationPct != null && governance.ballotPeriod.participationPct >= (governance.ballotPeriod.ballotsQuorum ?? 50) ? "#22c55e" : "#f59e0b" }}>
                            {governance.ballotPeriod.participationPct ?? "—"}%
                            {governance.ballotPeriod.ballotsQuorum && <span style={{ fontSize: "0.65rem", fontWeight: 500, color: "rgba(255,255,255,0.35)", marginLeft: "0.35rem" }}>quorum: {governance.ballotPeriod.ballotsQuorum}%</span>}
                          </span>
                        </div>
                        <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(100, governance.ballotPeriod.participationPct ?? 0)}%`, background: "#2c7df7", borderRadius: "4px", transition: "width 0.5s" }} />
                        </div>
                        {governance.ballotPeriod.ballotsQuorum && (
                          <div style={{ position: "relative", height: "4px" }}>
                            <div style={{ position: "absolute", left: `${governance.ballotPeriod.ballotsQuorum}%`, top: "-8px", width: "2px", height: "16px", background: "rgba(255,255,255,0.3)" }} />
                          </div>
                        )}
                      </div>
                      {/* Yay/Nay/Pass bars */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                        {[
                          { label: "Yay", count: governance.ballotPeriod.yayBallots, color: "#22c55e" },
                          { label: "Nay", count: governance.ballotPeriod.nayBallots, color: "#ef4444" },
                          { label: "Pass", count: governance.ballotPeriod.passBallots, color: "#f59e0b" },
                        ].map(v => {
                          const total = governance.ballotPeriod!.yayBallots + governance.ballotPeriod!.nayBallots + governance.ballotPeriod!.passBallots;
                          const pct = total > 0 ? Math.round(v.count / total * 100) : 0;
                          return (
                            <div key={v.label} style={{ textAlign: "center" }}>
                              <div style={{ fontSize: "0.62rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "0.3rem" }}>{v.label}</div>
                              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: v.color }}>{v.count}</div>
                              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>{pct}%</div>
                              <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", marginTop: "0.3rem", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: v.color, borderRadius: "2px" }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {governance.ballotPeriod.supermajority && (
                        <div style={{ marginTop: "0.75rem", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)" }}>
                          Supermajority required: {governance.ballotPeriod.supermajority}% · Yay share of cast votes: {governance.ballotPeriod.yayPct ?? "—"}%
                          {governance.ballotPeriod.yayPct != null && governance.ballotPeriod.yayPct >= governance.ballotPeriod.supermajority
                            ? <span style={{ color: "#22c55e", marginLeft: "0.4rem", fontWeight: 700 }}>✓ Passed</span>
                            : <span style={{ color: "#ef4444", marginLeft: "0.4rem", fontWeight: 700 }}>✗ Not reached</span>}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Top voters */}
                {governance.topVoters.length > 0 && (
                  <div style={{ marginBottom: "1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <h2 style={{ fontSize: "0.82rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <Shield size={13} style={{ color: "#f97316" }} /> Baker Votes
                      </h2>
                      {/* Vote filter dropdown */}
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        {(["all", "yay", "nay", "pass"] as const).map(f => (
                          <button key={f} onClick={() => setVoteFilter(f)}
                            style={{ padding: "0.3rem 0.7rem", background: voteFilter === f ? (f === "yay" ? "rgba(34,197,94,0.2)" : f === "nay" ? "rgba(239,68,68,0.2)" : f === "pass" ? "rgba(245,158,11,0.2)" : "rgba(44,125,247,0.2)") : "rgba(255,255,255,0.05)", border: `1px solid ${voteFilter === f ? (f === "yay" ? "rgba(34,197,94,0.5)" : f === "nay" ? "rgba(239,68,68,0.5)" : f === "pass" ? "rgba(245,158,11,0.5)" : "rgba(44,125,247,0.5)") : "rgba(255,255,255,0.1)"}`, borderRadius: "4px", color: voteFilter === f ? (f === "yay" ? "#22c55e" : f === "nay" ? "#ef4444" : f === "pass" ? "#f59e0b" : "#2c7df7") : "rgba(255,255,255,0.4)", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
                            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                              {["Baker", "Vote", "Voting Power", "% of Cast"].map(h => (
                                <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {governance.topVoters.filter((v: any) => voteFilter === "all" || v.vote === voteFilter).map((v: any, i: number) => (
                              <tr key={v.address + i} style={{ borderBottom: i < governance.topVoters.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                                <td style={{ padding: "0.55rem 1rem" }}>
                                  <Link href={`/explorer/address/${v.address}`} style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>{v.baker}</Link>
                                </td>
                                <td style={{ padding: "0.55rem 1rem" }}>
                                  <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: v.vote === "yay" ? "rgba(34,197,94,0.15)" : v.vote === "nay" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)", color: v.vote === "yay" ? "#22c55e" : v.vote === "nay" ? "#ef4444" : "#f59e0b", textTransform: "uppercase" }}>{v.vote}</span>
                                </td>
                                <td style={{ padding: "0.55rem 1rem", color: "rgba(255,255,255,0.6)", fontWeight: 600, whiteSpace: "nowrap" }}>{formatXtz(v.votingPower)}</td>
                                <td style={{ padding: "0.55rem 1rem" }}>
                                  {(() => {
                                    const totalVP = governance.topVoters.reduce((sum: number, x: any) => sum + x.votingPower, 0);
                                    const pct = totalVP > 0 ? (v.votingPower / totalVP * 100).toFixed(1) : "0";
                                    return (
                                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <div style={{ width: "60px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                                          <div style={{ height: "100%", width: `${pct}%`, background: v.vote === "yay" ? "#22c55e" : v.vote === "nay" ? "#ef4444" : "#f59e0b", borderRadius: "2px" }} />
                                        </div>
                                        <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>{pct}%</span>
                                      </div>
                                    );
                                  })()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Protocol upgrade history */}
                <UpgradeHistorySection />

                {/* Epoch history */}
                <div style={{ marginTop: "1.75rem" }}>
                  <h2 style={{ fontSize: "0.82rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <RefreshCw size={13} style={{ color: "#8b5cf6" }} /> Recent Epochs
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {governance.epochHistory.map((e: any) => (
                      <div key={e.index} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "0.75rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Epoch #{e.index}</span>
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: "3px", background: e.status === "voting" ? "rgba(44,125,247,0.15)" : e.status === "no_proposals" ? "rgba(255,255,255,0.06)" : "rgba(34,197,94,0.1)", color: e.status === "voting" ? "#2c7df7" : e.status === "no_proposals" ? "rgba(255,255,255,0.3)" : "#22c55e", textTransform: "capitalize" }}>{e.status.replace(/_/g, " ")}</span>
                          {e.proposals.map((p: any) => (
                            <span key={p.hash} style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{p.hash.slice(0, 12)}…</span>
                          ))}
                        </div>
                        <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>{e.startTime ? new Date(e.startTime).toLocaleDateString() : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>Failed to load governance data.</div>
            )}
          </div>
        )}

        {/* ── Dashboard tab ─────────────────────────────────────────────── */}
        {activeTab === "dashboard" && <>
        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
          {statCards.map(card => (
            <div key={card.label} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <span style={{ color: card.color }}>{card.icon}</span>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{card.label}</span>
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{card.value}</div>
              {card.sub && <div style={{ fontSize: "0.72rem", fontWeight: 700, color: card.subColor, marginTop: "0.25rem" }}>{card.sub}</div>}
            </div>
          ))}
          {!stats && Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "1rem" }}>
              <div className="skeleton" style={{ height: "10px", width: "80px", marginBottom: "10px" }} />
              <div className="skeleton" style={{ height: "20px", width: "100px" }} />
            </div>
          ))}
        </div>

        {/* Two-column: blocks + txs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
          {/* Latest Blocks */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h2 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Layers size={14} style={{ color: "#2c7df7" }} /> Latest Blocks
              </h2>
            </div>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", overflow: "hidden" }}>
              {blocks.length === 0 ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="skeleton" style={{ height: "12px", width: "60%", marginBottom: "6px" }} />
                    <div className="skeleton" style={{ height: "10px", width: "40%" }} />
                  </div>
                ))
              ) : (blocks as any[]).map((block: any, i: number) => (
                <Link key={block.level} href={`/explorer/block/${block.level}`} style={{ display: "block", padding: "0.7rem 1rem", borderBottom: i < blocks.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", textDecoration: "none", transition: "background 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.06)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div style={{ width: "32px", height: "32px", background: "rgba(44,125,247,0.15)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Layers size={13} style={{ color: "#2c7df7" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#2c7df7" }}>{block.level.toLocaleString()}</div>
                        <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>{block.baker}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)" }}>{block.transactions} txs</div>
                      <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{timeAgo(block.timestamp)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Latest Transactions */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <h2 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <ArrowRightLeft size={14} style={{ color: "#8b5cf6" }} /> Latest Transactions
              </h2>
            </div>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", overflow: "hidden" }}>
              {txs.length === 0 ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="skeleton" style={{ height: "12px", width: "70%", marginBottom: "6px" }} />
                    <div className="skeleton" style={{ height: "10px", width: "50%" }} />
                  </div>
                ))
              ) : (txs as any[]).map((tx: any, i: number) => (
                <Link key={tx.hash + i} href={`/explorer/tx/${tx.hash}`} style={{ display: "block", padding: "0.7rem 1rem", borderBottom: i < txs.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", textDecoration: "none", transition: "background 0.15s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.06)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 0 }}>
                      <div style={{ width: "32px", height: "32px", background: "rgba(139,92,246,0.15)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ArrowRightLeft size={13} style={{ color: "#8b5cf6" }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8b5cf6", fontFamily: "monospace" }}>{shortHash(tx.hash)}</div>
                        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {tx.sender || shortHash(tx.senderAddress)} → {tx.target || shortHash(tx.targetAddress)}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "0.5rem" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>{tx.amount.toFixed(2)} ꜩ</div>
                      <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>{timeAgo(tx.timestamp)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Token Transfers */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Zap size={14} style={{ color: "#f59e0b" }} /> Recent Token Transfers
          </h2>
          <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["Token", "From", "To", "Amount", "Time"].map(h => (
                      <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tokenTransfers.length === 0 ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}><td colSpan={5} style={{ padding: "0.75rem 1rem" }}><div className="skeleton" style={{ height: "12px", width: "100%" }} /></td></tr>
                    ))
                  ) : (tokenTransfers as any[]).map((t: any, i: number) => (
                    <tr key={t.id} style={{ borderBottom: i < tokenTransfers.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(245,158,11,0.04)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                      <td style={{ padding: "0.6rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          {t.token.thumbnail && <img src={t.token.thumbnail.replace("ipfs://", "https://ipfs.io/ipfs/")} alt="" style={{ width: "18px", height: "18px", borderRadius: "50%", objectFit: "cover" }} onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }} />}
                          <span style={{ fontWeight: 700, color: "#f59e0b" }}>{t.token.symbol}</span>
                        </div>
                      </td>
                      <td style={{ padding: "0.6rem 1rem" }}>
                        <Link href={`/explorer/address/${t.fromAddress || ""}`} style={{ color: "#2c7df7", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem" }}>
                          {t.from === "mint" ? <span style={{ color: "#22c55e" }}>mint</span> : shortHash(t.fromAddress || t.from)}
                        </Link>
                      </td>
                      <td style={{ padding: "0.6rem 1rem" }}>
                        <Link href={`/explorer/address/${t.toAddress || ""}`} style={{ color: "#2c7df7", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem" }}>
                          {t.to === "burn" ? <span style={{ color: "#ef4444" }}>burn</span> : shortHash(t.toAddress || t.to)}
                        </Link>
                      </td>
                      <td style={{ padding: "0.6rem 1rem", color: "#fff", fontWeight: 600 }}>
                        {(parseInt(t.amount) / Math.pow(10, t.token.decimals)).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </td>
                      <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}>
                        {timeAgo(t.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Links to TzKT */}
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)" }}>
            Data powered by{" "}
            <a href="https://tzkt.io" target="_blank" rel="nofollow noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)" }}>TzKT</a>
            {" "}·{" "}
            <a href="https://coingecko.com" target="_blank" rel="nofollow noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)" }}>CoinGecko</a>
          </p>
        </div>
        </> }
      </div>
    </div>
  );
}
