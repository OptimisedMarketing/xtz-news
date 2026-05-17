import { Link } from "wouter";
import { FileText, Tag, FolderOpen, Inbox, BarChart2, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const { data: postCount } = trpc.posts.count.useQuery();
  const { data: categories = [] } = trpc.categories.all.useQuery();
  const { data: submissions = [] } = trpc.submissions.list.useQuery(undefined, { enabled: user?.role === "admin" });

  if (loading) {
    return <div className="container py-16 text-center"><div className="skeleton h-8 w-48 mx-auto" /></div>;
  }

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
        <p className="text-white/50 mb-6">Please log in to access the admin dashboard.</p>
        <a href={getLoginUrl()} className="btn-primary">Log In</a>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-white/50 mb-6">You don't have permission to access this area.</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter((s) => s.status === "pending").length;

  const stats = [
    { label: "Total Posts", value: postCount ?? "—", icon: <FileText size={20} />, href: "/admin/posts" },
    { label: "Categories", value: categories.length, icon: <Tag size={20} />, href: "/admin/categories" },
    { label: "Submissions", value: submissions.length, icon: <Inbox size={20} />, href: "/admin/submissions", badge: pendingSubmissions },
    { label: "Projects", value: "—", icon: <FolderOpen size={20} />, href: "/admin/projects" },
  ];

  const quickLinks = [
    { label: "Manage Posts", href: "/admin/posts", icon: <FileText size={16} /> },
    { label: "Manage Categories", href: "/admin/categories", icon: <Tag size={16} /> },
    { label: "Manage Projects", href: "/admin/projects", icon: <FolderOpen size={16} /> },
    { label: "Article Submissions", href: "/admin/submissions", icon: <Inbox size={16} />, badge: pendingSubmissions },
    { label: "Newsletter Subscribers", href: "/admin/subscribers", icon: <BarChart2 size={16} /> },
  ];

  return (
    <div>
      <div className="py-10 border-b border-white/10" style={{ background: "var(--xtz-navy)" }}>
        <div className="container flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Admin</p>
            <h1 className="text-2xl font-black text-white">Dashboard</h1>
            <p className="text-sm text-white/40 mt-1">Welcome back, {user.name}</p>
          </div>
          <Link href="/" className="btn-read-more text-xs">← View Site</Link>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="p-5 rounded hover:bg-white/5 transition-colors relative group"
              style={{ background: "var(--card-bg)", border: "1px solid var(--xtz-border)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-blue-400">{stat.icon}</div>
                {stat.badge ? (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "var(--xtz-blue)" }}>
                    {stat.badge} new
                  </span>
                ) : null}
              </div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">{stat.label}</p>
              <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-blue-400 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <h2 className="section-title mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center justify-between p-4 rounded hover:bg-white/5 transition-colors"
              style={{ background: "var(--card-bg)", border: "1px solid var(--xtz-border)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-blue-400">{link.icon}</span>
                <span className="font-semibold text-white text-sm">{link.label}</span>
                {link.badge ? (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "var(--xtz-blue)" }}>
                    {link.badge}
                  </span>
                ) : null}
              </div>
              <ChevronRight size={14} className="text-white/30" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
