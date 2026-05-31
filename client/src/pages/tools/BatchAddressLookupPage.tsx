import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ChevronRight, Home, Download, Copy, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO, buildToolSchema } from "@/hooks/useSEO";
import { toast } from "sonner";

function fmtXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}K`;
  return v.toFixed(4);
}

export default function BatchAddressLookupPage() {
  useSEO({
    title: "Tezos Batch Address Lookup — Check 100 Wallets at Once | XTZ.News",
    description: "Paste up to 100 Tezos addresses and get XTZ balance, staking, delegation, and activity for each. Export to CSV. Perfect for DAOs and event organisers.",
    keywords: "Tezos batch lookup, XTZ bulk address check, Tezos DAO tools, Tezos airdrop distribution",
    canonical: "https://xtz.news/tools/batch-lookup",
    jsonLd: buildToolSchema({ name: "Tezos Batch Address Lookup", description: "Paste up to 100 Tezos addresses and get XTZ balance, staking, delegation, and activity for each. Export to CSV. Perfect for DAOs and event organisers.", url: "https://xtz.news/tools/batch-lookup" }),
  });

  const [textInput, setTextInput] = useState("");
  const [addresses, setAddresses] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<"input" | "balance" | "staked" | "txs">("balance");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState("");

  const { data = [], isLoading } = trpc.tools.batchAddressLookup.useQuery(
    { addresses },
    { enabled: addresses.length > 0, staleTime: 60_000 }
  );

  const handleLookup = () => {
    const lines = textInput
      .split(/[\n,\s]+/)
      .map(l => l.trim())
      .filter(l => l.startsWith("tz") || l.startsWith("KT"));
    if (!lines.length) { toast.error("No valid Tezos addresses found."); return; }
    if (lines.length > 100) { toast.error("Maximum 100 addresses at once."); return; }
    setAddresses(lines);
  };

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = useMemo(() => {
    const filtered = (data as any[]).filter(r =>
      !filter || r.address.includes(filter) || (r.alias || "").toLowerCase().includes(filter.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
      const dir = sortDir === "desc" ? -1 : 1;
      if (sortKey === "balance") return dir * (a.balance - b.balance);
      if (sortKey === "staked") return dir * (a.stakedBalance - b.stakedBalance);
      if (sortKey === "txs") return dir * (a.numTransactions - b.numTransactions);
      return 0;
    });
  }, [data, sortKey, sortDir, filter]);

  const totalXtz = (data as any[]).reduce((s, r) => s + r.balance, 0);
  const totalStaked = (data as any[]).reduce((s, r) => s + r.stakedBalance, 0);
  const found = (data as any[]).filter(r => r.found).length;

  const exportCSV = () => {
    const header = "Address,Alias,Balance (XTZ),Staked (XTZ),Delegated To,Type,Transactions,First Active,Last Active";
    const rows = (data as any[]).map(r =>
      `"${r.address}","${r.alias || ""}","${r.balance.toFixed(6)}","${r.stakedBalance.toFixed(6)}","${r.delegatedTo || ""}","${r.type}","${r.numTransactions}","${r.firstActivity || ""}","${r.lastActivity || ""}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tezos_batch_lookup_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  };

  const copySummary = () => {
    const lines = (data as any[]).map(r => `${r.address}: ${fmtXtz(r.balance)} XTZ${r.alias ? ` (${r.alias})` : ""}`);
    navigator.clipboard.writeText(lines.join("\n"));
    toast.success("Summary copied!");
  };

  const SortTh = ({ label, field }: { label: string; field: typeof sortKey }) => (
    <th onClick={() => handleSort(field)} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: sortKey === field ? "#2c7df7" : "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap", cursor: "pointer", userSelect: "none" }}>
      {label} {sortKey === field ? (sortDir === "desc" ? "↓" : "↑") : ""}
    </th>
  );

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
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Batch Address Lookup</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📋</div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Batch Address Lookup</h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>Paste up to 100 Tezos addresses — get XTZ balance, delegation, and activity for each. Export to CSV.</p>
            </div>
          </div>

          {/* Text area input */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "300px" }}>
              <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)}
                placeholder={"Paste addresses here — one per line, or comma/space separated:\ntz1abc...\ntz1def...\nKT1xyz..."}
                rows={5}
                style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "8px", color: "#fff", fontSize: "0.82rem", outline: "none", fontFamily: "monospace", resize: "vertical", transition: "border-color 0.15s" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,125,247,0.3)")} />
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", marginTop: "0.3rem" }}>
                {textInput.split(/[\n,\s]+/).filter(l => l.startsWith("tz") || l.startsWith("KT")).length} valid addresses detected
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", justifyContent: "flex-start" }}>
              <button onClick={handleLookup}
                style={{ padding: "0.75rem 1.5rem", background: "#f97316", border: "none", borderRadius: "8px", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Lookup All
              </button>
              {data.length > 0 && (
                <>
                  <button onClick={exportCSV}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "8px", color: "#22c55e", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
                    <Download size={13} /> Export CSV
                  </button>
                  <button onClick={copySummary}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "rgba(255,255,255,0.6)", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
                    <Copy size={13} /> Copy Summary
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "48px", borderRadius: "6px" }} />)}
          </div>
        )}

        {!isLoading && data.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Summary stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" }}>
              {[
                { label: "Addresses Found", value: `${found}/${addresses.length}`, color: "#2c7df7" },
                { label: "Total XTZ", value: `${fmtXtz(totalXtz)} ꜩ`, color: "#fff" },
                { label: "Total Staked", value: `${fmtXtz(totalStaked)} ꜩ`, color: "#f97316" },
                { label: "Delegating", value: `${(data as any[]).filter(r => r.delegatedTo).length}`, color: "#22c55e" },
              ].map(s => (
                <div key={s.label} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "0.875rem 1rem" }}>
                  <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.3rem" }}>{s.label}</div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Filter + table */}
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ position: "relative", flex: 1, maxWidth: "300px" }}>
                  <Search size={12} style={{ position: "absolute", left: "0.6rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                  <input value={filter} onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter by address or alias…"
                    style={{ width: "100%", padding: "0.4rem 0.75rem 0.4rem 2rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", color: "#fff", fontSize: "0.78rem", outline: "none", fontFamily: "inherit" }} />
                </div>
                <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>{sorted.length} results</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <th style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>#</th>
                      <th style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>Address</th>
                      <SortTh label="Balance (XTZ)" field="balance" />
                      <SortTh label="Staked" field="staked" />
                      <th style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>Delegation</th>
                      <SortTh label="Txs" field="txs" />
                      <th style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((r: any, i: number) => (
                      <tr key={r.address} style={{ borderBottom: i < sorted.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: !r.found ? "rgba(239,68,68,0.04)" : "transparent" }}>
                        <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.25)", fontSize: "0.65rem" }}>{i + 1}</td>
                        <td style={{ padding: "0.6rem 1rem" }}>
                          <div>
                            {r.alias && <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.82rem" }}>{r.alias}</div>}
                            <Link href={`/tools/wallet?address=${r.address}`} style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#2c7df7", textDecoration: "none" }}>
                              {r.address.slice(0, 14)}…
                            </Link>
                          </div>
                        </td>
                        <td style={{ padding: "0.6rem 1rem", fontWeight: 700, color: r.found ? "#fff" : "rgba(255,255,255,0.2)" }}>
                          {r.found ? `${fmtXtz(r.balance)} ꜩ` : "—"}
                        </td>
                        <td style={{ padding: "0.6rem 1rem", color: r.stakedBalance > 0 ? "#f97316" : "rgba(255,255,255,0.2)" }}>
                          {r.stakedBalance > 0 ? `${fmtXtz(r.stakedBalance)} ꜩ` : "—"}
                        </td>
                        <td style={{ padding: "0.6rem 1rem", color: r.delegatedTo ? "#22c55e" : "rgba(255,255,255,0.2)", fontSize: "0.72rem", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.delegatedTo || "—"}
                        </td>
                        <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.5)" }}>
                          {r.found ? r.numTransactions.toLocaleString() : "—"}
                        </td>
                        <td style={{ padding: "0.6rem 1rem" }}>
                          {r.found ? (
                            <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "1px 6px", borderRadius: "8px", background: "rgba(34,197,94,0.15)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.25)" }}>Found</span>
                          ) : (
                            <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "1px 6px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>Not found</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {!addresses.length && !isLoading && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
            <p style={{ fontSize: "0.9rem" }}>Paste up to 100 Tezos addresses above and click Lookup All</p>
            <p style={{ fontSize: "0.78rem", marginTop: "0.5rem", color: "rgba(255,255,255,0.2)" }}>Useful for event organisers, DAOs, and airdrop distributors</p>
          </div>
        )}
      </div>
    </div>
  );
}
