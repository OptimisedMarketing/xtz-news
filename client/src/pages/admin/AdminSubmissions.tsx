import { Link } from "wouter";
import { ChevronLeft, FileText, Image, Check, X, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  reviewed: "bg-blue-500/15 text-blue-400",
  approved: "bg-green-500/15 text-green-400",
  rejected: "bg-red-500/15 text-red-400",
};

export default function AdminSubmissions() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data: submissions = [], isLoading } = trpc.submissions.list.useQuery();

  const updateMutation = trpc.submissions.updateStatus.useMutation({
    onSuccess: () => { utils.submissions.list.invalidate(); toast.success("Status updated"); },
  });

  if (!user || user.role !== "admin") {
    return <div className="container py-16 text-center"><p className="text-white/50">Access denied.</p></div>;
  }

  const pending = submissions.filter((s) => s.status === "pending").length;

  return (
    <div>
      <div className="py-8 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container flex items-center gap-3">
          <Link href="/admin" className="text-white/40 hover:text-white"><ChevronLeft size={18} /></Link>
          <h1 className="text-xl font-black text-white">Article Submissions</h1>
          {pending > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white ml-1" style={{ background: "var(--xtz-blue)" }}>
              {pending} pending
            </span>
          )}
        </div>
      </div>

      <div className="container py-6">
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-24 rounded" />)}</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16"><p className="text-white/40">No submissions yet.</p></div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-5 rounded" style={{ background: "var(--card-bg)", border: "1px solid var(--xtz-border)" }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_COLORS[sub.status]}`}>
                        {sub.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-white/30">{formatDate(sub.createdAt)}</span>
                    </div>
                    <h3 className="font-bold text-white">{sub.articleTitle || "Untitled"}</h3>
                    <p className="text-sm text-white/50 mt-1">
                      {sub.firstName} {sub.lastName}{sub.email ? ` — ${sub.email}` : ""}
                    </p>
                    {/* Files */}
                    <div className="flex flex-wrap gap-3 mt-3">
                      {sub.articleFileUrl && (
                        <a href={sub.articleFileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-400 hover:underline">
                          <FileText size={12} /> Article File
                        </a>
                      )}
                      {sub.bannerImageUrl && (
                        <a href={sub.bannerImageUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-400 hover:underline">
                          <Image size={12} /> Banner Image
                        </a>
                      )}
                      {sub.image2Url && (
                        <a href={sub.image2Url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-400 hover:underline">
                          <Image size={12} /> Additional Image
                        </a>
                      )}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateMutation.mutate({ id: sub.id, status: "reviewed" })}
                      className="p-2 rounded hover:bg-blue-500/10 text-white/40 hover:text-blue-400 transition-colors"
                      title="Mark as reviewed"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => updateMutation.mutate({ id: sub.id, status: "approved" })}
                      className="p-2 rounded hover:bg-green-500/10 text-white/40 hover:text-green-400 transition-colors"
                      title="Approve"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => updateMutation.mutate({ id: sub.id, status: "rejected" })}
                      className="p-2 rounded hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors"
                      title="Reject"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                {sub.adminNotes && (
                  <p className="text-xs text-white/40 mt-3 pt-3 border-t border-white/8">Notes: {sub.adminNotes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
