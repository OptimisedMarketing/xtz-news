import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ChevronLeft, Save } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function AdminPostEdit() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const { data: posts = [] } = trpc.posts.adminList.useQuery({ limit: 1000, offset: 0 });
  const post = posts.find((p) => p.id === Number(id));

  const [form, setForm] = useState({
    title: "",
    slug: "",
    status: "publish" as "publish" | "draft" | "private",
    isFeatured: false,
    seoTitle: "",
    seoDescription: "",
    featuredImageUrl: "",
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        slug: post.slug,
        status: post.status,
        isFeatured: post.isFeatured,
        seoTitle: post.seoTitle || "",
        seoDescription: post.seoDescription || "",
        featuredImageUrl: post.featuredImageUrl || "",
      });
    }
  }, [post]);

  const updateMutation = trpc.posts.adminUpdate.useMutation({
    onSuccess: () => { utils.posts.adminList.invalidate(); toast.success("Post updated!"); },
    onError: () => toast.error("Update failed"),
  });

  if (!user || user.role !== "admin") {
    return <div className="container py-16 text-center"><p className="text-white/50">Access denied.</p></div>;
  }

  if (!post) {
    return <div className="container py-16 text-center"><p className="text-white/50">Post not found.</p></div>;
  }

  return (
    <div>
      <div className="py-8 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container flex items-center gap-3">
          <Link href="/admin/posts" className="text-white/40 hover:text-white"><ChevronLeft size={18} /></Link>
          <h1 className="text-xl font-black text-white">Edit Post</h1>
        </div>
      </div>
      <div className="container py-8 max-w-2xl">
        <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ id: post.id, ...form }); }} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="form-input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="form-input">
                <option value="publish">Published</option>
                <option value="draft">Draft</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-blue-500" />
                <span className="text-sm font-semibold text-white/70">Featured post</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">Featured Image URL</label>
            <input value={form.featuredImageUrl} onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })} className="form-input" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">SEO Title</label>
            <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className="form-input" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1.5">SEO Description</label>
            <textarea rows={3} value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} className="form-input resize-none" />
          </div>
          <button type="submit" disabled={updateMutation.isPending} className="btn-primary">
            <Save size={14} /> {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
