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

  // ─── Token Price History ───────────────────────────────────────────────────────────────────────────────────────
  tokenPriceHistory: publicProcedure
    .input(z.object({
      contract: z.string().min(10),
      tokenId: z.string().default("0"),
    }))
    .query(async ({ input }) => {
      const { contract, tokenId } = input;

      // Query objkt.com GraphQL for trade events
      const query = `{
        event(
          where: {
            token: { fa_contract: { _eq: "${contract}" }, token_id: { _eq: "${tokenId}" } }
            price_xtz: { _gt: "0" }
          }
          limit: 200
          order_by: { timestamp: desc }
        ) {
          timestamp
          price_xtz
          amount
          buyer_address
          seller_address
          token { name fa_contract token_id }
        }
      }`;

      const res = await fetch("https://data.objkt.com/v3/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`objkt API error: ${res.status}`);
      const json = await res.json();
      const events = json.data?.event ?? [];

      if (events.length === 0) return null;

      const tokenName = events[0]?.token?.name || null;
      const trades = events.map((e: any) => ({
        timestamp: e.timestamp,
        priceXtz: e.price_xtz / 1_000_000,
        amount: e.amount,
        buyer: e.buyer_address || null,
        seller: e.seller_address || null,
      }));

      const prices = trades.map((t: any) => t.priceXtz);
      const totalVolume = trades.reduce((s: number, t: any) => s + t.priceXtz * t.amount, 0);

      return {
        name: tokenName,
        contract,
        tokenId,
        objktUrl: `https://objkt.com/tokens/${contract}/${tokenId}`,
        trades,
        totalVolume,
        highPrice: Math.max(...prices),
        lowPrice: Math.min(...prices),
        avgPrice: prices.reduce((s: number, p: number) => s + p, 0) / prices.length,
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

  // ─── Batch Address Lookup ───────────────────────────────────────────────────────────────────────────────────────
  batchAddressLookup: publicProcedure
    .input(z.object({
      addresses: z.array(z.string().min(10)).min(1).max(100),
    }))
    .query(async ({ input }) => {
      const addrs = Array.from(new Set(input.addresses.map(a => a.trim()).filter(Boolean)));
      if (addrs.length === 0) return [];

      // TzKT supports address.in with comma-separated list
      const chunks: string[][] = [];
      for (let i = 0; i < addrs.length; i += 50) {
        chunks.push(addrs.slice(i, i + 50));
      }

      const results: any[] = [];
      for (const chunk of chunks) {
        const encoded = chunk.join(',');
        const data = await tzkt(
          `/accounts?address.in=${encoded}&select=address,alias,balance,stakedBalance,delegate,type,numTransactions,firstActivityTime,lastActivityTime&limit=50`
        ).catch(() => []);
        results.push(...data);
      }

      // Build a map for fast lookup
      const resultMap = new Map(results.map((r: any) => [r.address, r]));

      return addrs.map(addr => {
        const r = resultMap.get(addr);
        if (!r) return { address: addr, found: false, balance: 0, stakedBalance: 0, delegatedTo: null, type: 'unknown', numTransactions: 0, firstActivity: null, lastActivity: null };
        return {
          address: addr,
          found: true,
          alias: r.alias || null,
          balance: mutez(r.balance),
          stakedBalance: mutez(r.stakedBalance ?? 0),
          delegatedTo: r.delegate?.alias || r.delegate?.address || null,
          type: r.type,
          numTransactions: r.numTransactions ?? 0,
          firstActivity: r.firstActivityTime || null,
          lastActivity: r.lastActivityTime || null,
        };
      });
    }),

  // ─── DeFi Protocol Detail ───────────────────────────────────────────────────────────────────────────────────────
  defiProtocol: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const { slug } = input;
      const LLAMA = 'https://api.llama.fi';

      // Fetch protocol detail from DeFiLlama
      const res = await fetch(`${LLAMA}/protocol/${slug}`);
      if (!res.ok) return null;
      const p = await res.json();

      if (!p.name) return null;

      // Extract TVL history (last 90 days)
      const tvlHistory = (p.tvl || []).slice(-90).map((d: any) => ({
        date: d.date,
        tvl: d.totalLiquidityUSD,
      }));

      // Get token price from CoinGecko if gecko_id available
      let tokenPrice: number | null = null;
      let tokenMarketCap: number | null = null;
      let tokenChange24h: number | null = null;
      if (p.gecko_id) {
        try {
          const cgRes = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${p.gecko_id}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
            { headers: { 'User-Agent': 'XTZNews/1.0' } }
          );
          const cgData = await cgRes.json();
          const tokenData = cgData[p.gecko_id];
          if (tokenData) {
            tokenPrice = tokenData.usd ?? null;
            tokenMarketCap = tokenData.usd_market_cap ?? null;
            tokenChange24h = tokenData.usd_24h_change ?? null;
          }
        } catch {}
      }

      // Extract contract addresses from Tezos chains
      const contractAddresses: string[] = [];
      if (p.address && p.address.startsWith('tezos:')) {
        contractAddresses.push(p.address.replace('tezos:', ''));
      }

      // TVL stats
      const currentTvl = tvlHistory[tvlHistory.length - 1]?.tvl ?? 0;
      const prevDayTvl = tvlHistory[tvlHistory.length - 2]?.tvl ?? 0;
      const prev7dTvl = tvlHistory[tvlHistory.length - 8]?.tvl ?? 0;
      const prev30dTvl = tvlHistory[tvlHistory.length - 31]?.tvl ?? 0;
      const change1d = prevDayTvl > 0 ? ((currentTvl - prevDayTvl) / prevDayTvl) * 100 : 0;
      const change7d = prev7dTvl > 0 ? ((currentTvl - prev7dTvl) / prev7dTvl) * 100 : 0;
      const change30d = prev30dTvl > 0 ? ((currentTvl - prev30dTvl) / prev30dTvl) * 100 : 0;
      const maxTvl = tvlHistory.length > 0 ? Math.max(...tvlHistory.map((d: any) => d.tvl)) : 0;

      return {
        slug,
        name: p.name,
        logo: p.logo || null,
        description: p.description || null,
        url: p.url || null,
        twitter: p.twitter || null,
        github: p.github || null,
        category: p.category || null,
        audits: p.audits ? parseInt(p.audits) : 0,
        auditLinks: p.audit_links || [],
        geckoId: p.gecko_id || null,
        symbol: p.symbol || null,
        contractAddresses,
        stablecoins: p.stablecoins || [],
        chains: p.chains || [],
        currentTvl,
        tvlChange1d: parseFloat(change1d.toFixed(2)),
        tvlChange7d: parseFloat(change7d.toFixed(2)),
        tvlChange30d: parseFloat(change30d.toFixed(2)),
        maxTvl,
        tvlHistory,
        tokenPrice,
        tokenMarketCap,
        tokenChange24h: tokenChange24h !== null ? parseFloat(tokenChange24h.toFixed(2)) : null,
      };
    }),

  // ─── DeFi Dashboard ───────────────────────────────────────────────────────────────────────────────────────
  defiDashboard: publicProcedure.query(async () => {
    const LLAMA = 'https://api.llama.fi';

    const [chainTvlRes, protocolsRes, xtzPriceRes] = await Promise.allSettled([
      fetch(`${LLAMA}/v2/historicalChainTvl/Tezos`).then(r => r.json()),
      fetch(`${LLAMA}/protocols`).then(r => r.json()),
      fetch('https://api.tzkt.io/v1/quotes/last').then(r => r.json()),
    ]);

    const chainHistory = chainTvlRes.status === 'fulfilled' ? chainTvlRes.value : [];
    const allProtocols = protocolsRes.status === 'fulfilled' ? protocolsRes.value : [];
    const xtzPrice = xtzPriceRes.status === 'fulfilled' ? (xtzPriceRes.value?.usd ?? 0) : 0;

    // Filter Tezos protocols (exclude CEX)
    const tezosProtocols = allProtocols
      .filter((p: any) => p.chains?.includes('Tezos') && p.tvl > 0 && !['CEX', 'Bridge'].includes(p.category))
      .sort((a: any, b: any) => b.tvl - a.tvl)
      .slice(0, 15)
      .map((p: any) => ({
        name: p.name,
        slug: p.slug,
        tvl: p.tvl,
        tvlPrevDay: p.tvlPrevDay ?? null,
        change1d: p.change_1d ?? null,
        change7d: p.change_7d ?? null,
        category: p.category,
        logo: p.logo || null,
        url: p.url || null,
        description: p.description || null,
        chains: p.chains || [],
      }));

    // Total Tezos DeFi TVL (excluding CEX)
    const totalTvl = tezosProtocols.reduce((s: number, p: any) => s + p.tvl, 0);

    // TVL history (last 90 days)
    const tvlHistory = chainHistory
      .slice(-90)
      .map((d: any) => ({ date: d.date, tvl: d.tvl }));

    // TVL change
    const latestTvl = tvlHistory[tvlHistory.length - 1]?.tvl ?? 0;
    const prevDayTvl = tvlHistory[tvlHistory.length - 2]?.tvl ?? 0;
    const prev7dTvl = tvlHistory[tvlHistory.length - 8]?.tvl ?? 0;
    const prev30dTvl = tvlHistory[tvlHistory.length - 31]?.tvl ?? 0;
    const change1d = prevDayTvl > 0 ? ((latestTvl - prevDayTvl) / prevDayTvl) * 100 : 0;
    const change7d = prev7dTvl > 0 ? ((latestTvl - prev7dTvl) / prev7dTvl) * 100 : 0;
    const change30d = prev30dTvl > 0 ? ((latestTvl - prev30dTvl) / prev30dTvl) * 100 : 0;

    // Category breakdown
    const categoryMap: Record<string, number> = {};
    for (const p of tezosProtocols) {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + p.tvl;
    }
    const categories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, tvl]) => ({ name, tvl }));

    return {
      xtzPrice,
      chainTvl: latestTvl,
      chainTvlChange1d: parseFloat(change1d.toFixed(2)),
      chainTvlChange7d: parseFloat(change7d.toFixed(2)),
      chainTvlChange30d: parseFloat(change30d.toFixed(2)),
      totalDeFiTvl: totalTvl,
      tvlHistory,
      protocols: tezosProtocols,
      categories,
    };
  }),

  // ─── Smart Contract Inspector ───────────────────────────────────────────────────────────────────────────────────────
  contractInspect: publicProcedure
    .input(z.object({ address: z.string().min(10) }))
    .query(async ({ input }) => {
      const addr = input.address.trim();
      if (!addr.startsWith('KT')) throw new Error('Must be a KT1 contract address');

      const [info, storage, entrypoints, recentCalls, similar] = await Promise.allSettled([
        tzkt(`/contracts/${addr}`),
        tzkt(`/contracts/${addr}/storage`),
        tzkt(`/contracts/${addr}/entrypoints`),
        tzkt(`/operations/transactions?target=${addr}&limit=20&sort.desc=id&status=applied`),
        tzkt(`/contracts/${addr}/similar?limit=5`),
      ]);

      const contract = info.status === 'fulfilled' ? info.value : null;
      if (!contract || contract.type === 'user') return null;

      const storageData = storage.status === 'fulfilled' ? storage.value : null;
      const eps = entrypoints.status === 'fulfilled' ? entrypoints.value : [];
      const calls = recentCalls.status === 'fulfilled' ? recentCalls.value : [];
      const sim = similar.status === 'fulfilled' ? similar.value : [];

      // Summarise entrypoint call frequency from recent calls
      const epCallCount: Record<string, number> = {};
      for (const call of calls) {
        const ep = call.parameter?.entrypoint || 'default';
        epCallCount[ep] = (epCallCount[ep] || 0) + 1;
      }

      return {
        address: addr,
        alias: contract.alias || null,
        balance: mutez(contract.balance),
        creator: contract.creator?.alias || contract.creator?.address || null,
        creatorAddress: contract.creator?.address || null,
        numTransactions: contract.numTransactions ?? 0,
        firstActivity: contract.firstActivityTime || null,
        lastActivity: contract.lastActivityTime || null,
        typeHash: contract.typeHash,
        codeHash: contract.codeHash,
        storage: storageData,
        entrypoints: eps.map((ep: any) => ({
          name: ep.name,
          parameterSchema: ep.parameterSchema,
          callCount: epCallCount[ep.name] || 0,
        })),
        recentCalls: calls.slice(0, 20).map((call: any) => ({
          hash: call.hash,
          timestamp: call.timestamp,
          sender: call.sender?.alias || call.sender?.address || '',
          senderAddress: call.sender?.address || '',
          entrypoint: call.parameter?.entrypoint || 'default',
          amount: mutez(call.amount),
          parameter: call.parameter?.value,
          status: call.status,
        })),
        similarContracts: sim.slice(0, 5).map((c: any) => ({
          address: c.address,
          alias: c.alias || null,
          balance: mutez(c.balance),
          numTransactions: c.numTransactions ?? 0,
        })),
      };
    }),

  // ─── Tezos Name Service Lookup ───────────────────────────────────────────────────────────────────────────────────────
  tnsLookup: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ input }) => {
      const q = input.query.trim().toLowerCase();
      const isTezDomain = q.endsWith('.tez');
      const isAddress = q.startsWith('tz') || q.startsWith('kt');

      const GQL = 'https://api.tezos.domains/graphql';
      const gql = async (query: string) => {
        const res = await fetch(GQL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });
        return res.json();
      };

      if (isTezDomain) {
        // Forward lookup: domain -> address
        const data = await gql(`{ domain(name:"${q}"){name address owner expiresAtUtc tokenId} }`);
        const domain = data.data?.domain;
        if (!domain) return { type: 'domain', found: false, query: q };

        // Also get TzKT account info for the resolved address
        const account = domain.address
          ? await tzkt(`/accounts/${domain.address}`).catch(() => null)
          : null;

        // Get all domains owned by this owner
        const ownedData = await gql(`{ domains(where:{owner:{equalTo:"${domain.owner}"}},first:20){items{name address expiresAtUtc}} }`);
        const ownedDomains = ownedData.data?.domains?.items || [];

        return {
          type: 'domain' as const,
          found: true,
          query: q,
          name: domain.name,
          address: domain.address,
          owner: domain.owner,
          expiresAt: domain.expiresAtUtc,
          tokenId: domain.tokenId,
          accountBalance: account ? mutez(account.balance) : null,
          accountAlias: account?.alias || null,
          ownedDomains,
        };
      }

      if (isAddress) {
        // Reverse lookup: address -> domains
        const data = await gql(`{ domains(where:{address:{equalTo:"${q}"}},first:20){items{name address owner expiresAtUtc tokenId}} }`);
        const domains = data.data?.domains?.items || [];

        // Also get owned domains
        const ownedData = await gql(`{ domains(where:{owner:{equalTo:"${q}"}},first:20){items{name address owner expiresAtUtc}} }`);
        const ownedDomains = ownedData.data?.domains?.items || [];

        // Merge unique
        const allDomains = [...domains];
        for (const d of ownedDomains) {
          if (!allDomains.find(x => x.name === d.name)) allDomains.push(d);
        }

        const account = await tzkt(`/accounts/${q}`).catch(() => null);

        return {
          type: 'address' as const,
          found: allDomains.length > 0 || !!account,
          query: q,
          address: q,
          accountAlias: account?.alias || null,
          accountBalance: account ? mutez(account.balance) : null,
          domains: allDomains,
        };
      }

      // Try as domain name without .tez
      const withTez = `${q}.tez`;
      const data = await gql(`{ domain(name:"${withTez}"){name address owner expiresAtUtc tokenId} }`);
      const domain = data.data?.domain;
      if (domain) {
        return { type: 'domain' as const, found: true, query: withTez, name: domain.name, address: domain.address, owner: domain.owner, expiresAt: domain.expiresAtUtc, tokenId: domain.tokenId, accountBalance: null, accountAlias: null, ownedDomains: [] };
      }

      return { type: 'unknown' as const, found: false, query: q };
    }),

  // ─── Live Operations Monitor ───────────────────────────────────────────────────────────────────────────────────────
  liveOps: publicProcedure
    .input(z.object({
      types: z.array(z.enum(['transaction', 'delegation', 'origination', 'transfer'])).default(['transaction', 'delegation']),
      minAmount: z.number().default(0),
      limit: z.number().min(5).max(50).default(30),
    }))
    .query(async ({ input }) => {
      const { types, minAmount, limit } = input;
      const results: any[] = [];

      // Fetch each requested type in parallel
      await Promise.allSettled([
        types.includes('transaction') ? tzkt(
          `/operations/transactions?limit=${limit}&sort.desc=id&status=applied${minAmount > 0 ? `&amount.gt=${Math.floor(minAmount * 1_000_000)}` : ''}`
        ).then(ops => results.push(...ops.map((op: any) => ({
          hash: op.hash,
          type: 'transaction',
          timestamp: op.timestamp,
          sender: op.sender?.alias || op.sender?.address || '',
          senderAddress: op.sender?.address || '',
          target: op.target?.alias || op.target?.address || '',
          targetAddress: op.target?.address || '',
          amount: mutez(op.amount),
          level: op.level,
        })))) : Promise.resolve(),

        types.includes('delegation') ? tzkt(
          `/operations/delegations?limit=${Math.min(limit, 20)}&sort.desc=id&status=applied`
        ).then(ops => results.push(...ops.map((op: any) => ({
          hash: op.hash,
          type: 'delegation',
          timestamp: op.timestamp,
          sender: op.sender?.alias || op.sender?.address || '',
          senderAddress: op.sender?.address || '',
          target: op.newDelegate?.alias || op.newDelegate?.address || 'Undelegated',
          targetAddress: op.newDelegate?.address || '',
          amount: mutez(op.amount ?? 0),
          level: op.level,
        })))) : Promise.resolve(),

        types.includes('origination') ? tzkt(
          `/operations/originations?limit=${Math.min(limit, 10)}&sort.desc=id&status=applied`
        ).then(ops => results.push(...ops.map((op: any) => ({
          hash: op.hash,
          type: 'origination',
          timestamp: op.timestamp,
          sender: op.sender?.alias || op.sender?.address || '',
          senderAddress: op.sender?.address || '',
          target: op.originatedContract?.address || '',
          targetAddress: op.originatedContract?.address || '',
          amount: mutez(op.balance ?? 0),
          level: op.level,
        })))) : Promise.resolve(),

        types.includes('transfer') ? tzkt(
          `/tokens/transfers?limit=${Math.min(limit, 20)}&sort.desc=id`
        ).then(ops => results.push(...ops.map((op: any) => ({
          hash: op.transactionId?.toString() || '',
          type: 'transfer',
          timestamp: op.timestamp,
          sender: op.from?.alias || op.from?.address || 'Mint',
          senderAddress: op.from?.address || '',
          target: op.to?.alias || op.to?.address || '',
          targetAddress: op.to?.address || '',
          amount: 0,
          tokenName: op.token?.metadata?.name || op.token?.contract?.alias || 'Token',
          tokenAmount: op.amount,
          level: op.level,
        })))) : Promise.resolve(),
      ]);

      // Sort by timestamp desc and limit
      return results
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    }),

  // ─── Airdrop Checker ───────────────────────────────────────────────────────────────────────────────────────
  airdropCheck: publicProcedure
    .input(z.object({ address: z.string().min(10) }))
    .query(async ({ input }) => {
      const addr = input.address.trim();

      // Known Tezos airdrop/snapshot token contracts to check
      const AIRDROP_TOKENS = [
        { name: "Tezos Domains", contract: "KT1GBzLqjsp13K9JcKm65YZWTJsuuWMt4k7k", tokenId: "0", description: "Tezos Domains name service NFTs", url: "https://tezos.domains" },
        { name: "QuipuSwap (QUIPU)", contract: "KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb", tokenId: "0", description: "QuipuSwap governance token", url: "https://quipuswap.com" },
        { name: "Youves (YOU)", contract: "KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL", tokenId: "0", description: "Youves DeFi governance token", url: "https://app.youves.com" },
        { name: "Plenty DAO", contract: "KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b", tokenId: "0", description: "Plenty DeFi governance token", url: "https://www.plentydefi.com" },
        { name: "Kolibri (kDAO)", contract: "KT1JkoE42rrMBP9b2oDhbx6EUr26GcySZMUH", tokenId: "0", description: "Kolibri DAO governance token", url: "https://kolibri.finance" },
        { name: "Ctez", contract: "KT1SjXiUX63QvdNMcM2m492f7kuf8JxXRLp4", tokenId: "0", description: "Ctez synthetic tez token", url: "https://ctez.app" },
        { name: "Wrap Protocol (WRAP)", contract: "KT1LRboPna9yQY9BrjtQYDS1DVxhKESK4VVd", tokenId: "0", description: "Wrap Protocol bridge token", url: "https://app.tzwrap.com" },
        { name: "Spicyswap (SPI)", contract: "KT1CS2xKGHNPTauSh5Re4qE3N9PCfG5u4dPx", tokenId: "0", description: "SpicySwap DEX token", url: "https://spicyswap.xyz" },
        { name: "Hic et Nunc (hDAO)", contract: "KT1AFA2mwNUMNd4SsujE1YYp29vd8BZejyKW", tokenId: "0", description: "Hic et Nunc DAO token", url: "https://teia.art" },
        { name: "OBJKT.com Token (OBJKT)", contract: "KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton", tokenId: "0", description: "objkt.com marketplace NFTs", url: "https://objkt.com" },
      ];

      // Fetch all token balances for this address in one call
      const allBalances = await tzkt(
        `/tokens/balances?account=${addr}&limit=200&sort.desc=lastTime`
      ).catch(() => []);

      // Build a map of contract+tokenId -> balance
      const balanceMap = new Map<string, any>();
      for (const b of allBalances) {
        const key = `${b.token?.contract?.address}:${b.token?.tokenId}`;
        balanceMap.set(key, b);
      }

      // Also get account info for basic eligibility
      const account = await tzkt(`/accounts/${addr}`).catch(() => null);
      const xtzBalance = account ? mutez(account.balance) : 0;
      const firstActivityTime = account?.firstActivityTime || null;
      const isOldAccount = firstActivityTime
        ? new Date(firstActivityTime) < new Date('2023-01-01')
        : false;

      // Check each airdrop
      const checks = AIRDROP_TOKENS.map(token => {
        const key = `${token.contract}:${token.tokenId}`;
        const balance = balanceMap.get(key);
        const rawBalance = balance ? parseFloat(balance.balance || '0') : 0;
        const decimals = balance?.token?.metadata?.decimals ?? 0;
        const humanBalance = rawBalance / Math.pow(10, decimals);
        const eligible = rawBalance > 0;
        return {
          ...token,
          eligible,
          balance: humanBalance,
          rawBalance,
          symbol: balance?.token?.metadata?.symbol || token.name.split(' ')[0],
          thumbnailUri: balance?.token?.metadata?.thumbnailUri
            ? (balance.token.metadata.thumbnailUri.startsWith('ipfs://')
              ? `https://ipfs.io/ipfs/${balance.token.metadata.thumbnailUri.slice(7)}`
              : balance.token.metadata.thumbnailUri)
            : null,
        };
      });

      const eligibleCount = checks.filter(c => c.eligible).length;

      return {
        address: addr,
        alias: account?.alias || null,
        xtzBalance,
        isOldAccount,
        firstActivity: firstActivityTime,
        eligibleCount,
        checks,
      };
    }),

  // ─── Featured Artist (weekly rotation) ───────────────────────────────────────────────────────────────────────────────────
  featuredArtist: publicProcedure.query(async () => {
    // Curated list of notable Tezos artists — address field enables reliable works lookup
    const ARTISTS: Array<{ alias: string; address?: string; twitter: string; note: string }> = [
      { alias: 'QUAYOLA', address: 'tz2Wqd9ryeQUqDGfjXDoB6zVe9GE4KPa39gC', twitter: 'quayola', note: 'Generative & computational art' },
      { alias: 'Gabriel Massan', twitter: 'gabrielmassan', note: '3D & narrative digital art' },
      { alias: 'zancan', address: 'tz1bbbZ6Hqjnn9G6Tu2i7uXKRenCaB1Eikbz', twitter: 'zancan', note: 'Generative art & landscapes' },
      { alias: 'Iskra Velitchkova', address: 'tz1PEcnL3UvtPPXSwXT258xKVxwdpGabaWsh', twitter: 'iskravel', note: 'Abstract digital painting' },
      { alias: 'Alida Sun', address: 'tz1QR8esDbBTWbfwTrPve5aQ46kxSCubk1ZR', twitter: 'alidasun', note: 'AI dialogue & machine learning' },
      { alias: 'Hind Al Saad', twitter: 'hindsaad', note: 'Digital identity & memory' },
      { alias: 'Varvara&Mar', address: 'tz1ZJJPSdvqFnjCoLiSDHoo17B3YLfdeANA3', twitter: 'varvara_mar', note: 'Generative systems & machinima' },
      { alias: 'Joanie Lemercier', address: 'tz1Rzgqir9kEteYTdoVTnoFWsrwPSro78c2K', twitter: 'joanielemercier', note: 'Light & projection art' },
      { alias: 'Operator', address: 'tz1YyLW3Wd1UzV7XL8gBZV23dLSh8wu6ijFm', twitter: 'operatornft', note: 'Generative & algorithmic art' },
      { alias: 'Dmitri Cherniak', twitter: 'dmitricherniak', note: 'Generative & Ringers creator' },
      { alias: 'Kim Asendorf', address: 'tz1N1vuWBsDtGMyj3No8NfeJdCBFu8v6gvSX', twitter: 'kimasendorf', note: 'Pixel art & generative systems' },
      { alias: 'ciphrd', address: 'tz1PoDdN2oyRyF6DA73zTWAWYhNL4UGr3Egj', twitter: 'ciphrd', note: 'Generative art & fxhash founder' },
      { alias: 'Licia He', twitter: 'blahblahpapercut', note: 'Plotter & generative drawing art' },
      { alias: 'Yazid', address: 'tz1QgjmhrUD3X7kgS9mMHbUz4cS6uDiFGhAU', twitter: 'yazidxyz', note: 'Generative & abstract digital art' },
      { alias: 'Helena Sarin', twitter: 'NeuralBricolage', note: 'AI & neural network art' },
      { alias: 'andreasrau', address: 'tz1Roq6end2LFtkpGrmuyRZH82xsWfaRCat1', twitter: 'andreasrau_eu', note: 'Generative & code-based art' },
      { alias: 'Piter Pasma', address: 'tz1hgnuh2GNURBYeR8yWQhw8cynnXsbf6eFF', twitter: 'piterpasma', note: 'Mathematical & generative art' },
      { alias: 'DistCollective', twitter: 'DistCollective', note: 'Collaborative generative art' },
      { alias: 'Mathieu Stern', twitter: 'MathieuStern', note: 'Photography & digital art' },
      { alias: 'Fabrizio Lamoncha', twitter: 'fabriziolamoncha', note: 'Generative & abstract systems' },
      { alias: 'Aleksandra Jovanić', twitter: 'alexjovanic', note: 'Generative art & data visualisation' },
      { alias: 'Absurdeity.tez', address: 'tz1X568Wdkb1ZUs8qfVYcsZD31YQ4UV3sdY4', twitter: 'absurdeity', note: 'Community art events & curation' },
      { alias: 'Bonsaifox', address: 'tz1XS6dS499nK7TuNjLsdbioAVEdVgK4P5sG', twitter: 'BonsaiFox1', note: 'Community art events organiser' },
      { alias: 'V4w.enko', address: 'tz1Mpr7WD3UG47UFPbizLPnBCNhh8pcdbSyz', twitter: 'V4wEnko', note: 'Generative organic art & GLB' },
      { alias: 'memoakten', address: 'tz1Z1pDsbfuF7t6fHfbVxhjhouRemXuREpH5', twitter: 'memotv', note: 'AI & generative systems' },
    ];

    // Pick artist based on week number (rotates weekly)
    const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const artist = ARTISTS[weekNum % ARTISTS.length];

    const OBJKT = 'https://data.objkt.com/v3/graphql';

    // Fetch artist profile from objkt — prefer address lookup if available
    let profile: any = null;
    let recentWorks: any[] = [];

    try {
      const profileQuery = artist.address
        ? { query: `{ holder(where: {address: {_eq: "${artist.address}"}}, limit: 1) { address alias description website twitter instagram logo } }` }
        : { query: `{ holder(where: {alias: {_ilike: "${artist.alias}"}}, limit: 1, order_by: {held_tokens_aggregate: {count: desc}}) { address alias description website twitter instagram logo } }` };
      const profileRes = await fetch(OBJKT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileQuery),
        signal: AbortSignal.timeout(10000),
      });
      const profileData = await profileRes.json();
      profile = profileData?.data?.holder?.[0] || null;
      // If profile found but alias is empty, use static alias
      if (profile && !profile.alias) profile.alias = artist.alias;
    } catch (e) {
      // fallback — use static data
    }

    // Fetch recent tokens by this artist
    if (profile?.address) {
      try {
        const worksQuery = {
          query: `{ token(limit: 6, order_by: {timestamp: desc}, where: {creators: {holder_address: {_eq: "${profile.address}"}}}) { name description display_uri thumbnail_uri timestamp supply fa { name } } }`
        };
        const worksRes = await fetch(OBJKT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(worksQuery),
          signal: AbortSignal.timeout(10000),
        });
        const worksData = await worksRes.json();
        recentWorks = (worksData?.data?.token || []).map((t: any) => ({
          name: t.name,
          description: t.description,
          thumbnailUri: t.thumbnail_uri
            ? (t.thumbnail_uri.startsWith('ipfs://')
              ? `https://ipfs.io/ipfs/${t.thumbnail_uri.slice(7)}`
              : t.thumbnail_uri)
            : null,
          displayUri: t.display_uri
            ? (t.display_uri.startsWith('ipfs://')
              ? `https://ipfs.io/ipfs/${t.display_uri.slice(7)}`
              : t.display_uri)
            : null,
          timestamp: t.timestamp,
          supply: t.supply,
          collection: t.fa?.name || null,
        }));
      } catch (e) {
        // ignore
      }
    }

    return {
      alias: profile?.alias || artist.alias,
      address: profile?.address || null,
      description: profile?.description || artist.note,
      website: profile?.website || null,
      twitter: profile?.twitter || (artist.twitter ? `https://twitter.com/${artist.twitter}` : null),
      instagram: profile?.instagram || null,
      logo: profile?.logo || null,
      note: artist.note,
      recentWorks,
      weekNum,
      objktUrl: profile?.address ? `https://objkt.com/profile/${profile.address}` : `https://objkt.com/explore/creators`,
    };
  }),

  // ─── Live Auctions ───────────────────────────────────────────────────────────────────────────────────────
  liveAuctions: publicProcedure
    .input(z.object({ type: z.enum(['english', 'dutch', 'all']).default('all'), limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const OBJKT = 'https://data.objkt.com/v3/graphql';
      const resolveIpfs = (uri: string | null) => {
        if (!uri) return null;
        if (uri.startsWith('ipfs://')) return `https://ipfs.io/ipfs/${uri.slice(7)}`;
        return uri;
      };
      const results: any[] = [];

      if (input.type === 'english' || input.type === 'all') {
        try {
          const res = await fetch(OBJKT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `{ english_auction_active(limit: ${input.limit}, order_by: {end_time: asc}) { id end_time highest_bid_xtz reserve_xtz start_time ophash token { name thumbnail_uri display_uri fa { name logo } } seller { alias address } highest_bidder { alias } } }` }),
            signal: AbortSignal.timeout(10000),
          });
          const data = await res.json();
          for (const a of data?.data?.english_auction_active || []) {
            results.push({
              id: a.id,
              type: 'english',
              endTime: a.end_time,
              startTime: a.start_time,
              currentBid: a.highest_bid_xtz ? a.highest_bid_xtz / 1_000_000 : null,
              reserve: a.reserve_xtz ? a.reserve_xtz / 1_000_000 : null,
              tokenName: a.token?.name || 'Untitled',
              thumbnailUri: resolveIpfs(a.token?.thumbnail_uri || a.token?.display_uri),
              collectionName: a.token?.fa?.name || null,
              collectionLogo: a.token?.fa?.logo || null,
              seller: a.seller?.alias || null,
              topBidder: a.highest_bidder?.alias || null,
              ophash: a.ophash,
              objktUrl: `https://objkt.com/auction/english/${a.id}`,
            });
          }
        } catch (e) { /* ignore */ }
      }

      if (input.type === 'dutch' || input.type === 'all') {
        try {
          const res = await fetch(OBJKT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `{ dutch_auction_active(limit: ${Math.min(input.limit, 20)}, order_by: {end_time: asc}) { id end_time start_price_xtz end_price_xtz start_time ophash token { name thumbnail_uri display_uri fa { name logo } } seller { alias address } } }` }),
            signal: AbortSignal.timeout(10000),
          });
          const data = await res.json();
          for (const a of data?.data?.dutch_auction_active || []) {
            const now = Date.now();
            const start = new Date(a.start_time).getTime();
            const end = new Date(a.end_time).getTime();
            const elapsed = Math.max(0, now - start);
            const duration = Math.max(1, end - start);
            const progress = Math.min(1, elapsed / duration);
            const startP = a.start_price_xtz / 1_000_000;
            const endP = a.end_price_xtz / 1_000_000;
            const currentPrice = startP - (startP - endP) * progress;
            results.push({
              id: a.id,
              type: 'dutch',
              endTime: a.end_time,
              startTime: a.start_time,
              currentBid: Math.round(currentPrice * 100) / 100,
              reserve: endP,
              startPrice: startP,
              tokenName: a.token?.name || 'Untitled',
              thumbnailUri: resolveIpfs(a.token?.thumbnail_uri || a.token?.display_uri),
              collectionName: a.token?.fa?.name || null,
              collectionLogo: a.token?.fa?.logo || null,
              seller: a.seller?.alias || null,
              topBidder: null,
              ophash: a.ophash,
              objktUrl: `https://objkt.com/auction/dutch/${a.id}`,
            });
          }
        } catch (e) { /* ignore */ }
      }

      results.sort((a, b) => new Date(a.endTime || '9999').getTime() - new Date(b.endTime || '9999').getTime());
      return results.slice(0, input.limit);
    }),

  // ─── Trending Collections ───────────────────────────────────────────────────────────────────────────────────────
  trendingCollections: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(5) }))
    .query(async ({ input }) => {
      const OBJKT = 'https://data.objkt.com/v3/graphql';
      try {
        const res = await fetch(OBJKT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `{ fa(limit: ${input.limit}, order_by: {volume_24h: desc}, where: {volume_24h: {_gt: 0}, live: {_eq: true}, name: {_is_null: false}}) { contract name logo description volume_24h volume_total floor_price items owners collection_type } }` }),
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();
        return (data?.data?.fa || []).map((f: any) => ({
          contract: f.contract,
          name: f.name,
          logo: f.logo,
          description: f.description || null,
          volume24h: f.volume_24h / 1_000_000,
          volumeTotal: f.volume_total / 1_000_000,
          floorPrice: f.floor_price ? f.floor_price / 1_000_000 : null,
          items: f.items,
          owners: f.owners,
          collectionType: f.collection_type,
          objktUrl: `https://objkt.com/collections/${f.contract}`,
        }));
      } catch (e) {
        return [];
      }
    }),

  // ─── Top Sellers ───────────────────────────────────────────────────────────────────────────────────────
  topSellers: publicProcedure
    .input(z.object({ period: z.enum(['7', '30', 'all']).default('30'), limit: z.number().min(1).max(1000).default(1000) }))
    .query(async ({ input }) => {
      const OBJKT = 'https://data.objkt.com/v3/graphql';
      const intervalDays = input.period === 'all' ? 3650 : parseInt(input.period);
      const query = (offset: number) => `{ sales_stat(limit: 500, offset: ${offset}, order_by: {volume: desc}, where: {type: {_eq: "seller"}, interval_days: {_eq: ${intervalDays}}}) { volume rank subject { alias address logo description twitter website } } }`;
      try {
        // Fetch XTZ price and two pages in parallel
        const [res1, res2, priceRes] = await Promise.all([
          fetch(OBJKT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: query(0) }), signal: AbortSignal.timeout(15000) }),
          fetch(OBJKT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: query(500) }), signal: AbortSignal.timeout(15000) }),
          fetch('https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd', { signal: AbortSignal.timeout(5000) }),
        ]);
        const [d1, d2, priceData] = await Promise.all([res1.json(), res2.json(), priceRes.json()]);
        const xtzUsd = priceData?.tezos?.usd || 0;
        const allStats = [...(d1?.data?.sales_stat || []), ...(d2?.data?.sales_stat || [])];
        const seen = new Set<string>();
        const results: any[] = [];
        for (const s of allStats) {
          const addr = s.subject?.address;
          if (!addr || seen.has(addr)) continue;
          seen.add(addr);
          const volumeXtz = s.volume / 1_000_000;
          results.push({
            rank: results.length + 1,
            address: addr,
            alias: s.subject?.alias || null,
            logo: s.subject?.logo || null,
            description: s.subject?.description || null,
            twitter: s.subject?.twitter || null,
            website: s.subject?.website || null,
            volume: volumeXtz,
            volumeUsd: xtzUsd > 0 ? volumeXtz * xtzUsd : null,
            objktUrl: `https://objkt.com/profile/${addr}`,
          });
          if (results.length >= input.limit) break;
        }
        return { results, xtzUsd };
      } catch (e) {
        return { results: [], xtzUsd: 0 };
      }
    }),

  // ─── Collection Stats ───────────────────────────────────────────────────────────────────────────────────────
  collectionStats: publicProcedure
    .input(z.object({ contract: z.string().min(10) }))
    .query(async ({ input }) => {
      const OBJKT = 'https://data.objkt.com/v3/graphql';
      const resolveIpfs = (uri: string | null) => {
        if (!uri) return null;
        if (uri.startsWith('ipfs://')) return `https://ipfs.io/ipfs/${uri.slice(7)}`;
        return uri;
      };
      try {
        // Fetch collection info and recent sales in parallel
        const [collectionRes, salesRes] = await Promise.all([
          fetch(OBJKT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `{ fa(where: {contract: {_eq: "${input.contract}"}}, limit: 1) { contract name description logo floor_price volume_24h volume_total items owners collection_type website twitter creator { alias address } } }` }),
            signal: AbortSignal.timeout(10000),
          }),
          fetch(OBJKT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: `{ event(limit: 20, order_by: {timestamp: desc}, where: {fa_contract: {_eq: "${input.contract}"}, marketplace_event_type: {_eq: "list_buy"}, reverted: {_eq: false}}) { price_xtz timestamp token { name thumbnail_uri } creator { alias } recipient { alias } } }` }),
            signal: AbortSignal.timeout(10000),
          }),
        ]);

        const collectionData = await collectionRes.json();
        const salesData = await salesRes.json();
        const fa = collectionData?.data?.fa?.[0];
        if (!fa) return null;

        const recentSales = (salesData?.data?.event || []).map((e: any) => ({
          price: e.price_xtz / 1_000_000,
          timestamp: e.timestamp,
          tokenName: e.token?.name || 'Untitled',
          thumbnailUri: resolveIpfs(e.token?.thumbnail_uri),
          seller: e.creator?.alias || null,
          buyer: e.recipient?.alias || null,
        }));

        return {
          contract: fa.contract,
          name: fa.name,
          description: fa.description,
          logo: fa.logo,
          floorPrice: fa.floor_price ? fa.floor_price / 1_000_000 : null,
          volume24h: fa.volume_24h / 1_000_000,
          volumeTotal: fa.volume_total / 1_000_000,
          items: fa.items,
          owners: fa.owners,
          collectionType: fa.collection_type,
          website: fa.website,
          twitter: fa.twitter,
          creator: fa.creator?.alias || null,
          creatorAddress: fa.creator?.address || null,
          recentSales,
          objktUrl: `https://objkt.com/collections/${fa.contract}`,
        };
      } catch (e) {
        return null;
      }
    }),

  // ─── Collector Profile ───────────────────────────────────────────────────────────────────────────────────────
  collectorProfile: publicProcedure
    .input(z.object({ address: z.string().min(10), limit: z.number().min(1).max(20).default(8) }))
    .query(async ({ input }) => {
      const OBJKT = 'https://data.objkt.com/v3/graphql';
      const resolveIpfs = (uri: string | null) => {
        if (!uri) return null;
        if (uri.startsWith('ipfs://')) return `https://ipfs.io/ipfs/${uri.slice(7)}`;
        return uri;
      };
      try {
        const res = await fetch(OBJKT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `{ event(limit: ${input.limit}, order_by: {timestamp: desc}, where: {marketplace_event_type: {_eq: "list_buy"}, recipient_address: {_eq: "${input.address}"}, reverted: {_eq: false}}) { price_xtz timestamp token { name thumbnail_uri display_uri fa { name contract } } creator { alias } } }` }),
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();
        return (data?.data?.event || []).map((e: any) => ({
          price: e.price_xtz / 1_000_000,
          timestamp: e.timestamp,
          tokenName: e.token?.name || 'Untitled',
          thumbnailUri: resolveIpfs(e.token?.thumbnail_uri || e.token?.display_uri),
          collectionName: e.token?.fa?.name || null,
          collectionContract: e.token?.fa?.contract || null,
          seller: e.creator?.alias || null,
          objktUrl: e.token?.fa?.contract ? `https://objkt.com/collections/${e.token.fa.contract}` : 'https://objkt.com',
        }));
      } catch (e) {
        return [];
      }
    }),

  // ─── Top Collectors ───────────────────────────────────────────────────────────────────────────────────────
  topCollectors: publicProcedure
    .input(z.object({ period: z.enum(['7', '30', 'all']).default('30'), limit: z.number().min(1).max(1000).default(1000) }))
    .query(async ({ input }) => {
      const OBJKT = 'https://data.objkt.com/v3/graphql';
      const intervalDays = input.period === 'all' ? 3650 : parseInt(input.period);
      const query = (offset: number) => `{ sales_stat(limit: 500, offset: ${offset}, order_by: {volume: desc}, where: {type: {_eq: "buyer"}, interval_days: {_eq: ${intervalDays}}}) { volume rank subject { alias address logo description twitter website } } }`;
      try {
        const [res1, res2, priceRes] = await Promise.all([
          fetch(OBJKT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: query(0) }), signal: AbortSignal.timeout(15000) }),
          fetch(OBJKT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: query(500) }), signal: AbortSignal.timeout(15000) }),
          fetch('https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd', { signal: AbortSignal.timeout(5000) }),
        ]);
        const [d1, d2, priceData] = await Promise.all([res1.json(), res2.json(), priceRes.json()]);
        const xtzUsd = priceData?.tezos?.usd || 0;
        const allStats = [...(d1?.data?.sales_stat || []), ...(d2?.data?.sales_stat || [])];
        const seen = new Set<string>();
        const results: any[] = [];
        for (const s of allStats) {
          const addr = s.subject?.address;
          if (!addr || seen.has(addr)) continue;
          seen.add(addr);
          const volumeXtz = s.volume / 1_000_000;
          results.push({
            rank: results.length + 1,
            address: addr,
            alias: s.subject?.alias || null,
            logo: s.subject?.logo || null,
            description: s.subject?.description || null,
            twitter: s.subject?.twitter || null,
            website: s.subject?.website || null,
            volume: volumeXtz,
            volumeUsd: xtzUsd > 0 ? volumeXtz * xtzUsd : null,
            objktUrl: `https://objkt.com/profile/${addr}`,
          });
          if (results.length >= input.limit) break;
        }
        return { results, xtzUsd };
      } catch (e) {
        return { results: [], xtzUsd: 0 };
      }
    }),

  // ─── New Drops ───────────────────────────────────────────────────────────────────────────────────────
  newDrops: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(24).default(6), hours: z.number().min(1).max(72).default(24) }))
    .query(async ({ input }) => {
      const OBJKT = 'https://data.objkt.com/v3/graphql';
      const since = new Date(Date.now() - input.hours * 3600000).toISOString();
      const resolveIpfs = (uri: string | null) => {
        if (!uri) return null;
        if (uri.startsWith('ipfs://')) return `https://ipfs.io/ipfs/${uri.slice(7)}`;
        return uri;
      };
      try {
        const res = await fetch(OBJKT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `{ token(limit: ${input.limit}, order_by: {timestamp: desc}, where: {timestamp: {_gte: "${since}"}, supply: {_gt: 0}}) { name description thumbnail_uri display_uri timestamp supply fa { contract name } creators { holder { alias address } } listings_active { price_xtz } } }` }),
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();
        return (data?.data?.token || []).map((t: any) => {
          const lowestListing = t.listings_active?.length
            ? Math.min(...t.listings_active.map((l: any) => l.price_xtz)) / 1_000_000
            : null;
          return {
            name: t.name || 'Untitled',
            description: t.description || null,
            thumbnailUri: resolveIpfs(t.thumbnail_uri || t.display_uri),
            timestamp: t.timestamp,
            supply: t.supply,
            collectionName: t.fa?.name || null,
            collectionContract: t.fa?.contract || null,
            creators: (t.creators || []).map((c: any) => c.holder?.alias || c.holder?.address?.slice(0, 8) + '...').filter(Boolean),
            price: lowestListing,
            objktUrl: t.fa?.contract ? `https://objkt.com/collections/${t.fa.contract}` : 'https://objkt.com',
          };
        });
      } catch (e) {
        return [];
      }
    }),

  // ─── Recent NFT Sales ───────────────────────────────────────────────────────────────────────────────────────
  recentNftSales: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(30).default(15), minPrice: z.number().default(0) }))
    .query(async ({ input }) => {
      const OBJKT = 'https://data.objkt.com/v3/graphql';
      const resolveIpfs = (uri: string | null) => {
        if (!uri) return null;
        if (uri.startsWith('ipfs://')) return `https://ipfs.io/ipfs/${uri.slice(7)}`;
        return uri;
      };
      const minPriceMutez = Math.floor(input.minPrice * 1_000_000);
      try {
        const res = await fetch(OBJKT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `{ event(limit: ${input.limit}, order_by: {timestamp: desc}, where: {marketplace_event_type: {_eq: "list_buy"}, price_xtz: {_gt: ${minPriceMutez}}, reverted: {_eq: false}}) { price_xtz timestamp ophash token { name thumbnail_uri fa { name } } creator { alias address } recipient { alias address } } }` }),
          signal: AbortSignal.timeout(10000),
        });
        const data = await res.json();
        return (data?.data?.event || []).map((e: any) => ({
          price: e.price_xtz / 1_000_000,
          timestamp: e.timestamp,
          tokenName: e.token?.name || 'Untitled',
          thumbnailUri: resolveIpfs(e.token?.thumbnail_uri),
          collectionName: e.token?.fa?.name || null,
          seller: e.creator?.alias || (e.creator?.address ? `${e.creator.address.slice(0, 8)}...` : null),
          buyer: e.recipient?.alias || (e.recipient?.address ? `${e.recipient.address.slice(0, 8)}...` : null),
          ophash: e.ophash,
          objktUrl: e.ophash ? `https://tzkt.io/${e.ophash}` : 'https://objkt.com',
        }));
      } catch (e) {
        return [];
      }
    }),

  // ─── Top Collections ───────────────────────────────────────────────────────────────────────────────────────
  topCollections: publicProcedure
    .input(z.object({ sortBy: z.enum(['volume_total', 'volume_24h', 'items', 'owners']).default('volume_total'), limit: z.number().min(1).max(1000).default(1000) }))
    .query(async ({ input }) => {
      const OBJKT = 'https://data.objkt.com/v3/graphql';
      const orderBy = `{${input.sortBy}: desc}`;
      const query = (offset: number) => `{ fa(limit: 500, offset: ${offset}, order_by: ${orderBy}, where: {live: {_eq: true}, name: {_is_null: false}, ${input.sortBy}: {_gt: 0}}) { contract name logo description volume_total volume_24h floor_price items owners collection_type twitter website } }`;
      try {
        const [res1, res2, priceRes] = await Promise.all([
          fetch(OBJKT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: query(0) }), signal: AbortSignal.timeout(15000) }),
          fetch(OBJKT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: query(500) }), signal: AbortSignal.timeout(15000) }),
          fetch('https://api.coingecko.com/api/v3/simple/price?ids=tezos&vs_currencies=usd', { signal: AbortSignal.timeout(5000) }),
        ]);
        const [d1, d2, priceData] = await Promise.all([res1.json(), res2.json(), priceRes.json()]);
        const xtzUsd = priceData?.tezos?.usd || 0;
        const allFa = [...(d1?.data?.fa || []), ...(d2?.data?.fa || [])];
        const seen = new Set<string>();
        const results = allFa
          .filter((f: any) => { if (seen.has(f.contract)) return false; seen.add(f.contract); return true; })
          .slice(0, input.limit)
          .map((f: any, i: number) => ({
            rank: i + 1,
            contract: f.contract,
            name: f.name,
            logo: f.logo,
            description: f.description || null,
            volumeTotal: f.volume_total / 1_000_000,
            volumeTotalUsd: xtzUsd > 0 ? (f.volume_total / 1_000_000) * xtzUsd : null,
            volume24h: f.volume_24h / 1_000_000,
            volume24hUsd: xtzUsd > 0 ? (f.volume_24h / 1_000_000) * xtzUsd : null,
            floorPrice: f.floor_price ? f.floor_price / 1_000_000 : null,
            items: f.items,
            owners: f.owners,
            collectionType: f.collection_type,
            twitter: f.twitter,
            website: f.website,
            objktUrl: `https://objkt.com/collections/${f.contract}`,
          }));
        return { results, xtzUsd };
      } catch (e) {
        return { results: [], xtzUsd: 0 };
      }
    }),
});
