'use client'
// components/BreakdownTable.tsx

import type { CalculationOutput } from '@/lib/calculator'
import { fmtUsd, fmtApy } from '@/lib/calculator'
import { PROTOCOLS } from '@/lib/protocols'

interface Props {
  result: CalculationOutput
  asset: string
}

export function BreakdownTable({ result, asset }: Props) {
  const maxMonthly = Math.max(...result.perProtocol.map(p => p.revenue.monthly))

  return (
    <div
      style={{
        background: 'var(--arc-surface)',
        border: '1px solid var(--arc-border2)',
        borderRadius: 14,
        padding: 20,
        marginBottom: 20,
      }}
    >
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
        <div style={{ fontSize: 14, fontWeight: 700 }}>
          Per-Protocol Breakdown
        </div>
        <div
          style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono), monospace',
            color: 'var(--arc-muted)',
          }}
        >
          Asset: {asset} · {result.perProtocol.length} protocols
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Protocol', 'Network', 'APY', 'Daily', 'Weekly', 'Monthly', 'Share'].map(
                col => (
                  <th
                    key={col}
                    style={{
                      fontSize: 10,
                      fontFamily: 'var(--font-mono), monospace',
                      color: 'var(--arc-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      padding: '0 8px 10px 0',
                      textAlign: 'left',
                      borderBottom: '1px solid var(--arc-border)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {result.perProtocol
              .slice()
              .sort((a, b) => b.apy - a.apy)
              .map(row => {
                const proto = PROTOCOLS.find(p => p.id === row.protocolId)
                const barWidth = maxMonthly > 0 ? (row.revenue.monthly / maxMonthly) * 100 : 0
                const isBest = row.protocolId === result.bestProtocol.protocolId

                return (
                  <tr key={row.protocolId}>
                    {/* Protocol name */}
                    <td
                      style={{
                        padding: '12px 8px 12px 0',
                        borderBottom: '1px solid var(--arc-border)',
                        verticalAlign: 'middle',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{proto?.icon}</span>
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            {row.protocolName}
                            {isBest && (
                              <span
                                style={{
                                  fontSize: 9,
                                  background: 'rgba(201,168,76,0.15)',
                                  color: 'var(--arc-gold)',
                                  border: '1px solid rgba(201,168,76,0.3)',
                                  padding: '1px 6px',
                                  borderRadius: 3,
                                  fontFamily: 'var(--font-mono), monospace',
                                }}
                              >
                                best
                              </span>
                            )}
                          </div>
                          {proto?.isArcNative && (
                            <div
                              style={{
                                fontSize: 9,
                                fontFamily: 'var(--font-mono), monospace',
                                color: 'var(--arc-gold)',
                              }}
                            >
                              ⚡ Arc Native
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Network badge */}
                    <td
                      style={{
                        padding: '12px 8px 12px 0',
                        borderBottom: '1px solid var(--arc-border)',
                        verticalAlign: 'middle',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: 'var(--font-mono), monospace',
                          color: proto?.isArcNative ? 'var(--arc-gold)' : 'var(--arc-muted)',
                          background: proto?.isArcNative
                            ? 'rgba(201,168,76,0.1)'
                            : 'var(--arc-surface2)',
                          padding: '3px 7px',
                          borderRadius: 3,
                          border: `1px solid ${proto?.isArcNative ? 'rgba(201,168,76,0.2)' : 'var(--arc-border)'}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {proto?.network}
                      </span>
                    </td>

                    {/* APY */}
                    <td
                      style={{
                        padding: '12px 8px 12px 0',
                        borderBottom: '1px solid var(--arc-border)',
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: 13,
                        fontWeight: 500,
                        color: row.apy >= 6 ? 'var(--arc-gold)' : 'var(--arc-teal)',
                        verticalAlign: 'middle',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fmtApy(row.apy)}
                    </td>

                    {/* Daily */}
                    <td
                      style={{
                        padding: '12px 8px 12px 0',
                        borderBottom: '1px solid var(--arc-border)',
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: 12,
                        color: 'var(--arc-text)',
                        verticalAlign: 'middle',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fmtUsd(row.revenue.daily)}
                    </td>

                    {/* Weekly */}
                    <td
                      style={{
                        padding: '12px 8px 12px 0',
                        borderBottom: '1px solid var(--arc-border)',
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: 12,
                        color: 'var(--arc-text)',
                        verticalAlign: 'middle',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fmtUsd(row.revenue.weekly)}
                    </td>

                    {/* Monthly */}
                    <td
                      style={{
                        padding: '12px 8px 12px 0',
                        borderBottom: '1px solid var(--arc-border)',
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--arc-text)',
                        verticalAlign: 'middle',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {fmtUsd(row.revenue.monthly)}
                    </td>

                    {/* Share bar */}
                    <td
                      style={{
                        padding: '12px 0 12px 0',
                        borderBottom: '1px solid var(--arc-border)',
                        verticalAlign: 'middle',
                        minWidth: 100,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            flex: 1,
                            height: 4,
                            background: 'var(--arc-surface3)',
                            borderRadius: 2,
                            overflow: 'hidden',
                            minWidth: 60,
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${barWidth.toFixed(0)}%`,
                              background: proto?.color || 'var(--arc-teal)',
                              borderRadius: 2,
                              transition: 'width 0.6s ease',
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            fontFamily: 'var(--font-mono), monospace',
                            color: 'var(--arc-muted)',
                            minWidth: 36,
                            textAlign: 'right',
                          }}
                        >
                          {(barWidth).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
