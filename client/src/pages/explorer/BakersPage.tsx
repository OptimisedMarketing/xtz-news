import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Shield, ChevronRight, Home, TrendingUp, ExternalLink,
  ArrowRight, ArrowUpDown, Search, ChevronUp, ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";

const PAGE_SIZE = 10;

function formatXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K ꜩ`;
  return `${v.toFixed(2)} ꜩ`;
}

function templeDelegate(address: string) {
  return `https://app.templewallet.com/delegate?to=${address}`;
}

type SortKey = "rank" | "stakingBalance" | "ownBalance" | "numDelegators" | "apy";
type SortDir = "asc" | "desc";

// ── APY badge ─────────────────────────────────────────────────────────────────
function ApyBadge({ apy }: { apy: number | null }) {
  if (apy === null) return <span style={{ color: "rgba(255,255,255,0.25)" }}>—</span>;
  const color = apy >= 8 ? "#22c55e" : apy >= 5 ? "#f59e0b" : "#ef4444";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.2rem",
      padding: "0.2rem 0.5rem", borderRadius: "20px",
      background: `${color}18`, border: `1px solid ${color}40`,
      color, fontWeight: 800, fontSize: "0.78rem",
    }}>
      {apy.toFixed(2)}%
    </span>
  );
}

// ── Tooltip on Delegate button ─────────────────────────────────────────────────
function DelegateButton({ address }: { address: string }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <a
        href={templeDelegate(address)}
        target="_blank"
        rel="nofollow noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: "0.3rem",
          padding: "0.35rem 0.75rem",
          background: "rgba(249,115,22,0.15)",
          border: "1px solid rgba(249,115,22,0.35)",
          borderRadius: "4px",
          color: "#f97316", fontWeight: 700, fontSize: "0.7rem",
          textDecoration: "none", whiteSpace: "nowrap",
          transition: "background 0.15s, border-color 0.15s",
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.25)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.6)";
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.15)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.35)";
        }}
      >
        Delegate <ExternalLink size={10} />
      </a>
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", right: 0,
          background: "#1a2f52", border: "1px solid rgba(44,125,247,0.3)",
          borderRadius: "6px", padding: "0.6rem 0.85rem",
          width: "210px", zIndex: 50,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          pointerEvents: "none",
        }}>
          <div style={{ position: "absolute", bottom: "-5px", right: "18px", width: "9px", height: "9px", background: "#1a2f52", border: "1px solid rgba(44,125,247,0.3)", borderTop: "none", borderLeft: "none", transform: "rotate(45deg)" }} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <span style={{ fontSize: "1rem", flexShrink: 0 }}>🏛️</span>
            <div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.75rem", marginBottom: "0.2rem" }}>Opens Temple Wallet</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                This will open Temple Wallet in a new tab, pre-filled with this baker's address so you can delegate your XTZ in one click.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sortable column header ─────────────────────────────────────────────────────
function SortTh({ label, field, current, dir, onSort }: {
  label: string; field: SortKey;
  current: SortKey; dir: SortDir;
  onSort: (f: SortKey) => void;
}) {
  const active = current === field;
  return (
    <th
      onClick={() => onSort(field)}
      style={{
        padding: "0.75rem 1rem", textAlign: "left",
        fontWeight: 700, fontSize: "0.65rem",
        textTransform: "uppercase", letterSpacing: "0.08em",
        color: active ? "#2c7df7" : "rgba(255,255,255,0.4)",
        cursor: "pointer", whiteSpace: "nowrap", userSelect: "none",
        transition: "color 0.15s",
      }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
        {label}
        {active
          ? (dir === "desc" ? <ChevronDown size={11} /> : <ChevronUp size={11} />)
          : <ArrowUpDown size={10} style={{ opacity: 0.4 }} />}
      </span>
    </th>
  );
}

// ── Pagination bar ─────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const btnBase: React.CSSProperties = {
    minWidth: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center",
    borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
    color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
    transition: "all 0.15s", padding: "0 0.4rem",
  };
  const activeBtn: React.CSSProperties = {
    ...btnBase, background: "#2c7df7", borderColor: "#2c7df7", color: "#fff",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        style={{ ...btnBase, opacity: page === 1 ? 0.3 : 1 }}
      >
        <ChevronLeft size={14} />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} style={{ color: "rgba(255,255,255,0.3)", padding: "0 0.25rem" }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            style={p === page ? activeBtn : btnBase}
            onMouseEnter={(e) => { if (p !== page) (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.5)"; }}
            onMouseLeave={(e) => { if (p !== page) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            {p}
          </button>
        )
      )}
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        style={{ ...btnBase, opacity: page === totalPages ? 0.3 : 1 }}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function BakersPage() {
  useSEO({
    title: "Tezos Baker Leaderboard | XTZ.News — Top Tezos Validators",
    description: "The top Tezos bakers (validators) ranked by staking balance with real APY data. Find the best Tezos bakers to delegate your XTZ to.",
    keywords: "Tezos bakers, Tezos validators, Tezos staking APY, XTZ delegation, best Tezos baker",
    canonical: "https://xtz.news/explorer/bakers",
  });

  const { data: bakers = [], isLoading } = trpc.explorer.bakers.useQuery({ limit: 50 });

  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterQuery, setFilterQuery] = useState("");
  const [minDelegators, setMinDelegators] = useState<number | "">("");
  const [page, setPage] = useState(1);

  function handleSort(field: SortKey) {
    if (sortKey === field) {
      setSortDir(d => d === "desc" ? "asc" : "desc");
    } else {
      setSortKey(field);
      setSortDir("desc");
    }
    setPage(1);
  }

  function handleFilterChange(fn: () => void) {
    fn();
    setPage(1);
  }

  const processed = useMemo(() => {
    let list = [...(bakers as any[])];
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      list = list.filter(b => (b.alias || "").toLowerCase().includes(q) || b.address.toLowerCase().includes(q));
    }
    if (minDelegators !== "" && !isNaN(Number(minDelegators))) {
      list = list.filter(b => b.numDelegators >= Number(minDelegators));
    }
    list.sort((a, b) => {
      const av = a[sortKey] ?? (sortKey === "apy" ? -1 : 0);
      const bv = b[sortKey] ?? (sortKey === "apy" ? -1 : 0);
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return list;
  }, [bakers, sortKey, sortDir, filterQuery, minDelegators]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = processed.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2rem 0" }}>
        <div className="container">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}><Home size={12} /></Link>
            <ChevronRight size={10} />
            <Link href="/explorer" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Explorer</Link>
            <ChevronRight size={10} />
            <span style={{ color: "#fff" }}>Bakers</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "40px", height: "40px", background: "rgba(249,115,22,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={20} style={{ color: "#f97316" }} />
              </div>
              <div>
                <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: 0 }}>Baker Leaderboard</h1>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>Top 50 Tezos bakers — real APY, sort, filter, delegate in one click</p>
              </div>
            </div>
            <a
              href="/how-to-stake-on-tezos"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "6px", color: "#fff", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", boxShadow: "0 4px 14px rgba(249,115,22,0.35)", transition: "transform 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              <TrendingUp size={14} /> How to Delegate XTZ
            </a>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem" }}>

        {/* CTA Banner */}
        <div style={{ marginBottom: "1.75rem", padding: "1.5rem", background: "linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(234,88,12,0.06) 100%)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <div style={{ width: "44px", height: "44px", background: "rgba(249,115,22,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TrendingUp size={22} style={{ color: "#f97316" }} />
            </div>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 900, color: "#fff", margin: "0 0 0.3rem" }}>Earn up to ~9% APY by Delegating Your XTZ</h2>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6, maxWidth: "520px" }}>
                Choose a baker below and click <strong style={{ color: "#f97316" }}>Delegate</strong> — it opens Temple Wallet pre-filled with that baker's address. Your coins stay in your wallet. No lock-up period.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.6rem", flexShrink: 0 }}>
            <a href="/how-to-stake-on-tezos" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.25rem", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "6px", color: "#fff", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none", boxShadow: "0 4px 14px rgba(249,115,22,0.3)", transition: "transform 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")}>
              Delegation Guide <ArrowRight size={13} />
            </a>
            <a href="https://templewallet.com" target="_blank" rel="nofollow noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.65rem 1.25rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: "0.82rem", textDecoration: "none", transition: "border-color 0.15s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.5)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)")}>
              <ExternalLink size={13} /> Get Temple Wallet
            </a>
          </div>
        </div>

        {/* Filter / sort controls */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: "180px" }}>
            <Search size={13} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.35)", pointerEvents: "none" }} />
            <input
              value={filterQuery}
              onChange={(e) => handleFilterChange(() => setFilterQuery(e.target.value))}
              placeholder="Filter by name or address…"
              style={{ width: "100%", padding: "0.55rem 0.75rem 0.55rem 2.2rem", background: "#05152e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", color: "#fff", fontSize: "0.8rem", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>Min delegators:</span>
            <input
              type="number" min={0} value={minDelegators}
              onChange={(e) => handleFilterChange(() => setMinDelegators(e.target.value === "" ? "" : Number(e.target.value)))}
              placeholder="Any"
              style={{ width: "70px", padding: "0.55rem 0.6rem", background: "#05152e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "5px", color: "#fff", fontSize: "0.8rem", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {([
              { label: "Highest APY", key: "apy" as SortKey, dir: "desc" as SortDir },
              { label: "Most Delegators", key: "numDelegators" as SortKey, dir: "desc" as SortDir },
              { label: "Largest Baker", key: "stakingBalance" as SortKey, dir: "desc" as SortDir },
            ]).map(btn => {
              const active = sortKey === btn.key && sortDir === btn.dir;
              return (
                <button key={btn.label}
                  onClick={() => { setSortKey(btn.key); setSortDir(btn.dir); setPage(1); }}
                  style={{ padding: "0.4rem 0.8rem", background: active ? "rgba(44,125,247,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${active ? "rgba(44,125,247,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: "20px", color: active ? "#2c7df7" : "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                  {btn.label}
                </button>
              );
            })}
            {(filterQuery || minDelegators !== "") && (
              <button onClick={() => handleFilterChange(() => { setFilterQuery(""); setMinDelegators(""); })}
                style={{ padding: "0.4rem 0.8rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "20px", color: "#ef4444", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer" }}>
                Clear filters
              </button>
            )}
          </div>
          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>
            {processed.length} baker{processed.length !== 1 ? "s" : ""}
            {totalPages > 1 && ` · page ${safePage}/${totalPages}`}
          </span>
        </div>

        {/* Baker table */}
        <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <SortTh label="Rank" field="rank" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Baker</th>
                  <SortTh label="Staking Balance" field="stakingBalance" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Own Balance" field="ownBalance" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Delegators" field="numDelegators" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="APY (30d)" field="apy" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <th style={{ padding: "0.75rem 1rem" }} />
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td colSpan={7} style={{ padding: "0.75rem 1rem" }}><div className="skeleton" style={{ height: "14px", width: "100%" }} /></td>
                    </tr>
                  ))
                ) : pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>
                      No bakers match your filters.
                    </td>
                  </tr>
                ) : pageItems.map((baker: any, i: number) => (
                  <tr key={baker.address}
                    style={{ borderBottom: i < pageItems.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", transition: "background 0.15s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.04)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                    <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 900, color: baker.rank <= 3 ? "#f59e0b" : "rgba(255,255,255,0.4)" }}>
                        {baker.rank <= 3 ? "🏆" : ""} #{baker.rank}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <Link href={`/explorer/address/${baker.address}`} style={{ textDecoration: "none" }}>
                        <div style={{ fontWeight: 700, color: "#fff" }}>{baker.alias || "Unknown Baker"}</div>
                        <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{baker.address.slice(0, 12)}...</div>
                      </Link>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#f97316", whiteSpace: "nowrap" }}>{formatXtz(baker.stakingBalance)}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>{formatXtz(baker.ownBalance)}</td>
                    <td style={{ padding: "0.75rem 1rem", color: "rgba(255,255,255,0.7)" }}>{baker.numDelegators.toLocaleString()}</td>
                    <td style={{ padding: "0.75rem 1rem" }}><ApyBadge apy={baker.apy} /></td>
                    <td style={{ padding: "0.75rem 1rem" }}><DelegateButton address={baker.address} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!isLoading && <Pagination page={safePage} totalPages={totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />}

        {/* APY note */}
        {!isLoading && (
          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: "0.75rem" }}>
            APY calculated from the last completed cycle's actual rewards ÷ baking power × 365. Past performance does not guarantee future returns.
          </p>
        )}

        {/* Info cards */}
        <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {[
            { icon: "🔒", title: "Non-custodial", body: "Your XTZ never leaves your wallet. Bakers cannot spend your funds." },
            { icon: "💸", title: "Up to ~9% APY", body: "Rewards are paid every cycle (~1 day). No minimum amount required." },
            { icon: "🔓", title: "No lock-up", body: "Undelegate at any time. Rewards stop at the end of the current cycle." },
          ].map(card => (
            <div key={card.title} style={{ padding: "1.1rem 1.25rem", background: "rgba(44,125,247,0.05)", border: "1px solid rgba(44,125,247,0.12)", borderRadius: "8px" }}>
              <div style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{card.icon}</div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: "0.85rem", marginBottom: "0.3rem" }}>{card.title}</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{card.body}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
          <a href="/how-to-stake-on-tezos" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#2c7df7", fontWeight: 700, fontSize: "0.82rem", textDecoration: "none" }}>
            Read the full Tezos staking &amp; delegation guide <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
