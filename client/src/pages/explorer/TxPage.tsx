import { Link, useParams } from "wouter";
import { ArrowRightLeft, ChevronRight, Home, CheckCircle, XCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";

function shortHash(h: string, len = 10) { return h ? `${h.slice(0, len)}...${h.slice(-6)}` : ""; }

export default function TxPage() {
  const { hash } = useParams<{ hash: string }>();

  useSEO({
    title: `Transaction ${hash?.slice(0, 12)}... | Tezos Explorer — XTZ.News`,
    description: `Tezos transaction ${hash} details — sender, receiver, amount, fee, and status.`,
    canonical: `https://xtz.news/explorer/tx/${hash}`,
  });

  const { data: tx, isLoading, error } = trpc.explorer.transactionByHash.useQuery(
    { hash: hash || "" },
    { enabled: !!hash }
  );

  if (isLoading) return (
    <div className="container py-12">
      <div className="skeleton" style={{ height: "24px", width: "300px", marginBottom: "16px" }} />
      <div className="skeleton" style={{ height: "300px", borderRadius: "8px" }} />
    </div>
  );

  if (error || !tx) return (
    <div className="container py-12 text-center">
      <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "1.5rem", marginBottom: "0.5rem" }}>Transaction Not Found</h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>This transaction could not be found on the Tezos blockchain.</p>
      <Link href="/explorer" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>← Back to Explorer</Link>
    </div>
  );

  const details = [
    { label: "Hash", value: tx.hash, mono: true },
    { label: "Type", value: tx.type, mono: false },
    { label: "Status", value: tx.status, mono: false, isStatus: true },
    { label: "Timestamp", value: new Date(tx.timestamp).toLocaleString(), mono: false },
    { label: "Block", value: `#${tx.block.toLocaleString()}`, mono: false, link: `/explorer/block/${tx.block}` },
    { label: "From", value: tx.sender || tx.senderAddress, mono: true, link: `/explorer/address/${tx.senderAddress}` },
    { label: "To", value: tx.target || tx.targetAddress, mono: true, link: `/explorer/address/${tx.targetAddress}` },
    { label: "Amount", value: `${tx.amount.toFixed(6)} ꜩ`, mono: false },
    { label: "Fee", value: `${tx.fee.toFixed(6)} ꜩ`, mono: false },
    { label: "Gas Used", value: tx.gasUsed.toLocaleString(), mono: false },
    { label: "Storage Used", value: `${tx.storageUsed} bytes`, mono: false },
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
            <span style={{ color: "#fff" }}>Transaction</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(139,92,246,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowRightLeft size={20} style={{ color: "#8b5cf6" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", margin: 0 }}>Transaction</h1>
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", margin: 0, fontFamily: "monospace" }}>{shortHash(hash || "", 20)}</p>
            </div>
            {tx.status === "applied" ? (
              <CheckCircle size={20} style={{ color: "#22c55e", marginLeft: "auto" }} />
            ) : (
              <XCircle size={20} style={{ color: "#ef4444", marginLeft: "auto" }} />
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", overflow: "hidden", marginBottom: "2rem" }}>
          {details.map((d, i) => (
            <div key={d.label} style={{ display: "flex", padding: "0.75rem 1.25rem", borderBottom: i < details.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ width: "160px", flexShrink: 0, fontSize: "0.78rem", fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</div>
              <div style={{ flex: 1, fontSize: "0.85rem", color: "#fff", fontFamily: (d as any).mono ? "monospace" : "inherit", wordBreak: "break-all" }}>
                {(d as any).isStatus ? (
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 8px", borderRadius: "3px", background: d.value === "applied" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: d.value === "applied" ? "#22c55e" : "#ef4444" }}>
                    {d.value}
                  </span>
                ) : (d as any).link ? (
                  <Link href={(d as any).link} style={{ color: "#2c7df7", textDecoration: "none" }}>{d.value}</Link>
                ) : d.value}
              </div>
            </div>
          ))}
        </div>

        {tx.parameters && (
          <div>
            <h2 style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem" }}>Contract Parameters</h2>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "1rem" }}>
              <pre style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", margin: 0, overflow: "auto", maxHeight: "300px" }}>
                {JSON.stringify(tx.parameters, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
