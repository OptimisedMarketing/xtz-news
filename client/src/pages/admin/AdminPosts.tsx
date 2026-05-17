import { useState } from "react";
import { Link } from "wouter";
import { Pencil, Trash2, Eye, Star, StarOff, ChevronLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminPosts() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const PAGE = 20;
  const utils = trpc.useUtils();

  const { data: posts = [], isLoading } = trpc.posts.adminList.useQuery({ limit: PAGE, offset: (page - 1) * PAGE });

  const updateMutation = trpc.posts.adminUpdate.useMutation({
    onSuccess: () => { utils.posts.adminList.invalidate(); toast.success("Updated"); },
  });
  const deleteMutation = trpc.posts.adminDelete.useMutation({
    onSuccess: () => { utils.posts.adminList.invalidate(); toast.success("Deleted"); },
    onError: () => toast.error("Delete failed"),
  });

  if (!user || user.role !== "admin") {
    return <div className="container py-16 text-center"><p className="text-white/50">Access denied.</p></div>;
  }

  return (
    <div>
      <div className="py-8 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-white/40 hover:text-white"><ChevronLeft size={18} /></Link>
            <h1 className="text-xl font-black text-white">Posts</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40">{posts.length} shown</span>
            <Link href="/admin/posts/new" className="btn-primary text-xs py-1.5 px-3">+ New Article</Link>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton h-12 rounded" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 text-xs font-bold uppercase tracking-widest text-white/40 pr-4">Title</th>
                  <th className="pb-3 text-xs font-bold uppercase tracking-widest text-white/40 pr-4">Status</th>
                  <th className="pb-3 text-xs font-bold uppercase tracking-widest text-white/40 pr-4">Date</th>
                  <th className="pb-3 text-xs font-bold uppercase tracking-widest text-white/40 pr-4">Views</th>
                  <th className="pb-3 text-xs font-bold uppercase tracking-widest text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/3 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-white/80 line-clamp-1 max-w-xs">{post.title}</p>
                      <p className="text-xs text-white/30">{post.slug}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${post.status === "publish" ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400"}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-white/40 text-xs whitespace-nowrap">{formatDate(post.publishedAt)}</td>
                    <td className="py-3 pr-4 text-white/40 text-xs">{post.viewCount}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <a href={`/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="View"><Eye size={13} /></a>
                        <button
                          onClick={() => updateMutation.mutate({ id: post.id, isFeatured: !post.isFeatured })}
                          className="p-1.5 rounded hover:bg-white/10 transition-colors"
                          title={post.isFeatured ? "Unfeature" : "Feature"}
                        >
                          {post.isFeatured ? <Star size={13} className="text-yellow-400" /> : <StarOff size={13} className="text-white/30" />}
                        </button>
                        <Link href={`/admin/posts/${post.id}`} className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-blue-400 transition-colors" title="Edit"><Pencil size={13} /></Link>
                        <button
                          onClick={() => { if (confirm("Delete this post?")) deleteMutation.mutate({ id: post.id }); }}
                          className="p-1.5 rounded hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex gap-2 mt-6">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="page-btn disabled:opacity-30">‹ Prev</button>
          <button onClick={() => setPage(page + 1)} disabled={posts.length < PAGE} className="page-btn disabled:opacity-30">Next ›</button>
        </div>
      </div>
    </div>
  );
}
