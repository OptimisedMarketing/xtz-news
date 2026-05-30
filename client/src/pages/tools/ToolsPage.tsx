import { Link } from "wouter";
import { Search, Eye, Image, TrendingUp, ChevronRight, Home, ExternalLink } from "lucide-react";

const TOOLS = [
  {
    href: "/tools/wallet",
    icon: "🔍",
    title: "Wallet Inspector",
    description: "Enter any Tezos address to see XTZ balance, FA2 tokens, NFT count, delegation status, staking rewards, and recent transactions.",
    badge: "Read-only",
    badgeColor: "#22c55e",
    tags: ["Balance", "Tokens", "Delegation", "Transactions"],
  },
  {
    href: "/tools/whale-watcher",
    icon: "🐋",
    title: "Whale Watcher",
    description: "Live feed of large XTZ transfers on the Tezos network. Set your own threshold and watch big moves happen in real time.",
    badge: "Live",
    badgeColor: "#2c7df7",
    tags: ["Live Feed", "Large Transfers", "On-Chain"],
  },
  {
    href: "/tools/nft-gallery",
    icon: "🖼️",
    title: "NFT Gallery",
    description: "Enter any Tezos wallet address to view a beautiful visual gallery of all their NFTs — with links to objkt.com.",
    badge: "Read-only",
    badgeColor: "#22c55e",
    tags: ["NFTs", "FA2", "objkt", "Gallery"],
  },
  {
    href: "/tools/rewards",
    icon: "💰",
    title: "Reward Calculator",
    description: "Enter any address to see a full history of delegation or baking rewards cycle by cycle, with APY trends and totals.",
    badge: "Read-only",
    badgeColor: "#22c55e",
    tags: ["Rewards", "APY", "Delegation", "Baking"],
  },
  {
    href: "/tools/portfolio",
    icon: "📊",
    title: "Portfolio Tracker",
    description: "Track up to 5 Tezos wallets at once. See combined XTZ balance, total USD value, token holdings, NFT count, and delegation status per wallet.",
    badge: "Multi-wallet",
    badgeColor: "#8b5cf6",
    tags: ["Portfolio", "Multi-wallet", "USD Value", "Tokens"],
  },
  {
    href: "/tools/address-book",
    icon: "📒",
    title: "Address Book",
    description: "Save and label your frequently-used Tezos addresses. Stored locally in your browser — no account needed. One-click access to Inspect, NFTs, and Rewards.",
    badge: "Local",
    badgeColor: "#f59e0b",
    tags: ["Saved Addresses", "Labels", "Local Storage"],
  },
  {
    href: "/tools/token-price",
    icon: "📈",
    title: "Token Price History",
    description: "View trade history and price chart for any FA2 token on Tezos. Powered by objkt.com data — see high, low, average, and volume.",
    badge: "Read-only",
    badgeColor: "#22c55e",
    tags: ["FA2 Tokens", "Price Chart", "Trade History", "objkt"],
  },
  {
    href: "/tools/airdrop",
    icon: "🎁",
    title: "Airdrop Checker",
    description: "Check if your address holds tokens from 10 major Tezos protocols — QuipuSwap, Youves, Kolibri, Tezos Domains, objkt.com, and more.",
    badge: "Read-only",
    badgeColor: "#22c55e",
    tags: ["Airdrops", "Token Eligibility", "DeFi", "NFTs"],
  },
  {
    href: "/tools/batch-lookup",
    icon: "📋",
    title: "Batch Address Lookup",
    description: "Paste up to 100 Tezos addresses and get XTZ balance, staking, delegation, and activity for each. Export results to CSV.",
    badge: "Export CSV",
    badgeColor: "#f97316",
    tags: ["Batch", "CSV Export", "DAOs", "Events"],
  },
  {
    href: "/tools/tns",
    icon: "🌐",
    title: "TNS Lookup",
    description: "Resolve .tez domains to addresses, or enter a Tezos address to find all .tez names it owns. Shows expiry dates and all domains by the same owner.",
    badge: "Read-only",
    badgeColor: "#22c55e",
    tags: [".tez Domains", "Reverse Lookup", "Tezos Domains"],
  },
  {
    href: "/tools/live-ops",
    icon: "⚡",
    title: "Live Operations Monitor",
    description: "Real-time feed of Tezos on-chain operations: transactions, delegations, contract originations, and token transfers. Filter by type and minimum amount.",
    badge: "Live",
    badgeColor: "#2c7df7",
    tags: ["Live Feed", "Transactions", "Delegations", "Tokens"],
  },
];

export default function ToolsPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #05152e 0%, #0d2a5e 100%)", borderBottom: "1px solid rgba(44,125,247,0.2)", padding: "2.5rem 0 2rem" }}>
        <div className="container">
          <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "1.25rem", fontSize: "0.75rem", fontWeight: 600 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", textDecoration: "none" }}><Home size={12} /></Link>
            <ChevronRight size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span style={{ color: "rgba(255,255,255,0.7)" }}>XTZ Tools</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div style={{ width: "42px", height: "42px", background: "rgba(44,125,247,0.2)", border: "1px solid rgba(44,125,247,0.4)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>🛠️</div>
                <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>XTZ.News Tools</h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", margin: 0, maxWidth: "600px" }}>
                Free on-chain tools for the Tezos community. No wallet connection required — just enter any address and explore. Built on the public TzKT API.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.875rem", background: "rgba(44,125,247,0.08)", border: "1px solid rgba(44,125,247,0.2)", borderRadius: "6px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>Powered by TzKT API · Free · No login</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tool grid */}
      <div className="container" style={{ padding: "2.5rem 1.25rem 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} style={{ textDecoration: "none", display: "block" }}>
              <div
                style={{ background: "#05152e", border: "1px solid rgba(44,125,247,0.15)", borderRadius: "12px", padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column", transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s", cursor: "pointer" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-4px)";
                  el.style.borderColor = "rgba(44,125,247,0.4)";
                  el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "rgba(44,125,247,0.15)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "44px", height: "44px", background: "rgba(44,125,247,0.12)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>
                      {tool.icon}
                    </div>
                    <div>
                      <h2 style={{ fontSize: "1rem", fontWeight: 800, color: "#fff", margin: "0 0 0.2rem", letterSpacing: "-0.01em" }}>{tool.title}</h2>
                      <span style={{ fontSize: "0.62rem", fontWeight: 700, padding: "2px 7px", borderRadius: "10px", background: `${tool.badgeColor}22`, color: tool.badgeColor, border: `1px solid ${tool.badgeColor}44` }}>
                        {tool.badge}
                      </span>
                    </div>
                  </div>
                  <ExternalLink size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0, marginTop: "2px" }} />
                </div>

                {/* Description */}
                <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: "0 0 1rem", flex: 1 }}>
                  {tool.description}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {tool.tags.map(tag => (
                    <span key={tag} style={{ fontSize: "0.62rem", fontWeight: 600, padding: "2px 8px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming soon section */}
        <div style={{ marginTop: "3rem", padding: "1.5rem", background: "rgba(44,125,247,0.04)", border: "1px dashed rgba(44,125,247,0.2)", borderRadius: "10px" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Coming Soon</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {["Token Explorer", "Smart Contract Inspector", "Tezos Wallet Connect (Beacon)"].map(name => (
              <span key={name} style={{ fontSize: "0.78rem", padding: "0.35rem 0.875rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", color: "rgba(255,255,255,0.35)" }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
