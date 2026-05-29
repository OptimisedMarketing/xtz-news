import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Home, Search, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

function fmtXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}K ꜩ`;
  return `${v.toFixed(4)} ꜩ`;
}

const EXAMPLE_ADDRESSES = [
  { label: "Coinbase Baker", address: "tz1irJKkXS2DBWkU1NnmFQx1c1L7pbGg4yhk" },
  { label: "Try your wallet", address: "" },
];

export default function AirdropCheckerPage() {
  const [input, setInput] = useState("");
  const [address, setAddress] = useState("");

  const { data, isLoading } = trpc.tools.airdropCheck.useQuery(
    { address },
    { enabled: !!address, staleTime: 120_000 }
  );

  const handleSearch = (addr?: string) => {
    const a = (addr || input).trim();
    if (!a) return;
    setAddress(a);
    if (!addr) setInput(a);
  };

  const eligible = data?.checks.filter(c => c.eligible) || [];
  const notEligible = data?.checks.filter(c => !c.eligible) || [];

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
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Airdrop Checker</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🎁</div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Airdrop Checker</h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>Check if your Tezos address holds tokens from 10 major Tezos protocols</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 400px" }}>
              <Search size={14} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter your Tezos address (tz1…)"
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "8px", color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,125,247,0.3)")} />
            </div>
            <button onClick={() => handleSearch()}
              style={{ padding: "0.75rem 1.5rem", background: "#22c55e", border: "none", borderRadius: "8px", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
              Check Eligibility
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem" }}>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>Try:</span>
            <button onClick={() => { setInput(EXAMPLE_ADDRESSES[0].address); handleSearch(EXAMPLE_ADDRESSES[0].address); }}
              style={{ padding: "0.2rem 0.7rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer" }}>
              {EXAMPLE_ADDRESSES[0].label}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "64px", borderRadius: "8px" }} />)}
          </div>
        )}

        {!isLoading && data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Summary */}
            <div style={{ background: "#05152e", border: `1px solid ${data.eligibleCount > 0 ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  {data.alias && <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff", marginBottom: "0.25rem" }}>{data.alias}</div>}
                  <code style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{data.address}</code>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(44,125,247,0.15)", color: "#2c7df7", border: "1px solid rgba(44,125,247,0.3)" }}>
                      {fmtXtz(data.xtzBalance)} XTZ
                    </span>
                    {data.isOldAccount && (
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(249,115,22,0.15)", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)" }}>
                        🏛️ OG Account (pre-2023)
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: data.eligibleCount > 0 ? "#22c55e" : "rgba(255,255,255,0.3)" }}>
                    {data.eligibleCount}/{data.checks.length}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>protocols found</div>
                </div>
              </div>
            </div>

            {/* Eligible tokens */}
            {eligible.length > 0 && (
              <div style={{ background: "#05152e", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(34,197,94,0.15)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <CheckCircle size={14} style={{ color: "#22c55e" }} />
                  <span style={{ fontWeight: 800, color: "#22c55e", fontSize: "0.88rem" }}>Tokens Found ({eligible.length})</span>
                </div>
                {eligible.map((check, i) => (
                  <div key={check.contract} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1.25rem", borderBottom: i < eligible.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", flexWrap: "wrap" }}>
                    {check.thumbnailUri ? (
                      <img src={check.thumbnailUri} alt="" style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>✓</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.88rem" }}>{check.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>{check.description}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontWeight: 800, color: "#22c55e", fontSize: "0.95rem" }}>
                        {check.balance >= 1000 ? `${(check.balance / 1000).toFixed(1)}K` : check.balance.toFixed(check.balance < 1 ? 4 : 2)} {check.symbol}
                      </div>
                      <a href={check.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.65rem", color: "#2c7df7", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                        Visit <ExternalLink size={9} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Not eligible tokens */}
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <XCircle size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                <span style={{ fontWeight: 800, color: "rgba(255,255,255,0.5)", fontSize: "0.88rem" }}>Not Found ({notEligible.length})</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0" }}>
                {notEligible.map((check, i) => (
                  <div key={check.contract} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.04)", borderRight: "1px solid rgba(255,255,255,0.04)", opacity: 0.5 }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0 }}>✗</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{check.name}</div>
                      <a href={check.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.62rem", color: "rgba(44,125,247,0.6)", textDecoration: "none" }}>
                        Get tokens →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
              This tool checks current token balances only. Past eligibility for completed airdrops cannot be verified retroactively. Data from TzKT API.
            </p>
          </div>
        )}

        {!address && !isLoading && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎁</div>
            <p style={{ fontSize: "0.9rem" }}>Enter your Tezos address above to check which protocol tokens you hold</p>
          </div>
        )}
      </div>
    </div>
  );
}
