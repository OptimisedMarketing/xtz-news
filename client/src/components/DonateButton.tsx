/**
 * DonateButton — XTZ donation button with modal.
 *
 * Shows a modal with:
 * - Wallet address (copyable)
 * - QR code (via qr.tezos.com or a free QR service)
 * - "Open in Temple Wallet" deep link
 */

import { useState } from "react";
import { toast } from "sonner";

const WALLET_ADDRESS = "tz1VjHjMkdWdrqbWLswcd6QentEgqexSd27Q";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${WALLET_ADDRESS}&bgcolor=05152e&color=2c7df7&margin=10`;

interface DonateButtonProps {
  variant?: "header" | "article";
}

export default function DonateButton({ variant = "header" }: DonateButtonProps) {
  const [open, setOpen] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS).then(() => {
      toast.success("Wallet address copied!");
    }).catch(() => {
      toast.error("Could not copy — please copy manually.");
    });
  };

  const isArticle = variant === "article";

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: isArticle ? "0.4rem" : "0.35rem",
          padding: isArticle ? "0.55rem 1rem" : "0.35rem 0.75rem",
          background: "linear-gradient(135deg, #2c7df7 0%, #1a6ae0 100%)",
          border: "none",
          borderRadius: isArticle ? "6px" : "3px",
          color: "#fff",
          fontSize: isArticle ? "0.82rem" : "0.7rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          cursor: "pointer",
          transition: "all 0.15s",
          whiteSpace: "nowrap",
          flexShrink: 0,
          fontFamily: "inherit",
          boxShadow: isArticle ? "0 2px 8px rgba(44,125,247,0.35)" : "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #1a6ae0 0%, #1258c4 100%)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #2c7df7 0%, #1a6ae0 100%)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        {/* Tezos ⬡ icon */}
        <svg width={isArticle ? "14" : "12"} height={isArticle ? "14" : "12"} viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 2L2 9.5v13L16 30l14-7.5v-13L16 2zm0 3.09l10.5 5.63v11.56L16 27.91 5.5 22.28V10.72L16 5.09z"/>
          <path d="M13 10v12h2v-5h4a3 3 0 000-6h-4V9h-2v1zm2 2h4a1 1 0 010 2h-4v-2z"/>
        </svg>
        Donate XTZ
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#05152e",
              border: "1px solid rgba(44,125,247,0.3)",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "380px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(44,125,247,0.1)",
              animation: "donatePopIn 0.25s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(44,125,247,0.15)", border: "1px solid rgba(44,125,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 32 32" fill="#2c7df7">
                    <path d="M16 2L2 9.5v13L16 30l14-7.5v-13L16 2zm0 3.09l10.5 5.63v11.56L16 27.91 5.5 22.28V10.72L16 5.09z"/>
                    <path d="M13 10v12h2v-5h4a3 3 0 000-6h-4V9h-2v1zm2 2h4a1 1 0 010 2h-4v-2z"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 900, color: "#fff", margin: 0 }}>Donate XTZ</h3>
                  <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>Support XTZ.News</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: "4px", borderRadius: "4px", fontSize: "1.2rem", lineHeight: 1, transition: "color 0.15s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}
              >
                ✕
              </button>
            </div>

            {/* Message */}
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "1.5rem", textAlign: "center" }}>
              XTZ.News is independent and community-funded. If you find our Tezos coverage valuable, a small donation helps keep the lights on. ❤️
            </p>

            {/* QR Code */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
              <div style={{ background: "#fff", borderRadius: "12px", padding: "8px", display: "inline-block" }}>
                <img
                  src={QR_URL}
                  alt="Tezos wallet QR code"
                  width="180"
                  height="180"
                  style={{ display: "block", borderRadius: "6px" }}
                />
              </div>
            </div>

            {/* Wallet address */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: "0.4rem" }}>Tezos Wallet Address</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.625rem 0.875rem" }}>
                <code style={{ fontSize: "0.72rem", color: "#2c7df7", fontFamily: "monospace", flex: 1, wordBreak: "break-all" }}>
                  {WALLET_ADDRESS}
                </code>
                <button
                  onClick={copyAddress}
                  title="Copy address"
                  style={{ background: "rgba(44,125,247,0.15)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "5px", color: "#2c7df7", cursor: "pointer", padding: "4px 8px", fontSize: "0.68rem", fontWeight: 700, whiteSpace: "nowrap", transition: "all 0.15s", fontFamily: "inherit" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.3)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.15)"; }}
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Wallet links */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <a
                href={`https://wallet.kukai.app/send?to=${WALLET_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.65rem", background: "#2c7df7", borderRadius: "8px", color: "#fff", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700, transition: "background 0.15s", whiteSpace: "nowrap", minWidth: "120px" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a6ae0")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2c7df7")}
              >
                Send via Kukai
              </a>
              <a
                href={`https://app.templewallet.com/send?to=${WALLET_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.65rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.78rem", fontWeight: 700, transition: "all 0.15s", whiteSpace: "nowrap", minWidth: "120px" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)"; }}
              >
                Send via Temple
              </a>
              <a
                href={`https://tzkt.io/${WALLET_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.65rem 0.875rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.45)", textDecoration: "none", fontSize: "0.75rem", fontWeight: 700, transition: "all 0.15s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
              >
                TzKT
              </a>
            </div>
            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", textAlign: "center", margin: "0.75rem 0 0", lineHeight: 1.5 }}>
              Or scan the QR code with any Tezos mobile wallet (Temple, Kukai, Umami)
            </p>

            <style>{`
              @keyframes donatePopIn {
                from { transform: scale(0.92) translateY(8px); opacity: 0; }
                to { transform: scale(1) translateY(0); opacity: 1; }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}
