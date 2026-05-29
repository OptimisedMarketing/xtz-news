import { useState } from "react";
import { Mail, Send, CheckCircle, Vote } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ArticleNewsletterSignup() {
  const [email, setEmail] = useState("");
  const [govAlerts, setGovAlerts] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
    },
    onError: (err) => {
      toast.error(err.message || "Subscription failed. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribeMutation.mutate({ email: email.trim(), govAlerts });
  };

  if (subscribed) {
    return (
      <div style={{
        background: "linear-gradient(135deg, rgba(44,125,247,0.12) 0%, rgba(44,125,247,0.04) 100%)",
        border: "1px solid rgba(44,125,247,0.3)",
        borderRadius: "8px",
        padding: "2rem",
        textAlign: "center",
        marginTop: "2rem",
      }}>
        <CheckCircle size={32} style={{ color: "#22c55e", margin: "0 auto 0.75rem" }} />
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff", margin: "0 0 0.4rem" }}>
          You're subscribed!
        </h3>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", margin: 0 }}>
          Welcome to the XTZ.News weekly digest.{govAlerts ? " You'll also receive governance alerts when new Tezos proposals enter voting." : " You'll receive the top Tezos stories every Monday."}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)",
      border: "1px solid rgba(44,125,247,0.2)",
      borderRadius: "8px",
      padding: "2rem",
      marginTop: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative background pattern */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: "200px", height: "200px",
        background: "radial-gradient(circle at top right, rgba(44,125,247,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative" }}>
        {/* Icon + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <div style={{ width: "32px", height: "32px", background: "rgba(44,125,247,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mail size={15} style={{ color: "#2c7df7" }} />
          </div>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#2c7df7", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Weekly Digest
          </span>
        </div>

        <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#fff", margin: "0 0 0.5rem", lineHeight: 1.3 }}>
          Stay ahead of Tezos news
        </h3>
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", margin: "0 0 1.25rem", lineHeight: 1.6 }}>
          Join 1,026+ Tezos enthusiasts who get the week's top stories delivered every Monday. No spam, unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              style={{
                flex: "1 1 220px",
                padding: "0.7rem 1rem",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "4px",
                color: "#fff",
                fontSize: "0.875rem",
                outline: "none",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
              onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)")}
            />
            <button
              type="submit"
              disabled={subscribeMutation.isPending}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.7rem 1.5rem",
                background: "#2c7df7", border: "none", borderRadius: "4px",
                color: "#fff", fontSize: "0.82rem", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.06em",
                cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s", fontFamily: "inherit",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a6ae0")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2c7df7")}
            >
              <Send size={13} />
              {subscribeMutation.isPending ? "Subscribing..." : "Subscribe Free"}
            </button>
          </div>

          {/* Governance Alerts opt-in */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer", userSelect: "none" }}>
            <div
              onClick={() => setGovAlerts(v => !v)}
              style={{
                width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0, marginTop: "1px",
                border: `2px solid ${govAlerts ? "#2c7df7" : "rgba(255,255,255,0.2)"}`,
                background: govAlerts ? "#2c7df7" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s", cursor: "pointer",
              }}>
              {govAlerts && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Vote size={12} style={{ color: govAlerts ? "#2c7df7" : "rgba(255,255,255,0.4)" }} />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: govAlerts ? "#fff" : "rgba(255,255,255,0.55)" }}>
                  Governance Alerts
                </span>
                <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "1px 5px", borderRadius: "3px", background: "rgba(44,125,247,0.15)", color: "#2c7df7", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  New
                </span>
              </div>
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", margin: "0.15rem 0 0", lineHeight: 1.5 }}>
                Get notified when a new Tezos protocol upgrade proposal enters the voting phase.
              </p>
            </div>
          </label>
        </form>

        <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", margin: "0.75rem 0 0" }}>
          📬 Sent every Monday · 1,026+ subscribers · No spam
        </p>
      </div>
    </div>
  );
}
