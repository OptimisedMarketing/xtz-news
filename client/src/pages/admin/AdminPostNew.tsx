import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeft, Save, Eye, Tag, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";

export default function AdminPostNew() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImageUrl: "",
    status: "draft" as "publish" | "draft" | "private",
    isFeatured: false,
    seoTitle: "",
    seoDescription: "",
  });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [preview, setPreview] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);

  const { data: allCategories = [] } = trpc.categories.all.useQuery();

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 200);
    setForm((f) => ({ ...f, title, slug }));
  };

  const createMutation = trpc.posts.adminCreate.useMutation({
    onSuccess: () => {
      utils.posts.adminList.invalidate();
      toast.success("Article saved!");
      navigate("/admin/posts");
    },
    onError: (err) => toast.error(err.message || "Failed to save"),
  });

  const handleSubmit = (e: React.FormEvent, status: "publish" | "draft") => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.slug.trim()) { toast.error("Slug is required"); return; }
    createMutation.mutate({ ...form, status });
  };

  if (!user || user.role !== "admin") {
    return <div className="container py-16 text-center"><p style={{ color: "rgba(255,255,255,0.5)" }}>Access denied.</p></div>;
  }

  const selectedCats = allCategories.filter((c) => selectedCategoryIds.includes(c.id));
  const filteredCats = allCategories.filter(
    (c) =>
      !selectedCategoryIds.includes(c.id) &&
      c.name.toLowerCase().includes(catSearch.toLowerCase())
  );

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#05152e", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link href="/admin/posts" style={{ color: "rgba(255,255,255,0.4)", display: "flex" }}><ChevronLeft size={20} /></Link>
            <h1 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fff", margin: 0 }}>New Article</h1>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="button" onClick={() => setPreview(!preview)}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "3px", color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <Eye size={13} /> {preview ? "Edit" : "Preview"}
            </button>
            <button type="button" onClick={(e) => handleSubmit(e as any, "draft")} disabled={createMutation.isPending}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", background: "transparent", border: "1px solid #2c7df7", borderRadius: "3px", color: "#2c7df7", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <Save size={13} /> Save Draft
            </button>
            <button type="button" onClick={(e) => handleSubmit(e as any, "publish")} disabled={createMutation.isPending}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1.25rem", background: "#2c7df7", border: "none", borderRadius: "3px", color: "#fff", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {createMutation.isPending ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "2rem 1.25rem", display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.5rem", alignItems: "start" }}>
        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Title */}
          <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Article title..."
            style={{ width: "100%", padding: "0.875rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px", color: "#fff", fontSize: "1.5rem", fontWeight: 900, outline: "none", fontFamily: "inherit" }} />

          {/* Slug */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>URL slug:</span>
            <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))}
              style={{ flex: 1, padding: "0.4rem 0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px", color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", outline: "none", fontFamily: "inherit" }} />
          </div>

          {/* Excerpt */}
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>Excerpt</label>
            <textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={3} placeholder="Brief summary shown in article cards..."
              style={{ width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px", color: "#fff", fontSize: "0.9rem", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
          </div>

          {/* Rich text editor */}
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>Article Content</label>
            {preview ? (
              <div className="post-content" style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", minHeight: "400px" }}
                dangerouslySetInnerHTML={{ __html: form.content || "<p style='color:rgba(255,255,255,0.3)'>Nothing to preview yet...</p>" }} />
            ) : (
              <RichTextEditor content={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} placeholder="Write your article here..." />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", position: "sticky", top: "1rem" }}>
          {/* Featured image */}
          <div style={{ padding: "1rem", background: "#05152e", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: "0.75rem" }}>Featured Image URL</label>
            <input type="text" value={form.featuredImageUrl} onChange={(e) => setForm((f) => ({ ...f, featuredImageUrl: e.target.value }))} placeholder="https://..."
              style={{ width: "100%", padding: "0.6rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px", color: "#fff", fontSize: "0.8rem", outline: "none", fontFamily: "inherit" }} />
            {form.featuredImageUrl && (
              <img src={form.featuredImageUrl} alt="Preview" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "3px", marginTop: "0.75rem" }}
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")} />
            )}
          </div>

          {/* ── Category picker ── */}
          <div style={{ padding: "1rem", background: "#05152e", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: "0.75rem" }}>
              Categories
            </label>

            {/* Selected categories */}
            {selectedCats.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
                {selectedCats.map((cat) => (
                  <span key={cat.id} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.5rem", background: "rgba(44,125,247,0.15)", border: "1px solid rgba(44,125,247,0.3)", borderRadius: "2px", fontSize: "0.7rem", fontWeight: 700, color: "#2c7df7" }}>
                    <Tag size={9} />
                    {cat.name}
                    <button onClick={() => setSelectedCategoryIds((ids) => ids.filter((id) => id !== cat.id))}
                      style={{ background: "none", border: "none", color: "#2c7df7", cursor: "pointer", padding: 0, display: "flex" }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search + dropdown */}
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={catSearch}
                onChange={(e) => { setCatSearch(e.target.value); setCatDropdownOpen(true); }}
                onFocus={() => setCatDropdownOpen(true)}
                placeholder="Search and add categories..."
                style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px", color: "#fff", fontSize: "0.8rem", outline: "none", fontFamily: "inherit" }}
              />
              {catDropdownOpen && filteredCats.length > 0 && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#05152e", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "3px", zIndex: 20, maxHeight: "180px", overflowY: "auto", marginTop: "2px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                  {filteredCats.slice(0, 20).map((cat) => (
                    <button key={cat.id}
                      onClick={() => { setSelectedCategoryIds((ids) => [...ids, cat.id]); setCatSearch(""); setCatDropdownOpen(false); }}
                      style={{ width: "100%", textAlign: "left", padding: "0.5rem 0.75rem", background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 0.15s" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(44,125,247,0.1)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "none")}
                    >
                      <span>{cat.name}</span>
                      <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>{cat.postCount}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div style={{ padding: "1rem", background: "#05152e", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", marginBottom: "0.75rem" }}>SEO</label>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem" }}>SEO Title</label>
              <input type="text" value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} placeholder={form.title || "Auto-filled from title"}
                style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px", color: "#fff", fontSize: "0.8rem", outline: "none", fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem" }}>Meta Description</label>
              <textarea rows={3} value={form.seoDescription} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} placeholder="Brief description for search engines..."
                style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "3px", color: "#fff", fontSize: "0.8rem", outline: "none", resize: "none", fontFamily: "inherit" }} />
            </div>
          </div>

          {/* Options */}
          <div style={{ padding: "1rem", background: "#05152e", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                style={{ width: "16px", height: "16px", accentColor: "#2c7df7" }} />
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Mark as Featured</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
