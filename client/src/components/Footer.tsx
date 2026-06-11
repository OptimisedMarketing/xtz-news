import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
      toast.success("You're subscribed! Welcome to XTZ.News.");
    },
    onError: (err) => {
      toast.error(err.message || "Subscription failed. Please try again.");
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    subscribeMutation.mutate({ email: email.trim() });
  };

  return (
    <footer>
      {/* ── Newsletter signup bar ── */}
      <div style={{ background: "#123262", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "2rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff", margin: "0 0 0.3rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                Stay up to date with Tezos
              </h3>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", margin: 0 }}>
                Get the latest news, projects and updates delivered to your inbox.
              </p>
            </div>
            {subscribed ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "rgba(44,125,247,0.15)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "3px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2c7df7" }}>✓ You're subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  style={{
                    padding: "0.65rem 1rem",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "3px",
                    color: "#fff",
                    fontSize: "0.85rem",
                    outline: "none",
                    width: "260px",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                  onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)")}
                />
                <button
                  type="submit"
                  disabled={subscribeMutation.isPending}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.65rem 1.25rem",
                    background: "#2c7df7",
                    border: "none",
                    borderRadius: "3px",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1a6ae0")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2c7df7")}
                >
                  <Send size={13} />
                  {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── More Tezos News: internal links for SEO ── */}
      <div style={{ background: "#030e1f", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem 0" }}>
        <div className="container">
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>More Tezos News</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.25rem" }}>
            {[
              { label: "Tezos DeFi News", href: "/category/defi" },
              { label: "Tezos NFT News", href: "/category/nfts" },
              { label: "Tezos Gaming News", href: "/category/games" },
              { label: "Tezos Adoption", href: "/category/adoption" },
              { label: "Tezos Stablecoins", href: "/category/stablecoins" },
              { label: "Tezos Wallets", href: "/category/wallets" },
              { label: "Tezos Tokenization", href: "/category/tokenization" },
              { label: "Tezos Exhibition", href: "/category/exhibition" },
              { label: "Tezos Music", href: "/category/music" },
              { label: "Tezos Projects", href: "/projects" },
              { label: "Tezos Timeline", href: "/timeline" },
              { label: "Latest Tezos News", href: "/category/latest-news" },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#2c7df7")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)")}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer Top: nav + social ── */}
      <div style={{ background: "#05152e", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "2.5rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            {/* Footer logo */}
            <Link href="/" style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
              <img
                src="/manus-storage/footer-logo_bbfa516b.svg"
                alt="XTZ.News"
                style={{ height: "80px", width: "auto" }}
              />
            </Link>

            {/* Nav links */}
            <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem", alignItems: "center" }}>
              {[
                { label: "Home", href: "/" },
                { label: "Latest News", href: "/category/latest-news" },
                { label: "Timeline", href: "/timeline" },
                { label: "Contact", href: "/contact" },
                { label: "Advertise", href: "/advertise" },
                { label: "Submit Article", href: "/submit-article" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.65)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#fff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Email + Social icons */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <a
                href="mailto:hello@xtz.news"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0 0.75rem", height: "36px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "2px", color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em", transition: "all 0.2s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2c7df7"; (e.currentTarget as HTMLElement).style.color = "#2c7df7"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                hello@xtz.news
              </a>
              {[
                { label: "Twitter", href: "https://twitter.com/XTZNews", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { label: "Facebook", href: "https://www.facebook.com/xtz.news", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                { label: "LinkedIn", href: "https://www.linkedin.com/company/xtz-news", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                { label: "Telegram", href: "https://t.me/xtznews", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", border: "1px solid #2c7df7", borderRadius: "2px", color: "#2c7df7", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2c7df7"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "#2c7df7"; }}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Bottom ── */}
      <div style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            © {year} XTZ.News. All rights reserved.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Disclaimer", href: "/disclaimer" },
              { label: "Terms & Conditions", href: "/terms-and-conditions" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
