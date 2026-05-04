'use client'
// app/page.tsx — ArcYield main dashboard

import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Header } from '@/components/Header'
import { ProtocolSelector } from '@/components/ProtocolSelector'
import { RevenueCards } from '@/components/RevenueCards'
import { BreakdownTable } from '@/components/BreakdownTable'
import { ArcKitPanel } from '@/components/ArcKitPanel'
import { PROTOCOLS, ASSETS } from '@/lib/protocols'
import { calculateAll, fmtUsd, type CalculationOutput } from '@/lib/calculator'

const DEFAULT_PROTOCOLS = new Set(['aave-v3', 'arc-lending', 'morpho-blue'])
const FALLBACK_APYS: Record<string, number> = {
  'aave-v3': 4.82,
  'compound-v3': 3.95,
  'arc-lending': 6.40,
  'morpho-blue': 5.21,
  'spark': 5.00,
  'fluid': 4.45,
}

export default function Home() {
  const { address } = useAccount()
  const [deposit, setDeposit] = useState('10000')
  const [asset, setAsset] = useState('USDC')
  const [selected, setSelected] = useState<Set<string>>(DEFAULT_PROTOCOLS)
  const [apys, setApys] = useState<Record<string, number>>(FALLBACK_APYS)
  const [apysLoading, setApysLoading] = useState(false)
  const [apysLive, setApysLive] = useState(false)
  const [result, setResult] = useState<CalculationOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [walletOverride, setWalletOverride] = useState('')

  // Fetch live APYs from our API route (which hits Aave subgraph + Compound)
  const fetchApys = useCallback(async (selectedAsset: string) => {
    setApysLoading(true)
    try {
      const res = await fetch(`/api/apys?asset=${selectedAsset}`)
      const data = await res.json()
      if (data.success && data.apys) {
        setApys(data.apys)
        setApysLive(data.apys.isLive)
      }
    } catch {
      // fallback silently
    } finally {
      setApysLoading(false)
    }
  }, [])

  useEffect(() => { fetchApys(asset) }, [asset, fetchApys])

  // Autofill deposit from wallet if connected
  useEffect(() => {
    if (address && !walletOverride) {
      setWalletOverride(address)
    }
  }, [address])

  const handleToggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size === 1) return prev
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleCalculate = () => {
    const dep = parseFloat(deposit)
    if (!dep || dep <= 0) return
    setLoading(true)
    setTimeout(() => {
      try {
        const protocolNames = Object.fromEntries(PROTOCOLS.map(p => [p.id, p.name]))
        const out = calculateAll(dep, apys, Array.from(selected), protocolNames)
        out.asset = asset
        setResult(out)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }, 200)
  }

  const totalWeightedApy = Array.from(selected).reduce((s, id) => s + (apys[id] || 0), 0) / selected.size

  return (
    <div style={{ minHeight: '100vh', background: 'var(--arc-black)' }}>
      <Header />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── HERO ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 32, marginBottom: 40, alignItems: 'start' }}>
          <div>
            <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 14 }}>
              Track Your{' '}
              <span style={{ color: 'var(--arc-gold)' }}>DeFi Revenue</span>
              <br />Across Every Protocol
            </h1>
            <p style={{ fontSize: 13, fontFamily: 'var(--font-mono), monospace', color: 'var(--arc-muted)', lineHeight: 1.8, marginBottom: 20, maxWidth: 460 }}>
              // Calculate daily, weekly & monthly yield across Aave, Compound,
              Morpho, Spark, and Arc-native lending.
              <br />// Powered by Arc&apos;s stablecoin-native L1 infrastructure.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['var(--arc-gold)', 'Arc App Kit — bridge, swap & unified balance'],
                ['var(--arc-teal)', 'Live APY from Aave V3 subgraph + Compound API'],
                ['#a78bfa', 'Multi-protocol yield aggregation'],
                ['#60a5fa', 'Arc MCP-ready — build with Claude / Cursor'],
              ].map(([color, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, fontFamily: 'var(--font-mono), monospace', color: 'var(--arc-muted)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* ── Input Card ── */}
          <div style={{ background: 'var(--arc-surface)', border: '1px solid var(--arc-border2)', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono), monospace', color: 'var(--arc-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
              Wallet / Deposit
            </div>

            {/* Wallet address */}
            <input
              value={walletOverride}
              onChange={e => setWalletOverride(e.target.value)}
              placeholder={address || '0x... or connect wallet above'}
              style={{ width: '100%', background: 'var(--arc-surface2)', border: '1px solid var(--arc-border2)', color: 'var(--arc-text)', fontFamily: 'var(--font-mono), monospace', fontSize: 11, padding: '10px 12px', borderRadius: 8, outline: 'none', marginBottom: 12 }}
            />

            {/* Amount + Asset */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono), monospace', color: 'var(--arc-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Deposit (USD)</div>
                <input
                  type="number"
                  value={deposit}
                  onChange={e => setDeposit(e.target.value)}
                  min="1"
                  step="100"
                  style={{ width: '100%', background: 'var(--arc-surface2)', border: '1px solid var(--arc-border2)', color: 'var(--arc-text)', fontFamily: 'var(--font-mono), monospace', fontSize: 14, padding: '10px 12px', borderRadius: 8, outline: 'none' }}
                />
              </div>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono), monospace', color: 'var(--arc-muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Asset</div>
                <select
                  value={asset}
                  onChange={e => setAsset(e.target.value)}
                  style={{ width: '100%', background: 'var(--arc-surface2)', border: '1px solid var(--arc-border2)', color: 'var(--arc-text)', fontFamily: 'var(--font-mono), monospace', fontSize: 14, padding: '10px 12px', borderRadius: 8, outline: 'none', cursor: 'pointer' }}
                >
                  {ASSETS.map(a => (
                    <option key={a.symbol} value={a.symbol}>{a.symbol} — {a.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live APY preview */}
            <div style={{ background: 'var(--arc-surface2)', borderRadius: 8, padding: '10px 12px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono), monospace', color: 'var(--arc-muted)' }}>
                Weighted APY ({selected.size} protocols)
              </span>
              <span style={{ fontSize: 14, fontFamily: 'var(--font-mono), monospace', fontWeight: 700, color: 'var(--arc-teal)' }}>
                {apysLoading ? '...' : totalWeightedApy.toFixed(2) + '%'}
              </span>
            </div>

            {/* Estimate preview */}
            {deposit && parseFloat(deposit) > 0 && (
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono), monospace', color: 'var(--arc-muted)', marginBottom: 12, background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 6, padding: '8px 12px' }}>
                ≈ {fmtUsd((parseFloat(deposit) * totalWeightedApy / 100) / 12)}/month
                <span style={{ marginLeft: 8, color: 'var(--arc-gold)' }}>
                  · {fmtUsd((parseFloat(deposit) * totalWeightedApy / 100) / 365)}/day
                </span>
              </div>
            )}

            <button
              onClick={handleCalculate}
              disabled={loading}
              style={{ width: '100%', padding: 13, background: loading ? 'rgba(201,168,76,0.5)' : 'var(--arc-gold)', color: '#000', fontFamily: 'var(--font-syne), sans-serif', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.15s', letterSpacing: '0.2px' }}
            >
              {loading ? 'Calculating...' : 'Calculate Revenue Share →'}
            </button>

            {/* APY source badge */}
            <div style={{ marginTop: 10, fontSize: 10, fontFamily: 'var(--font-mono), monospace', color: 'var(--arc-muted)', textAlign: 'center' }}>
              {apysLive ? (
                <span style={{ color: 'var(--arc-teal)' }}>● Live APYs from Aave subgraph</span>
              ) : (
                <span>◌ Using benchmark APYs (subgraph offline)</span>
              )}
            </div>
          </div>
        </div>

        {/* ── PROTOCOL SELECTOR ── */}
        <ProtocolSelector
          selected={selected}
          apys={apys}
          apysLoading={apysLoading}
          onToggle={handleToggle}
        />

        {/* ── METRICS BAR ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 32 }}>
          {[
            { label: 'Protocols Selected', value: `${selected.size} / ${PROTOCOLS.length}`, color: 'var(--arc-text)' },
            { label: 'Weighted APY', value: apysLoading ? '...' : totalWeightedApy.toFixed(2) + '%', color: 'var(--arc-teal)' },
            { label: 'Arc Gas (USDC)', value: '$0.0001 / tx', color: 'var(--arc-gold)' },
            { label: 'Arc Finality', value: '< 1 second', color: 'var(--arc-teal)' },
          ].map(m => (
            <div key={m.label} style={{ background: 'var(--arc-surface)', border: '1px solid var(--arc-border)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono), monospace', color: 'var(--arc-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px', color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* ── RESULTS ── */}
        {!result && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--arc-muted)', fontFamily: 'var(--font-mono), monospace', fontSize: 13, background: 'var(--arc-surface)', border: '1px solid var(--arc-border)', borderRadius: 14, marginBottom: 28 }}>
            <div style={{ fontSize: 36, opacity: 0.2, marginBottom: 12 }}>↑</div>
            Enter a deposit amount and click Calculate Revenue Share
          </div>
        )}

        {result && (
          <div className="animate-fade-up" style={{ marginBottom: 28 }}>
            <RevenueCards result={result} asset={asset} />
          </div>
        )}

        {result && (
          <div className="animate-fade-up">
            <BreakdownTable result={result} asset={asset} />
          </div>
        )}

        {/* ── ARC KIT PANEL (always visible) ── */}
        <ArcKitPanel result={result} asset={asset} />

        {/* ── FOOTER NOTE ── */}
        <div style={{ borderTop: '1px solid var(--arc-border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono), monospace', color: 'var(--arc-muted)', lineHeight: 1.8 }}>
            // Built on Arc Network · Arc Testnet · USDC-native gas · EVM-compatible<br />
            // APYs from Aave V3 subgraph & Compound API · Arc lending rates simulated until mainnet
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              ['Docs', 'https://docs.arc.network'],
              ['Explorer', 'https://testnet.arcscan.app'],
              ['Faucet', 'https://faucet.circle.com'],
              ['Arc MCP', 'https://docs.arc.network/ai/mcp'],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" style={{ fontSize: 11, fontFamily: 'var(--font-mono), monospace', color: 'var(--arc-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--arc-gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--arc-muted)')}
              >
                {label} ↗
              </a>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
