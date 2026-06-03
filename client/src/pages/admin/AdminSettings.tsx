import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Zap, Save, Eye, EyeOff, ArrowLeft, Headphones, Rss } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();
  const { data: breakingNews, isLoading } = trpc.settings.getBreakingNews.useQuery();

  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [active, setActive] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize form from loaded data
  if (breakingNews && !initialized) {
    setText(breakingNews.text || "");
    setUrl(breakingNews.url || "");
    setActive(breakingNews.active || false);
    setInitialized(true);
  }

  const setBreakingNews = trpc.settings.setBreakingNews.useMutation({
    onSuccess: () => toast.success("Breaking news banner updated"),
    onError: (e) => toast.error("Failed to update: " + e.message),
  });

  const handleSave = () => {
    setBreakingNews.mutate({ text, url, active });
  };

  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number; running: boolean } | null>(null);
  const generateAudio = trpc.audio.getOrGenerate.useMutation();

  const handleBatchGenerate = async () => {
    if (batchProgress?.running) return;
    const confirmed = window.confirm('This will generate George ElevenLabs audio for all articles without audio. This may take several hours and will use ElevenLabs credits. Continue?');
    if (!confirmed) return;
    setBatchProgress({ done: 0, total: 0, running: true });
    try {
      // Get all posts without audio via the admin list
      const res = await fetch('/api/trpc/posts.adminList?input=' + encodeURIComponent(JSON.stringify({ json: { page: 1, limit: 2000 } })));
      const data = await res.json();
      const allPosts: any[] = data?.result?.data?.json?.posts || [];
      const withoutAudio = allPosts.filter((p: any) => !p.audioUrl);
      setBatchProgress({ done: 0, total: withoutAudio.length, running: true });
      toast.info(`Starting batch audio generation for ${withoutAudio.length} articles...`);
      let done = 0;
      for (const post of withoutAudio) {
        try {
          await generateAudio.mutateAsync({ postId: post.id });
          done++;
          setBatchProgress({ done, total: withoutAudio.length, running: true });
        } catch (e) {
          console.error('Failed for post', post.id, e);
        }
        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));
      }
      setBatchProgress({ done, total: withoutAudio.length, running: false });
      toast.success(`Batch complete! Generated audio for ${done} articles.`);
    } catch (e) {
      setBatchProgress(prev => prev ? { ...prev, running: false } : null);
      toast.error('Batch generation failed.');
    }
  };

  if (isLoading) return <div style={{ background: "#000", minHeight: "100vh" }} />;
  if (!user || user.role !== "admin") {
    return (
      <div style={{ background: "#000", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.4)" }}>Admin access required.</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <Link href="/admin" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem" }}>
              <ArrowLeft size={14} /> Admin
            </Link>
          </div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 900, color: "#fff" }}>Site Settings</h1>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem" }}>
        <div style={{ maxWidth: "700px" }}>

          {/* Breaking News Banner */}
          <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.75rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <Zap size={16} style={{ color: "#fbbf24" }} />
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#fff" }}>Breaking News Banner</h2>
              <span style={{ marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "3px", background: active ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)", color: active ? "#22c55e" : "rgba(255,255,255,0.4)", border: `1px solid ${active ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.12)"}` }}>
                {active ? "LIVE" : "HIDDEN"}
              </span>
            </div>

            <p style={{ margin: "0 0 1.25rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
              Displays a dismissible amber banner above the navigation for breaking Tezos news. Dismissed per-session by visitors.
            </p>

            {/* Active toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <button
                onClick={() => setActive(!active)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer",
                  background: active ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${active ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.15)"}`,
                  color: active ? "#22c55e" : "rgba(255,255,255,0.5)",
                  fontSize: "0.8rem", fontWeight: 700,
                  transition: "all 0.2s",
                }}
              >
                {active ? <Eye size={14} /> : <EyeOff size={14} />}
                {active ? "Banner is ON" : "Banner is OFF"}
              </button>
            </div>

            {/* Banner text */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem" }}>
                Banner Text *
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Tezos Paris upgrade is now live — protocol upgrade complete"
                maxLength={200}
                style={{ width: "100%", padding: "0.65rem 0.875rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px", color: "#fff", fontSize: "0.88rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#fbbf24")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
              <p style={{ margin: "0.3rem 0 0", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>{text.length}/200 characters</p>
            </div>

            {/* Link URL */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: "0.4rem" }}>
                Link URL (optional)
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. /paris-upgrade-tezos-protocol or https://tezos.com/..."
                style={{ width: "100%", padding: "0.65rem 0.875rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px", color: "#fff", fontSize: "0.88rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2c7df7")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
              <p style={{ margin: "0.3rem 0 0", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>Clicking the banner text will navigate to this URL. Leave blank for no link.</p>
            </div>

            {/* Preview */}
            {text && (
              <div style={{ marginBottom: "1.5rem", background: "linear-gradient(90deg, #1a0a00 0%, #2d1500 50%, #1a0a00 100%)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "6px", padding: "0.6rem 1rem" }}>
                <p style={{ margin: "0 0 0.3rem", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }}>Preview</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Zap size={13} style={{ color: "#fbbf24", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.6rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", color: "#fbbf24", background: "rgba(251,191,36,0.15)", padding: "2px 7px", borderRadius: "2px", border: "1px solid rgba(251,191,36,0.3)", whiteSpace: "nowrap" }}>Breaking</span>
                  <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</p>
                  {url && <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fbbf24", whiteSpace: "nowrap" }}>Read more →</span>}
                </div>
              </div>
            )}

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={setBreakingNews.isPending || !text.trim()}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.7rem 1.5rem", background: "#2c7df7", border: "none",
                borderRadius: "4px", color: "#fff", fontSize: "0.82rem", fontWeight: 700,
                cursor: (setBreakingNews.isPending || !text.trim()) ? "not-allowed" : "pointer",
                opacity: (setBreakingNews.isPending || !text.trim()) ? 0.6 : 1,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { if (!setBreakingNews.isPending && text.trim()) (e.currentTarget as HTMLElement).style.background = "#1a6ae0"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#2c7df7"; }}
            >
              <Save size={14} />
              {setBreakingNews.isPending ? "Saving…" : "Save Banner Settings"}
            </button>
          </div>

          {/* Audio & Podcast */}
          <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Headphones size={16} style={{ color: "#22c55e" }} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#fff" }}>Audio &amp; Podcast</h2>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>ElevenLabs George voice narration for all articles</p>
              </div>
            </div>

            {/* Podcast RSS */}
            <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Rss size={14} style={{ color: "#22c55e" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#22c55e" }}>Podcast RSS Feed</span>
              </div>
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>Submit this URL to Apple Podcasts, Spotify, and Google Podcasts:</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <code style={{ flex: 1, padding: "0.5rem 0.75rem", background: "rgba(0,0,0,0.3)", borderRadius: "4px", fontSize: "0.8rem", color: "#22c55e", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>https://xtz.news/podcast.rss</code>
                <button onClick={() => { navigator.clipboard.writeText('https://xtz.news/podcast.rss'); toast.success('Copied!'); }}
                  style={{ padding: "0.5rem 0.875rem", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "4px", color: "#22c55e", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Copy URL</button>
                <a href="https://xtz.news/podcast.rss" target="_blank" rel="noopener noreferrer"
                  style={{ padding: "0.5rem 0.875rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>Preview</a>
              </div>
            </div>

            {/* Batch generation */}
            <div style={{ padding: "1rem", background: "rgba(255,165,0,0.05)", border: "1px solid rgba(255,165,0,0.15)", borderRadius: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Headphones size={14} style={{ color: "#ffa500" }} />
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ffa500" }}>Batch Audio Generation</span>
              </div>
              <p style={{ margin: "0 0 0.875rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>
                Generate George ElevenLabs narration for all articles that don't have audio yet. This runs in the browser and may take several hours for 1,400+ articles. You can close the tab — audio already generated is cached.
              </p>
              {batchProgress && (
                <div style={{ marginBottom: "0.875rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>{batchProgress.running ? 'Generating...' : 'Complete'}</span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#ffa500" }}>{batchProgress.done} / {batchProgress.total}</span>
                  </div>
                  <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: batchProgress.total > 0 ? `${(batchProgress.done / batchProgress.total) * 100}%` : '0%', background: "#ffa500", borderRadius: "3px", transition: "width 0.3s" }} />
                  </div>
                </div>
              )}
              <button
                onClick={handleBatchGenerate}
                disabled={batchProgress?.running}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem", background: batchProgress?.running ? "rgba(255,165,0,0.1)" : "rgba(255,165,0,0.15)", border: "1px solid rgba(255,165,0,0.3)", borderRadius: "4px", color: batchProgress?.running ? "rgba(255,165,0,0.5)" : "#ffa500", fontSize: "0.8rem", fontWeight: 700, cursor: batchProgress?.running ? "not-allowed" : "pointer" }}
              >
                <Headphones size={14} />
                {batchProgress?.running ? `Generating ${batchProgress.done}/${batchProgress.total}...` : 'Generate Audio for All Articles'}
              </button>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ background: "#05152e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.25rem" }}>
            <h3 style={{ margin: "0 0 0.875rem", fontSize: "0.82rem", fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Admin Navigation</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {[
                { href: "/admin", label: "Dashboard" },
                { href: "/admin/posts", label: "Posts" },
                { href: "/admin/categories", label: "Categories" },
                { href: "/admin/projects", label: "Projects" },
                { href: "/admin/submissions", label: "Submissions" },
                { href: "/admin/subscribers", label: "Subscribers" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ padding: "0.4rem 0.875rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.78rem", fontWeight: 600, transition: "all 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.1)"; (e.currentTarget as HTMLElement).style.color = "#2c7df7"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
