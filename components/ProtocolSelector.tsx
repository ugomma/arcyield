'use client'
// components/ProtocolSelector.tsx

import { PROTOCOLS } from '@/lib/protocols'
import { fmtApy, fmtTvl } from '@/lib/calculator'

interface Props {
  selected: Set<string>
  apys: Record<string, number>
  apysLoading: boolean
  onToggle: (id: string) => void
}

export function ProtocolSelector({ selected, apys, apysLoading, onToggle }: Props) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono), monospace',
          color: 'var(--arc-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: 12,
        }}
      >
        Select Protocols — {selected.size} active
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 10,
        }}
      >
        {PROTOCOLS.map(p => {
          const isActive = selected.has(p.id)
          const apy = apys[p.id]

          return (
            <button
              key={p.id}
              onClick={() => onToggle(p.id)}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${p.color}18 0%, ${p.color}08 100%)`
                  : 'var(--arc-surface)',
                border: `1px solid ${isActive ? p.color + '55' : 'var(--arc-border)'}`,
                borderRadius: 12,
                padding: '14px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.18s ease',
                position: 'relative',
                outline: 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--arc-border2)'
                  ;(e.currentTarget as HTMLElement).style.background = 'var(--arc-surface2)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--arc-border)'
                  ;(e.currentTarget as HTMLElement).style.background = 'var(--arc-surface)'
                }
              }}
            >
              {/* Native badge */}
              {p.isArcNative && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    fontSize: 9,
                    fontFamily: 'var(--font-mono), monospace',
                    color: 'var(--arc-gold)',
                    background: 'rgba(201,168,76,0.12)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    padding: '2px 5px',
                    borderRadius: 3,
                  }}
                >
                  native
                </div>
              )}

              {/* Active checkmark */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: p.isArcNative ? 54 : 8,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: p.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    color: '#000',
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
              )}

              <div style={{ fontSize: 22, marginBottom: 6 }}>{p.icon}</div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 3,
                  color: 'var(--arc-text)',
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--arc-muted)',
                  marginBottom: 6,
                }}
              >
                {p.chain}
              </div>

              {/* APY — live or skeleton */}
              {apysLoading ? (
                <div className="skeleton" style={{ height: 16, width: 60 }} />
              ) : (
                <div
                  style={{
                    fontSize: 14,
                    fontFamily: 'var(--font-mono), monospace',
                    fontWeight: 500,
                    color: apy ? (apy >= 6 ? 'var(--arc-gold)' : 'var(--arc-teal)') : 'var(--arc-muted)',
                  }}
                >
                  {apy ? fmtApy(apy) : '—'} APY
                </div>
              )}

              <div
                style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--arc-muted)',
                  marginTop: 3,
                }}
              >
                TVL {fmtTvl(p.tvlUsd)}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
