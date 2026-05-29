import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { CheckCircle, Mail, Vote, Bell, XCircle, Loader, Save } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ManageSubscriptionsPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const token = params.get("token") || "";

  const [govAlerts, setGovAlerts] = useState(false);
  const [status, setStatus] = useState<"active" | "unsubscribed">("active");
  const [saved, setSaved] = useState(false);

  const { data: prefs, isLoading, error } = trpc.newsletter.getPreferences.useQuery(
    { token },
    { enabled: !!token }
  );

  useEffect(() => {
    if (prefs) {
      setGovAlerts(prefs.govAlerts ?? false);
      setStatus(prefs.status as "active" | "unsubscribed");
    }
  }, [prefs]);

  const updateMutation = trpc.newsletter.updatePreferences.useMutation({
    onSuccess: () => {
      setSaved(true);
      toast.success("Preferences saved!");
      setTimeout(() => setSaved(false), 3000);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save preferences.");
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ token, govAlerts, status });
  };

  if (!token) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <XCircle size={48} style={{ color: "#ef4444", margin: "0 auto 1rem" }} />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", margin: "0 0 0.5rem" }}>Invalid Link</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>Please use the link from your email to manage your subscriptions.</p>
          <Link href="/" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>← Back to XTZ.News</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh", padding: "4rem 1rem" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "52px", height: "52px", background: "rgba(44,125,247,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <Mail size={24} style={{ color: "#2c7df7" }} />
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: "0 0 0.4rem" }}>Manage Subscriptions</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", margin: 0 }}>
            Choose what you'd like to receive from XTZ.News
          </p>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <Loader size={32} style={{ color: "#2c7df7", margin: "0 auto", animation: "spin 1s linear infinite" }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "2rem", background: "#05152e", borderRadius: "10px", border: "1px solid rgba(239,68,68,0.3)" }}>
            <XCircle size={32} style={{ color: "#ef4444", margin: "0 auto 0.75rem" }} />
            <p style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>This link is invalid or has expired. Please use the link from your most recent email.</p>
          </div>
        ) : prefs ? (
          <div style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "12px", overflow: "hidden" }}>
            {/* Email display */}
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "36px", height: "36px", background: "rgba(44,125,247,0.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Mail size={16} style={{ color: "#2c7df7" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.2rem" }}>Subscribed email</div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>{prefs.email}</div>
              </div>
            </div>

            {/* Subscription options */}
            <div style={{ padding: "1.5rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "0.78rem", fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.75rem" }}>Email Preferences</h3>

                {/* Status toggle */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", padding: "0.9rem 1rem", background: status === "active" ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${status === "active" ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)"}`, borderRadius: "8px", transition: "all 0.15s" }}>
                    <div
                      onClick={() => setStatus(s => s === "active" ? "unsubscribed" : "active")}
                      style={{ width: "20px", height: "20px", borderRadius: "4px", flexShrink: 0, marginTop: "1px", border: `2px solid ${status === "active" ? "#22c55e" : "rgba(255,255,255,0.2)"}`, background: status === "active" ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}>
                      {status === "active" && (
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                        <Bell size={14} style={{ color: status === "active" ? "#22c55e" : "rgba(255,255,255,0.4)" }} />
                        <span style={{ fontWeight: 700, color: status === "active" ? "#fff" : "rgba(255,255,255,0.5)", fontSize: "0.88rem" }}>Weekly Digest</span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.5 }}>
                        Top Tezos stories every Monday. The main XTZ.News newsletter.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Governance alerts toggle */}
                <div>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", padding: "0.9rem 1rem", background: govAlerts ? "rgba(44,125,247,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${govAlerts ? "rgba(44,125,247,0.2)" : "rgba(255,255,255,0.08)"}`, borderRadius: "8px", transition: "all 0.15s" }}>
                    <div
                      onClick={() => setGovAlerts(v => !v)}
                      style={{ width: "20px", height: "20px", borderRadius: "4px", flexShrink: 0, marginTop: "1px", border: `2px solid ${govAlerts ? "#2c7df7" : "rgba(255,255,255,0.2)"}`, background: govAlerts ? "#2c7df7" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}>
                      {govAlerts && (
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                        <Vote size={14} style={{ color: govAlerts ? "#2c7df7" : "rgba(255,255,255,0.4)" }} />
                        <span style={{ fontWeight: 700, color: govAlerts ? "#fff" : "rgba(255,255,255,0.5)", fontSize: "0.88rem" }}>Governance Alerts</span>
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "1px 5px", borderRadius: "3px", background: "rgba(44,125,247,0.15)", color: "#2c7df7", textTransform: "uppercase", letterSpacing: "0.06em" }}>New</span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.5 }}>
                        Get notified when a new Tezos protocol upgrade proposal enters the voting phase.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                style={{ width: "100%", padding: "0.85rem", background: saved ? "#22c55e" : "#2c7df7", border: "none", borderRadius: "8px", color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "background 0.2s", fontFamily: "inherit" }}
                onMouseEnter={(e) => { if (!saved) (e.currentTarget as HTMLElement).style.background = "#1a6ae0"; }}
                onMouseLeave={(e) => { if (!saved) (e.currentTarget as HTMLElement).style.background = "#2c7df7"; }}
              >
                {updateMutation.isPending ? (
                  <><Loader size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
                ) : saved ? (
                  <><CheckCircle size={16} /> Saved!</>
                ) : (
                  <><Save size={16} /> Save Preferences</>
                )}
              </button>

              {/* Unsubscribe link */}
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button
                  onClick={() => { setStatus("unsubscribed"); setTimeout(handleSave, 0); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", textDecoration: "underline", fontFamily: "inherit" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(239,68,68,0.7)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
                >
                  Unsubscribe from all emails
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "0.82rem" }}>← Back to XTZ.News</Link>
        </div>
      </div>
    </div>
  );
}
