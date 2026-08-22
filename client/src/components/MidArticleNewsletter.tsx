import React, { useState } from "react";
import { CheckCircle, Mail, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function MidArticleNewsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { data: subscriberCount = 1026 } = trpc.newsletter.subscriberCount.useQuery(undefined, { staleTime: 5 * 60_000 });
  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => { setSubscribed(true); setEmail(""); },
    onError: (error) => toast.error(error.message || "Subscription failed. Please try again."),
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email.trim()) subscribeMutation.mutate({ email: email.trim(), govAlerts: false });
  };

  if (subscribed) {
    return <section aria-label="XTZ.News newsletter signup" style={{ margin: "2rem 0", padding: "1.4rem", borderRadius: "10px", textAlign: "center", background: "linear-gradient(135deg, rgba(44,125,247,0.2), rgba(99,247,177,0.12))", border: "1px solid rgba(99,247,177,0.32)" }}><CheckCircle size={26} color="#63f7b1" aria-hidden="true" /><h2 style={{ color: "#fff", margin: "0.45rem 0 0.25rem", fontSize: "1rem" }}>You’re on the XTZ.News list.</h2><p style={{ margin: 0, color: "rgba(255,255,255,0.65)", fontSize: "0.78rem" }}>The next Tezos briefing will land in your inbox.</p></section>;
  }

  return (
    <section aria-labelledby="mid-article-newsletter-title" style={{ margin: "2rem 0", padding: "1.35rem", borderRadius: "10px", position: "relative", overflow: "hidden", background: "linear-gradient(120deg, #092a60, #0a1c3f 53%, #073c42)", border: "1px solid rgba(90,159,255,0.35)" }}>
      <div aria-hidden="true" style={{ position: "absolute", width: "180px", height: "180px", right: "-65px", top: "-90px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,247,177,0.22), transparent 68%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: "0.9rem" }}>
        <div style={{ display: "grid", placeItems: "center", flexShrink: 0, width: "34px", height: "34px", borderRadius: "8px", color: "#fff", background: "linear-gradient(135deg, #2c7df7, #63f7b1)" }}><Mail size={17} aria-hidden="true" /></div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ display: "flex", alignItems: "center", gap: "0.35rem", margin: "0 0 0.25rem", color: "#8dbbff", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 900 }}><Sparkles size={12} aria-hidden="true" /> XTZ.News weekly brief</p>
          <h2 id="mid-article-newsletter-title" style={{ margin: 0, color: "#fff", fontSize: "1.05rem", fontWeight: 900, lineHeight: 1.25 }}>Get the signal, not the noise.</h2>
          <p style={{ margin: "0.35rem 0 0.9rem", color: "rgba(255,255,255,0.68)", fontSize: "0.78rem", lineHeight: 1.55 }}>Join {subscriberCount.toLocaleString()}+ readers for the week’s essential Tezos, Etherlink and governance stories.</p>
          <form onSubmit={submit} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <label className="sr-only" htmlFor="mid-article-newsletter-email">Email address</label>
            <input id="mid-article-newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" style={{ minWidth: "0", flex: "1 1 180px", padding: "0.62rem 0.75rem", color: "#fff", background: "rgba(3,14,31,0.58)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: "5px", outline: "none", fontFamily: "inherit", fontSize: "0.78rem" }} />
            <button type="submit" disabled={subscribeMutation.isPending} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", padding: "0.62rem 0.82rem", border: "1px solid #63f7b1", borderRadius: "5px", background: "#63f7b1", color: "#04172a", fontWeight: 900, cursor: "pointer", fontSize: "0.72rem", fontFamily: "inherit", transition: "transform 160ms cubic-bezier(0.23, 1, 0.32, 1)" }}>
              <Send size={13} aria-hidden="true" />{subscribeMutation.isPending ? "Joining…" : "Join free"}
            </button>
          </form>
          <p style={{ margin: "0.55rem 0 0", color: "rgba(255,255,255,0.45)", fontSize: "0.62rem" }}>One concise weekly email. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
