# ArcYield — DeFi Revenue Share Calculator

Built on Arc Network. Calculate daily, weekly & monthly yield across Aave, Compound, Morpho, Spark, and Arc-native lending.

## Stack
- Next.js 15 (App Router) + TypeScript
- Wagmi v2 + RainbowKit (wallet connect)
- Arc App Kit (@circle-fin/app-kit) for bridge, swap, unified balance
- Aave V3 subgraph for live APYs
- Arc Testnet (chain ID 4231, USDC-native gas)

## Quick Start

1. Install dependencies:
   npm install

2. Copy env file and fill in your keys:
   cp .env.local .env.local
   # Edit NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID (free at cloud.walletconnect.com)

3. Run the dev server:
   npm run dev

4. Open http://localhost:3000

## Project Structure

arcyield/
├── app/
│   ├── api/apys/route.ts     ← Server route: fetches live APYs (Aave subgraph + Compound)
│   ├── globals.css            ← Arc design system CSS variables
│   ├── layout.tsx             ← Root layout with fonts + providers
│   ├── page.tsx               ← Main dashboard page
│   └── providers.tsx          ← Wagmi + RainbowKit + React Query setup
├── components/
│   ├── Header.tsx             ← Sticky header with wallet connect button
│   ├── ProtocolSelector.tsx   ← Protocol cards grid (Aave, Compound, Arc, etc.)
│   ├── RevenueCards.tsx       ← Daily / Weekly / Monthly yield result cards
│   ├── BreakdownTable.tsx     ← Per-protocol yield breakdown table
│   └── ArcKitPanel.tsx        ← Arc App Kit actions + code snippets
├── lib/
│   ├── calculator.ts          ← Revenue share math (daily/weekly/monthly/ROI)
│   ├── protocols.ts           ← Protocol list, asset list, Arc chain config
│   ├── subgraph.ts            ← Aave subgraph + Compound API data fetching
│   └── wagmi.ts               ← Arc Testnet chain def + wagmi config
├── .env.local                 ← Your API keys (never commit this)
├── package.json
└── tsconfig.json

## Arc Integration Points

| Feature | File | Arc Docs |
|---------|------|----------|
| Arc chain definition | lib/wagmi.ts | docs.arc.network/arc/references/connect-to-arc |
| Bridge tokens | components/ArcKitPanel.tsx | docs.arc.network/app-kit/quickstarts/bridge-tokens |
| Unified Balance | components/ArcKitPanel.tsx | docs.arc.network/app-kit/unified-balance |
| Swap tokens | components/ArcKitPanel.tsx | docs.arc.network/app-kit/quickstarts/swap-tokens |
| Arc MCP | Any AI coding tool | docs.arc.network/ai/mcp |

## Arc MCP (AI-assisted coding)

Add Arc's MCP server to your AI coding tool for doc-aware code generation:

Claude Code:
  claude mcp add --transport http arc-docs https://docs.arc.network/mcp

Cursor / VS Code (mcp.json):
  { "mcpServers": { "arc-docs": { "url": "https://docs.arc.network/mcp" } } }

## Deploy to Vercel

npx vercel --prod
(Add env vars in Vercel dashboard under Project → Settings → Environment Variables)
