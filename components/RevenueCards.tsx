'use client'
// components/RevenueCards.tsx

import type { CalculationOutput } from '@/lib/calculator'
import { fmtUsd, fmtPct, fmtApy } from '@/lib/calculator'

interface Props {
  result: CalculationOutput
  asset: string
}

export function RevenueCards({ result, asset }: Props) {
  const { totalRevenue, weightedApy, deposit } = result

  const cards = [
    {
      period: 'Daily',
      value: totalRevenue.daily,
      roi: totalRevenue.dailyRoiPct,
      accentColor: 'var(--arc-teal)',
      bgColor: 'rgba(30,158,120,0.06)',
    },
    {
      period: 'Weekly',
      value: totalRevenue.weekly,
      roi: totalRevenue.weeklyRoiPct,
      accentColor: 'var(--arc-gold)',
      bgColor: 'rgba(201,168,76,0.06)',
    },
    {
      period: 'Monthly',
      value: totalRevenue.monthly,
      roi: totalRevenue.monthlyRoiPct,
      accentColor: '#a78bfa',
      bgColor: 'rgba(167,139,250,0.06)',
    },
  ]

  return (
    <div>
      {/* Summary bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono), monospace',
              color: 'var(--arc-muted)',
              marginBottom: 3,
            }}
          >
            Revenue share on {fmtUsd(deposit, true)} · {asset}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Weighted APY:{' '}
            <span style={{ color: 'var(--arc-gold)' }}>{fmtApy(weightedApy)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Chip color="var(--arc-teal)">⚡ Arc-powered</Chip>
          {result.arcNativeRevenue && (
            <Chip color="var(--arc-gold)">
              Arc Lending: {fmtUsd(result.arcNativeRevenue.monthly)}/mo
            </Chip>
          )}
        </div>
      </div>

      {/* 3 yield cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {cards.map(c => (
          <div
            key={c.period}
            className="animate-fade-up"
            style={{
              background: c.bgColor,
              border: `1px solid ${c.accentColor}33`,
              borderRadius: 14,
              padding: '20px 20px 16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top accent line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: c.accentColor,
              }}
            />

            <div
              style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono), monospace',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                color: 'var(--arc-muted)',
                marginBottom: 10,
              }}
            >
              {c.period} Yield
            </div>

            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: '-1.5px',
                color: c.accentColor,
                marginBottom: 6,
                lineHeight: 1,
              }}
            >
              {fmtUsd(c.value)}
            </div>

            <div
              style={{
                fontSize: 12,
                fontFamily: 'var(--font-mono), monospace',
                color: 'var(--arc-muted)',
                marginBottom: 10,
              }}
            >
              {c.value.toFixed(4)} {asset} / {c.period.toLowerCase()}
            </div>

            <div
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: 4,
                fontSize: 12,
                fontFamily: 'var(--font-mono), monospace',
                background: `${c.accentColor}20`,
                color: c.accentColor,
              }}
            >
              {fmtPct(c.roi)} / {c.period.toLowerCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Arc gas savings callout */}
      <div
        style={{
          background: 'rgba(201,168,76,0.05)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 10,
          padding: '12px 16px',
          fontSize: 12,
          fontFamily: 'var(--font-mono), monospace',
          color: 'var(--arc-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ color: 'var(--arc-gold)', fontSize: 14 }}>⚡</span>
        <span>
          Arc gas savings vs Ethereum:{' '}
          <strong style={{ color: 'var(--arc-gold)' }}>
            ~{fmtUsd(result.arcBridgeSavings)}/month
          </strong>{' '}
          · $0.0001 USDC/tx · Sub-second finality ·{' '}
          <a
            href="https://docs.arc.network/arc/references/gas-and-fees"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--arc-gold)', textDecoration: 'underline' }}
          >
            docs.arc.network
          </a>
        </span>
      </div>
    </div>
  )
}

function Chip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontFamily: 'var(--font-mono), monospace',
        color,
        background: `${color}18`,
        border: `1px solid ${color}33`,
        padding: '4px 10px',
        borderRadius: 4,
      }}
    >
      {children}
    </div>
  )
}
