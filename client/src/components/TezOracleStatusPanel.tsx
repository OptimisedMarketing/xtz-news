import React from "react";
import { CheckCircle2, CircleDashed, Clock3, ExternalLink, LockKeyhole } from "lucide-react";

export interface TezOracleStatusData {
  sourceUrl: string;
  architectureStatus: string;
  implementationStatus: string;
  testnetStatus: string;
  productionStatus: string;
  contractAddresses: Array<{ network: string; address: string; label?: string }>;
  sourceCheckedAt: Date | string;
}

const milestoneLabels = [
  ["Architecture", "architectureStatus"],
  ["Implementation", "implementationStatus"],
  ["Testnet", "testnetStatus"],
  ["Production", "productionStatus"],
] as const;

function statusColor(status: string) {
  if (status === "Defined") return "#63f7b1";
  if (status === "Next") return "#7cb4ff";
  if (status === "Planned") return "#c5a7ff";
  return "rgba(255,255,255,0.56)";
}

export default function TezOracleStatusPanel({ status }: { status?: TezOracleStatusData }) {
  const checkedAt = status?.sourceCheckedAt ? new Date(status.sourceCheckedAt) : undefined;
  const validCheckedAt = checkedAt && !Number.isNaN(checkedAt.getTime());
  const addresses = status?.contractAddresses ?? [];

  return (
    <section aria-labelledby="tezoracle-status-title" style={{ background: "linear-gradient(135deg, rgba(44,125,247,0.12), rgba(5,21,46,0.96))", border: "1px solid rgba(44,125,247,0.33)", borderRadius: "9px", padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: "1.1rem" }}>
        <div>
          <p style={{ color: "#7cb4ff", fontSize: "0.66rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.3rem" }}>Official source monitor</p>
          <h2 id="tezoracle-status-title" style={{ color: "#fff", fontSize: "1.08rem", fontWeight: 850, margin: 0 }}>TezOracle build status</h2>
        </div>
        <a href={status?.sourceUrl || "https://tezoracle.com/"} target="_blank" rel="nofollow noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "#7cb4ff", fontSize: "0.72rem", fontWeight: 800, textDecoration: "none" }}>
          Official project status <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>

      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", lineHeight: 1.55, margin: "0 0 1rem" }}>Updates are derived from TezOracle’s official published status. The panel never infers testnet availability or contract addresses.</p>

      <div aria-label="TezOracle development milestones" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.6rem" }}>
        {milestoneLabels.map(([label, key]) => {
          const value = status?.[key] || "Awaiting check";
          return <div key={key} style={{ padding: "0.7rem", borderRadius: "6px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ margin: "0 0 0.24rem", color: "rgba(255,255,255,0.45)", fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
            <p style={{ margin: 0, color: status ? statusColor(value) : "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.3rem" }}>{value === "Defined" ? <CheckCircle2 size={13} aria-hidden="true" /> : <CircleDashed size={13} aria-hidden="true" />}{value}</p>
          </div>;
        })}
      </div>

      <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <p style={{ margin: "0 0 0.5rem", color: "rgba(255,255,255,0.46)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>Published contract addresses</p>
        {addresses.length === 0 ? (
          <p style={{ margin: 0, color: "rgba(255,255,255,0.73)", fontSize: "0.8rem", lineHeight: 1.5, display: "flex", gap: "0.45rem", alignItems: "flex-start" }}><LockKeyhole size={15} aria-hidden="true" style={{ color: "#7cb4ff", flexShrink: 0, marginTop: "0.1rem" }} />No official testnet or production contract addresses have been published yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.45rem" }}>{addresses.map((address) => <div key={`${address.network}:${address.address}`} style={{ padding: "0.62rem 0.7rem", borderRadius: "5px", background: "rgba(0,0,0,0.18)", color: "rgba(255,255,255,0.78)", fontSize: "0.76rem" }}><strong style={{ color: "#7cb4ff" }}>{address.label || address.network}:</strong> <code style={{ wordBreak: "break-all" }}>{address.address}</code></div>)}</div>
        )}
      </div>

      <p aria-live="polite" style={{ margin: "1rem 0 0", color: "rgba(255,255,255,0.46)", fontSize: "0.68rem", display: "flex", alignItems: "center", gap: "0.35rem" }}><Clock3 size={13} aria-hidden="true" />{validCheckedAt ? `Last verified from the official source ${checkedAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}.` : "Daily source monitor awaiting its first verified check."}</p>
    </section>
  );
}
