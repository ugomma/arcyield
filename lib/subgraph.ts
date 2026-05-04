// lib/subgraph.ts
// Live APY fetching from Aave V3 subgraph, Compound API, and fallbacks
// Docs: https://docs.aave.com/developers/developing-on-aave/the-graph

import { request, gql } from 'graphql-request'

// ── Aave V3 Subgraph ──────────────────────────────────────────────────────────
const AAVE_SUBGRAPH = process.env.NEXT_PUBLIC_AAVE_SUBGRAPH_URL ||
  'https://api.thegraph.com/subgraphs/name/aave/protocol-v3'

// GraphQL query for reserve APY data
// liquidityRate is in RAY units (1e27) — we convert to %
const AAVE_RESERVES_QUERY = gql`
  query GetReserves($assets: [String!]) {
    reserves(
      where: { symbol_in: $assets, isActive: true }
      orderBy: totalLiquidity
      orderDirection: desc
    ) {
      symbol
      name
      liquidityRate        # supply APY in RAY (1e27)
      variableBorrowRate   # borrow APY in RAY
      totalLiquidity
      availableLiquidity
      utilizationRate
      decimals
      underlyingAsset
    }
  }
`

export interface AaveReserve {
  symbol: string
  name: string
  supplyApy: number      // as percentage (e.g. 4.82)
  borrowApy: number
  totalLiquidity: number
  utilizationRate: number
}

// Convert RAY (1e27) to APY percentage
function rayToApy(ray: string): number {
  const RAY = 1e27
  const rate = parseFloat(ray) / RAY
  // Compound continuously: (1 + rate/secondsPerYear)^secondsPerYear - 1
  // Simplified: rate * 100 for display
  return rate * 100
}

export async function fetchAaveApys(symbols: string[]): Promise<Record<string, number>> {
  try {
    const data = await request<{ reserves: any[] }>(
      AAVE_SUBGRAPH,
      AAVE_RESERVES_QUERY,
      { assets: symbols.map(s => s.toUpperCase()) }
    )
    const result: Record<string, number> = {}
    data.reserves.forEach((r: any) => {
      result[r.symbol] = rayToApy(r.liquidityRate)
    })
    return result
  } catch (err) {
    console.warn('[ArcYield] Aave subgraph unavailable, using fallback APYs', err)
    return {}
  }
}

// ── Compound V3 API ───────────────────────────────────────────────────────────
const COMPOUND_API = process.env.NEXT_PUBLIC_COMPOUND_API_URL ||
  'https://api.compound.finance/api/v2/ctoken'

export interface CompoundMarket {
  symbol: string
  supplyRate: number  // % per year
  totalSupply: number
}

export async function fetchCompoundApys(symbols: string[]): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      `${COMPOUND_API}?network=mainnet`,
      { next: { revalidate: 300 } } // cache 5 minutes
    )
    if (!res.ok) throw new Error('Compound API error')
    const data = await res.json()
    const result: Record<string, number> = {}

    data.cToken?.forEach((market: any) => {
      const sym = market.underlying_symbol?.toUpperCase()
      if (sym && symbols.includes(sym)) {
        // supply_rate.value is already in % form for V2
        result[sym] = parseFloat(market.supply_rate?.value || '0') * 100
      }
    })
    return result
  } catch (err) {
    console.warn('[ArcYield] Compound API unavailable, using fallback', err)
    return {}
  }
}

// ── Morpho Blue (uses Aave-compatible rates + spread) ─────────────────────────
// Morpho optimises Aave rates — typically 0.3-0.5% higher
export function estimateMorphoApy(aaveApy: number): number {
  return aaveApy * 1.08 // ~8% improvement from peer-to-peer matching
}

// ── Arc Native Lending (simulated until mainnet) ──────────────────────────────
// Arc testnet lending rates — higher APY due to lower TVL and higher demand
// In production these come from Arc's on-chain lending contract
export function getArcNativeApy(symbol: string): number {
  const base: Record<string, number> = {
    USDC: 6.40,
    EURC: 6.10,
    ETH: 3.20,
    WBTC: 1.85,
    DAI: 6.35,
    USDT: 6.20,
  }
  return base[symbol] ?? 5.50
}

// ── Aggregated APY fetch ──────────────────────────────────────────────────────
export interface ProtocolApys {
  'aave-v3': number
  'compound-v3': number
  'arc-lending': number
  'morpho-blue': number
  'spark': number
  'fluid': number
  fetchedAt: number
  isLive: boolean
}

export async function fetchAllApys(asset: string): Promise<ProtocolApys> {
  const [aaveApys, compoundApys] = await Promise.all([
    fetchAaveApys([asset]),
    fetchCompoundApys([asset]),
  ])

  const aaveApy = aaveApys[asset] || getDefaultApy('aave-v3', asset)
  const compoundApy = compoundApys[asset] || getDefaultApy('compound-v3', asset)

  return {
    'aave-v3': aaveApy,
    'compound-v3': compoundApy,
    'arc-lending': getArcNativeApy(asset),
    'morpho-blue': estimateMorphoApy(aaveApy),
    'spark': aaveApy * 1.035,       // Spark uses DSR + buffer
    'fluid': compoundApy * 1.12,    // Fluid optimises Compound
    fetchedAt: Date.now(),
    isLive: Object.keys(aaveApys).length > 0,
  }
}

// ── Fallback APYs (when APIs are unavailable) ────────────────────────────────
function getDefaultApy(protocolId: string, asset: string): number {
  const defaults: Record<string, Record<string, number>> = {
    'aave-v3': { USDC: 4.82, EURC: 4.50, ETH: 2.10, WBTC: 0.85, DAI: 4.75, USDT: 4.90 },
    'compound-v3': { USDC: 3.95, EURC: 3.70, ETH: 1.80, WBTC: 0.62, DAI: 3.90, USDT: 4.00 },
    'morpho-blue': { USDC: 5.21, EURC: 4.86, ETH: 2.27, WBTC: 0.92, DAI: 5.13, USDT: 5.29 },
    'spark': { USDC: 5.00, EURC: 4.70, ETH: 2.00, WBTC: 0.80, DAI: 4.92, USDT: 5.08 },
    'fluid': { USDC: 4.45, EURC: 4.18, ETH: 2.02, WBTC: 0.70, DAI: 4.38, USDT: 4.52 },
  }
  return defaults[protocolId]?.[asset] ?? 4.00
}

// ── Wallet balance via Arc RPC (EVM-compatible) ───────────────────────────────
// Arc supports standard eth_call / balanceOf reads
export async function fetchWalletBalance(
  walletAddress: string,
  tokenAddress: string,
  rpcUrl: string
): Promise<number> {
  try {
    // ERC-20 balanceOf(address) selector: 0x70a08231
    const data = '0x70a08231' + walletAddress.slice(2).padStart(64, '0')
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{ to: tokenAddress, data }, 'latest'],
      }),
    })
    const json = await res.json()
    if (json.result) {
      return parseInt(json.result, 16) / 1e6 // USDC has 6 decimals
    }
    return 0
  } catch {
    return 0
  }
}
