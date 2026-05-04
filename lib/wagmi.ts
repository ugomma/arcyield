// lib/wagmi.ts
// Arc Network chain definition + wagmi config
// Arc is EVM-compatible — we define it as a custom chain

import { createConfig, http } from 'wagmi'
import { mainnet, base, arbitrum, polygon } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import type { Chain } from 'wagmi/chains'

// ── Arc Testnet chain definition ──────────────────────────────────────────────
// Based on: https://docs.arc.network/arc/references/connect-to-arc
export const arcTestnet: Chain = {
  id: 4231,
  name: 'Arc Testnet',
  nativeCurrency: {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6, // USDC is the native gas token on Arc
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ARC_RPC_URL || 'https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
}

// ── Wagmi + RainbowKit config ─────────────────────────────────────────────────
export const wagmiConfig = getDefaultConfig({
  appName: 'ArcYield — DeFi Revenue Calculator',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
  chains: [arcTestnet, mainnet, base, arbitrum, polygon],
  transports: {
    [arcTestnet.id]: http(arcTestnet.rpcUrls.default.http[0]),
    [mainnet.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
  },
  ssr: true,
})
