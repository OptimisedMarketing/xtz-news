import { useMemo } from "react";
import { Link } from "wouter";
import { ArrowRight, Bell, Sparkles } from "lucide-react";
import { goToReaderLogin } from "@/lib/readerAuth";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getFollowableTopics } from "@/lib/topicCatalog";
import { getMediaUrl } from "@/lib/mediaUrl";

function getRelativeDate(value: Date | string | null) {
  if (!value) return "Recently";
  const delta = Math.max(0, Date.now() - new Date(value).getTime());
  const hours = Math.floor(delta / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ForYouFeed() {
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();
  const { data: categories = [] } = trpc.categories.all.useQuery();
  const { data: preferenceData, isLoading: feedLoading } = trpc.preferences.forYou.useQuery(
    { limit: 4 },
    { enabled: isAuthenticated }
  );
  const followedCategories = preferenceData?.followedCategories ?? [];
  const posts = preferenceData?.posts ?? [];
  const followedIds = useMemo(() => new Set(followedCategories.map((category) => category.id)), [followedCategories]);
  const toggle = trpc.preferences.toggleCategory.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.preferences.followedCategories.invalidate(),
        utils.preferences.forYou.invalidate(),
      ]);
    },
  });

  const chooseTopic = (categoryId: number, following: boolean) => {
    if (!isAuthenticated) {
      goToReaderLogin();
      return;
    }
    toggle.mutate({ categoryId, following });
  };

  const allTopicChoices = useMemo(() => getFollowableTopics(categories), [categories]);
  const topicChoices = allTopicChoices.slice(0, 12);
  const additionalTopicChoices = allTopicChoices.slice(12);

  return (
    <section aria-labelledby="for-you-heading" style={{ background: "#020914", padding: "1.25rem 0 0" }}>
      <div className="container">
        <div style={{ border: "1px solid rgba(44,125,247,0.28)", borderRadius: "10px", padding: "1rem", background: "linear-gradient(135deg, rgba(20,75,156,0.18), rgba(5,21,46,0.95) 48%, rgba(5,21,46,0.98))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap", marginBottom: isAuthenticated && followedCategories.length > 0 ? "0.9rem" : 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem" }}>
              <div style={{ width: "32px", height: "32px", display: "grid", placeItems: "center", borderRadius: "8px", background: "rgba(44,125,247,0.2)", color: "#8ebdff", flexShrink: 0 }}><Sparkles size={17} /></div>
              <div>
                <h2 id="for-you-heading" style={{ margin: 0, fontSize: "0.95rem", color: "#fff", fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase" }}>For You</h2>
                <p style={{ margin: "0.25rem 0 0", color: "rgba(255,255,255,0.56)", fontSize: "0.76rem", lineHeight: 1.45 }}>
                  {isAuthenticated && followedCategories.length > 0
                    ? `Fresh reporting from ${followedCategories.map((category) => category.name).slice(0, 3).join(", ")}${followedCategories.length > 3 ? " and more" : ""}.`
                    : "Follow the Tezos topics you care about to shape this feed."}
                </p>
              </div>
            </div>
            {!isAuthenticated && !loading && (
              <button type="button" onClick={() => { goToReaderLogin(); }} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 0.7rem", border: "1px solid rgba(44,125,247,0.6)", borderRadius: "6px", color: "#a7c9ff", background: "rgba(44,125,247,0.12)", fontSize: "0.7rem", fontWeight: 800, cursor: "pointer" }}><Bell size={13} /> Sign in to personalise</button>
            )}
          </div>

          {!isAuthenticated && !loading ? null : feedLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.6rem", marginTop: "0.9rem" }}>
              {Array.from({ length: 4 }).map((_, index) => <div key={index} className="skeleton" style={{ height: "68px", borderRadius: "6px" }} />)}
            </div>
          ) : followedCategories.length === 0 ? (
            <div style={{ marginTop: "0.9rem" }}>
              <p style={{ margin: "0 0 0.55rem", color: "rgba(255,255,255,0.42)", fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>Choose your crypto & ecosystem topics</p>
              <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                {topicChoices.map((category) => <button key={category.id} type="button" onClick={() => chooseTopic(category.id, true)} disabled={toggle.isPending} style={{ padding: "0.42rem 0.6rem", border: "1px solid rgba(255,255,255,0.13)", background: "rgba(255,255,255,0.045)", color: "rgba(255,255,255,0.78)", borderRadius: "999px", cursor: "pointer", fontSize: "0.7rem", fontWeight: 700 }}>{category.name}</button>)}
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(205px, 1fr))", gap: "0.55rem" }}>
                {posts.map((post) => (
                  <Link key={post.id} href={`/${post.slug}`} style={{ display: "flex", gap: "0.6rem", minWidth: 0, padding: "0.55rem", borderRadius: "6px", textDecoration: "none", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {post.featuredImageUrl ? <img src={getMediaUrl(post.featuredImageUrl)} alt="" style={{ width: "50px", height: "50px", borderRadius: "4px", objectFit: "cover", flexShrink: 0 }} /> : <div style={{ width: "50px", height: "50px", borderRadius: "4px", background: "#0b2548", flexShrink: 0 }} />}
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, color: "#fff", fontSize: "0.74rem", lineHeight: 1.32, fontWeight: 800, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.title}</p>
                      <span style={{ display: "block", marginTop: "0.3rem", color: "rgba(255,255,255,0.42)", fontSize: "0.62rem" }}>{post.categories[0]?.name ?? "Tezos News"} · {getRelativeDate(post.publishedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
              {posts.length === 0 && <p style={{ margin: "0.6rem 0 0", color: "rgba(255,255,255,0.55)", fontSize: "0.76rem" }}>New stories from your topics will appear here as they are published.</p>}
              <details style={{ marginTop: "0.75rem" }}>
                <summary style={{ cursor: "pointer", color: "#93bfff", fontSize: "0.7rem", fontWeight: 800, listStyle: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>Manage crypto topics ({allTopicChoices.length}) <ArrowRight size={12} /></summary>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.65rem" }}>
                  {topicChoices.map((category) => {
                    const following = followedIds.has(category.id);
                    return <button key={category.id} type="button" onClick={() => chooseTopic(category.id, !following)} disabled={toggle.isPending} aria-pressed={following} style={{ padding: "0.4rem 0.58rem", border: `1px solid ${following ? "rgba(54,211,153,0.6)" : "rgba(255,255,255,0.14)"}`, background: following ? "rgba(54,211,153,0.12)" : "rgba(255,255,255,0.04)", color: following ? "#5fe4b1" : "rgba(255,255,255,0.7)", borderRadius: "999px", cursor: "pointer", fontSize: "0.68rem", fontWeight: 700 }}>{following ? "✓ " : "+ "}{category.name}</button>;
                  })}
                </div>
                {additionalTopicChoices.length > 0 && (
                  <details style={{ marginTop: "0.65rem" }}>
                    <summary style={{ cursor: "pointer", color: "rgba(255,255,255,0.58)", fontSize: "0.66rem", fontWeight: 800, listStyle: "none" }}>More Tezos topics ({additionalTopicChoices.length})</summary>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.55rem" }}>
                      {additionalTopicChoices.map((category) => {
                        const following = followedIds.has(category.id);
                        return <button key={category.id} type="button" onClick={() => chooseTopic(category.id, !following)} disabled={toggle.isPending} aria-pressed={following} style={{ padding: "0.4rem 0.58rem", border: `1px solid ${following ? "rgba(54,211,153,0.6)" : "rgba(255,255,255,0.14)"}`, background: following ? "rgba(54,211,153,0.12)" : "rgba(255,255,255,0.04)", color: following ? "#5fe4b1" : "rgba(255,255,255,0.7)", borderRadius: "999px", cursor: "pointer", fontSize: "0.68rem", fontWeight: 700 }}>{following ? "✓ " : "+ "}{category.name}</button>;
                      })}
                    </div>
                  </details>
                )}
              </details>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
