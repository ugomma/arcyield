'use client'
// components/Header.tsx

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ARC_EXPLORER, ARC_MCP_URL } from '@/lib/protocols'

export function Header() {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 32px',
        borderBottom: '1px solid var(--arc-border)',
        background: 'rgba(10,10,10,0.95)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: 'var(--arc-gold)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 800,
            color: '#000',
          }}
        >
          A
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>
            ArcYield
          </div>
          <div
            style={{
              fontSize: 10,
              color: 'var(--arc-muted)',
              fontFamily: 'var(--font-mono), monospace',
              marginTop: 1,
            }}
          >
            // defi revenue calculator · Arc Network
          </div>
        </div>
      </div>

      {/* Nav + Wallet */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a
          href={ARC_EXPLORER}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: 12,
            fontFamily: 'var(--font-mono), monospace',
            color: 'var(--arc-muted)',
            textDecoration: 'none',
            padding: '6px 10px',
          }}
        >
          Explorer ↗
        </a>
        <a
          href={ARC_MCP_URL}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono), monospace',
            color: 'var(--arc-gold)',
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.25)',
            padding: '5px 10px',
            borderRadius: 4,
            textDecoration: 'none',
            letterSpacing: '0.3px',
          }}
        >
          Arc MCP
        </a>
        <div
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono), monospace',
            color: 'var(--arc-teal)',
            background: 'rgba(30,158,120,0.1)',
            border: '1px solid rgba(30,158,120,0.25)',
            padding: '5px 10px',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            className="animate-pulse-dot"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--arc-teal)',
              display: 'inline-block',
            }}
          />
          Testnet
        </div>

        {/* RainbowKit wallet connect — styled to Arc theme via darkTheme in providers.tsx */}
        <ConnectButton
          accountStatus="avatar"
          chainStatus="icon"
          showBalance={{ smallScreen: false, largeScreen: true }}
        />
      </div>
    </header>
  )
}
