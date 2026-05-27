import { useState, useRef } from "react";
import { Link } from "wouter";
import { Upload, CheckCircle, AlertCircle, Loader2, Send, ChevronRight, Home, FileText, ImageIcon, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";

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

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem" }}>
      {children} {required && <span style={{ color: "#2c7df7" }}>*</span>}
    </label>
  );
}

function FileZone({ label, accept, hint, icon, onChange, value, onClear }: {
  label: string; accept: string; hint: string; icon: React.ReactNode;
  onChange: (f: File | null) => void; value: File | null; onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  return (
    <div
      onClick={() => !value && ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onChange(f); }}
      style={{
        border: `2px dashed ${drag ? "#2c7df7" : value ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: "6px", padding: "1.25rem 1rem", cursor: value ? "default" : "pointer",
        background: drag ? "rgba(44,125,247,0.06)" : value ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.02)",
        transition: "all 0.2s", display: "flex", alignItems: "center", gap: "1rem",
      }}
      onMouseEnter={(e) => { if (!value) (e.currentTarget as HTMLElement).style.borderColor = "rgba(44,125,247,0.35)"; }}
      onMouseLeave={(e) => { if (!value) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
    >
      <input ref={ref} type="file" accept={accept} style={{ display: "none" }} onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: value ? "rgba(74,222,128,0.1)" : "rgba(44,125,247,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {value ? <CheckCircle size={20} style={{ color: "#4ade80" }} /> : <span style={{ color: "#2c7df7" }}>{icon}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {value ? (
          <>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value.name}</p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", margin: "0.2rem 0 0" }}>{(value.size / 1024 / 1024).toFixed(2)} MB · File ready</p>
          </>
        ) : (
          <>
            <p style={{ fontSize: "0.85rem", fontWeight: 500, color: "rgba(255,255,255,0.6)", margin: 0 }}>{label}</p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", margin: "0.2rem 0 0" }}>{hint}</p>
          </>
        )}
      </div>
      {value && (
        <button onClick={(e) => { e.stopPropagation(); onClear(); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: "4px", display: "flex", flexShrink: 0 }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#f87171")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
        ><X size={16} /></button>
      )}
    </div>
  );
}

export default function SubmitArticlePage() {
  useSEO({
    title: "Submit a Tezos Article | XTZ.News — Share Your Tezos Story",
    description: "Submit your Tezos news article, press release, or project update to XTZ.News. Reach thousands of Tezos developers, investors, and enthusiasts.",
    keywords: "submit Tezos article, Tezos press release, XTZ news submission, Tezos guest post",
    canonical: "https://xtz.news/submit-article",
  });
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", articleTitle: "", agreedToTerms: false });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [additionalFile, setAdditionalFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const getUploadUrl = trpc.upload.getUploadUrl.useMutation();
  const createSubmission = trpc.submissions.create.useMutation();

  const uploadFile = async (file: File, folder: string) => {
    const result = await getUploadUrl.mutateAsync({ filename: file.name, contentType: file.type, folder });
    const uploadEndpoint = (result as any).uploadUrl || (result as any).uploadEndpoint;
    const fileUrl = (result as any).fileUrl || (result as any).url || "";
    const fileKey = (result as any).fileKey || (result as any).key || "";
    if (uploadEndpoint) {
      await fetch(uploadEndpoint, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
    }
    return { url: fileUrl, key: fileKey };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.firstName.trim()) return setError("First name is required.");
    if (!form.email.trim()) return setError("Email address is required.");
    if (!form.articleTitle.trim()) return setError("Article title is required.");
    if (!articleFile) return setError("Please upload your article file (.docx or .pdf).");
    if (!form.agreedToTerms) return setError("You must agree to the terms and conditions.");

    setUploading(true);
    try {
      const [articleResult] = await Promise.all([uploadFile(articleFile, "articles")]);
      let bannerImageUrl = "", bannerImageKey = "", image2Url = "", image2Key = "";
      if (bannerFile) { const r = await uploadFile(bannerFile, "banners"); bannerImageUrl = r.url; bannerImageKey = r.key; }
      if (additionalFile) { const r = await uploadFile(additionalFile, "images"); image2Url = r.url; image2Key = r.key; }
      await createSubmission.mutateAsync({
        firstName: form.firstName, lastName: form.lastName || undefined, email: form.email, articleTitle: form.articleTitle,
        articleFileUrl: articleResult.url, articleFileKey: articleResult.key,
        bannerImageUrl: bannerImageUrl || undefined, bannerImageKey: bannerImageKey || undefined,
        image2Url: image2Url || undefined, image2Key: image2Key || undefined,
        agreedToTerms: form.agreedToTerms,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: "480px", padding: "2rem" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "2px solid rgba(74,222,128,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <CheckCircle size={36} style={{ color: "#4ade80" }} />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", margin: "0 0 0.75rem" }}>Article Submitted!</h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 2rem" }}>
            Thank you for submitting your article to XTZ.News. Our editorial team will review it and get back to you within 3–5 business days.
          </p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", background: "#2c7df7", borderRadius: "4px", color: "#fff", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Back to Home
          </Link>
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
            <span style={{ color: "rgba(255,255,255,0.85)" }}>Submit Article</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "4px", height: "52px", background: "#2c7df7", borderRadius: "2px", flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0, lineHeight: 1 }}>Submit Article</h1>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", margin: "0.4rem 0 0" }}>Share your Tezos story with our community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "3rem 1.25rem 5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr min(340px, 100%)", gap: "2.5rem", alignItems: "start" }}>
          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Personal details */}
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "2rem", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2c7df7", margin: "0 0 1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>Your Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <FieldLabel required>First Name</FieldLabel>
                  <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="John" style={inputStyle}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                    onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")} />
                </div>
                <div>
                  <FieldLabel>Last Name</FieldLabel>
                  <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" style={inputStyle}
                    onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                    onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")} />
                </div>
              </div>
              <FieldLabel required>Email Address</FieldLabel>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" style={inputStyle}
                onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")} />
            </div>

            {/* Article details */}
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "2rem", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#2c7df7", margin: "0 0 1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>Article Details</h2>
              <div style={{ marginBottom: "1.25rem" }}>
                <FieldLabel required>Article Title</FieldLabel>
                <input type="text" value={form.articleTitle} onChange={(e) => setForm({ ...form, articleTitle: e.target.value })} placeholder="Title of your article" style={inputStyle}
                  onFocus={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2c7df7")}
                  onBlur={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)")} />
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <FieldLabel required>Article File</FieldLabel>
                <FileZone label="Upload your article" accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hint="Word document (.docx) or PDF · Max 20MB" icon={<FileText size={20} />} onChange={setArticleFile} value={articleFile} onClear={() => setArticleFile(null)} />
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <FieldLabel>Banner Image</FieldLabel>
                <FileZone label="Upload a banner image" accept="image/jpeg,image/png,image/webp" hint="JPG, PNG or WebP · Recommended 1344×896px" icon={<ImageIcon size={20} />} onChange={setBannerFile} value={bannerFile} onClear={() => setBannerFile(null)} />
              </div>
              <div>
                <FieldLabel>Additional Image <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></FieldLabel>
                <FileZone label="Upload an additional image" accept="image/jpeg,image/png,image/webp" hint="JPG, PNG or WebP · Optional" icon={<ImageIcon size={20} />} onChange={setAdditionalFile} value={additionalFile} onClear={() => setAdditionalFile(null)} />
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
                  I agree to the <span style={{ color: "#2c7df7" }}>privacy policy</span> and T&Cs outlined by XTZ.News. By uploading an article, I accept all copyright terms and confirm that the information is true and accurate to the best of my knowledge.
                </span>
              </label>
            </div>

            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "4px", marginBottom: "1.25rem" }}>
                <AlertCircle size={16} style={{ color: "#f87171", flexShrink: 0 }} />
                <p style={{ fontSize: "0.85rem", color: "#f87171", margin: 0 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={uploading}
              style={{ width: "100%", padding: "1rem", background: uploading ? "rgba(44,125,247,0.5)" : "#2c7df7", border: "none", borderRadius: "4px", color: "#fff", fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", cursor: uploading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", transition: "background 0.2s" }}
              onMouseEnter={(e) => { if (!uploading) (e.currentTarget as HTMLElement).style.background = "#1a6ae0"; }}
              onMouseLeave={(e) => { if (!uploading) (e.currentTarget as HTMLElement).style.background = "#2c7df7"; }}
            >
              {uploading ? <><Loader2 size={18} style={{ animation: "spin 0.8s linear infinite" }} /> Uploading & Submitting...</> : <><Send size={16} /> Submit Article</>}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c7df7", margin: "0 0 1rem" }}>Submission Guidelines</h3>
              <ul style={{ margin: 0, padding: "0 0 0 1.1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {["Submit as Word (.docx) or PDF", "Must relate to the Tezos ecosystem", "Banner image: 1344×896px recommended", "Ensure all facts and quotes are accurate", "Original content only — no plagiarism", "Review within 3–5 business days"].map((item, i) => (
                  <li key={i} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ background: "rgba(44,125,247,0.06)", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "8px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2c7df7", margin: "0 0 0.75rem" }}>Need Help?</h3>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", margin: "0 0 0.75rem", lineHeight: 1.6 }}>Having trouble with the form? Contact us directly.</p>
              <a href="mailto:info@xtz.news" style={{ fontSize: "0.85rem", color: "#2c7df7", textDecoration: "none", fontWeight: 700 }}>info@xtz.news</a>
            </div>
            <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", margin: "0 0 0.875rem" }}>Topics We Cover</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {["DeFi", "NFTs", "Gaming", "Protocol", "Adoption", "Dev Tools", "Governance", "Stablecoins", "Layer 2", "RWA"].map((tag) => (
                  <span key={tag} style={{ fontSize: "0.62rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.05)", padding: "3px 7px", borderRadius: "2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
