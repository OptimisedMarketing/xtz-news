import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle, AlertCircle, Loader2, Send, ChevronRight, Home, Globe, Twitter, Github } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.8rem 1rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
  boxSizing: "border-box" as const,
};

const CATEGORIES = ["DeFi", "NFTs", "Gaming", "Dev Tools", "Wallets", "Stablecoins", "Layer 2", "Block Explorer", "DAOs", "Governance", "Digital Identity", "Baking Tools", "Core Development", "Foundation", "Community", "Privacy", "Payments", "Security Tokens", "RWA", "Web3 Infrastructure", "Other"];

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem" }}>
      {children} {required && <span style={{ color: "#2c7df7" }}>*</span>}
    </label>
  );
}

export default function SubmitProjectPage() {
  const [form, setForm] = useState({
    projectName: "",
    category: "",
    website: "",
    twitter: "",
    github: "",
    description: "",
    contactName: "",
    contactEmail: "",
    agreedToTerms: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.projectName.trim()) return setError("Project name is required.");
    if (!form.category) return setError("Please select a category.");
    if (!form.website.trim()) return setError("Website URL is required.");
    if (!form.description.trim()) return setError("Project description is required.");
    if (!form.contactEmail.trim()) return setError("Contact email is required.");
    if (!form.agreedToTerms) return setError("You must agree to the terms.");

    setLoading(true);
    try {
      // Send project submission via email notification
      await fetch("/api/trpc/system.notifyOwner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            title: `New Project Submission: ${form.projectName}`,
            content: `
**Project:** ${form.projectName}
**Category:** ${form.category}
**Website:** ${form.website}
**Twitter:** ${form.twitter || "N/A"}
**GitHub:** ${form.github || "N/A"}
**Description:** ${form.description}
**Contact:** ${form.contactName} (${form.contactEmail})
            `.trim()
          }
        })
      });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please email us directly at info@xtz.news");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "480px", padding: "2rem" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "2px solid rgba(74,222,128,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <CheckCircle size={36} style={{ color: "#4ade80" }} />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", margin: "0 0 0.75rem" }}>Project Submitted!</h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 2rem" }}>
            Thank you for submitting your project to XTZ.News. Our team will review it and get back to you within 3–5 business days.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <Link href="/projects" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", background: "#2c7df7", borderRadius: "4px", color: "#fff", textDecoration: "none", fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              View Projects
            </Link>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 700 }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "4rem 0 3rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(44,125,247,0.8) 40px, rgba(44,125,247,0.8) 41px)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.5rem", fontSize: "0.78rem", fontWeight: 600 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", textDecoration: "none" }}><Home size={13} /></Link>
            <ChevronRight size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <Link href="/projects" style={{ color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>Projects</Link>
            <ChevronRight size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span style={{ color: "rgba(255,255,255,0.85)" }}>Submit Project</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "4px", height: "52px", background: "#2c7df7", borderRadius: "2px", flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0, lineHeight: 1 }}>Submit Project</h1>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", margin: "0.4rem 0 0" }}>Get your Tezos project featured on XTZ.News</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "3rem 1.25rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr min(340px, 100%)", gap: "2.5rem", alignItems: "start" }}>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Project info */}
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "2rem", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2c7df7", margin: "0 0 1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>Project Information</h2>

              <div style={{ marginBottom: "1.25rem" }}>
                <FieldLabel required>Project Name</FieldLabel>
                <input type="text" value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} placeholder="e.g. QuipuSwap" style={inputStyle}
                  onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                  onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")} />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <FieldLabel required>Category</FieldLabel>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                  onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")}
                >
                  <option value="">Select a category...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <FieldLabel required>Website URL</FieldLabel>
                <div style={{ position: "relative" }}>
                  <Globe size={14} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                  <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://yourproject.com" style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                    onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <FieldLabel>Twitter / X</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <Twitter size={14} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                    <input type="text" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} placeholder="@yourproject" style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                      onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                      onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")} />
                  </div>
                </div>
                <div>
                  <FieldLabel>GitHub</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <Github size={14} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", pointerEvents: "none" }} />
                    <input type="text" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="github.com/yourproject" style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                      onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                      onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")} />
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel required>Project Description</FieldLabel>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your project in 2-3 sentences. What does it do? How does it use Tezos?" rows={4}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "100px", lineHeight: 1.6 }}
                  onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                  onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")} />
              </div>
            </div>

            {/* Contact */}
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "2rem", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2c7df7", margin: "0 0 1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>Your Contact Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <FieldLabel>Your Name</FieldLabel>
                  <input type="text" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} placeholder="John Doe" style={inputStyle}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                    onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")} />
                </div>
                <div>
                  <FieldLabel required>Contact Email</FieldLabel>
                  <input type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="you@project.com" style={inputStyle}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                    onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")} />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.25rem" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", cursor: "pointer" }}>
                <div onClick={() => setForm({ ...form, agreedToTerms: !form.agreedToTerms })}
                  style={{ width: "20px", height: "20px", borderRadius: "3px", flexShrink: 0, border: form.agreedToTerms ? "2px solid #2c7df7" : "2px solid rgba(255,255,255,0.2)", background: form.agreedToTerms ? "#2c7df7" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", marginTop: "2px" }}>
                  {form.agreedToTerms && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
                  I confirm this project is actively building on the Tezos ecosystem and all information provided is accurate. I agree to XTZ.News <span style={{ color: "#2c7df7" }}>terms and conditions</span>.
                </span>
              </label>
            </div>

            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", marginBottom: "1.25rem" }}>
                <AlertCircle size={16} style={{ color: "#f87171", flexShrink: 0 }} />
                <p style={{ fontSize: "0.85rem", color: "#f87171", margin: 0 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "1rem", background: loading ? "rgba(44,125,247,0.5)" : "#2c7df7", border: "none", borderRadius: "4px", color: "#fff", fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", transition: "background 0.2s" }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#1a6ae0"; }}
              onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#2c7df7"; }}
            >
              {loading ? <><Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} /> Submitting...</> : <><Send size={16} /> Submit Project</>}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c7df7", margin: "0 0 1rem" }}>Listing Criteria</h3>
              <ul style={{ margin: 0, padding: "0 0 0 1.1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {["Project must be live on Tezos mainnet or testnet", "Must have a working website", "Original project — no clones or forks without significant changes", "Active development or maintenance", "No scam, rug-pull, or fraudulent projects", "Review within 3–5 business days"].map((item, i) => (
                  <li key={i} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ background: "rgba(44,125,247,0.06)", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "8px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c7df7", margin: "0 0 0.75rem" }}>Already Listed?</h3>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", margin: "0 0 0.75rem", lineHeight: 1.6 }}>
                Want to update your project's information or logo? Contact us directly.
              </p>
              <a href="mailto:info@xtz.news" style={{ fontSize: "0.85rem", color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>info@xtz.news</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
