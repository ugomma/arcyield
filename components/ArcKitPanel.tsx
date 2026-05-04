'use client'
// components/ArcKitPanel.tsx
// Displays Arc App Kit integration actions + live code snippets
// Docs: https://docs.arc.network/app-kit

import { useState } from 'react'
import type { CalculationOutput } from '@/lib/calculator'
import { fmtUsd } from '@/lib/calculator'

interface Props {
  result: CalculationOutput | null
  asset: string
}

type Tab = 'bridge' | 'unified' | 'swap' | 'mcp' | 'roi'

const CODE: Record<Tab, (r: CalculationOutput | null, asset: string) => string> = {
  bridge: (r, asset) => `<span class="c-comment">// Arc App Kit — Bridge yield earnings to Arc Testnet</span>
<span class="c-comment">// npm install @circle-fin/app-kit @circle-fin/adapter-viem-v2 viem</span>
<span class="c-comment">// Docs: https://docs.arc.network/app-kit/quickstarts/bridge-tokens-across-blockchains</span>

<span class="c-keyword">import</span> { AppKit } <span class="c-keyword">from</span> <span class="c-string">'@circle-fin/app-kit'</span>
<span class="c-keyword">import</span> { createViemV2Adapter } <span class="c-keyword">from</span> <span class="c-string">'@circle-fin/adapter-viem-v2'</span>
<span class="c-keyword">import</span> { createWalletClient, http } <span class="c-keyword">from</span> <span class="c-string">'viem'</span>
<span class="c-keyword">import</span> { privateKeyToAccount } <span class="c-keyword">from</span> <span class="c-string">'viem/accounts'</span>

<span class="c-keyword">const</span> <span class="c-var">walletClient</span> = <span class="c-fn">createWalletClient</span>({
  account: <span class="c-fn">privateKeyToAccount</span>(process.env.PRIVATE_KEY),
  transport: <span class="c-fn">http</span>(<span class="c-string">'https://eth-mainnet.g.alchemy.com/v2/...'</span>),
})

<span class="c-keyword">const</span> <span class="c-var">viemAdapter</span> = <span class="c-fn">createViemV2Adapter</span>(<span class="c-var">walletClient</span>)
<span class="c-keyword">const</span> <span class="c-var">kit</span> = <span class="c-keyword">new</span> <span class="c-fn">AppKit</span>()

<span class="c-comment">// Bridge monthly yield earnings from Ethereum → Arc Testnet</span>
<span class="c-keyword">const</span> <span class="c-var">result</span> = <span class="c-keyword">await</span> <span class="c-var">kit</span>.<span class="c-fn">bridge</span>({
  from: { adapter: <span class="c-var">viemAdapter</span>, chain: <span class="c-string">"Ethereum_Mainnet"</span> },
  to:   { adapter: <span class="c-var">viemAdapter</span>, chain: <span class="c-string">"Arc_Testnet"</span> },
  amount: <span class="c-string">"${r ? r.totalRevenue.monthly.toFixed(2) : '42.00'}"</span>,  <span class="c-comment">// monthly yield in ${asset}</span>
  token: <span class="c-string">"${asset}"</span>,
})

<span class="c-comment">// Arc fees: ~$0.0001 USDC flat · Finality: &lt;1s</span>
console.<span class="c-fn">log</span>(<span class="c-string">'Bridge tx:'</span>, result.txHash)`,

  unified: (r, asset) => `<span class="c-comment">// Arc Unified Balance — aggregate yield across chains</span>
<span class="c-comment">// Docs: https://docs.arc.network/app-kit/unified-balance</span>

<span class="c-keyword">const</span> <span class="c-var">kit</span> = <span class="c-keyword">new</span> <span class="c-fn">AppKit</span>()

<span class="c-comment">// 1. Deposit yield from Ethereum into Unified Balance</span>
<span class="c-keyword">await</span> <span class="c-var">kit</span>.unifiedBalance.<span class="c-fn">deposit</span>({
  from: { adapter: <span class="c-var">viemAdapter</span>, chain: <span class="c-string">"Ethereum_Mainnet"</span> },
  amount: <span class="c-string">"${r ? (r.totalRevenue.monthly / 2).toFixed(2) : '21.00'}"</span>,
  token: <span class="c-string">"${asset}"</span>,
})

<span class="c-comment">// 2. Deposit from Base as well (multi-chain aggregation)</span>
<span class="c-keyword">await</span> <span class="c-var">kit</span>.unifiedBalance.<span class="c-fn">deposit</span>({
  from: { adapter: <span class="c-var">viemAdapter</span>, chain: <span class="c-string">"Base_Mainnet"</span> },
  amount: <span class="c-string">"${r ? (r.totalRevenue.monthly / 2).toFixed(2) : '21.00'}"</span>,
  token: <span class="c-string">"${asset}"</span>,
})

<span class="c-comment">// 3. Spend full unified balance on Arc in one tx</span>
<span class="c-keyword">const</span> <span class="c-var">spend</span> = <span class="c-keyword">await</span> <span class="c-var">kit</span>.unifiedBalance.<span class="c-fn">spend</span>({
  from: { adapter: <span class="c-var">viemAdapter</span> },
  amountIn: <span class="c-string">"${r ? r.totalRevenue.monthly.toFixed(2) : '42.00'}"</span>,
  to: {
    adapter: <span class="c-var">viemAdapter</span>,
    chain: <span class="c-string">"Arc_Testnet"</span>,
    recipientAddress: <span class="c-string">"0xYourArcAddress"</span>,
  },
})`,

  swap: (_, asset) => `<span class="c-comment">// Arc App Kit — Swap ${asset} → EURC on Arc Testnet</span>
<span class="c-comment">// Docs: https://docs.arc.network/app-kit/quickstarts/swap-tokens-same-chain</span>

<span class="c-keyword">const</span> <span class="c-var">kit</span> = <span class="c-keyword">new</span> <span class="c-fn">AppKit</span>()

<span class="c-keyword">const</span> <span class="c-var">result</span> = <span class="c-keyword">await</span> <span class="c-var">kit</span>.<span class="c-fn">swap</span>({
  from:     { adapter: <span class="c-var">viemAdapter</span>, chain: <span class="c-string">"Arc_Testnet"</span> },
  tokenIn:  <span class="c-string">"${asset}"</span>,
  tokenOut: <span class="c-string">"EURC"</span>,
  amountIn: <span class="c-string">"100.00"</span>,
  config: {
    kitKey: process.env.NEXT_PUBLIC_ARC_KIT_KEY,  <span class="c-comment">// from Circle Console</span>
  },
})

console.<span class="c-fn">log</span>(<span class="c-string">'Swapped:'</span>, result.amountOut, <span class="c-string">'EURC'</span>)

<span class="c-comment">// Cross-chain swap: USDC on Ethereum → EURC on Arc</span>
<span class="c-keyword">const</span> <span class="c-var">crossChain</span> = <span class="c-keyword">await</span> <span class="c-var">kit</span>.<span class="c-fn">swap</span>({
  from:     { adapter: <span class="c-var">viemAdapter</span>, chain: <span class="c-string">"Ethereum_Mainnet"</span> },
  to:       { chain: <span class="c-string">"Arc_Testnet"</span> },
  tokenIn:  <span class="c-string">"USDC"</span>,
  tokenOut: <span class="c-string">"EURC"</span>,
  amountIn: <span class="c-string">"100.00"</span>,
})`,

  mcp: () => `<span class="c-comment">// Arc MCP Server — connect AI coding tools to Arc docs</span>
<span class="c-comment">// https://docs.arc.network/ai/mcp · No auth required</span>

<span class="c-comment">── Claude Code ──────────────────────────────────────────</span>
$ claude mcp add --transport http \\
    arc-docs https://docs.arc.network/mcp

<span class="c-comment">── Cursor / VS Code (mcp.json) ───────────────────────────</span>
{
  <span class="c-string">"mcpServers"</span>: {
    <span class="c-string">"arc-docs"</span>: {
      <span class="c-string">"url"</span>: <span class="c-string">"https://docs.arc.network/mcp"</span>
    }
  }
}

<span class="c-comment">── Windsurf ──────────────────────────────────────────────</span>
{
  <span class="c-string">"mcpServers"</span>: {
    <span class="c-string">"arc-docs"</span>: {
      <span class="c-string">"serverUrl"</span>: <span class="c-string">"https://docs.arc.network/mcp"</span>
    }
  }
}

<span class="c-comment">── Two exposed tools ─────────────────────────────────────</span>
<span class="c-comment">//  search   — find relevant Arc documentation snippets</span>
<span class="c-comment">//  get_page — retrieve full content of any Arc doc page</span>

<span class="c-comment">── Verify connection ─────────────────────────────────────</span>
<span class="c-string">"What smart contract standards does Arc support?"</span>`,

  roi: (r, asset) => `<span class="c-comment">// ArcYield — ROI calculation logic (this app)</span>
<span class="c-comment">// lib/calculator.ts</span>

<span class="c-keyword">function</span> <span class="c-fn">calcRevenue</span>(depositUsd: <span class="c-type">number</span>, apyPct: <span class="c-type">number</span>) {
  <span class="c-keyword">const</span> <span class="c-var">annual</span>  = depositUsd * (apyPct / <span class="c-num">100</span>)
  <span class="c-keyword">return</span> {
    daily:   annual / <span class="c-num">365</span>,   <span class="c-comment">// → ${r ? fmtUsd(r.totalRevenue.daily) : '$0.00'}</span>
    weekly:  annual / <span class="c-num">52</span>,    <span class="c-comment">// → ${r ? fmtUsd(r.totalRevenue.weekly) : '$0.00'}</span>
    monthly: annual / <span class="c-num">12</span>,    <span class="c-comment">// → ${r ? fmtUsd(r.totalRevenue.monthly) : '$0.00'}</span>
    annual,                 <span class="c-comment">// → ${r ? fmtUsd(r.totalRevenue.annual) : '$0.00'}</span>
  }
}

<span class="c-comment">// Live APY from Aave V3 subgraph</span>
<span class="c-keyword">const</span> <span class="c-var">AAVE_SUBGRAPH</span> = <span class="c-string">'https://api.thegraph.com/subgraphs/name/aave/protocol-v3'</span>
<span class="c-keyword">const</span> <span class="c-var">query</span> = <span class="c-fn">gql</span><span class="c-string">\`
  query GetReserves($assets: [String!]) {
    reserves(where: { symbol_in: $assets, isActive: true }) {
      symbol
      liquidityRate    # RAY (1e27) — convert: rate/1e27 * 100
      utilizationRate
    }
  }
\`</span>

<span class="c-comment">// Arc RPC — EVM-compatible, balanceOf call</span>
<span class="c-keyword">const</span> <span class="c-var">ARC_RPC</span> = <span class="c-string">'https://rpc.testnet.arc.network'</span>
<span class="c-comment">// GET /api/apys?asset=${asset} — server route caches 5 min</span>`,
}

export function ArcKitPanel({ result, asset }: Props) {
  const [tab, setTab] = useState<Tab>('bridge')

  const actions = [
    { id: 'bridge' as Tab, icon: '→', label: 'Bridge to Arc', sub: 'kit.bridge()' },
    { id: 'unified' as Tab, icon: '◎', label: 'Unified Balance', sub: 'kit.unifiedBalance.spend()' },
    { id: 'swap' as Tab, icon: '⇄', label: 'Swap Tokens', sub: 'kit.swap()' },
  ]

  const tabs: { id: Tab; label: string }[] = [
    { id: 'bridge', label: 'Bridge' },
    { id: 'unified', label: 'Unified Balance' },
    { id: 'swap', label: 'Swap' },
    { id: 'roi', label: 'ROI Calc' },
    { id: 'mcp', label: 'MCP Server' },
  ]

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Arc App Kit action panel */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.05) 0%, rgba(30,158,120,0.05) 100%)',
          border: '1px solid rgba(201,168,76,0.18)',
          borderRadius: 16,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              background: 'var(--arc-gold)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 800,
              color: '#000',
            }}
          >
            A
          </div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            Arc <span style={{ color: 'var(--arc-gold)' }}>App Kit</span> — Take Action
          </div>
          <a
            href="https://docs.arc.network/app-kit"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono), monospace',
              color: 'var(--arc-gold)',
              textDecoration: 'none',
              marginLeft: 'auto',
            }}
          >
            docs.arc.network ↗
          </a>
        </div>

        <div
          style={{
            fontSize: 12,
            fontFamily: 'var(--font-mono), monospace',
            color: 'var(--arc-muted)',
            marginBottom: 16,
            lineHeight: 1.6,
          }}
        >
          {result
            ? `// Deploy your ${fmtUsd(result.totalRevenue.monthly)}/month yield using Arc's native infrastructure`
            : '// Bridge, swap, and aggregate your DeFi yield with USDC-native gas ($0.0001/tx)'}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 10,
          }}
        >
          {actions.map(a => (
            <button
              key={a.id}
              onClick={() => setTab(a.id)}
              style={{
                background: tab === a.id ? 'rgba(201,168,76,0.1)' : 'var(--arc-surface)',
                border: `1px solid ${tab === a.id ? 'rgba(201,168,76,0.35)' : 'var(--arc-border2)'}`,
                color: 'var(--arc-text)',
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: 13,
                fontWeight: 600,
                padding: '12px 14px',
                borderRadius: 10,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.18s',
                outline: 'none',
              }}
            >
              <span style={{ display: 'block', fontSize: 20, marginBottom: 6 }}>
                {a.icon}
              </span>
              {a.label}
              <span
                style={{
                  display: 'block',
                  fontSize: 10,
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--arc-muted)',
                  marginTop: 3,
                }}
              >
                {a.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Code snippet panel */}
      <div
        style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono), monospace',
          color: 'var(--arc-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: 10,
        }}
      >
        Integration Snippets
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          gap: 2,
          background: 'var(--arc-surface2)',
          border: '1px solid var(--arc-border2)',
          borderBottom: 'none',
          borderRadius: '10px 10px 0 0',
          padding: '8px 12px 0',
          overflowX: 'auto',
        }}
      >
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono), monospace',
              padding: '5px 12px 8px',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              color: tab === t.id ? 'var(--arc-gold)' : 'var(--arc-muted)',
              background: tab === t.id ? 'rgba(201,168,76,0.1)' : 'transparent',
              border: 'none',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              outline: 'none',
            }}
          >
            {t.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono), monospace',
              color: 'var(--arc-gold)',
              background: 'rgba(201,168,76,0.1)',
              padding: '2px 8px',
              borderRadius: '4px 4px 0 0',
            }}
          >
            docs.arc.network
          </span>
        </div>
      </div>

      {/* Code body */}
      <div
        style={{
          background: 'var(--arc-surface)',
          border: '1px solid var(--arc-border2)',
          borderRadius: '0 0 10px 10px',
          padding: 20,
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 12,
          lineHeight: 1.9,
          overflowX: 'auto',
          color: 'var(--arc-text)',
        }}
        dangerouslySetInnerHTML={{ __html: CODE[tab](result, asset) }}
      />
    </div>
  )
}
