// Script to add useSEO to all tool pages
import { readFileSync, writeFileSync } from 'fs';

const TOOLS = [
  {
    file: 'client/src/pages/tools/ToolsPage.tsx',
    title: 'XTZ.News Tools — Free Tezos Blockchain Tools',
    description: 'Free on-chain tools for the Tezos community: Wallet Inspector, Whale Watcher, NFT Gallery, Staking Calculator, DeFi Dashboard, Smart Contract Inspector, and more.',
    keywords: 'Tezos tools, XTZ tools, Tezos blockchain tools, Tezos wallet inspector, Tezos DeFi, Tezos NFT, Tezos staking',
    canonical: 'https://xtz.news/tools',
    toolName: 'XTZ.News Tools',
  },
  {
    file: 'client/src/pages/tools/WalletInspectorPage.tsx',
    title: 'Tezos Wallet Inspector — Check Any XTZ Address | XTZ.News',
    description: 'Inspect any Tezos wallet address: view XTZ balance, FA2 tokens, NFT count, delegation status, staking rewards, and recent transactions. Free, no login required.',
    keywords: 'Tezos wallet inspector, XTZ wallet checker, Tezos address lookup, Tezos balance checker, tz1 address',
    canonical: 'https://xtz.news/tools/wallet',
    toolName: 'Tezos Wallet Inspector',
  },
  {
    file: 'client/src/pages/tools/WhaleWatcherPage.tsx',
    title: 'Tezos Whale Watcher — Live Large XTZ Transfers | XTZ.News',
    description: 'Watch large XTZ transfers on the Tezos network in real time. Filter by minimum amount (10K–1M+ XTZ). Auto-refreshes every 15 seconds.',
    keywords: 'Tezos whale watcher, large XTZ transfers, Tezos on-chain activity, XTZ whale tracker',
    canonical: 'https://xtz.news/tools/whale-watcher',
    toolName: 'Tezos Whale Watcher',
  },
  {
    file: 'client/src/pages/tools/NftGalleryPage.tsx',
    title: 'Tezos NFT Gallery — View Any Wallet\'s NFTs | XTZ.News',
    description: 'View all Tezos NFTs held by any wallet address. Beautiful visual gallery with links to objkt.com. Free, no login required.',
    keywords: 'Tezos NFT gallery, XTZ NFT viewer, Tezos NFT collection, objkt NFT, Tezos FA2 tokens',
    canonical: 'https://xtz.news/tools/nft-gallery',
    toolName: 'Tezos NFT Gallery',
  },
  {
    file: 'client/src/pages/tools/RewardCalculatorPage.tsx',
    title: 'Tezos Reward Calculator — Baking & Delegation History | XTZ.News',
    description: 'View baking or delegation reward history for any Tezos address. See APY per cycle, past bakers, total rewards earned, and delegation history.',
    keywords: 'Tezos reward calculator, XTZ staking rewards, Tezos delegation rewards, Tezos baking APY, XTZ yield',
    canonical: 'https://xtz.news/tools/rewards',
    toolName: 'Tezos Reward Calculator',
  },
  {
    file: 'client/src/pages/tools/PortfolioTrackerPage.tsx',
    title: 'Tezos Portfolio Tracker — Multi-Wallet Dashboard | XTZ.News',
    description: 'Track up to 5 Tezos wallets at once. See combined XTZ balance, total USD value, token holdings, NFT count, and delegation status. Share with a link.',
    keywords: 'Tezos portfolio tracker, XTZ portfolio, multi-wallet Tezos, Tezos wallet dashboard',
    canonical: 'https://xtz.news/tools/portfolio',
    toolName: 'Tezos Portfolio Tracker',
  },
  {
    file: 'client/src/pages/tools/AddressBookPage.tsx',
    title: 'Tezos Address Book — Save & Label Wallets | XTZ.News',
    description: 'Save and label your frequently-used Tezos addresses. Stored locally in your browser — no account needed. One-click access to wallet tools.',
    keywords: 'Tezos address book, save Tezos addresses, XTZ wallet labels, Tezos wallet manager',
    canonical: 'https://xtz.news/tools/address-book',
    toolName: 'Tezos Address Book',
  },
  {
    file: 'client/src/pages/tools/TokenPriceHistoryPage.tsx',
    title: 'Tezos Token Price History — FA2 Trade Charts | XTZ.News',
    description: 'View trade history and price charts for any Tezos FA2 token. See high, low, average price, and volume. Powered by objkt.com data.',
    keywords: 'Tezos token price, FA2 token history, Tezos token chart, QUIPU price, kUSD price, Tezos DeFi tokens',
    canonical: 'https://xtz.news/tools/token-price',
    toolName: 'Tezos Token Price History',
  },
  {
    file: 'client/src/pages/tools/AirdropCheckerPage.tsx',
    title: 'Tezos Airdrop Checker — Token Eligibility | XTZ.News',
    description: 'Check if your Tezos address holds tokens from 10 major protocols: QuipuSwap, Youves, Kolibri, Tezos Domains, objkt.com, and more.',
    keywords: 'Tezos airdrop checker, XTZ token eligibility, QuipuSwap QUIPU, Youves YOU, Tezos DeFi tokens',
    canonical: 'https://xtz.news/tools/airdrop',
    toolName: 'Tezos Airdrop Checker',
  },
  {
    file: 'client/src/pages/tools/BatchAddressLookupPage.tsx',
    title: 'Tezos Batch Address Lookup — Check 100 Wallets at Once | XTZ.News',
    description: 'Paste up to 100 Tezos addresses and get XTZ balance, staking, delegation, and activity for each. Export to CSV. Perfect for DAOs and event organisers.',
    keywords: 'Tezos batch lookup, XTZ bulk address check, Tezos DAO tools, Tezos airdrop distribution',
    canonical: 'https://xtz.news/tools/batch-lookup',
    toolName: 'Tezos Batch Address Lookup',
  },
  {
    file: 'client/src/pages/tools/TnsLookupPage.tsx',
    title: 'Tezos Name Service Lookup — .tez Domain Resolver | XTZ.News',
    description: 'Resolve .tez domains to Tezos addresses, or find all .tez names owned by an address. Shows expiry dates and all domains by the same owner.',
    keywords: 'Tezos domains, .tez domain lookup, TNS resolver, Tezos name service, tz1 address lookup',
    canonical: 'https://xtz.news/tools/tns',
    toolName: 'Tezos Name Service Lookup',
  },
  {
    file: 'client/src/pages/tools/LiveOpsMonitorPage.tsx',
    title: 'Tezos Live Operations Monitor — Real-Time On-Chain Activity | XTZ.News',
    description: 'Real-time feed of Tezos on-chain operations: transactions, delegations, originations, and token transfers. Filter by type and minimum XTZ amount.',
    keywords: 'Tezos live transactions, XTZ on-chain activity, Tezos blockchain monitor, Tezos operations feed',
    canonical: 'https://xtz.news/tools/live-ops',
    toolName: 'Tezos Live Operations Monitor',
  },
  {
    file: 'client/src/pages/tools/SmartContractInspectorPage.tsx',
    title: 'Tezos Smart Contract Inspector — Storage & Entrypoints | XTZ.News',
    description: 'Inspect any Tezos KT1 smart contract: view live storage, entrypoints with parameter schemas, recent callers, and similar contracts.',
    keywords: 'Tezos smart contract inspector, KT1 contract viewer, Tezos contract storage, Tezos entrypoints, Tezos DeFi contracts',
    canonical: 'https://xtz.news/tools/contract',
    toolName: 'Tezos Smart Contract Inspector',
  },
  {
    file: 'client/src/pages/tools/DefiDashboardPage.tsx',
    title: 'Tezos DeFi Dashboard — Live TVL & Protocol Rankings | XTZ.News',
    description: 'Live Tezos DeFi overview: chain TVL, 90-day chart, protocol rankings with 24h/7d changes, and category breakdown. Powered by DeFiLlama.',
    keywords: 'Tezos DeFi, Tezos TVL, Youves, QuipuSwap, Kolibri, Tezos DeFi protocols, XTZ DeFi dashboard',
    canonical: 'https://xtz.news/tools/defi',
    toolName: 'Tezos DeFi Dashboard',
  },
];

for (const tool of TOOLS) {
  const path = `/home/ubuntu/xtz-news/${tool.file}`;
  let content = readFileSync(path, 'utf8');
  
  // Skip if already has useSEO
  if (content.includes('useSEO(')) {
    console.log(`SKIP (already has useSEO): ${tool.file}`);
    continue;
  }
  
  // Add import after the last import line
  const importMatch = content.match(/(^import[^;]+;[\r\n]+)+/m);
  if (!importMatch) { console.log(`SKIP (no imports): ${tool.file}`); continue; }
  
  // Add useSEO import
  content = content.replace(
    /^(import[^;]+from "@\/lib\/trpc";)/m,
    `$1\nimport { useSEO, buildToolSchema } from "@/hooks/useSEO";`
  );
  
  // Find the export default function and add useSEO call after the first {
  const funcMatch = content.match(/export default function \w+\([^)]*\)\s*\{/);
  if (!funcMatch) { console.log(`SKIP (no export default function): ${tool.file}`); continue; }
  
  const seoCall = `
  useSEO({
    title: "${tool.title}",
    description: "${tool.description}",
    keywords: "${tool.keywords}",
    canonical: "${tool.canonical}",
    jsonLd: buildToolSchema({ name: "${tool.toolName}", description: "${tool.description}", url: "${tool.canonical}" }),
  });
`;
  
  content = content.replace(
    funcMatch[0],
    funcMatch[0] + seoCall
  );
  
  writeFileSync(path, content);
  console.log(`DONE: ${tool.file}`);
}

console.log('\nAll tool pages processed.');
