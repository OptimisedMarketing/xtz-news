import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";

const TZKT = "https://api.tzkt.io/v1";

async function tzkt(path: string) {
  const res = await fetch(`${TZKT}${path}`);
  if (!res.ok) throw new Error(`TzKT ${res.status}: ${path}`);
  return res.json();
}

function mutez(v: number | null | undefined) {
  if (v == null) return 0;
  return v / 1_000_000;
}

function formatAddress(a: string | null | undefined) {
  if (!a) return null;
  return a.length > 20 ? `${a.slice(0, 8)}...${a.slice(-6)}` : a;
}

export const toolsRouter = router({

  // ─── Wallet Inspector ─────────────────────────────────────────────────────────
  walletInspect: publicProcedure
    .input(z.object({ address: z.string().min(10) }))
    .query(async ({ input }) => {
      const addr = input.address.trim();

      const [account, tokens, txs, rewards] = await Promise.allSettled([
        tzkt(`/accounts/${addr}`),
        tzkt(`/tokens/balances?account=${addr}&limit=50&sort.desc=lastTime`),
        tzkt(`/operations/transactions?anyof.sender.target=${addr}&limit=10&sort.desc=id&status=applied`),
        tzkt(`/rewards/delegators/${addr}?limit=12&sort.desc=cycle`),
      ]);

      const a = account.status === "fulfilled" ? account.value : null;
      const t = tokens.status === "fulfilled" ? tokens.value : [];
      const tx = txs.status === "fulfilled" ? txs.value : [];
      const r = rewards.status === "fulfilled" ? rewards.value : [];

      if (!a || a.type === "empty") return null;

      // Separate NFTs from fungible tokens
      const nfts = t.filter((tok: any) => {
        const meta = tok.token?.metadata;
        return meta?.artifactUri || meta?.displayUri || meta?.thumbnailUri || tok.token?.totalSupply === "1";
      });
      const fungible = t.filter((tok: any) => {
        const meta = tok.token?.metadata;
        return !(meta?.artifactUri || meta?.displayUri || meta?.thumbnailUri || tok.token?.totalSupply === "1");
      });

      // Compute total delegation rewards
      const totalRewards = r.reduce((sum: number, cycle: any) => {
        return sum + mutez((cycle.expectedRewards ?? 0) + (cycle.extraRewards ?? 0));
      }, 0);

      return {
        address: a.address,
        alias: a.alias || null,
        type: a.type,
        balance: mutez(a.balance),
        stakedBalance: mutez(a.stakedBalance ?? 0),
        unstakedBalance: mutez(a.unstakedBalance ?? 0),
        delegatedTo: a.delegate?.alias || a.delegate?.address || null,
        delegatedToAddress: a.delegate?.address || null,
        delegationLevel: a.delegationLevel || null,
        numTransactions: a.numTransactions ?? 0,
        firstActivity: a.firstActivity || null,
        lastActivity: a.lastActivity || null,
        // Baker fields (if delegate)
        isBaker: a.type === "delegate",
        numDelegators: a.numDelegators ?? 0,
        stakingBalance: mutez(a.stakingBalance ?? 0),
        // Tokens
        fungibleTokens: fungible.slice(0, 20).map((tok: any) => ({
          name: tok.token?.metadata?.name || tok.token?.contract?.alias || "Unknown Token",
          symbol: tok.token?.metadata?.symbol || "",
          balance: tok.balance,
          decimals: tok.token?.metadata?.decimals ?? 0,
          contract: tok.token?.contract?.address || "",
          tokenId: tok.token?.tokenId || "0",
          thumbnailUri: tok.token?.metadata?.thumbnailUri || null,
        })),
        nftCount: nfts.length,
        // Recent transactions
        recentTxs: tx.slice(0, 10).map((op: any) => ({
          hash: op.hash,
          timestamp: op.timestamp,
          type: op.sender?.address === addr ? "out" : "in",
          amount: mutez(op.amount),
          counterparty: op.sender?.address === addr
            ? (op.target?.alias || op.target?.address || "")
            : (op.sender?.alias || op.sender?.address || ""),
          status: op.status,
        })),
        // Delegation rewards
        rewardCycles: r.slice(0, 12).map((cycle: any) => ({
          cycle: cycle.cycle,
          balance: mutez(cycle.balance ?? 0),
          expectedRewards: mutez(cycle.expectedRewards ?? 0),
          extraRewards: mutez(cycle.extraRewards ?? 0),
        })),
        totalDelegationRewards: totalRewards,
      };
    }),

  // ─── Whale Watcher ────────────────────────────────────────────────────────────
  whaleTxs: publicProcedure
    .input(z.object({
      minXtz: z.number().min(1).max(10_000_000).default(10_000),
      limit: z.number().min(5).max(50).default(20),
    }))
    .query(async ({ input }) => {
      const minMutez = Math.floor(input.minXtz * 1_000_000);
      const txs = await tzkt(
        `/operations/transactions?amount.gt=${minMutez}&limit=${input.limit}&sort.desc=id&status=applied`
      );
      return txs.map((op: any) => ({
        hash: op.hash,
        timestamp: op.timestamp,
        amount: mutez(op.amount),
        sender: op.sender?.alias || op.sender?.address || "",
        senderAddress: op.sender?.address || "",
        target: op.target?.alias || op.target?.address || "",
        targetAddress: op.target?.address || "",
        level: op.level,
      }));
    }),

  // ─── NFT Gallery ─────────────────────────────────────────────────────────────
  nftGallery: publicProcedure
    .input(z.object({
      address: z.string().min(10),
      limit: z.number().min(1).max(100).default(48),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const addr = input.address.trim();

      // Fetch FA2 token balances with metadata
      const tokens = await tzkt(
        `/tokens/balances?account=${addr}&limit=${input.limit}&offset=${input.offset}&sort.desc=lastTime&token.metadata.artifactUri.null=false`
      );

      // Also try without the artifactUri filter to catch more NFTs
      const tokens2 = tokens.length < 5
        ? await tzkt(`/tokens/balances?account=${addr}&limit=${input.limit}&offset=${input.offset}&sort.desc=lastTime&token.standard=fa2`)
        : [];

      const all = tokens.length >= 5 ? tokens : tokens2;

      const nfts = all
        .filter((tok: any) => {
          const meta = tok.token?.metadata;
          return meta && (meta.artifactUri || meta.displayUri || meta.thumbnailUri || meta.name);
        })
        .map((tok: any) => {
          const meta = tok.token?.metadata || {};
          // Resolve IPFS URIs
          const resolveIpfs = (uri: string | null | undefined) => {
            if (!uri) return null;
            if (uri.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${uri.slice(7)}`;
            if (uri.startsWith("data:")) return uri;
            return uri;
          };
          return {
            name: meta.name || "Untitled",
            description: meta.description || "",
            artifactUri: resolveIpfs(meta.artifactUri),
            displayUri: resolveIpfs(meta.displayUri),
            thumbnailUri: resolveIpfs(meta.thumbnailUri),
            mimeType: meta.mimeType || "image/png",
            contract: tok.token?.contract?.address || "",
            contractAlias: tok.token?.contract?.alias || null,
            tokenId: tok.token?.tokenId || "0",
            balance: tok.balance,
            lastTime: tok.lastTime,
            objktUrl: tok.token?.contract?.address
              ? `https://objkt.com/tokens/${tok.token.contract.address}/${tok.token.tokenId}`
              : null,
          };
        });

      // Get total count
      const total = await tzkt(
        `/tokens/balances?account=${addr}&limit=1&offset=0&select=id&token.metadata.artifactUri.null=false`
      ).then((r: any) => r.length).catch(() => nfts.length);

      return { nfts, total: Math.max(total, nfts.length) };
    }),

  // ─── Reward Calculator ────────────────────────────────────────────────────────
  rewardHistory: publicProcedure
    .input(z.object({
      address: z.string().min(10),
      cycles: z.number().min(1).max(100).default(30),
    }))
    .query(async ({ input }) => {
      const addr = input.address.trim();

      // Get account info first
      const [account, head] = await Promise.all([
        tzkt(`/accounts/${addr}`),
        tzkt(`/head`),
      ]);

      if (!account || account.type === "empty") return null;

      const currentCycle = head.cycle ?? 0;

      // For bakers: use baker rewards endpoint
      if (account.type === "delegate") {
        const rewards = await tzkt(
          `/rewards/bakers/${addr}?limit=${input.cycles}&sort.desc=cycle`
        );
        return {
          type: "baker" as const,
          address: addr,
          alias: account.alias || null,
          balance: mutez(account.balance),
          currentCycle,
          cycles: rewards.map((r: any) => {
            const totalRewards = (r.blockRewardsDelegated ?? 0) + (r.blockRewardsStakedOwn ?? 0) +
              (r.attestationRewardsDelegated ?? 0) + (r.attestationRewardsStakedOwn ?? 0) +
              (r.dalAttestationRewardsDelegated ?? 0) + (r.dalAttestationRewardsStakedOwn ?? 0);
            const bakingPower = r.bakingPower ?? 0;
            const apy = bakingPower > 0 ? parseFloat(((totalRewards * 365) / bakingPower * 100).toFixed(2)) : null;
            return {
              cycle: r.cycle,
              totalRewards: mutez(totalRewards),
              bakingPower: mutez(bakingPower),
              apy,
              blocks: r.blocks ?? 0,
              missedBlocks: r.missedBlocks ?? 0,
              attestations: r.attestations ?? 0,
              missedAttestations: r.missedAttestations ?? 0,
            };
          }),
        };
      }

      // For delegators: use balance history to estimate rewards
      // TzKT doesn't have a direct delegator rewards endpoint, so we compute from balance changes
      // and delegation info
      const delegate = account.delegate;
      const delegationLevel = account.delegationLevel;

      // Get balance history (periodic snapshots)
      const balanceHistory = await tzkt(
        `/accounts/${addr}/balance_history?step=8192&limit=${input.cycles}`
      ).catch(() => []);

      // Estimate rewards from balance changes (rough approximation)
      const cycles = balanceHistory.slice(0, input.cycles).map((snap: any, i: number, arr: any[]) => {
        const prev = arr[i - 1];
        const balChange = prev ? mutez(snap.balance) - mutez(prev.balance) : 0;
        return {
          timestamp: snap.timestamp,
          balance: mutez(snap.balance),
          estimatedReward: Math.max(0, balChange), // only positive changes (rewards)
          level: snap.level,
        };
      }).filter((c: any) => c.estimatedReward > 0);

      return {
        type: "delegator" as const,
        address: addr,
        alias: account.alias || null,
        balance: mutez(account.balance),
        stakedBalance: mutez(account.stakedBalance ?? 0),
        delegatedTo: delegate?.alias || delegate?.address || null,
        delegatedToAddress: delegate?.address || null,
        delegationLevel,
        currentCycle,
        cycles,
        // Estimated APY based on current baker's performance
        estimatedApy: null as number | null,
      };
    }),
});
