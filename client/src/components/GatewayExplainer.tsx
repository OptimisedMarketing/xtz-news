import { ArrowRightLeft, Boxes, Braces, CircleDot, ShieldCheck } from "lucide-react";
import React, { useState } from "react";

type GatewayFlow = "evm" | "michelson";

const flowDetails: Record<GatewayFlow, { label: string; source: string; gateway: string; destination: string; summary: string; address: string }> = {
  evm: {
    label: "EVM → Michelson",
    source: "EVM account or contract",
    gateway: "EVM precompile gateway",
    destination: "Michelson runtime",
    address: "0xfF00000000000000000000000000000000007",
    summary: "Calling the EVM precompile assigns a KT1 address on the Michelson runtime, creating an atomic cross-interface path.",
  },
  michelson: {
    label: "Michelson → EVM",
    source: "Tezos account or Michelson contract",
    gateway: "Michelson native gateway",
    destination: "EVM runtime",
    address: "KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw",
    summary: "Calling the Michelson gateway assigns an Ethereum address on the EVM side, associated with EIP-1271 account behaviour.",
  },
};

export default function GatewayExplainer() {
  const [activeFlow, setActiveFlow] = useState<GatewayFlow>("evm");
  const detail = flowDetails[activeFlow];

  const activate = (flow: GatewayFlow) => () => setActiveFlow(flow);

  return (
    <section aria-labelledby="gateway-explainer-title" style={{ margin: "1.5rem 0 1.75rem", padding: "1.25rem", background: "radial-gradient(circle at 50% 30%, rgba(51,255,175,0.14), transparent 41%), linear-gradient(145deg, #061b32, #07122a)", border: "1px solid rgba(88,255,185,0.22)", borderRadius: "12px", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start", marginBottom: "1.1rem" }}>
        <div>
          <p style={{ display: "flex", alignItems: "center", gap: "0.45rem", margin: "0 0 0.25rem", fontSize: "0.68rem", fontWeight: 900, color: "#63f7b1", letterSpacing: "0.1em", textTransform: "uppercase" }}><ArrowRightLeft size={14} /> Interactive explainer</p>
          <h2 id="gateway-explainer-title" style={{ margin: 0, color: "#fff", fontSize: "1.1rem", fontWeight: 850 }}>How the two gateways connect</h2>
        </div>
        <p id="gateway-explainer-instructions" style={{ margin: 0, maxWidth: "310px", fontSize: "0.72rem", lineHeight: 1.5, color: "rgba(255,255,255,0.55)" }}>Hover, focus, or select an interface to follow that direction. Both sides commit or revert together.</p>
      </div>

      <div role="group" aria-describedby="gateway-explainer-instructions" aria-label="Choose a cross-interface gateway direction" style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginBottom: "1rem" }}>
        {(Object.keys(flowDetails) as GatewayFlow[]).map((flow) => {
          const selected = activeFlow === flow;
          return (
            <button key={flow} type="button" onClick={activate(flow)} onMouseEnter={activate(flow)} onFocus={activate(flow)} aria-pressed={selected} style={{ padding: "0.48rem 0.72rem", background: selected ? "#63f7b1" : "rgba(255,255,255,0.06)", color: selected ? "#031320" : "rgba(255,255,255,0.76)", border: selected ? "1px solid #63f7b1" : "1px solid rgba(255,255,255,0.15)", borderRadius: "999px", cursor: "pointer", fontSize: "0.72rem", fontWeight: 800, transition: "background 160ms cubic-bezier(0.23, 1, 0.32, 1), color 160ms cubic-bezier(0.23, 1, 0.32, 1), transform 160ms cubic-bezier(0.23, 1, 0.32, 1)" }}>
              {flowDetails[flow].label}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" aria-atomic="true" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", alignItems: "stretch", gap: "0.65rem" }}>
        <div style={{ padding: "0.9rem", borderRadius: "8px", border: activeFlow === "evm" ? "1px solid rgba(88,255,185,0.75)" : "1px solid rgba(255,255,255,0.1)", background: activeFlow === "evm" ? "rgba(31,86,100,0.38)" : "rgba(255,255,255,0.035)" }}>
          <Braces size={18} color="#79a9ff" aria-hidden="true" />
          <p style={{ margin: "0.55rem 0 0.2rem", color: "#fff", fontSize: "0.82rem", fontWeight: 800 }}>EVM interface</p>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.52)", fontSize: "0.7rem", lineHeight: 1.45 }}>EVM accounts and smart contracts can call the precompile gateway.</p>
        </div>

        <div style={{ padding: "0.9rem", borderRadius: "8px", border: "1px solid rgba(88,255,185,0.5)", background: "linear-gradient(180deg, rgba(61,245,169,0.18), rgba(61,245,169,0.06))", textAlign: "center" }}>
          <CircleDot size={21} color="#63f7b1" aria-hidden="true" />
          <p style={{ margin: "0.45rem 0 0.15rem", color: "#fff", fontSize: "0.82rem", fontWeight: 850 }}>NAC gateway</p>
          <code style={{ display: "block", color: "#a9ffcf", fontSize: "0.6rem", overflowWrap: "anywhere", lineHeight: 1.35 }}>{detail.address}</code>
        </div>

        <div style={{ padding: "0.9rem", borderRadius: "8px", border: activeFlow === "michelson" ? "1px solid rgba(88,255,185,0.75)" : "1px solid rgba(255,255,255,0.1)", background: activeFlow === "michelson" ? "rgba(31,86,100,0.38)" : "rgba(255,255,255,0.035)" }}>
          <Boxes size={18} color="#f5b4ff" aria-hidden="true" />
          <p style={{ margin: "0.55rem 0 0.2rem", color: "#fff", fontSize: "0.82rem", fontWeight: 800 }}>Michelson interface</p>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.52)", fontSize: "0.7rem", lineHeight: 1.45 }}>Tezos accounts and Michelson contracts use the native gateway in the other direction.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", gap: "0.75rem", alignItems: "start", marginTop: "0.85rem", padding: "0.8rem", borderRadius: "7px", background: "rgba(0,0,0,0.18)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <ShieldCheck size={18} color="#63f7b1" aria-hidden="true" />
        <div>
          <strong style={{ display: "block", color: "#fff", fontSize: "0.75rem", marginBottom: "0.18rem" }}>{detail.source} → {detail.gateway} → {detail.destination}</strong>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", lineHeight: 1.5 }}>{detail.summary}</p>
        </div>
      </div>
    </section>
  );
}
