import { Link, useParams } from "wouter";
import { User, ChevronRight, Home, ArrowRightLeft, Shield, Copy } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
import { toast } from "sonner";

function shortHash(h: string, len = 10) { return h ? `${h.slice(0, len)}...${h.slice(-6)}` : ""; }
function timeAgo(ts: string | null | undefined) {
  if (!ts) return "—";
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}

export default function AddressPage() {
  const { address } = useParams<{ address: string }>();

  useSEO({
    title: `Address ${address?.slice(0, 12)}... | Tezos Explorer — XTZ.News`,
    description: `Tezos address ${address} — balance, transactions, delegation, and activity.`,
    canonical: `https://xtz.news/explorer/address/${address}`,
  });

  const { data: account, isLoading, error } = trpc.explorer.accountByAddress.useQuery(
    { address: address || "" },
    { enabled: !!address }
  );

  const copyAddress = () => {
    navigator.clipboard.writeText(address || "");
    toast.success("Address copied!");
  };

  if (isLoading) return (
    <div className="container py-12">
      <div className="skeleton" style={{ height: "24px", width: "300px", marginBottom: "16px" }} />
      <div className="skeleton" style={{ height: "200px", borderRadius: "8px", marginBottom: "16px" }} />
      <div className="skeleton" style={{ height: "300px", borderRadius: "8px" }} />
    </div>
  );

  if (error || !account) return (
    <div className="container py-12 text-center">
      <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "1.5rem", marginBottom: "0.5rem" }}>Address Not Found</h1>
      <Link href="/explorer" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>← Back to Explorer</Link>
    </div>
  );

  const isBaker = account.type === "delegate";

  const details = [
    { label: "Address", value: account.address, mono: true, copy: true },
    ...(account.alias ? [{ label: "Alias", value: account.alias, mono: false }] : []),
    { label: "Type", value: account.type, mono: false },
    { label: "Balance", value: `${account.balance.toFixed(6)} ꜩ`, mono: false },
    ...(account.stakedBalance > 0 ? [{ label: "Staked", value: `${account.stakedBalance.toFixed(6)} ꜩ`, mono: false }] : []),
    ...(account.delegate ? [{ label: "Delegated To", value: account.delegate, mono: false, link: `/explorer/address/${account.delegateAddress}` }] : []),
    { label: "Transactions", value: account.numTransactions.toLocaleString(), mono: false },
    ...(isBaker ? [
      { label: "Delegators", value: account.numDelegators.toLocaleString(), mono: false },
      { label: "Staking Balance", value: `${account.stakingBalance.toFixed(2)} ꜩ`, mono: false },
    ] : []),
    { label: "First Activity", value: timeAgo(account.firstActivity), mono: false },
    { label: "Last Activity", value: timeAgo(account.lastActivity), mono: false },
  ];

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2rem 0" }}>
        <div className="container">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}><Home size={12} /></Link>
            <ChevronRight size={10} />
            <Link href="/explorer" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Explorer</Link>
            <ChevronRight size={10} />
            <span style={{ color: "#fff" }}>Address</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "40px", height: "40px", background: isBaker ? "rgba(249,115,22,0.2)" : "rgba(44,125,247,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isBaker ? <Shield size={20} style={{ color: "#f97316" }} /> : <User size={20} style={{ color: "#2c7df7" }} />}
            </div>
            <div>
              <h1 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", margin: 0 }}>
                {account.alias || (isBaker ? "Baker" : "Account")}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", margin: 0, fontFamily: "monospace" }}>{shortHash(account.address, 16)}</p>
                <button onClick={copyAddress} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center" }}>
                  <Copy size={11} />
                </button>
              </div>
            </div>
            {isBaker && (
              <span style={{ marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700, padding: "3px 8px", borderRadius: "3px", background: "rgba(249,115,22,0.15)", color: "#f97316", textTransform: "uppercase", letterSpacing: "0.08em" }}>Baker</span>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        {/* Balance cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
          {[
            { label: "Balance", value: `${account.balance.toFixed(2)} ꜩ`, color: "#2c7df7" },
            { label: "Staked", value: `${account.stakedBalance.toFixed(2)} ꜩ`, color: "#8b5cf6" },
            { label: "Transactions", value: account.numTransactions.toLocaleString(), color: "#f59e0b" },
            ...(isBaker ? [{ label: "Delegators", value: account.numDelegators.toLocaleString(), color: "#f97316" }] : []),
          ].map(c => (
            <div key={c.label} style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", padding: "1rem" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>{c.label}</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 900, color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Details */}
        <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden", marginBottom: "2rem" }}>
          {details.map((d: any, i: number) => (
            <div key={d.label} style={{ display: "flex", padding: "0.75rem 1.25rem", borderBottom: i < details.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ width: "160px", flexShrink: 0, fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</div>
              <div style={{ flex: 1, fontSize: "0.85rem", color: "#fff", fontFamily: d.mono ? "monospace" : "inherit", wordBreak: "break-all", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                {d.link ? (
                  <Link href={d.link} style={{ color: "#2c7df7", textDecoration: "none" }}>{d.value}</Link>
                ) : d.value}
                {d.copy && (
                  <button onClick={copyAddress} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center" }}>
                    <Copy size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recent transactions */}
        {account.transactions && account.transactions.length > 0 && (
          <div>
            <h2 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ArrowRightLeft size={14} style={{ color: "#8b5cf6" }} /> Recent Transactions
            </h2>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      {["Hash", "From", "To", "Amount", "Status", "Time"].map(h => (
                        <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(account.transactions as any[]).map((op: any, i: number) => (
                      <tr key={op.hash + i} style={{ borderBottom: i < account.transactions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <td style={{ padding: "0.6rem 1rem" }}>
                          <Link href={`/explorer/tx/${op.hash}`} style={{ color: "#8b5cf6", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem" }}>{shortHash(op.hash)}</Link>
                        </td>
                        <td style={{ padding: "0.6rem 1rem" }}>
                          <Link href={`/explorer/address/${op.senderAddress}`} style={{ color: op.senderAddress === address ? "#fff" : "#2c7df7", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem", fontWeight: op.senderAddress === address ? 700 : 400 }}>{op.sender || shortHash(op.senderAddress)}</Link>
                        </td>
                        <td style={{ padding: "0.6rem 1rem" }}>
                          <Link href={`/explorer/address/${op.targetAddress}`} style={{ color: op.targetAddress === address ? "#fff" : "#2c7df7", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem", fontWeight: op.targetAddress === address ? 700 : 400 }}>{op.target || shortHash(op.targetAddress)}</Link>
                        </td>
                        <td style={{ padding: "0.6rem 1rem", color: op.senderAddress === address ? "#ef4444" : "#22c55e", fontWeight: 700 }}>
                          {op.senderAddress === address ? "-" : "+"}{op.amount.toFixed(4)} ꜩ
                        </td>
                        <td style={{ padding: "0.6rem 1rem" }}>
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", background: op.status === "applied" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: op.status === "applied" ? "#22c55e" : "#ef4444" }}>{op.status}</span>
                        </td>
                        <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}>{timeAgo(op.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
