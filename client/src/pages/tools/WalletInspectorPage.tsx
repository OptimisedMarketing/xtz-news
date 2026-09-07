import { useState } from "react";
import { Link } from "wouter";
import { Search, Copy, ExternalLink, ChevronRight, Home, ArrowUpRight, ArrowDownLeft, Shield, Coins } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ToolBreadcrumb from "@/components/ToolBreadcrumb";
import { TezosResourceLinks } from "@/components/TezosResourceLinks";
import { useSEO, buildToolSchema, buildFAQSchema } from "@/hooks/useSEO";
import { toast } from "sonner";

function fmtXtz(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M ꜩ`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(2)}K ꜩ`;
  return `${v.toFixed(4)} ꜩ`;
}
function fmtTime(ts: string | null | undefined) {
  if (!ts) return "—";
  const d = new Date(ts);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function fmtToken(balance: string, decimals: number) {
  const n = parseFloat(balance) / Math.pow(10, decimals);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toFixed(decimals > 0 ? 2 : 0);
}

const EXAMPLE_ADDRESSES = [
  { label: "Coinbase Baker", address: "tz1irJKkXS2DBWkU1NnmFQx1c1L7pbGg4yhk" },
  { label: "Tezos Foundation", address: "tz3bTdwZinP8U1JmSweNzVKhmwafqWmFWRfk" },
];

export default function WalletInspectorPage() {
  useSEO({
    title: "Tezos Wallet Inspector — Check Any XTZ Address | XTZ.News",
    description: "Inspect any Tezos wallet address: view XTZ balance, FA2 tokens, NFT count, delegation status, staking rewards, and recent transactions. Free, no login required.",
    keywords: "Tezos wallet inspector, XTZ wallet checker, Tezos address lookup, Tezos balance checker, tz1 address",
    canonical: "https://xtz.news/tools/wallet",
    jsonLd: [
      buildToolSchema({ name: "Tezos Wallet Inspector", description: "Inspect any Tezos wallet address: view XTZ balance, FA2 tokens, NFT count, delegation status, staking rewards, and recent transactions. Free, no login required.", url: "https://xtz.news/tools/wallet" }),
      buildFAQSchema([
        { question: "How do I check a Tezos wallet balance?", answer: "Enter any Tezos address (tz1, tz2, tz3, or KT1) in the XTZ.News Wallet Inspector. It instantly shows the XTZ balance, staked XTZ, FA2 token holdings, NFT count, delegation status, and recent transactions. No login or wallet connection required." },
        { question: "What information can I see about a Tezos address?", answer: "The Tezos Wallet Inspector shows: XTZ balance, staked and unstaked balances, all FA2 fungible tokens, NFT count (with link to NFT Gallery), delegation status and baker, number of transactions, first and last activity dates, and the last 10 transactions." },
        { question: "Can I check any Tezos address without connecting my wallet?", answer: "Yes. The XTZ.News Wallet Inspector is completely read-only and requires no wallet connection. Simply paste any Tezos address (tz1, tz2, tz3, or KT1) and click Inspect to view all public on-chain data." },
        { question: "What is a tz1 address on Tezos?", answer: "A tz1 address is a standard Tezos account address derived from an Ed25519 public key. Most Tezos wallets (Temple, Kukai, Ledger) use tz1 addresses. There are also tz2 (secp256k1) and tz3 (P-256) addresses, and KT1 addresses for smart contracts." },
      ]),
    ],
  });

  const [input, setInput] = useState("");
  const [address, setAddress] = useState("");

  const { data: wallet, isLoading, error } = trpc.tools.walletInspect.useQuery(
    { address },
    { enabled: !!address, staleTime: 60_000 }
  );

  const handleSearch = (addr?: string) => {
    const a = (addr || input).trim();
    if (!a) return;
    setAddress(a);
    if (!addr) setInput(a);
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2rem 0" }}>
        <div className="container">
          <ToolBreadcrumb items={[{ label: "Tools", href: "/tools" }, { label: "Wallet Inspector" }]} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(44,125,247,0.2)", border: "1px solid rgba(44,125,247,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🔍</div>
            <div>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fff", margin: 0 }}>Wallet Inspector</h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>Enter any Tezos address to inspect balance, tokens, NFTs, delegation, and transactions</p>
            </div>
          </div>

          {/* Search */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 400px" }}>
              <Search size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter tz1, tz2, tz3, or KT1 address…"
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "8px", color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(44,125,247,0.3)")}
              />
            </div>
            <button onClick={() => handleSearch()}
              style={{ padding: "0.75rem 1.5rem", background: "#2c7df7", border: "none", borderRadius: "8px", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", transition: "background 0.15s", fontFamily: "inherit" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a6ae0")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2c7df7")}>
              Inspect
            </button>
          </div>

          {/* Example addresses */}
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
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[200, 300, 150, 250].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "8px" }} />
            ))}
          </div>
        )}

        {/* Not found */}
        {!isLoading && address && (wallet === null || error) && (
          <div style={{ textAlign: "center", padding: "3rem", background: "#05152e", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔍</div>
            <h2 style={{ color: "#fff", fontWeight: 800, marginBottom: "0.5rem" }}>Address Not Found</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
              <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.8rem" }}>{address}</code> doesn't exist or has no activity on Tezos.
            </p>
          </div>
        )}

        {/* Results */}
        {!isLoading && wallet && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Identity card */}
            <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  {wallet.alias && <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", marginBottom: "0.25rem" }}>{wallet.alias}</div>}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <code style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{wallet.address}</code>
                    <button onClick={() => copy(wallet.address, "Address")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex", padding: "2px" }}>
                      <Copy size={12} />
                    </button>
                    <a href={`https://tzkt.io/${wallet.address}`} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.3)", display: "flex" }}>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(44,125,247,0.15)", color: "#2c7df7", border: "1px solid rgba(44,125,247,0.3)", textTransform: "capitalize" }}>
                      {wallet.isBaker ? "🏦 Baker" : wallet.type}
                    </span>
                    {wallet.delegatedTo && (
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>
                        ✓ Delegating
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>XTZ Balance</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff" }}>{fmtXtz(wallet.balance)}</div>
                  {wallet.stakedBalance > 0 && (
                    <div style={{ fontSize: "0.75rem", color: "#f97316", marginTop: "0.2rem" }}>+ {fmtXtz(wallet.stakedBalance)} staked</div>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem", marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                {[
                  { label: "Transactions", value: wallet.numTransactions.toLocaleString(), icon: "↔️" },
                  { label: "FA2 Tokens", value: wallet.fungibleTokens.length.toString(), icon: "🪙" },
                  { label: "NFTs", value: wallet.nftCount.toString(), icon: "🖼️" },
                  ...(wallet.isBaker ? [{ label: "Delegators", value: wallet.numDelegators.toLocaleString(), icon: "👥" }] : []),
                  ...(wallet.delegatedTo ? [{ label: "Delegated To", value: wallet.delegatedTo.slice(0, 12) + "…", icon: "🔗" }] : []),
                  { label: "First Active", value: fmtTime(wallet.firstActivity), icon: "📅" },
                  { label: "Last Active", value: fmtTime(wallet.lastActivity), icon: "⏱️" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "0.75rem" }}>
                    <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.3rem" }}>{s.icon} {s.label}</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#fff" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-column: tokens + transactions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

              {/* FA2 Tokens */}
              {wallet.fungibleTokens.length > 0 && (
                <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Coins size={14} style={{ color: "#f97316" }} />
                    <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>FA2 Tokens</span>
                    <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>{wallet.fungibleTokens.length} tokens</span>
                  </div>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {wallet.fungibleTokens.map((tok: any, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderBottom: i < wallet.fungibleTokens.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        {tok.thumbnailUri ? (
                          <img src={tok.thumbnailUri} alt="" style={{ width: "28px", height: "28px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", flexShrink: 0 }}>🪙</div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tok.name}</div>
                          {tok.symbol && <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.35)" }}>{tok.symbol}</div>}
                        </div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#f97316", flexShrink: 0 }}>
                          {fmtToken(tok.balance, tok.decimals)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Transactions */}
              {wallet.recentTxs.length > 0 && (
                <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>Recent Transactions</span>
                    <a href={`https://tzkt.io/${wallet.address}/operations`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", color: "#2c7df7", fontSize: "0.7rem", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                      View all <ExternalLink size={10} />
                    </a>
                  </div>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {wallet.recentTxs.map((tx: any, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderBottom: i < wallet.recentTxs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: tx.type === "in" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {tx.type === "in" ? <ArrowDownLeft size={13} style={{ color: "#22c55e" }} /> : <ArrowUpRight size={13} style={{ color: "#ef4444" }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: tx.type === "in" ? "#22c55e" : "#ef4444" }}>
                            {tx.type === "in" ? "+" : "-"}{fmtXtz(tx.amount)}
                          </div>
                          <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {tx.type === "in" ? "from" : "to"} {tx.counterparty.slice(0, 20)}{tx.counterparty.length > 20 ? "…" : ""}
                          </div>
                        </div>
                        <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{fmtTime(tx.timestamp)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Delegation rewards */}
            {wallet.rewardCycles.length > 0 && (
              <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem" }}>Delegation Rewards</span>
                  <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>
                    Total: <span style={{ color: "#22c55e", fontWeight: 700 }}>{fmtXtz(wallet.totalDelegationRewards)}</span>
                  </span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Cycle", "Balance", "Expected Rewards", "Extra Rewards"].map(h => (
                          <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {wallet.rewardCycles.map((c: any, i: number) => (
                        <tr key={c.cycle} style={{ borderBottom: i < wallet.rewardCycles.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                          <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{c.cycle}</td>
                          <td style={{ padding: "0.6rem 1rem", color: "#fff", fontWeight: 600 }}>{fmtXtz(c.balance)}</td>
                          <td style={{ padding: "0.6rem 1rem", color: "#22c55e", fontWeight: 700 }}>+{fmtXtz(c.expectedRewards)}</td>
                          <td style={{ padding: "0.6rem 1rem", color: "#f97316" }}>{c.extraRewards > 0 ? `+${fmtXtz(c.extraRewards)}` : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quick links */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <a href={`https://tzkt.io/${wallet.address}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700 }}>
                <ExternalLink size={12} /> View on TzKT
              </a>
              <Link href={`/explorer/address/${wallet.address}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", background: "rgba(44,125,247,0.1)", border: "1px solid rgba(44,125,247,0.25)", borderRadius: "6px", color: "#2c7df7", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700 }}>
                View in XTZ Explorer →
              </Link>
              {wallet.nftCount > 0 && (
                <Link href={`/tools/nft-gallery?address=${wallet.address}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: "6px", color: "#8b5cf6", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700 }}>
                  🖼️ View NFT Gallery →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!address && !isLoading && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p style={{ fontSize: "0.9rem" }}>Enter a Tezos address above to inspect it</p>
          </div>
        )}
        <TezosResourceLinks context="wallet" />
      </div>
    </div>
  );
}
