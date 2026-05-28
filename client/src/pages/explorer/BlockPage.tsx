import { Link, useParams } from "wouter";
import { Layers, ChevronRight, Home, ArrowRightLeft, Clock, Shield, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";

function mutezLabel(v: number) { return `${v.toFixed(4)} ꜩ`; }
function timeAgo(ts: string) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return new Date(ts).toLocaleString();
}
function shortHash(h: string, len = 10) { return h ? `${h.slice(0, len)}...${h.slice(-6)}` : ""; }

export default function BlockPage() {
  const { id } = useParams<{ id: string }>();
  const isHash = id?.startsWith("B");

  useSEO({
    title: `Block ${id} | Tezos Explorer — XTZ.News`,
    description: `Tezos block ${id} details — baker, transactions, fees, rewards, and operations.`,
    canonical: `https://xtz.news/explorer/block/${id}`,
  });

  const { data: block, isLoading, error } = isHash
    ? trpc.explorer.blockByHash.useQuery({ hash: id || "" }, { enabled: !!id })
    : trpc.explorer.blockByLevel.useQuery({ level: parseInt(id || "0") }, { enabled: !!id && !isNaN(parseInt(id || "")) });

  if (isLoading) return (
    <div className="container py-12">
      <div className="skeleton" style={{ height: "24px", width: "300px", marginBottom: "16px" }} />
      <div className="skeleton" style={{ height: "200px", borderRadius: "8px", marginBottom: "16px" }} />
      <div className="skeleton" style={{ height: "300px", borderRadius: "8px" }} />
    </div>
  );

  if (error || !block) return (
    <div className="container py-12 text-center">
      <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "1.5rem", marginBottom: "0.5rem" }}>Block Not Found</h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>Block {id} could not be found on the Tezos blockchain.</p>
      <Link href="/explorer" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>← Back to Explorer</Link>
    </div>
  );

  const details = [
    { label: "Block Level", value: block.level.toLocaleString(), mono: false },
    { label: "Hash", value: block.hash, mono: true, truncate: true },
    { label: "Timestamp", value: `${new Date(block.timestamp).toLocaleString()} (${timeAgo(block.timestamp)})`, mono: false },
    { label: "Baker", value: block.baker, mono: false, link: `/explorer/address/${block.bakerAddress}` },
    { label: "Cycle", value: block.cycle.toLocaleString(), mono: false },
    { label: "Protocol", value: `v${block.proto}`, mono: false },
    { label: "Transactions", value: block.transactions.toLocaleString(), mono: false },
    { label: "Fees", value: mutezLabel(block.fees), mono: false },
    { label: "Reward", value: mutezLabel(block.reward), mono: false },
    { label: "Attestations", value: `${block.validations.toLocaleString()} / 7,000`, mono: false },
  ];

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
            <span style={{ color: "#fff" }}>Block {block.level.toLocaleString()}</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(44,125,247,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layers size={20} style={{ color: "#2c7df7" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: 0 }}>Block #{block.level.toLocaleString()}</h1>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", margin: 0, fontFamily: "monospace" }}>{shortHash(block.hash, 16)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        {/* Details table */}
        <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden", marginBottom: "2rem" }}>
          {details.map((d, i) => (
            <div key={d.label} style={{ display: "flex", padding: "0.75rem 1.25rem", borderBottom: i < details.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ width: "160px", flexShrink: 0, fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</div>
              <div style={{ flex: 1, fontSize: "0.85rem", color: "#fff", fontFamily: d.mono ? "monospace" : "inherit", wordBreak: "break-all" }}>
                {d.link ? (
                  <Link href={d.link} style={{ color: "#2c7df7", textDecoration: "none" }}>{d.value}</Link>
                ) : d.value}
              </div>
            </div>
          ))}
        </div>

        {/* Operations */}
        {block.operations && block.operations.length > 0 && (
          <div>
            <h2 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ArrowRightLeft size={14} style={{ color: "#8b5cf6" }} /> Transactions ({block.operations.length})
            </h2>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      {["Hash", "From", "To", "Amount", "Fee", "Status"].map(h => (
                        <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontWeight: 700, color: "rgba(255,255,255,0.4)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(block.operations as any[]).map((op: any, i: number) => (
                      <tr key={op.hash + i} style={{ borderBottom: i < block.operations.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <td style={{ padding: "0.6rem 1rem" }}>
                          <Link href={`/explorer/tx/${op.hash}`} style={{ color: "#8b5cf6", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem" }}>{shortHash(op.hash)}</Link>
                        </td>
                        <td style={{ padding: "0.6rem 1rem" }}>
                          <Link href={`/explorer/address/${op.senderAddress}`} style={{ color: "#2c7df7", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem" }}>{op.sender || shortHash(op.senderAddress)}</Link>
                        </td>
                        <td style={{ padding: "0.6rem 1rem" }}>
                          <Link href={`/explorer/address/${op.targetAddress}`} style={{ color: "#2c7df7", textDecoration: "none", fontFamily: "monospace", fontSize: "0.72rem" }}>{op.target || shortHash(op.targetAddress)}</Link>
                        </td>
                        <td style={{ padding: "0.6rem 1rem", color: "#fff", fontWeight: 600 }}>{op.amount.toFixed(4)} ꜩ</td>
                        <td style={{ padding: "0.6rem 1rem", color: "rgba(255,255,255,0.5)" }}>{op.fee.toFixed(6)} ꜩ</td>
                        <td style={{ padding: "0.6rem 1rem" }}>
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", background: op.status === "applied" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: op.status === "applied" ? "#22c55e" : "#ef4444" }}>
                            {op.status}
                          </span>
                        </td>
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
