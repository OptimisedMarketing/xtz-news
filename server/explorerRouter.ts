import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";

const TZKT = "https://api.tzkt.io/v1";
const TZKT_PRICE = "https://api.tzkt.io/v1/quotes/last";

async function tzkt(path: string) {
  const res = await fetch(`${TZKT}${path}`);
  if (!res.ok) throw new Error(`TzKT error: ${res.status} ${path}`);
  return res.json();
}

async function coingecko(path: string) {
  const res = await fetch(`https://api.coingecko.com/api/v3${path}`);
  if (!res.ok) return null;
  return res.json();
}

function mutez(v: number | null | undefined) {
  if (v == null) return 0;
  return v / 1_000_000;
}

export const explorerRouter = router({

  // ─── Network overview (dashboard) ───────────────────────────────────────────
  networkStats: publicProcedure.query(async () => {
    const [head, stats, price, cgData] = await Promise.allSettled([
      tzkt("/head"),
      tzkt("/statistics/current"),
      fetch(TZKT_PRICE).then(r => r.json()),
      coingecko("/coins/tezos?localization=false&tickers=false&community_data=false&developer_data=false"),
    ]);

    const h = head.status === "fulfilled" ? head.value : {};
    const s = stats.status === "fulfilled" ? stats.value : {};
    const p = price.status === "fulfilled" ? price.value : {};
    const cg = cgData.status === "fulfilled" ? cgData.value : null;

    return {
      level: h.level ?? 0,
      cycle: h.cycle ?? 0,
      protocol: h.protocol ?? "",
      hash: h.hash ?? "",
      timestamp: h.timestamp ?? "",
      // Supply
      totalSupply: mutez(s.totalSupply),
      circulatingSupply: mutez(s.circulatingSupply),
      totalFrozen: mutez(s.totalFrozen),
      totalBurned: mutez(s.totalBurned),
      // Staking
      totalBakers: s.totalBakers ?? 0,
      totalDelegators: s.totalDelegators ?? 0,
      totalStakers: s.totalStakers ?? 0,
      totalBakingPower: mutez(s.totalBakingPower),
      // Price
      xtzUsd: p.usd ?? 0,
      xtzBtc: p.btc ?? 0,
      // CoinGecko extras
      marketCap: cg?.market_data?.market_cap?.usd ?? 0,
      volume24h: cg?.market_data?.total_volume?.usd ?? 0,
      priceChange24h: cg?.market_data?.price_change_percentage_24h ?? 0,
      priceChange7d: cg?.market_data?.price_change_percentage_7d ?? 0,
      allTimeHigh: cg?.market_data?.ath?.usd ?? 0,
      allTimeLow: cg?.market_data?.atl?.usd ?? 0,
    };
  }),

  // ─── Latest blocks ───────────────────────────────────────────────────────────
  latestBlocks: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const blocks = await tzkt(`/blocks?limit=${input.limit}&sort.desc=level`);
      return blocks.map((b: any) => ({
        level: b.level,
        hash: b.hash,
        timestamp: b.timestamp,
        baker: b.proposer?.alias || b.proposer?.address || "Unknown",
        bakerAddress: b.proposer?.address || "",
        transactions: b.transactions ?? 0,
        fees: mutez(b.fees),
        reward: mutez((b.rewardDelegated ?? 0) + (b.rewardStakedOwn ?? 0) + (b.bonusDelegated ?? 0) + (b.bonusStakedOwn ?? 0)),
        validations: b.validations ?? 0,
        proto: b.proto ?? 0,
      }));
    }),

  // ─── Block detail ────────────────────────────────────────────────────────────
  blockByLevel: publicProcedure
    .input(z.object({ level: z.number() }))
    .query(async ({ input }) => {
      const [block, ops] = await Promise.all([
        tzkt(`/blocks/${input.level}`),
        tzkt(`/operations/transactions?level=${input.level}&limit=50`),
      ]);
      return {
        level: block.level,
        hash: block.hash,
        timestamp: block.timestamp,
        baker: block.proposer?.alias || block.proposer?.address || "Unknown",
        bakerAddress: block.proposer?.address || "",
        transactions: block.transactions ?? 0,
        fees: mutez(block.fees),
        reward: mutez((block.rewardDelegated ?? 0) + (block.rewardStakedOwn ?? 0) + (block.bonusDelegated ?? 0) + (block.bonusStakedOwn ?? 0)),
        validations: block.validations ?? 0,
        proto: block.proto ?? 0,
        cycle: block.cycle ?? 0,
        operations: ops.map((op: any) => ({
          hash: op.hash,
          timestamp: op.timestamp,
          sender: op.sender?.alias || op.sender?.address || "",
          senderAddress: op.sender?.address || "",
          target: op.target?.alias || op.target?.address || "",
          targetAddress: op.target?.address || "",
          amount: mutez(op.amount),
          fee: mutez(op.bakerFee),
          status: op.status,
        })),
      };
    }),

  // ─── Block by hash ───────────────────────────────────────────────────────────
  blockByHash: publicProcedure
    .input(z.object({ hash: z.string() }))
    .query(async ({ input }) => {
      const block = await tzkt(`/blocks/${input.hash}`);
      const ops = await tzkt(`/operations/transactions?level=${block.level}&limit=50`);
      return {
        level: block.level,
        hash: block.hash,
        timestamp: block.timestamp,
        baker: block.proposer?.alias || block.proposer?.address || "Unknown",
        bakerAddress: block.proposer?.address || "",
        transactions: block.transactions ?? 0,
        fees: mutez(block.fees),
        reward: mutez((block.rewardDelegated ?? 0) + (block.rewardStakedOwn ?? 0) + (block.bonusDelegated ?? 0) + (block.bonusStakedOwn ?? 0)),
        validations: block.validations ?? 0,
        proto: block.proto ?? 0,
        cycle: block.cycle ?? 0,
        operations: ops.map((op: any) => ({
          hash: op.hash,
          timestamp: op.timestamp,
          sender: op.sender?.alias || op.sender?.address || "",
          senderAddress: op.sender?.address || "",
          target: op.target?.alias || op.target?.address || "",
          targetAddress: op.target?.address || "",
          amount: mutez(op.amount),
          fee: mutez(op.bakerFee),
          status: op.status,
        })),
      };
    }),

  // ─── Latest transactions ─────────────────────────────────────────────────────
  latestTransactions: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const ops = await tzkt(`/operations/transactions?limit=${input.limit}&sort.desc=id&status=applied`);
      return ops.map((op: any) => ({
        hash: op.hash,
        timestamp: op.timestamp,
        block: op.block ?? 0,
        sender: op.sender?.alias || op.sender?.address || "",
        senderAddress: op.sender?.address || "",
        target: op.target?.alias || op.target?.address || "",
        targetAddress: op.target?.address || "",
        amount: mutez(op.amount),
        fee: mutez(op.bakerFee),
        status: op.status,
      }));
    }),

  // ─── Transaction detail ──────────────────────────────────────────────────────
  transactionByHash: publicProcedure
    .input(z.object({ hash: z.string() }))
    .query(async ({ input }) => {
      const ops = await tzkt(`/operations/${input.hash}`);
      if (!ops || ops.length === 0) return null;
      const op = ops[0];
      return {
        hash: op.hash,
        type: op.type,
        timestamp: op.timestamp,
        block: op.level ?? 0,
        blockHash: op.block ?? "",
        sender: op.sender?.alias || op.sender?.address || "",
        senderAddress: op.sender?.address || "",
        target: op.target?.alias || op.target?.address || "",
        targetAddress: op.target?.address || "",
        amount: mutez(op.amount),
        fee: mutez(op.bakerFee),
        gasUsed: op.gasUsed ?? 0,
        storageUsed: op.storageUsed ?? 0,
        status: op.status,
        errors: op.errors ?? [],
        parameters: op.parameter ?? null,
      };
    }),

  // ─── Account / address detail ────────────────────────────────────────────────
  accountByAddress: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
      const [account, txs, delegations] = await Promise.allSettled([
        tzkt(`/accounts/${input.address}`),
        tzkt(`/operations/transactions?anyof.sender.target=${input.address}&limit=20&sort.desc=id`),
        tzkt(`/operations/delegations?sender=${input.address}&limit=5&sort.desc=id`),
      ]);
      const a = account.status === "fulfilled" ? account.value : {};
      return {
        address: a.address || input.address,
        alias: a.alias || null,
        type: a.type || "user",
        balance: mutez(a.balance),
        stakedBalance: mutez(a.stakedBalance),
        unstakedBalance: mutez(a.unstakedBalance),
        frozenDeposit: mutez(a.frozenDeposit),
        delegate: a.delegate?.alias || a.delegate?.address || null,
        delegateAddress: a.delegate?.address || null,
        numTransactions: a.numTransactions ?? 0,
        numDelegators: a.numDelegators ?? 0,
        firstActivity: a.firstActivity ?? null,
        lastActivity: a.lastActivity ?? null,
        // Baker-specific
        stakingBalance: mutez(a.stakingBalance),
        estimatedSharedReward: a.estimatedSharedReward ?? null,
        // Recent transactions
        transactions: txs.status === "fulfilled" ? txs.value.map((op: any) => ({
          hash: op.hash,
          timestamp: op.timestamp,
          sender: op.sender?.alias || op.sender?.address || "",
          senderAddress: op.sender?.address || "",
          target: op.target?.alias || op.target?.address || "",
          targetAddress: op.target?.address || "",
          amount: mutez(op.amount),
          fee: mutez(op.bakerFee),
          status: op.status,
        })) : [],
      };
    }),

  // ─── Baker leaderboard ───────────────────────────────────────────────────────
  bakers: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(50) }))
    .query(async ({ input }) => {
      // Fetch bakers + current head (to get last completed cycle)
      const [bakers, head] = await Promise.all([
        tzkt(`/delegates?limit=${input.limit}&sort.desc=balance&active=true`),
        tzkt(`/head`),
      ]);

      // Use 2 cycles ago (fully settled rewards)
      const rewardCycle = Math.max(1, (head.cycle ?? 1) - 2);

      // Fetch rewards for all bakers in parallel (batches of 10 to avoid rate limits)
      async function getApy(address: string): Promise<number | null> {
        try {
          const data = await tzkt(`/rewards/bakers/${address}?cycle=${rewardCycle}`);
          if (!data || !data[0]) return null;
          const r = data[0];
          const totalRewards =
            (r.blockRewardsDelegated ?? 0) +
            (r.blockRewardsStakedOwn ?? 0) +
            (r.attestationRewardsDelegated ?? 0) +
            (r.attestationRewardsStakedOwn ?? 0) +
            (r.dalAttestationRewardsDelegated ?? 0) +
            (r.dalAttestationRewardsStakedOwn ?? 0);
          const bakingPower = r.bakingPower ?? 0;
          if (bakingPower === 0) return null;
          // 1 cycle = 1 day (14400 blocks × 6s), 365 cycles/year
          return parseFloat(((totalRewards * 365) / bakingPower * 100).toFixed(2));
        } catch {
          return null;
        }
      }

      // Fetch APY in parallel batches of 10
      const apyMap: Record<string, number | null> = {};
      for (let i = 0; i < bakers.length; i += 10) {
        const batch = bakers.slice(i, i + 10);
        const results = await Promise.all(batch.map((b: any) => getApy(b.address)));
        batch.forEach((b: any, j: number) => { apyMap[b.address] = results[j]; });
      }

      return bakers.map((b: any, i: number) => {
        // Available staking space:
        // limitOfStakingOverBaking is in millionths (5_000_000 = 500% of own balance)
        // null means baker hasn't opted into staking (delegation only, no hard limit)
        const limitRatio = b.limitOfStakingOverBaking ?? null;
        let availableSpace: number | null = null;
        if (limitRatio !== null) {
          const stakingCapacity = (b.balance ?? 0) * limitRatio / 1_000_000;
          availableSpace = Math.max(0, mutez(stakingCapacity - (b.externalStakedBalance ?? 0)));
        }
        return {
          rank: i + 1,
          address: b.address,
          alias: b.alias || null,
          stakingBalance: mutez(b.stakingBalance),
          ownBalance: mutez(b.balance),
          numDelegators: b.numDelegators ?? 0,
          apy: apyMap[b.address] ?? null,
          frozen: mutez(b.frozenDeposit),
          availableSpace, // null = delegation-only (no staking limit set)
        };
      });
    }),

  // ─── Search (address, tx hash, block level/hash) ─────────────────────────────
  search: publicProcedure
    .input(z.object({ q: z.string().min(1) }))
    .query(async ({ input }) => {
      const q = input.q.trim();
      // Block level (numeric)
      if (/^\d+$/.test(q)) {
        return { type: "block", value: parseInt(q) };
      }
      // Block hash (B...)
      if (q.startsWith("B") && q.length > 30) {
        return { type: "block_hash", value: q };
      }
      // Transaction hash (o...)
      if (q.startsWith("o") && q.length > 30) {
        return { type: "tx", value: q };
      }
      // Address (tz1/tz2/tz3/KT1)
      if (/^(tz1|tz2|tz3|KT1)/.test(q)) {
        return { type: "address", value: q };
      }
      return { type: "unknown", value: q };
    }),

  // ─── Token transfers (FA2) ───────────────────────────────────────────────────
  tokenTransfers: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const transfers = await tzkt(`/tokens/transfers?limit=${input.limit}&sort.desc=id`);
      return transfers.map((t: any) => ({
        id: t.id,
        timestamp: t.timestamp,
        token: {
          contract: t.token?.contract?.address || "",
          tokenId: t.token?.tokenId || "0",
          symbol: t.token?.metadata?.symbol || "?",
          name: t.token?.metadata?.name || "Unknown Token",
          decimals: parseInt(t.token?.metadata?.decimals || "0"),
          thumbnail: t.token?.metadata?.thumbnailUri || null,
        },
        from: t.from?.alias || t.from?.address || "mint",
        fromAddress: t.from?.address || null,
        to: t.to?.alias || t.to?.address || "burn",
        toAddress: t.to?.address || null,
        amount: t.amount || "0",
      }));
    }),

  // ─── Baker detail (modal: 10-cycle APY history, fee rate, uptime) ─────────────
  bakerDetail: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
      const [delegate, head] = await Promise.all([
        tzkt(`/delegates/${input.address}`),
        tzkt(`/head`),
      ]);

      // Fetch last 10 completed cycles of rewards
      const rewardCycle = Math.max(1, (head.cycle ?? 1) - 1);
      const history = await tzkt(
        `/rewards/bakers/${input.address}?limit=10&sort.desc=cycle&cycle.lt=${rewardCycle}`
      );

      const cycles = (history as any[]).map((r: any) => {
        const totalRewards =
          (r.blockRewardsDelegated ?? 0) +
          (r.blockRewardsStakedOwn ?? 0) +
          (r.attestationRewardsDelegated ?? 0) +
          (r.attestationRewardsStakedOwn ?? 0) +
          (r.dalAttestationRewardsDelegated ?? 0) +
          (r.dalAttestationRewardsStakedOwn ?? 0);
        const bp = r.bakingPower ?? 0;
        const apy = bp > 0 ? parseFloat(((totalRewards * 365) / bp * 100).toFixed(2)) : null;
        const expectedAtt = r.expectedAttestations ?? 0;
        const actualAtt = r.attestations ?? 0;
        const uptime = expectedAtt > 0 ? parseFloat((actualAtt / expectedAtt * 100).toFixed(1)) : null;
        return {
          cycle: r.cycle,
          apy,
          uptime,
          rewards: mutez(totalRewards),
          bakingPower: mutez(bp),
          missedBlocks: r.missedBlocks ?? 0,
          blocks: r.blocks ?? 0,
          expectedBlocks: r.expectedBlocks ?? 0,
        };
      });

      // Fee rate: edgeOfBakingOverStaking is in billionths (1e9 = 100%)
      const edgeRaw = delegate.edgeOfBakingOverStaking ?? null;
      const feeRate = edgeRaw != null ? parseFloat((edgeRaw / 1e9 * 100).toFixed(1)) : null;

      // Average APY and uptime over available cycles
      const validApys = cycles.filter((c: any) => c.apy != null).map((c: any) => c.apy as number);
      const avgApy = validApys.length > 0 ? parseFloat((validApys.reduce((a: number, b: number) => a + b, 0) / validApys.length).toFixed(2)) : null;
      const validUptimes = cycles.filter((c: any) => c.uptime != null).map((c: any) => c.uptime as number);
      const avgUptime = validUptimes.length > 0 ? parseFloat((validUptimes.reduce((a: number, b: number) => a + b, 0) / validUptimes.length).toFixed(1)) : null;

      return {
        address: delegate.address,
        alias: delegate.alias || null,
        stakingBalance: mutez(delegate.stakingBalance),
        ownBalance: mutez(delegate.balance),
        numDelegators: delegate.numDelegators ?? 0,
        feeRate,
        avgApy,
        avgUptime,
        activeSince: delegate.activationTime ?? null,
        cycles,
      };
    }),

  // ─── Delegation history (delegator count + staked balance over cycles) ─────────────
  delegationHistory: publicProcedure
    .input(z.object({
      address: z.string(),
      cycles: z.number().min(10).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const head = await tzkt(`/head`);
      const currentCycle = head.cycle ?? 1;
      const fromCycle = Math.max(1, currentCycle - input.cycles);

      // Fetch reward history with delegator counts
      const history = await tzkt(
        `/rewards/bakers/${input.address}?limit=${input.cycles}&sort.asc=cycle&cycle.gt=${fromCycle}&cycle.lt=${currentCycle}`
      );

      return (history as any[]).map((r: any) => ({
        cycle: r.cycle,
        delegatorsCount: r.delegatorsCount ?? 0,
        stakersCount: r.stakersCount ?? 0,
        externalDelegatedBalance: mutez(r.externalDelegatedBalance ?? 0),
        externalStakedBalance: mutez(r.externalStakedBalance ?? 0),
        totalDelegated: mutez((r.externalDelegatedBalance ?? 0) + (r.externalStakedBalance ?? 0)),
      }));
    }),

  // ─── Best baker recommendation (for small delegators) ────────────────────────
  bestBaker: publicProcedure.query(async () => {
    // Fetch top 50 active bakers
    const [bakers, head] = await Promise.all([
      tzkt(`/delegates?limit=50&sort.desc=balance&active=true`),
      tzkt(`/head`),
    ]);
    const rewardCycle = Math.max(1, (head.cycle ?? 1) - 2);

    // Filter to bakers with <500 delegators and >10 delegators (established but not saturated)
    const candidates = (bakers as any[]).filter(
      (b: any) => (b.numDelegators ?? 0) < 500 && (b.numDelegators ?? 0) >= 5
    );

    if (candidates.length === 0) return null;

    // Fetch rewards + delegate params for each candidate in parallel
    async function getCandidateData(b: any) {
      try {
        const [rewards, delegate] = await Promise.all([
          tzkt(`/rewards/bakers/${b.address}?limit=5&sort.desc=cycle&cycle.lt=${rewardCycle}`),
          tzkt(`/delegates/${b.address}`),
        ]);

        // Compute avg APY over last 5 cycles
        const apys: number[] = [];
        const uptimes: number[] = [];
        for (const r of (rewards as any[])) {
          const total =
            (r.blockRewardsDelegated ?? 0) + (r.blockRewardsStakedOwn ?? 0) +
            (r.attestationRewardsDelegated ?? 0) + (r.attestationRewardsStakedOwn ?? 0) +
            (r.dalAttestationRewardsDelegated ?? 0) + (r.dalAttestationRewardsStakedOwn ?? 0);
          const bp = r.bakingPower ?? 0;
          if (bp > 0) apys.push((total * 365) / bp * 100);
          const ea = r.expectedAttestations ?? 0;
          const aa = r.attestations ?? 0;
          if (ea > 0) uptimes.push(aa / ea * 100);
        }
        if (apys.length === 0) return null;

        const avgApy = apys.reduce((a, x) => a + x, 0) / apys.length;
        const avgUptime = uptimes.length > 0 ? uptimes.reduce((a, x) => a + x, 0) / uptimes.length : 99;
        const edgeRaw = delegate.edgeOfBakingOverStaking ?? null;
        const feeRate = edgeRaw != null ? edgeRaw / 1e9 * 100 : 15; // default 15% if unknown

        // Score: APY (weight 50%) + uptime (weight 30%) + low fee (weight 20%)
        // Normalise fee: 0% fee = 100 score, 20%+ fee = 0 score
        const feeScore = Math.max(0, 100 - feeRate * 5);
        const score = avgApy * 0.5 + (avgUptime - 99) * 3 + feeScore * 0.2;

        return {
          address: b.address,
          alias: b.alias || null,
          stakingBalance: mutez(b.stakingBalance),
          numDelegators: b.numDelegators ?? 0,
          avgApy: parseFloat(avgApy.toFixed(2)),
          avgUptime: parseFloat(avgUptime.toFixed(1)),
          feeRate: parseFloat(feeRate.toFixed(1)),
          score,
          activeSince: delegate.activationTime ?? null,
        };
      } catch {
        return null;
      }
    }

    // Process in batches of 5
    const results: any[] = [];
    for (let i = 0; i < candidates.length; i += 5) {
      const batch = candidates.slice(i, i + 5);
      const batchResults = await Promise.all(batch.map(getCandidateData));
      results.push(...batchResults.filter(Boolean));
    }

    if (results.length === 0) return null;

    // Pick the highest-scoring candidate
    results.sort((a, b) => b.score - a.score);
    return results[0];
  }),

  // ─── Protocol upgrade history ─────────────────────────────────────────────────
  upgradeHistory: publicProcedure.query(async () => {
    // Fetch all voting epochs with accepted proposals
    const [epochs, protocols] = await Promise.all([
      tzkt("/voting/epochs?limit=100&sort.asc=index"),
      tzkt("/protocols?limit=50&sort.asc=firstLevel"),
    ]);

    // Known protocol name mapping (proposal hash -> human name)
    const PROTOCOL_NAMES: Record<string, string> = {
      "Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd": "Athens A",
      "PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU": "Babylon",
      "PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb": "Carthage",
      "PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo": "Delphi",
      "PtEdoTezd3RHSC31mpxxo1npxFjoWWcFgQtxapi51Z8TLu6v6Uq": "Edo",
      "PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i": "Florence",
      "PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV": "Granada",
      "PtHangzHogokSuiMHemCuowEavgYTP8J5qQ9fQS793MHYFpCY3r": "Hangzhou",
      "Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A": "Ithaca",
      "PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY": "Jakarta",
      "PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg": "Kathmandu",
      "PtLimaPtLMwfNinJi9rCfDPWea8dFgTZ1MeJ9f1m2SRic6ayiwW": "Lima",
      "PtMumbaiiFFEGbew1rRjzSPyzRbA51Tm3RVZL5suHPxSZYDhCEc": "Mumbai",
      "PtNairobiyssHuh87hEhfVBGCVrK3WnS8Z2FT4ymB5tAa4r1nQf": "Nairobi",
      "ProxfordYmVfjWnRcgjWH36fW6PArwqykTFzotUxRs6gmTcZDuH": "Oxford",
      "PtParisBQscdCm6Cfow6ndeU6wKJyA3aV1j4D3gQBQMsTQyJCrz": "Paris",
      "PsQuebecnLByd3JwTiGadoG4nGWi3HYiLXUjkibeFV8dCFeVMUg": "Quebec",
      "PsRiotumaAMotcRoDWW1bysEhQy2n1M5fy8JgRp8jjRfHGmfeA7": "Rio",
      "PtSeouLouXkxhg39oWzjxDWaCydNfR3RxCUrNe4Q9Ro8BTehcbh": "Seoul",
      "PtTALLiNtPec7mE7yY4m3k26J8Qukef3E3ehzhfXgFZKGtDdAXu": "Tallinn",
    };

    // Build protocol map by hash prefix
    const protocolMap: Record<string, any> = {};
    for (const p of (protocols as any[])) {
      protocolMap[p.hash] = p;
    }

    // Filter accepted epochs and build upgrade list
    const upgrades = (epochs as any[])
      .filter((e: any) => e.status === "completed" && e.proposals?.length > 0)
      .map((e: any) => {
        const proposal = e.proposals[0];
        const protocol = protocolMap[proposal.hash] || null;
        const name = PROTOCOL_NAMES[proposal.hash] || null;
        return {
          epoch: e.index,
          proposalHash: proposal.hash,
          name,
          upvotes: proposal.upvotes,
          activationLevel: protocol?.firstLevel ?? null,
          activationCycle: protocol?.firstCycle ?? null,
          activationTime: protocol?.firstLevelTime ?? null,
          startTime: e.startTime,
        };
      })
      .reverse(); // Most recent first

    return upgrades;
  }),

  // ─── Voting / governance (rich) ─────────────────────────────────────────────────
  governance: publicProcedure.query(async () => {
    // Fetch current epoch + last 5 epochs for history
    const [currentEpoch, recentEpochs] = await Promise.all([
      tzkt("/voting/epochs/current"),
      tzkt("/voting/epochs?limit=5&sort.desc=index"),
    ]);

    // Find the most recent period with ballots (exploration or promotion)
    const ballotPeriod = (currentEpoch.periods as any[]).find(
      (p: any) => (p.kind === "exploration" || p.kind === "promotion") && p.yayBallots != null
    );

    // Fetch ballots for the most recent ballot period (if any)
    let ballots: any[] = [];
    if (ballotPeriod) {
      try {
        ballots = await tzkt(`/operations/ballots?limit=500&sort.desc=id&period=${ballotPeriod.index}`);
      } catch { ballots = []; }
    }

    // Compute participation stats from ballots
    const yayBakers = ballots.filter((b: any) => b.vote === "yay");
    const nayBakers = ballots.filter((b: any) => b.vote === "nay");
    const passBakers = ballots.filter((b: any) => b.vote === "pass");
    const totalVotingPower = ballotPeriod?.totalVotingPower ?? 0;
    const castVotingPower = (ballotPeriod?.yayVotingPower ?? 0) + (ballotPeriod?.nayVotingPower ?? 0) + (ballotPeriod?.passVotingPower ?? 0);
    const participationPct = totalVotingPower > 0 ? parseFloat(((castVotingPower / totalVotingPower) * 100).toFixed(1)) : null;
    const yayPct = castVotingPower > 0 ? parseFloat(((ballotPeriod?.yayVotingPower ?? 0) / castVotingPower * 100).toFixed(1)) : null;

    // Current period (last in the epoch)
    const currentPeriod = (currentEpoch.periods as any[]).at(-1) ?? null;

    // Epoch history for the timeline
    const epochHistory = (recentEpochs as any[]).map((e: any) => ({
      index: e.index,
      status: e.status,
      startTime: e.startTime,
      endTime: e.endTime,
      proposals: (e.proposals as any[]).map((p: any) => ({
        hash: p.hash,
        upvotes: p.upvotes,
        status: p.status,
        initiator: p.initiator?.alias || p.initiator?.address || null,
      })),
    }));

    return {
      epoch: {
        index: currentEpoch.index,
        status: currentEpoch.status,
        startTime: currentEpoch.startTime,
        endTime: currentEpoch.endTime,
      },
      currentPeriod: currentPeriod ? {
        index: currentPeriod.index,
        kind: currentPeriod.kind,
        status: currentPeriod.status,
        startTime: currentPeriod.startTime,
        endTime: currentPeriod.endTime,
        totalBakers: currentPeriod.totalBakers ?? 0,
        totalVotingPower: mutez(currentPeriod.totalVotingPower ?? 0),
      } : null,
      proposals: (currentEpoch.proposals as any[]).map((p: any) => ({
        hash: p.hash,
        upvotes: p.upvotes,
        votingPower: mutez(p.votingPower ?? 0),
        status: p.status,
        initiator: p.initiator?.alias || p.initiator?.address || null,
      })),
      ballotPeriod: ballotPeriod ? {
        kind: ballotPeriod.kind,
        status: ballotPeriod.status,
        totalBakers: ballotPeriod.totalBakers ?? 0,
        yayBallots: ballotPeriod.yayBallots ?? 0,
        nayBallots: ballotPeriod.nayBallots ?? 0,
        passBallots: ballotPeriod.passBallots ?? 0,
        participationPct,
        yayPct,
        ballotsQuorum: ballotPeriod.ballotsQuorum ?? null,
        supermajority: ballotPeriod.supermajority ?? null,
      } : null,
      // Top voters by voting power
      topVoters: ballots.slice(0, 20).map((b: any) => ({
        baker: b.delegate?.alias || b.delegate?.address || "Unknown",
        address: b.delegate?.address || "",
        vote: b.vote,
        votingPower: mutez(b.votingPower ?? 0),
      })),
      epochHistory,
    };
  }),
});
