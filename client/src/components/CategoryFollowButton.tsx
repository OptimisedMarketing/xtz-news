import { Bell, Check, LogIn } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

type CategoryFollowButtonProps = {
  categoryId: number;
  categoryName: string;
  compact?: boolean;
};

export default function CategoryFollowButton({ categoryId, categoryName, compact = false }: CategoryFollowButtonProps) {
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();
  const { data: followedCategories = [] } = trpc.preferences.followedCategories.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const following = followedCategories.some((category) => category.id === categoryId);
  const toggle = trpc.preferences.toggleCategory.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.preferences.followedCategories.invalidate(),
        utils.preferences.forYou.invalidate(),
      ]);
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    toggle.mutate({ categoryId, following: !following });
  };

  const label = !isAuthenticated ? "Sign in to follow" : following ? "Following" : "Follow topic";
  const Icon = !isAuthenticated ? LogIn : following ? Check : Bell;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || toggle.isPending}
      aria-pressed={isAuthenticated ? following : undefined}
      aria-label={`${label}: ${categoryName}`}
      title={!isAuthenticated ? `Sign in to follow ${categoryName}` : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: compact ? "0.38rem 0.6rem" : "0.55rem 0.8rem",
        border: `1px solid ${following ? "rgba(54, 211, 153, 0.7)" : "rgba(44,125,247,0.55)"}`,
        borderRadius: "999px",
        background: following ? "rgba(54,211,153,0.12)" : "rgba(44,125,247,0.12)",
        color: following ? "#5fe4b1" : "#9cc2ff",
        fontSize: compact ? "0.66rem" : "0.74rem",
        fontWeight: 800,
        letterSpacing: "0.04em",
        cursor: loading || toggle.isPending ? "wait" : "pointer",
        opacity: loading || toggle.isPending ? 0.7 : 1,
      }}
    >
      <Icon size={compact ? 12 : 14} />
      {toggle.isPending ? "Saving…" : label}
    </button>
  );
}
