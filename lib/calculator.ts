// lib/calculator.ts
// Core revenue share calculation logic

export interface RevenueResult {
  daily: number
  weekly: number
  monthly: number
  annual: number
  dailyRoiPct: number
  weeklyRoiPct: number
  monthlyRoiPct: number
  annualRoiPct: number
}

export interface ProtocolResult {
  protocolId: string
  protocolName: string
  apy: number
  revenue: RevenueResult
  shareOfTotal: number  // 0–1, this protocol's monthly yield as % of total
}

export interface CalculationOutput {
  deposit: number
  asset: string
  weightedApy: number
  totalRevenue: RevenueResult
  perProtocol: ProtocolResult[]
  bestProtocol: ProtocolResult
  arcNativeRevenue: RevenueResult | null
  arcBridgeSavings: number  // estimated gas savings vs Ethereum
  calculatedAt: number
}

// Calculate revenue for a single APY + deposit
export function calcRevenue(depositUsd: number, apyPct: number): RevenueResult {
  const annual = depositUsd * (apyPct / 100)
  const monthly = annual / 12
  const weekly = annual / 52
  const daily = annual / 365

  return {
    daily,
    weekly,
    monthly,
    annual,
    dailyRoiPct: (daily / depositUsd) * 100,
    weeklyRoiPct: (weekly / depositUsd) * 100,
    monthlyRoiPct: (monthly / depositUsd) * 100,
    annualRoiPct: apyPct,
  }
}

// Full calculation across multiple protocols
export function calculateAll(
  depositUsd: number,
  apys: Record<string, number>,    // protocolId → apy%
  selectedProtocols: string[],
  protocolNames: Record<string, string>,
): CalculationOutput {
  const active = selectedProtocols.filter(id => apys[id] !== undefined)

  if (active.length === 0) {
    throw new Error('No protocols selected')
  }

  // Weighted average APY (equal weight per protocol)
  const weightedApy = active.reduce((sum, id) => sum + apys[id], 0) / active.length

  // Per-protocol results
  const perProtocol: ProtocolResult[] = active.map(id => ({
    protocolId: id,
    protocolName: protocolNames[id] || id,
    apy: apys[id],
    revenue: calcRevenue(depositUsd, apys[id]),
    shareOfTotal: 0, // filled below
  }))

  const totalMonthly = perProtocol.reduce((s, p) => s + p.revenue.monthly, 0)
  perProtocol.forEach(p => {
    p.shareOfTotal = totalMonthly > 0 ? p.revenue.monthly / totalMonthly : 0
  })

  const totalRevenue = calcRevenue(depositUsd, weightedApy)
  const bestProtocol = [...perProtocol].sort((a, b) => b.apy - a.apy)[0]
  const arcNative = perProtocol.find(p => p.protocolId === 'arc-lending')

  // Arc gas savings vs Ethereum:
  // Arc: ~$0.0001 per tx · Ethereum: ~$2–5 per tx
  // For a typical DeFi user making 10 txs/month:
  const arcBridgeSavings = (2.50 - 0.0001) * 10 // $24.99/month saved

  return {
    deposit: depositUsd,
    asset: '',
    weightedApy,
    totalRevenue,
    perProtocol,
    bestProtocol,
    arcNativeRevenue: arcNative?.revenue ?? null,
    arcBridgeSavings,
    calculatedAt: Date.now(),
  }
}

// Format currency values
export function fmtUsd(n: number, compact = false): string {
  if (compact && n >= 1000) return '$' + (n / 1000).toFixed(2) + 'k'
  if (n < 0.001) return '$' + n.toFixed(6)
  if (n < 0.01) return '$' + n.toFixed(4)
  if (n < 1) return '$' + n.toFixed(3)
  return '$' + n.toFixed(2)
}

export function fmtPct(n: number, decimals = 4): string {
  return (n >= 0 ? '+' : '') + n.toFixed(decimals) + '%'
}

export function fmtApy(n: number): string {
  return n.toFixed(2) + '%'
}

// Format large numbers
export function fmtTvl(n: number): string {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(0) + 'M'
  return '$' + n.toLocaleString()
}
