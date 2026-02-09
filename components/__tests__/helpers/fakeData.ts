type SeededRng = () => number

export type Wallet = {
  id: string
  address: string
}

export type Token = {
  symbol: string
  decimals: number
}

export type Pool = {
  id: string
  token: Token
}

export type Reward = {
  type: string
  amount: bigint
  claimableAt: number
  claimedAt?: number
  epoch: number
}

export type Deposit = {
  amount: bigint
  timestamp: number
  txHash: string
  status: 'success' | 'failed' | 'pending'
}

export type Fixtures = {
  seed: number
  now: number
  wallets: Wallet[]
  tokens: {
    elimu: Token
    lp: Token
  }
  pool: Pool
  rewardRatePerSec: bigint
  balances: Record<string, { elimu: bigint; lp: bigint; staked: bigint }>
  deposits: Record<string, Deposit[]>
  rewards: Record<string, Reward[]>
}

function mulberry32(seed: number): SeededRng {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function toAddress(index: number): string {
  return `0x${index.toString(16).padStart(40, '0')}`
}

function randomBigInt(rng: SeededRng, min: number, max: number): bigint {
  const value = Math.floor(rng() * (max - min + 1)) + min
  return BigInt(value)
}

function makeTxHash(rng: SeededRng): string {
  const hex = Math.floor(rng() * 1e12).toString(16).padStart(12, '0')
  return `0x${hex.padStart(64, '0')}`
}

export function createFixtures(seed = 1337): Fixtures {
  const rng = mulberry32(seed)
  const now = Date.UTC(2025, 0, 1, 0, 0, 0)

  const wallets: Wallet[] = Array.from({ length: 5 }, (_, idx) => ({
    id: `U${idx + 1}`,
    address: toAddress(idx + 1)
  }))

  const tokens = {
    elimu: { symbol: 'ELIMU', decimals: 18 },
    lp: { symbol: 'LP', decimals: 18 }
  }

  const pool = {
    id: 'pool-1',
    token: tokens.lp
  }

  const rewardRatePerSec = BigInt(1000)

  const balances: Fixtures['balances'] = {}
  const deposits: Fixtures['deposits'] = {}
  const rewards: Fixtures['rewards'] = {}

  const hugeAmount = BigInt('9007199254740993000000000000000000')

  wallets.forEach((wallet, index) => {
    balances[wallet.address] = {
      elimu: index === wallets.length - 1 ? hugeAmount : randomBigInt(rng, 500, 2000),
      lp: index === wallets.length - 1 ? hugeAmount : randomBigInt(rng, 0, 500),
      staked: index === wallets.length - 1 ? hugeAmount : randomBigInt(rng, 0, 300)
    }

    deposits[wallet.address] = Array.from({ length: 2 }, () => ({
      amount: randomBigInt(rng, 10, 200),
      timestamp: now - Math.floor(rng() * 7 * 24 * 60 * 60 * 1000),
      txHash: makeTxHash(rng),
      status: rng() > 0.2 ? 'success' : 'failed'
    }))

    rewards[wallet.address] = Array.from({ length: 2 }, (_, rewardIdx) => ({
      type: 'ELIMU',
      amount: randomBigInt(rng, 0, 200),
      claimableAt: now + (rewardIdx === 0 ? -3600_000 : 3600_000),
      claimedAt: rewardIdx === 1 && rng() > 0.6 ? now - 1800_000 : undefined,
      epoch: rewardIdx + 1
    }))
  })

  return { seed, now, wallets, tokens, pool, rewardRatePerSec, balances, deposits, rewards }
}

export function getClaimableAmount(reward: Reward, now: number): bigint {
  if (reward.claimedAt) {
    return BigInt(0)
  }
  return now >= reward.claimableAt ? reward.amount : BigInt(0)
}

export function simulateAddLiquidity(amountElimu: bigint, amountPair: bigint): bigint {
  const minAmount = amountElimu < amountPair ? amountElimu : amountPair
  return minAmount / BigInt(2)
}

export function computeEarned(
  stake: bigint,
  totalStake: bigint,
  rewardRatePerSec: bigint,
  elapsedSeconds: number
): bigint {
  if (totalStake === BigInt(0) || elapsedSeconds <= 0) {
    return BigInt(0)
  }
  const numerator = stake * rewardRatePerSec * BigInt(elapsedSeconds)
  return numerator / totalStake
}
