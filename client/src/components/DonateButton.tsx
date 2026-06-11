/**
 * DonateButton — XTZ donation button using Taquito + BeaconWallet.
 *
 * Uses @taquito/beacon-wallet which wraps the Beacon SDK and works
 * reliably in Vite/React environments. Connects to Temple, Kukai,
 * AirGap, or any Beacon-compatible Tezos wallet.
 */

import { useState, useCallback } from "react";
import { toast } from "sonner";

const WALLET_ADDRESS = "tz1VjHjMkdWdrqbWLswcd6QentEgqexSd27Q";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${WALLET_ADDRESS}&bgcolor=ffffff&color=000000&margin=10`;
const PRESET_AMOUNTS = [1, 5, 10, 25];

interface DonateButtonProps {
  variant?: "header" | "article";
}

// Singleton Taquito instance
let taquitoInstance: any = null;
let walletInstance: any = null;

async function getTaquito() {
  if (!taquitoInstance) {
    const { TezosToolkit } = await import("@taquito/taquito");
    const { BeaconWallet } = await import("@taquito/beacon-wallet");
    const Tezos = new TezosToolkit("https://rpc.tzbeta.net");
    // In newer BeaconWallet versions, network must be passed in the constructor
    const wallet = new BeaconWallet({
      name: "XTZ.News",
      network: { type: "mainnet" },
    } as any);
    Tezos.setWalletProvider(wallet);
    taquitoInstance = Tezos;
    walletInstance = wallet;
  }
  return { Tezos: taquitoInstance, wallet: walletInstance };
}

export default function DonateButton({ variant = "header" }: DonateButtonProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("5");
  const [status, setStatus] = useState<"idle" | "connecting" | "sending" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);

  const isArticle = variant === "article";

  const copyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS).then(() => {
      toast.success("Wallet address copied!");
    }).catch(() => {
      toast.error("Could not copy — please copy manually.");
    });
  };

  const handleDonate = useCallback(async () => {
    const xtzAmount = parseFloat(amount);
    if (!xtzAmount || xtzAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    try {
      setStatus("connecting");
      const { Tezos, wallet } = await getTaquito();

      // Check if already connected
      const activeAccount = await wallet.client.getActiveAccount();
      if (!activeAccount) {
        // This opens the Beacon wallet picker (Temple, Kukai, etc.)
        // Network is already set in the constructor — don't pass it here
        await wallet.requestPermissions();
      }

      setStatus("sending");

      // Send the XTZ transfer
      const op = await Tezos.wallet.transfer({
        to: WALLET_ADDRESS,
        amount: xtzAmount,
      }).send();

      setTxHash(op.opHash);
      setStatus("success");
      toast.success("Thank you for your donation! 🎉");
    } catch (err: any) {
      console.error("Donation error:", err);
      const msg = (err?.message || err?.title || err?.description || JSON.stringify(err) || "").toLowerCase();
      if (
        msg.includes("cancel") ||
        msg.includes("dismiss") ||
        msg.includes("abort") ||
        msg.includes("user rejected") ||
        msg.includes("not granted")
      ) {
        // User cancelled — reset silently
        setStatus("idle");
      } else if (msg.includes("not connected") || msg.includes("no active account")) {
        setStatus("idle");
        toast.error("Please connect your wallet first.");
      } else {
        setStatus("error");
        // Show the actual error for debugging
        const displayMsg = err?.message || err?.title || "Unknown error";
        toast.error(`Error: ${displayMsg.substring(0, 120)}`);
        console.error("Full error:", JSON.stringify(err, null, 2));
      }
    }
  }, [amount]);

  const handleClose = () => {
    setOpen(false);
    // Reset status after a short delay so animation completes
    setTimeout(() => {
      setStatus("idle");
      setTxHash(null);
    }, 300);
  };

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
          textTransform: "uppercase" as const,
          letterSpacing: "0.06em",
          cursor: "pointer",
          transition: "all 0.15s",
          whiteSpace: "nowrap" as const,
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
        <svg width={isArticle ? "14" : "12"} height={isArticle ? "14" : "12"} viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 2L2 9.5v13L16 30l14-7.5v-13L16 2zm0 3.09l10.5 5.63v11.56L16 27.91 5.5 22.28V10.72L16 5.09z"/>
          <path d="M13 10v12h2v-5h4a3 3 0 000-6h-4V9h-2v1zm2 2h4a1 1 0 010 2h-4v-2z"/>
        </svg>
        Donate XTZ
      </button>

      {/* Modal — rendered at document body level via portal-like fixed positioning */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
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
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              animation: "donatePopIn 0.25s cubic-bezier(0.23,1,0.32,1)",
              position: "relative",
              zIndex: 100000,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
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
                onClick={handleClose}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: "4px", fontSize: "1.2rem", lineHeight: 1, transition: "color 0.15s", fontFamily: "inherit" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}
              >✕</button>
            </div>

            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🎉</div>
                <h4 style={{ color: "#4ade80", fontSize: "1.1rem", fontWeight: 900, margin: "0 0 0.5rem" }}>Thank you!</h4>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", lineHeight: 1.6, margin: "0 0 1.25rem" }}>
                  Your donation helps keep XTZ.News independent and community-funded.
                </p>
                {txHash && (
                  <a
                    href={`https://tzkt.io/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}
                  >
                    View transaction on TzKT →
                  </a>
                )}
                <button
                  onClick={handleClose}
                  style={{ display: "block", width: "100%", marginTop: "1.25rem", padding: "0.75rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, fontFamily: "inherit" }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: "1.25rem", textAlign: "center" }}>
                  XTZ.News is independent and community-funded. Connect your Tezos wallet to donate directly on-chain. ❤️
                </p>

                {/* Amount selector */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: "0.5rem" }}>Amount (XTZ)</p>
                  <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", flexWrap: "wrap" as const }}>
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setAmount(amt.toString())}
                        style={{
                          padding: "0.4rem 0.75rem",
                          borderRadius: "6px",
                          border: amount === amt.toString() ? "1px solid #2c7df7" : "1px solid rgba(255,255,255,0.15)",
                          background: amount === amt.toString() ? "rgba(44,125,247,0.2)" : "rgba(255,255,255,0.04)",
                          color: amount === amt.toString() ? "#2c7df7" : "rgba(255,255,255,0.6)",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.15s",
                          fontFamily: "inherit",
                        }}
                      >
                        {amt} ꜩ
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "0.5rem 0.75rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>ꜩ</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0.1"
                      step="0.1"
                      placeholder="Custom amount"
                      style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: "0.9rem", fontWeight: 700, fontFamily: "inherit" }}
                    />
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)" }}>XTZ</span>
                  </div>
                </div>

                {/* Connect & Donate button */}
                <button
                  onClick={handleDonate}
                  disabled={status === "connecting" || status === "sending"}
                  style={{
                    width: "100%",
                    padding: "0.9rem",
                    background: status === "connecting" || status === "sending" ? "rgba(44,125,247,0.5)" : "#2c7df7",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    cursor: status === "connecting" || status === "sending" ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "background 0.15s",
                    fontFamily: "inherit",
                    marginBottom: "0.75rem",
                  }}
                  onMouseEnter={(e) => { if (status === "idle" || status === "error") (e.currentTarget as HTMLElement).style.background = "#1a6ae0"; }}
                  onMouseLeave={(e) => { if (status === "idle" || status === "error") (e.currentTarget as HTMLElement).style.background = "#2c7df7"; }}
                >
                  {status === "connecting" && (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "donateSpin 0.8s linear infinite" }}><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Connecting wallet…</>
                  )}
                  {status === "sending" && (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "donateSpin 0.8s linear infinite" }}><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> Confirm in wallet…</>
                  )}
                  {(status === "idle" || status === "error") && (
                    <>
                      <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M16 2L2 9.5v13L16 30l14-7.5v-13L16 2zm0 3.09l10.5 5.63v11.56L16 27.91 5.5 22.28V10.72L16 5.09z"/>
                        <path d="M13 10v12h2v-5h4a3 3 0 000-6h-4V9h-2v1zm2 2h4a1 1 0 010 2h-4v-2z"/>
                      </svg>
                      {status === "error" ? "Try Again" : `Connect Wallet & Donate ${amount} XTZ`}
                    </>
                  )}
                </button>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
                  <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>or send manually</span>
                  <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
                </div>

                {/* QR + copy fallback */}
                <div style={{ display: "flex", gap: "0.875rem", alignItems: "center" }}>
                  <div style={{ background: "#fff", borderRadius: "8px", padding: "5px", flexShrink: 0 }}>
                    <img src={QR_URL} alt="Wallet QR" width="72" height="72" style={{ display: "block", borderRadius: "4px" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "rgba(255,255,255,0.3)", marginBottom: "0.35rem" }}>Wallet Address</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "0.4rem 0.6rem" }}>
                      <code style={{ fontSize: "0.62rem", color: "#2c7df7", fontFamily: "monospace", flex: 1, wordBreak: "break-all" as const, lineHeight: 1.4 }}>
                        {WALLET_ADDRESS}
                      </code>
                      <button
                        onClick={copyAddress}
                        style={{ background: "none", border: "none", color: "#2c7df7", cursor: "pointer", padding: "2px 4px", fontSize: "0.65rem", fontWeight: 700, whiteSpace: "nowrap" as const, fontFamily: "inherit", flexShrink: 0 }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            <style>{`
              @keyframes donatePopIn {
                from { transform: scale(0.92) translateY(8px); opacity: 0; }
                to { transform: scale(1) translateY(0); opacity: 1; }
              }
              @keyframes donateSpin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}
