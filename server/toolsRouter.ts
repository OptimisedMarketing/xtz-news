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

      // IPFS URI resolver
      const resolveIpfs = (uri: string | null | undefined): string | null => {
        if (!uri) return null;
        if (uri.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${uri.slice(7)}`;
        if (uri.startsWith("data:") || uri.startsWith("http")) return uri;
        return null;
      };

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
        firstActivity: a.firstActivityTime || null,  // ISO timestamp, not block level
        lastActivity: a.lastActivityTime || null,     // ISO timestamp, not block level
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
          thumbnailUri: resolveIpfs(tok.token?.metadata?.thumbnailUri),
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

      // For delegators: get delegation history and per-baker rewards
      const delegate = account.delegate;
      const delegationLevel = account.delegationLevel;

      // Get all delegation operations (past baker changes)
      const delegationOps = await tzkt(
        `/operations/delegations?sender=${addr}&limit=50&sort.desc=id`
      ).catch(() => []);

      // Get actual delegator rewards from TzKT
      const delegatorRewards = await tzkt(
        `/rewards/delegators/${addr}?limit=${Math.min(input.cycles, 50)}&sort.desc=cycle`
      ).catch(() => []);

      // Build delegation periods from operations
      const delegationPeriods: Array<{
        baker: string;
        bakerAlias: string | null;
        bakerAddress: string;
        from: string;
        to: string | null;
        cycleCount: number;
        totalRewards: number;
        avgApy: number | null;
      }> = [];

      if (delegationOps.length > 0) {
        // Sort oldest first
        const sorted = [...delegationOps].reverse();
        for (let i = 0; i < sorted.length; i++) {
          const op = sorted[i];
          const nextOp = sorted[i + 1];
          const bakerAddr = op.newDelegate?.address || null;
          if (!bakerAddr) continue;

          const from = op.timestamp;
          const to = nextOp ? nextOp.timestamp : null;

          // Find rewards for this baker in this period
          const periodRewards = delegatorRewards.filter((r: any) => r.baker?.address === bakerAddr);
          const totalRewards = periodRewards.reduce((s: number, r: any) => {
            return s + mutez(
              (r.blockRewardsDelegated ?? 0) +
              (r.attestationRewardsDelegated ?? 0) +
              (r.dalAttestationRewardsDelegated ?? 0)
            );
          }, 0);

          // Estimate APY from baker's rewards data
          const apyValues = periodRewards
            .filter((r: any) => r.bakerRewards?.bakingPower > 0)
            .map((r: any) => {
              const bakerTotal = (r.bakerRewards?.blockRewardsDelegated ?? 0) +
                (r.bakerRewards?.attestationRewardsDelegated ?? 0) +
                (r.bakerRewards?.dalAttestationRewardsDelegated ?? 0);
              return (bakerTotal * 365) / r.bakerRewards.bakingPower * 100;
            });
          const avgApy = apyValues.length > 0
            ? parseFloat((apyValues.reduce((s: number, v: number) => s + v, 0) / apyValues.length).toFixed(2))
            : null;

          // Estimate cycle count
          const fromDate = new Date(from);
          const toDate = to ? new Date(to) : new Date();
          const daysDiff = Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
          const cycleCount = Math.max(1, Math.floor(daysDiff)); // ~1 day per cycle

          delegationPeriods.push({
            baker: op.newDelegate?.alias || bakerAddr.slice(0, 16) + "…",
            bakerAlias: op.newDelegate?.alias || null,
            bakerAddress: bakerAddr,
            from,
            to,
            cycleCount,
            totalRewards,
            avgApy,
          });
        }
      }

      // Get balance history for the chart
      const balanceHistory = await tzkt(
        `/accounts/${addr}/balance_history?step=8192&limit=${input.cycles}`
      ).catch(() => []);

      const cycles = balanceHistory.slice(0, input.cycles).map((snap: any, i: number, arr: any[]) => {
        const prev = arr[i - 1];
        const balChange = prev ? mutez(snap.balance) - mutez(prev.balance) : 0;
        return {
          timestamp: snap.timestamp,
          balance: mutez(snap.balance),
          estimatedReward: Math.max(0, balChange),
          level: snap.level,
        };
      }).filter((c: any) => c.estimatedReward > 0);

      // Compute total rewards from actual delegator rewards data
      const totalDelegatorRewards = delegatorRewards.reduce((s: number, r: any) => {
        return s + mutez(
          (r.blockRewardsDelegated ?? 0) +
          (r.attestationRewardsDelegated ?? 0) +
          (r.dalAttestationRewardsDelegated ?? 0)
        );
      }, 0);

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
        delegationPeriods,
        totalDelegatorRewards,
        rewardCycles: delegatorRewards.slice(0, 20).map((r: any) => ({
          cycle: r.cycle,
          baker: r.baker?.alias || r.baker?.address?.slice(0, 16) + "…" || "Unknown",
          bakerAddress: r.baker?.address || null,
          delegatedBalance: mutez(r.delegatedBalance ?? 0),
          rewards: mutez(
            (r.blockRewardsDelegated ?? 0) +
            (r.attestationRewardsDelegated ?? 0) +
            (r.dalAttestationRewardsDelegated ?? 0)
          ),
        })),
        estimatedApy: null as number | null,
      };
    }),

  // ─── Portfolio Tracker ───────────────────────────────────────────────────────────────────────────────────────
  portfolioTrack: publicProcedure
    .input(z.object({
      addresses: z.array(z.string().min(10)).min(1).max(5),
    }))
    .query(async ({ input }) => {
      // Fetch XTZ price
      const priceRes = await fetch("https://api.tzkt.io/v1/quotes/last").then(r => r.json()).catch(() => ({ usd: 0 }));
      const xtzUsd = priceRes.usd ?? 0;

      // Fetch all wallets in parallel
      const walletResults = await Promise.allSettled(
        input.addresses.map(async (addr) => {
          const trimmed = addr.trim();
          const [account, tokens] = await Promise.allSettled([
            tzkt(`/accounts/${trimmed}`),
            tzkt(`/tokens/balances?account=${trimmed}&limit=30&sort.desc=lastTime`),
          ]);

          const a = account.status === "fulfilled" ? account.value : null;
          const t = tokens.status === "fulfilled" ? tokens.value : [];

          if (!a || a.type === "empty") return null;

          // Separate NFTs from fungible tokens
          const fungible = t.filter((tok: any) => {
            const meta = tok.token?.metadata;
            return !(meta?.artifactUri || meta?.displayUri || meta?.thumbnailUri || tok.token?.totalSupply === "1");
          });
          const nftCount = t.length - fungible.length;

          return {
            address: trimmed,
            alias: a.alias || null,
            type: a.type,
            balance: mutez(a.balance),
            stakedBalance: mutez(a.stakedBalance ?? 0),
            unstakedBalance: mutez(a.unstakedBalance ?? 0),
            delegatedTo: a.delegate?.alias || a.delegate?.address || null,
            delegatedToAddress: a.delegate?.address || null,
            isBaker: a.type === "delegate",
            numDelegators: a.numDelegators ?? 0,
            stakingBalance: mutez(a.stakingBalance ?? 0),
            numTransactions: a.numTransactions ?? 0,
            firstActivity: a.firstActivityTime || null,
            lastActivity: a.lastActivityTime || null,
            fungibleTokens: fungible.slice(0, 10).map((tok: any) => ({
              name: tok.token?.metadata?.name || "Unknown Token",
              symbol: tok.token?.metadata?.symbol || "",
              balance: tok.balance,
              decimals: tok.token?.metadata?.decimals ?? 0,
              contract: tok.token?.contract?.address || "",
              tokenId: tok.token?.tokenId || "0",
              thumbnailUri: tok.token?.metadata?.thumbnailUri || null,
            })),
            nftCount,
          };
        })
      );

      const wallets = walletResults
        .map(r => r.status === "fulfilled" ? r.value : null)
        .filter(Boolean) as NonNullable<typeof walletResults[0] extends PromiseFulfilledResult<infer T> ? T : never>[];

      // Aggregate totals
      const totalXtz = wallets.reduce((s, w) => s + (w as any).balance, 0);
      const totalStaked = wallets.reduce((s, w) => s + (w as any).stakedBalance, 0);
      const totalUsd = (totalXtz + totalStaked) * xtzUsd;

      // Aggregate fungible tokens across all wallets
      const tokenMap: Record<string, { name: string; symbol: string; decimals: number; totalBalance: number; thumbnailUri: string | null; wallets: string[] }> = {};
      for (const w of wallets as any[]) {
        for (const tok of w.fungibleTokens) {
          const key = `${tok.contract}:${tok.tokenId}`;
          if (!tokenMap[key]) {
            tokenMap[key] = { name: tok.name, symbol: tok.symbol, decimals: tok.decimals, totalBalance: 0, thumbnailUri: tok.thumbnailUri, wallets: [] };
          }
          tokenMap[key].totalBalance += parseFloat(tok.balance) / Math.pow(10, tok.decimals);
          tokenMap[key].wallets.push((w as any).alias || (w as any).address.slice(0, 8));
        }
      }

      return {
        wallets,
        xtzUsd,
        totals: {
          xtz: totalXtz,
          staked: totalStaked,
          usd: totalUsd,
          nfts: wallets.reduce((s, w) => s + (w as any).nftCount, 0),
          transactions: wallets.reduce((s, w) => s + (w as any).numTransactions, 0),
        },
        aggregatedTokens: Object.values(tokenMap)
          .sort((a, b) => b.totalBalance - a.totalBalance)
          .slice(0, 20),
      };
    }),
});
