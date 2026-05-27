import { useState } from "react";
import { Link } from "wouter";
import { Mail, Send, CheckCircle, AlertCircle, Loader2, ChevronRight, Home, MessageSquare, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.85rem 1rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "0.9rem",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s, background 0.2s",
  boxSizing: "border-box" as const,
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem" }}>
      {children} {required && <span style={{ color: "#2c7df7" }}>*</span>}
    </label>
  );
}

function generateMath() {
  const a = Math.floor(Math.random() * 12) + 1;
  const b = Math.floor(Math.random() * 12) + 1;
  return { a, b, answer: a + b };
}

function focusStyle(e: React.FocusEvent) {
  (e.currentTarget as HTMLElement).style.borderColor = "#2c7df7";
  (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.04)";
}
function blurStyle(e: React.FocusEvent) {
  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
}

export default function ContactPage() {
  useSEO({
    title: "Contact XTZ.News | Get in Touch with the Tezos News Team",
    description: "Contact the XTZ.News editorial team. Submit news tips, press releases, advertising enquiries, or general questions about Tezos blockchain news.",
    keywords: "contact XTZ News, Tezos news contact, submit Tezos news tip",
    canonical: "https://xtz.news/contact",
  });
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", honeypot: "", captchaAnswer: "" });
  const [math, setMath] = useState(generateMath);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const notifyOwner = trpc.system.notifyOwner.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Honeypot — bots fill this hidden field
    if (form.honeypot) { setSubmitted(true); return; }

    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.email.trim() || !form.email.includes("@")) return setError("Please enter a valid email address.");
    if (!form.message.trim() || form.message.trim().length < 10) return setError("Please enter a message (at least 10 characters).");
    if (parseInt(form.captchaAnswer) !== math.answer) {
      setError(`Incorrect answer. What is ${math.a} + ${math.b}?`);
      setMath(generateMath());
      setForm({ ...form, captchaAnswer: "" });
      return;
    }

    setLoading(true);
    try {
      await notifyOwner.mutateAsync({
        title: `Contact Form: ${form.subject || "New Message"} — from ${form.name}`,
        content: `**From:** ${form.name} (${form.email})\n**Subject:** ${form.subject || "N/A"}\n\n${form.message}`,
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
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "2px solid rgba(74,222,128,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", animation: "ctPopIn 0.4s cubic-bezier(0.23,1,0.32,1)" }}>
            <CheckCircle size={36} style={{ color: "#4ade80" }} />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", margin: "0 0 0.75rem" }}>Message Sent!</h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 2rem" }}>
            Thank you for getting in touch with XTZ.News. We'll get back to you within 24–48 hours.
          </p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", background: "#2c7df7", borderRadius: "4px", color: "#fff", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Back to Home
          </Link>
          <style>{`@keyframes ctPopIn { from { transform:scale(0.5);opacity:0 } to { transform:scale(1);opacity:1 } }`}</style>
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
            <span style={{ color: "rgba(255,255,255,0.85)" }}>Contact</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "4px", height: "52px", background: "#2c7df7", borderRadius: "2px", flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0, lineHeight: 1 }}>Contact Us</h1>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", margin: "0.4rem 0 0" }}>Get in touch with the XTZ.News team</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "3rem 1.25rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr min(340px, 100%)", gap: "2.5rem", alignItems: "start" }}>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Honeypot — hidden from humans */}
            <input type="text" name="website_url" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
              style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }} tabIndex={-1} autoComplete="off" />

            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "2rem" }}>
              <h2 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2c7df7", margin: "0 0 1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>Send a Message</h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <FieldLabel required>Your Name</FieldLabel>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
                <div>
                  <FieldLabel required>Email Address</FieldLabel>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <FieldLabel>Subject</FieldLabel>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <FieldLabel required>Message</FieldLabel>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." rows={6}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "140px", lineHeight: 1.65 }} onFocus={focusStyle} onBlur={blurStyle} />
              </div>

              {/* Math CAPTCHA */}
              <div style={{ background: "rgba(44,125,247,0.05)", border: "1px solid rgba(44,125,247,0.15)", borderRadius: "6px", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <Shield size={13} style={{ color: "#2c7df7" }} />
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>Bot Protection</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.8)", margin: 0, fontWeight: 600 }}>
                    What is <span style={{ color: "#2c7df7", fontWeight: 900 }}>{math.a} + {math.b}</span>?
                  </p>
                  <input type="number" value={form.captchaAnswer} onChange={(e) => setForm({ ...form, captchaAnswer: e.target.value })} placeholder="Answer"
                    style={{ ...inputStyle, width: "100px", padding: "0.6rem 0.875rem" }} onFocus={focusStyle} onBlur={blurStyle} />
                  <button type="button" onClick={() => { setMath(generateMath()); setForm((f) => ({ ...f, captchaAnswer: "" })); }}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "0.72rem", textDecoration: "underline", padding: 0 }}>
                    New question
                  </button>
                </div>
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
                {loading ? <><Loader2 size={18} style={{ animation: "ctSpin 0.8s linear infinite" }} /> Sending...</> : <><Send size={16} /> Send Message</>}
              </button>
              <style>{`@keyframes ctSpin { to { transform: rotate(360deg); } }`}</style>
            </div>
          </form>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c7df7", margin: "0 0 1.25rem" }}>Direct Contact</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {[
                  { icon: <Mail size={16} style={{ color: "#2c7df7" }} />, label: "Email", value: "info@xtz.news", href: "mailto:info@xtz.news", bg: "rgba(44,125,247,0.12)", hover: "rgba(44,125,247,0.08)" },
                  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DA1F2"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, label: "Twitter / X", value: "@xtz_news", href: "https://twitter.com/xtz_news", bg: "rgba(29,161,242,0.12)", hover: "rgba(29,161,242,0.08)" },
                ].map((item) => (
                  <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "nofollow noopener noreferrer" : undefined}
                    style={{ display: "flex", alignItems: "center", gap: "0.875rem", textDecoration: "none", padding: "0.875rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = item.hover; (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.2)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
                  >
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", margin: 0 }}>{item.label}</p>
                      <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#fff", margin: "0.15rem 0 0" }}>{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", margin: "0 0 1rem" }}>Common Enquiries</h3>
              <ul style={{ margin: 0, padding: "0 0 0 1.1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["Submit a news tip or press release", "Advertise on XTZ.News", "Report inaccurate information", "Partnership or collaboration", "Technical issues with the site", "General feedback"].map((item, i) => (
                  <li key={i} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: "rgba(44,125,247,0.06)", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "8px", padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <MessageSquare size={13} style={{ color: "#2c7df7" }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#2c7df7" }}>Response Time</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
                We aim to respond to all enquiries within 24–48 hours on business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
