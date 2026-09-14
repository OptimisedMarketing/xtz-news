import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Eye, EyeOff, Megaphone, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function AdminFirstPartyPromotion() {
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const { data: current } = trpc.settings.getFirstPartyPromotion.useQuery();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Explore");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!current) return;
    setTitle(current.title || ""); setDescription(current.description || ""); setUrl(current.url || ""); setCtaLabel(current.ctaLabel || "Explore"); setActive(current.active);
  }, [current]);

  const save = trpc.settings.setFirstPartyPromotion.useMutation({
    onSuccess: async () => { await utils.settings.getFirstPartyPromotion.invalidate(); toast.success("First-party promotion saved."); },
    onError: (error) => toast.error(error.message),
  });

  if (loading) return <div className="container" style={{ padding: "5rem 1.25rem" }}><div className="skeleton h-8 w-48" /></div>;
  if (!user || user.role !== "admin") return <div className="container" style={{ padding: "5rem 1.25rem" }}><h1 style={{ color: "#fff" }}>Admin access required</h1><p style={{ color: "rgba(255,255,255,0.55)" }}>Sign in with an administrator account to manage first-party promotions.</p></div>;

  const submit = () => save.mutate({ title: title.trim(), description: description.trim(), url: url.trim(), ctaLabel: ctaLabel.trim(), active });
  const fieldStyle = { width: "100%", padding: "0.72rem 0.82rem", boxSizing: "border-box" as const, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "5px", color: "#fff", fontFamily: "inherit" };

  return <main style={{ background: "#000", minHeight: "100vh" }}>
    <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.1)" }}><div className="container" style={{ padding: "1.5rem 1.25rem" }}><Link href="/admin" style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center", color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.76rem" }}><ArrowLeft size={14} /> Admin</Link><h1 style={{ margin: "0.8rem 0 0", color: "#fff", fontSize: "1.5rem" }}>First-party promotion</h1><p style={{ color: "rgba(255,255,255,0.52)", margin: "0.4rem 0 0", fontSize: "0.84rem" }}>A clearly labelled homepage placement for businesses and apps you manage.</p></div></div>
    <div className="container" style={{ maxWidth: "800px", padding: "2rem 1.25rem 4rem" }}>
      <section style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.1)", padding: "1.4rem", borderRadius: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1.2rem" }}><div><h2 style={{ color: "#fff", margin: 0, fontSize: "1rem" }}>Homepage placement</h2><p style={{ color: "rgba(255,255,255,0.5)", margin: "0.35rem 0 0", fontSize: "0.76rem" }}>No third-party tracker or external advertising script is added.</p></div><button onClick={() => setActive((value) => !value)} style={{ display: "inline-flex", gap: "0.45rem", alignItems: "center", border: "1px solid rgba(99,247,177,0.42)", color: active ? "#63f7b1" : "rgba(255,255,255,0.55)", background: active ? "rgba(99,247,177,0.1)" : "rgba(255,255,255,0.04)", padding: "0.55rem 0.7rem", borderRadius: "4px", cursor: "pointer", fontWeight: 800, fontSize: "0.72rem" }}>{active ? <Eye size={14} /> : <EyeOff size={14} />}{active ? "Visible" : "Hidden"}</button></div>
        <label style={{ display: "block", color: "rgba(255,255,255,0.65)", fontSize: "0.72rem", fontWeight: 800, marginBottom: "0.4rem" }}>Title</label><input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={100} placeholder="Business or app name" style={fieldStyle} />
        <label style={{ display: "block", color: "rgba(255,255,255,0.65)", fontSize: "0.72rem", fontWeight: 800, margin: "1rem 0 0.4rem" }}>Description</label><textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={280} placeholder="Short, factual description" rows={3} style={fieldStyle} />
        <label style={{ display: "block", color: "rgba(255,255,255,0.65)", fontSize: "0.72rem", fontWeight: 800, margin: "1rem 0 0.4rem" }}>Destination URL</label><input type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://… or /internal-route" style={fieldStyle} />
        <label style={{ display: "block", color: "rgba(255,255,255,0.65)", fontSize: "0.72rem", fontWeight: 800, margin: "1rem 0 0.4rem" }}>Button label</label><input value={ctaLabel} onChange={(event) => setCtaLabel(event.target.value)} maxLength={40} style={fieldStyle} />
        <button onClick={submit} disabled={save.isPending || !title.trim() || !url.trim()} style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", marginTop: "1.25rem", padding: "0.7rem 1rem", background: "#2c7df7", border: 0, borderRadius: "4px", color: "#fff", cursor: save.isPending ? "wait" : "pointer", fontWeight: 800, fontSize: "0.78rem", opacity: save.isPending || !title.trim() || !url.trim() ? 0.6 : 1 }}><Save size={15} />{save.isPending ? "Saving…" : "Save promotion"}</button>
      </section>
      {title && url && <section aria-label="Promotion preview" style={{ marginTop: "1.25rem", background: "linear-gradient(135deg, #082742, #05152e)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(99,247,177,0.25)", display: "flex", alignItems: "center", gap: "0.75rem" }}><Megaphone color="#63f7b1" /><div><p style={{ color: "#63f7b1", fontSize: "0.6rem", fontWeight: 900, letterSpacing: "0.1em", margin: 0 }}>FROM OUR NETWORK</p><strong style={{ color: "#fff", fontSize: "0.9rem" }}>{title}</strong>{description && <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.75rem", margin: "0.25rem 0 0" }}>{description}</p>}</div></section>}
    </div>
  </main>;
}
