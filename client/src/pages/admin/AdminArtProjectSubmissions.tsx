import React, { useMemo, useState } from "react";
import { Check, ChevronLeft, ExternalLink, Eye, Loader2, Palette, Search, X } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

type ReviewStatus = "pending" | "reviewed" | "approved" | "rejected";

const STATUS_COLORS: Record<ReviewStatus, string> = {
  pending: "bg-amber-400/15 text-amber-300",
  reviewed: "bg-sky-400/15 text-sky-300",
  approved: "bg-emerald-400/15 text-emerald-300",
  rejected: "bg-rose-400/15 text-rose-300",
};

const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "Pending",
  reviewed: "Reviewed",
  approved: "Approved",
  rejected: "Rejected",
};

function formatDate(value: Date | string | null | undefined) {
  return value ? new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—";
}

export default function AdminArtProjectSubmissions() {
  const { user, loading } = useAuth();
  const utils = trpc.useUtils();
  const { data: submissions = [], isLoading, isError } = trpc.artProjectSubmissions.list.useQuery(undefined, { enabled: user?.role === "admin" });
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("pending");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});

  const update = trpc.artProjectSubmissions.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.artProjectSubmissions.list.invalidate();
      toast.success("Submission status updated");
    },
    onError: () => toast.error("The submission could not be updated. Please try again."),
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return submissions.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const searchable = `${item.projectName} ${item.submitterName} ${item.submitterEmail} ${item.submitterType} ${item.projectType}`.toLowerCase();
      return matchesStatus && (!query || searchable.includes(query));
    }).sort((left, right) => {
      const leftTime = new Date(left.createdAt).getTime();
      const rightTime = new Date(right.createdAt).getTime();
      return sortOrder === "newest" ? rightTime - leftTime : leftTime - rightTime;
    });
  }, [search, sortOrder, statusFilter, submissions]);

  const pendingCount = submissions.filter((item) => item.status === "pending").length;
  const visibleIds = filtered.map((item) => item.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  const updateOne = (id: number, status: ReviewStatus) => {
    update.mutate({ id, status, notes: notes[id]?.trim() || undefined });
  };

  const updateSelected = async (status: ReviewStatus) => {
    const ids = selectedIds.filter((id) => submissions.some((item) => item.id === id));
    if (!ids.length) return;
    try {
      await Promise.all(ids.map((id) => update.mutateAsync({ id, status, notes: notes[id]?.trim() || undefined })));
      setSelectedIds([]);
    } catch {
      // The mutation-level error notification gives the editor clear feedback.
    }
  };

  if (loading) return <div className="container py-16 text-center"><div className="skeleton h-8 w-56 mx-auto" /></div>;
  if (!user || user.role !== "admin") return <div className="container py-16 text-center"><h1 className="text-2xl font-black text-white">Access denied</h1><p className="text-white/50 mt-3">This review queue is available to XTZ.News administrators only.</p><Link href="/" className="btn-primary inline-flex mt-6">Back to home</Link></div>;

  return <div>
    <header className="py-8 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
      <div className="container flex items-center gap-3">
        <Link href="/admin" aria-label="Back to dashboard" className="text-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"><ChevronLeft size={18} /></Link>
        <div className="flex-1 min-w-0"><p className="text-xs font-bold tracking-widest uppercase text-pink-300 mb-1">Editorial queue</p><h1 className="text-xl font-black text-white">Art on Tezos submissions</h1></div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300">{pendingCount} pending</span>
      </div>
    </header>

    <main className="container py-6">
      <div className="mb-5 p-4 rounded-lg border border-pink-300/20 bg-pink-300/5 text-sm text-white/65 leading-relaxed">Every entry has been submitted for editorial review. Approving a submission changes its queue status only; it does not create or publish a directory profile automatically.</div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_auto] gap-3 mb-4">
        <label className="relative"><span className="sr-only">Search art project submissions</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search project, contact, or collection group" className="w-full min-h-10 rounded border border-white/15 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-pink-300" /></label>
        <label className="text-xs text-white/55">Status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as ReviewStatus | "all")} className="block w-full mt-1 min-h-10 rounded border border-white/15 bg-[#09152d] px-3 text-sm text-white"><option value="all">All statuses</option>{(Object.keys(STATUS_LABELS) as ReviewStatus[]).map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select></label>
        <label className="text-xs text-white/55">Sort<select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")} className="block w-full mt-1 min-h-10 rounded border border-white/15 bg-[#09152d] px-3 text-sm text-white"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer"><input type="checkbox" checked={allVisibleSelected} onChange={() => setSelectedIds(allVisibleSelected ? selectedIds.filter((id) => !visibleIds.includes(id)) : Array.from(new Set([...selectedIds, ...visibleIds])))} className="accent-pink-300" /> Select visible ({selectedIds.length})</label><div className="flex flex-wrap gap-2"><button type="button" disabled={!selectedIds.length || update.isPending} onClick={() => updateSelected("reviewed")} className="min-h-9 px-3 rounded border border-sky-300/30 text-sky-300 text-xs font-bold disabled:opacity-40">Mark reviewed</button><button type="button" disabled={!selectedIds.length || update.isPending} onClick={() => updateSelected("approved")} className="min-h-9 px-3 rounded border border-emerald-300/30 text-emerald-300 text-xs font-bold disabled:opacity-40">Approve selected</button><button type="button" disabled={!selectedIds.length || update.isPending} onClick={() => updateSelected("rejected")} className="min-h-9 px-3 rounded border border-rose-300/30 text-rose-300 text-xs font-bold disabled:opacity-40">Reject selected</button></div></div>
      {isLoading ? <div className="space-y-3">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="skeleton h-48 rounded" />)}</div> : isError ? <div className="rounded border border-rose-300/30 p-6 text-rose-200">The review queue could not be loaded. Refresh the page and try again.</div> : filtered.length === 0 ? <div className="rounded border border-white/10 p-12 text-center"><Palette className="mx-auto text-pink-300 mb-3" /><p className="text-white/65">No Art on Tezos submissions match this view.</p></div> : <div className="space-y-4">{filtered.map((submission) => <article key={submission.id} className="p-5 rounded-lg border border-white/10 bg-white/[0.03]"><div className="flex items-start gap-3"><input aria-label={`Select ${submission.projectName}`} type="checkbox" checked={selectedIds.includes(submission.id)} onChange={() => setSelectedIds((ids) => ids.includes(submission.id) ? ids.filter((id) => id !== submission.id) : [...ids, submission.id])} className="mt-1 accent-pink-300" /><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 items-center"><span className={`text-[0.65rem] px-2 py-0.5 rounded font-black uppercase tracking-wider ${STATUS_COLORS[submission.status as ReviewStatus]}`}>{STATUS_LABELS[submission.status as ReviewStatus]}</span><span className="text-xs text-white/35">Submitted {formatDate(submission.createdAt)}</span><span className="text-xs text-pink-200/75 capitalize">{submission.projectType.replace("_", " ")}</span></div><h2 className="mt-2 text-lg font-black text-white">{submission.projectName}</h2><p className="mt-1 text-sm text-white/65">{submission.submitterName} · {submission.submitterType} · <a href={`mailto:${submission.submitterEmail}`} className="text-blue-300 hover:underline">{submission.submitterEmail}</a></p><a href={submission.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-sm text-blue-300 hover:underline">Open submitted website <ExternalLink size={13} /></a><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/75">{submission.description}</p><label className="block mt-4 text-xs font-bold text-white/55">Editorial note<textarea value={notes[submission.id] ?? submission.adminNotes ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [submission.id]: event.target.value }))} maxLength={2000} rows={2} placeholder="Optional internal note saved with the status action" className="mt-1 block w-full rounded border border-white/15 bg-black/20 p-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-pink-300" /></label></div><div className="flex flex-col gap-2 shrink-0"><button type="button" onClick={() => updateOne(submission.id, "reviewed")} disabled={update.isPending} className="inline-flex justify-center items-center gap-1 min-h-9 px-3 rounded border border-sky-300/30 text-sky-300 text-xs font-bold disabled:opacity-40"><Eye size={14} /> Review</button><button type="button" onClick={() => updateOne(submission.id, "approved")} disabled={update.isPending} className="inline-flex justify-center items-center gap-1 min-h-9 px-3 rounded border border-emerald-300/30 text-emerald-300 text-xs font-bold disabled:opacity-40"><Check size={14} /> Approve</button><button type="button" onClick={() => updateOne(submission.id, "rejected")} disabled={update.isPending} className="inline-flex justify-center items-center gap-1 min-h-9 px-3 rounded border border-rose-300/30 text-rose-300 text-xs font-bold disabled:opacity-40"><X size={14} /> Reject</button></div></div></article>)}</div>}
      {update.isPending && <p role="status" className="fixed bottom-5 right-5 rounded bg-[#0b1830] border border-white/15 px-4 py-3 text-sm text-white shadow-xl"><Loader2 className="inline mr-2 animate-spin" size={15} />Updating review queue…</p>}
    </main>
  </div>;
}
