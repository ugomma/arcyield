// lib/protocols.ts
// Protocol definitions, assets, and Arc contract addresses

export interface Protocol {
  id: string
  name: string
  shortName: string
  icon: string
  chain: string
  chainId: number
  color: string
  accentColor: string
  defaultApy: number          // fallback APY when subgraph is unreachable
  tvlUsd: number              // approximate TVL in USD
  network: 'Ethereum' | 'Base' | 'Arbitrum' | 'Arc' | 'Polygon'
  isArcNative: boolean
  subgraphAsset?: string      // asset id in the subgraph (for filtering)
  docsUrl: string
}

export const PROTOCOLS: Protocol[] = [
  {
    id: 'aave-v3',
    name: 'Aave V3',
    shortName: 'Aave',
    icon: '👻',
    chain: 'Ethereum',
    chainId: 1,
    color: '#B6509E',
    accentColor: 'rgba(182,80,158,0.15)',
    defaultApy: 4.82,
    tvlUsd: 12_400_000_000,
    network: 'Ethereum',
    isArcNative: false,
    docsUrl: 'https://docs.aave.com/developers/',
  },
  {
    id: 'compound-v3',
    name: 'Compound V3',
    shortName: 'Compound',
    icon: '🏦',
    chain: 'Ethereum / Base',
    chainId: 1,
    color: '#00D395',
    accentColor: 'rgba(0,211,149,0.12)',
    defaultApy: 3.95,
    tvlUsd: 3_200_000_000,
    network: 'Ethereum',
    isArcNative: false,
    docsUrl: 'https://docs.compound.finance/',
  },
  {
    id: 'arc-lending',
    name: 'Arc Lending',
    shortName: 'Arc',
    icon: '⚡',
    chain: 'Arc Testnet',
    chainId: 4231,
    color: '#C9A84C',
    accentColor: 'rgba(201,168,76,0.12)',
    defaultApy: 6.40,
    tvlUsd: 420_000_000,
    network: 'Arc',
    isArcNative: true,
    docsUrl: 'https://docs.arc.network',
  },
  {
    id: 'morpho-blue',
    name: 'Morpho Blue',
    shortName: 'Morpho',
    icon: '🔵',
    chain: 'Ethereum / Base',
    chainId: 1,
    color: '#6771F5',
    accentColor: 'rgba(103,113,245,0.12)',
    defaultApy: 5.21,
    tvlUsd: 1_800_000_000,
    network: 'Ethereum',
    isArcNative: false,
    docsUrl: 'https://docs.morpho.org/',
  },
  {
    id: 'spark',
    name: 'Spark Protocol',
    shortName: 'Spark',
    icon: '✨',
    chain: 'Ethereum',
    chainId: 1,
    color: '#F77F00',
    accentColor: 'rgba(247,127,0,0.12)',
    defaultApy: 5.00,
    tvlUsd: 2_100_000_000,
    network: 'Ethereum',
    isArcNative: false,
    docsUrl: 'https://docs.spark.fi/',
  },
  {
    id: 'fluid',
    name: 'Fluid (Instadapp)',
    shortName: 'Fluid',
    icon: '💧',
    chain: 'Ethereum / Arbitrum',
    chainId: 1,
    color: '#2CA8FF',
    accentColor: 'rgba(44,168,255,0.12)',
    defaultApy: 4.45,
    tvlUsd: 980_000_000,
    network: 'Arbitrum',
    isArcNative: false,
    docsUrl: 'https://docs.fluid.instadapp.io/',
  },
]

// ── Assets ────────────────────────────────────────────────────────────────────
export interface Asset {
  symbol: string
  name: string
  decimals: number
  // APY multiplier relative to USDC baseline
  apyMultiplier: number
  // Arc contract addresses (testnet)
  arcAddress?: string
}

export const ASSETS: Asset[] = [
  { symbol: 'USDC', name: 'USD Coin', decimals: 6, apyMultiplier: 1.0, arcAddress: '0x...' },
  { symbol: 'EURC', name: 'Euro Coin', decimals: 6, apyMultiplier: 0.94 },
  { symbol: 'ETH', name: 'Ethereum', decimals: 18, apyMultiplier: 0.52 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', decimals: 8, apyMultiplier: 0.28 },
  { symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, apyMultiplier: 0.99 },
  { symbol: 'USDT', name: 'Tether USD', decimals: 6, apyMultiplier: 0.97 },
]

// ── Arc App Kit supported chains ──────────────────────────────────────────────
// From: https://docs.arc.network/app-kit/references/supported-blockchains
export const ARC_KIT_CHAINS = [
  'Arc_Testnet',
  'Ethereum_Mainnet',
  'Ethereum_Sepolia',
  'Base_Mainnet',
  'Base_Sepolia',
  'Arbitrum_One',
  'Arbitrum_Sepolia',
  'Polygon_Mainnet',
] as const

export type ArcKitChain = (typeof ARC_KIT_CHAINS)[number]

// ── Arc MCP Server ────────────────────────────────────────────────────────────
// https://docs.arc.network/ai/mcp
export const ARC_MCP_URL = 'https://docs.arc.network/mcp'
export const ARC_RPC_URL = process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc.testnet.arc.network'
export const ARC_EXPLORER = 'https://testnet.arcscan.app'
export const ARC_FAUCET = 'https://faucet.circle.com'
