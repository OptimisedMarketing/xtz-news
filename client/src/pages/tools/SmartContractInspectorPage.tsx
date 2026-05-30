import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Home, Search, ExternalLink, Copy, Code, Database, Zap, GitBranch } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

function fmtXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}K ꜩ`;
  return `${v.toFixed(4)} ꜩ`;
}
function timeAgo(ts: string | null | undefined) {
  if (!ts) return "—";
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const KNOWN_CONTRACTS = [
  { label: "QUIPU Token", address: "KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb" },
  { label: "QuipuSwap DEX", address: "KT1X3zxdTzPB9DgVzA3ad6dgZe9JEamoaeRy" },
  { label: "Tezos Domains", address: "KT1GBzLqjsp13K9JcKm65YZWTJsuuWMt4k7k" },
  { label: "kUSD", address: "KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV" },
];

function JsonViewer({ data, depth = 0 }: { data: any; depth?: number }) {
  const [collapsed, setCollapsed] = useState(depth > 1);
  if (data === null || data === undefined) return <span style={{ color: "rgba(255,255,255,0.3)" }}>null</span>;
  if (typeof data === "boolean") return <span style={{ color: "#f97316" }}>{String(data)}</span>;
  if (typeof data === "number") return <span style={{ color: "#22c55e" }}>{data}</span>;
  if (typeof data === "string") {
    const isAddress = data.startsWith("tz") || data.startsWith("KT");
    if (isAddress) return (
      <Link href={`/explorer/address/${data}`} style={{ color: "#2c7df7", textDecoration: "none", fontFamily: "monospace", fontSize: "0.78rem" }}>
        {data.length > 20 ? `${data.slice(0, 10)}…${data.slice(-6)}` : data}
      </Link>
    );
    return <span style={{ color: "#f59e0b" }}>"{data.length > 60 ? data.slice(0, 60) + "…" : data}"</span>;
  }
  if (Array.isArray(data)) {
    if (data.length === 0) return <span style={{ color: "rgba(255,255,255,0.3)" }}>[]</span>;
    return (
      <span>
        <button onClick={() => setCollapsed(c => !c)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", padding: "0 2px" }}>
          {collapsed ? "▶" : "▼"}
        </button>
        {collapsed ? <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem" }}>[{data.length} items]</span> : (
          <div style={{ paddingLeft: "1rem" }}>
            {data.map((item, i) => (
              <div key={i} style={{ marginBottom: "2px" }}>
                <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem" }}>{i}: </span>
                <JsonViewer data={item} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }
  if (typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.length === 0) return <span style={{ color: "rgba(255,255,255,0.3)" }}>{"{}"}</span>;
    return (
      <span>
        <button onClick={() => setCollapsed(c => !c)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", padding: "0 2px" }}>
          {collapsed ? "▶" : "▼"}
        </button>
        {collapsed ? <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem" }}>{"{"}…{"}"} ({keys.length} keys)</span> : (
          <div style={{ paddingLeft: "1rem" }}>
            {keys.map(key => (
              <div key={key} style={{ marginBottom: "2px" }}>
                <span style={{ color: "#8b5cf6", fontSize: "0.78rem" }}>{key}</span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>: </span>
                <JsonViewer data={data[key]} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }
  return <span style={{ color: "rgba(255,255,255,0.5)" }}>{String(data)}</span>;
}

export default function SmartContractInspectorPage() {
  const [input, setInput] = useState("");
  const [address, setAddress] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "storage" | "entrypoints" | "calls" | "similar">("overview");

  const { data, isLoading, error } = trpc.tools.contractInspect.useQuery(
    { address },
    { enabled: !!address, staleTime: 60_000 }
  );

  const handleSearch = (addr?: string) => {
    const a = (addr || input).trim();
    if (!a) return;
    setAddress(a);
    setActiveTab("overview");
    if (!addr) setInput(a);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  const tabs = data ? [
    { id: "overview" as const, label: "Overview" },
    { id: "storage" as const, label: "Storage" },
    { id: "entrypoints" as const, label: `Entrypoints (${data.entrypoints.length})` },
    { id: "calls" as const, label: `Recent Calls (${data.recentCalls.length})` },
    ...(data.similarContracts.length > 0 ? [{ id: "similar" as const, label: `Similar (${data.similarContracts.length})` }] : []),
  ] : [];

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
            <span style={{ color: "rgba(255,255,255,0.7)" }}>Smart Contract Inspector</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>📜</div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Smart Contract Inspector</h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>Inspect any Tezos smart contract — storage, entrypoints, recent calls, and similar contracts</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 400px" }}>
              <Search size={14} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter KT1 contract address…"
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "8px", color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "monospace" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,125,247,0.3)")} />
            </div>
            <button onClick={() => handleSearch()} style={{ padding: "0.75rem 1.5rem", background: "#8b5cf6", border: "none", borderRadius: "8px", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
              Inspect
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>Try:</span>
            {KNOWN_CONTRACTS.map(c => (
              <button key={c.address} onClick={() => { setInput(c.address); handleSearch(c.address); }}
                style={{ padding: "0.2rem 0.7rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer" }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
        {isLoading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[200, 300, 150].map((_, i) => <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "8px" }} />)}
          </div>
        )}

        {!isLoading && address && (data === null || error) && (
          <div style={{ textAlign: "center", padding: "3rem", background: "#05152e", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📜</div>
            <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.5rem" }}>Contract Not Found</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
              <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px" }}>{address}</code> is not a smart contract or doesn't exist.
            </p>
          </div>
        )}

        {!isLoading && data && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Contract header */}
            <div style={{ background: "#05152e", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  {data.alias && <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", marginBottom: "0.25rem" }}>{data.alias}</div>}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <code style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", fontFamily: "monospace" }}>{data.address}</code>
                    <button onClick={() => copy(data.address)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}><Copy size={11} /></button>
                    <a href={`https://tzkt.io/${data.address}`} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.3)", display: "flex" }}><ExternalLink size={11} /></a>
                  </div>
                  {data.creator && (
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.35rem" }}>
                      Created by: <Link href={`/explorer/address/${data.creatorAddress}`} style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 600 }}>{data.creator}</Link>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>Balance</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff" }}>{fmtXtz(data.balance)}</div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                {[
                  { label: "Total Calls", value: data.numTransactions.toLocaleString(), icon: "📞" },
                  { label: "Entrypoints", value: data.entrypoints.length.toString(), icon: "🔌" },
                  { label: "First Active", value: timeAgo(data.firstActivity), icon: "📅" },
                  { label: "Last Active", value: timeAgo(data.lastActivity), icon: "⏱️" },
                  { label: "Type Hash", value: data.typeHash?.toString() || "—", icon: "#" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "0.75rem" }}>
                    <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.3rem" }}>{s.icon} {s.label}</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: "0" }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ padding: "0.6rem 1rem", background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? "#8b5cf6" : "transparent"}`, color: activeTab === tab.id ? "#8b5cf6" : "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: "0.78rem", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Overview tab */}
            {activeTab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                {/* Top entrypoints */}
                <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Zap size={13} style={{ color: "#8b5cf6" }} />
                    <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.85rem" }}>Entrypoints</span>
                  </div>
                  {data.entrypoints.slice(0, 8).map((ep: any, i: number) => (
                    <div key={ep.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 1.25rem", borderBottom: i < Math.min(data.entrypoints.length, 8) - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <code style={{ fontSize: "0.8rem", color: "#8b5cf6", fontFamily: "monospace", fontWeight: 700 }}>{ep.name}</code>
                      {ep.callCount > 0 && (
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "1px 6px", borderRadius: "8px", background: "rgba(139,92,246,0.15)", color: "#8b5cf6" }}>
                          {ep.callCount} recent
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Recent callers */}
                <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Code size={13} style={{ color: "#2c7df7" }} />
                    <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.85rem" }}>Recent Callers</span>
                  </div>
                  {data.recentCalls.slice(0, 8).map((call: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 1.25rem", borderBottom: i < 7 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Link href={`/explorer/address/${call.senderAddress}`} style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2c7df7", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                          {call.sender || call.senderAddress.slice(0, 14) + "…"}
                        </Link>
                        <code style={{ fontSize: "0.62rem", color: "#8b5cf6" }}>{call.entrypoint}</code>
                      </div>
                      <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{timeAgo(call.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Storage tab */}
            {activeTab === "storage" && (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Database size={13} style={{ color: "#f97316" }} />
                  <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.85rem" }}>Current Storage</span>
                  <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>Click ▶/▼ to expand/collapse</span>
                </div>
                <div style={{ padding: "1.25rem", fontFamily: "monospace", fontSize: "0.78rem", lineHeight: 1.7, overflowX: "auto" }}>
                  {data.storage ? <JsonViewer data={data.storage} depth={0} /> : <span style={{ color: "rgba(255,255,255,0.3)" }}>No storage data available</span>}
                </div>
              </div>
            )}

            {/* Entrypoints tab */}
            {activeTab === "entrypoints" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {data.entrypoints.map((ep: any) => (
                  <div key={ep.name} style={{ background: "#05152e", border: "1px solid rgba(139,92,246,0.2)", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ padding: "0.875rem 1.25rem", borderBottom: ep.parameterSchema ? "1px solid rgba(255,255,255,0.06)" : "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <code style={{ fontSize: "0.9rem", fontWeight: 800, color: "#8b5cf6", fontFamily: "monospace" }}>{ep.name}</code>
                      {ep.callCount > 0 && (
                        <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: "8px", background: "rgba(139,92,246,0.15)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.25)" }}>
                          {ep.callCount} recent calls
                        </span>
                      )}
                    </div>
                    {ep.parameterSchema && (
                      <div style={{ padding: "0.875rem 1.25rem", fontFamily: "monospace", fontSize: "0.75rem", lineHeight: 1.6, overflowX: "auto" }}>
                        <JsonViewer data={ep.parameterSchema} depth={0} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Recent calls tab */}
            {activeTab === "calls" && (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Time", "Caller", "Entrypoint", "Amount", "Hash"].map(h => (
                          <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentCalls.map((call: any, i: number) => (
                        <tr key={i} style={{ borderBottom: i < data.recentCalls.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                          <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>{timeAgo(call.timestamp)}</td>
                          <td style={{ padding: "0.6rem 1rem" }}>
                            <Link href={`/explorer/address/${call.senderAddress}`} style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 600, fontSize: "0.75rem" }}>
                              {call.sender || call.senderAddress.slice(0, 12) + "…"}
                            </Link>
                          </td>
                          <td style={{ padding: "0.6rem 1rem" }}>
                            <code style={{ fontSize: "0.75rem", color: "#8b5cf6", fontFamily: "monospace" }}>{call.entrypoint}</code>
                          </td>
                          <td style={{ padding: "0.6rem 1rem", color: call.amount > 0 ? "#f97316" : "rgba(255,255,255,0.2)" }}>
                            {call.amount > 0 ? fmtXtz(call.amount) : "—"}
                          </td>
                          <td style={{ padding: "0.6rem 1rem" }}>
                            <a href={`https://tzkt.io/${call.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.3)", display: "inline-flex", alignItems: "center", gap: "0.2rem", fontSize: "0.7rem" }}>
                              {call.hash.slice(0, 10)}… <ExternalLink size={9} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Similar contracts tab */}
            {activeTab === "similar" && data.similarContracts.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {data.similarContracts.map((c: any) => (
                  <div key={c.address} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {c.alias && <div style={{ fontWeight: 700, color: "#fff", marginBottom: "0.2rem" }}>{c.alias}</div>}
                      <button onClick={() => { setInput(c.address); handleSearch(c.address); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#2c7df7", fontFamily: "monospace", fontSize: "0.75rem", padding: 0, textAlign: "left" }}>
                        {c.address}
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", flexShrink: 0 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Balance</div>
                        <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.85rem" }}>{fmtXtz(c.balance)}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Calls</div>
                        <div style={{ fontWeight: 700, color: "#2c7df7", fontSize: "0.85rem" }}>{c.numTransactions.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!address && !isLoading && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📜</div>
            <p style={{ fontSize: "0.9rem" }}>Enter a KT1 contract address above to inspect it</p>
            <p style={{ fontSize: "0.78rem", marginTop: "0.5rem", color: "rgba(255,255,255,0.2)" }}>View storage, entrypoints, recent calls, and similar contracts</p>
          </div>
        )}
      </div>
    </div>
  );
}
