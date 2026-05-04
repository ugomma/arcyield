// app/api/apys/route.ts
// Server-side APY fetching — avoids CORS issues with subgraphs
// Cached for 5 minutes via Next.js route cache

import { NextRequest, NextResponse } from 'next/server'
import { fetchAllApys } from '@/lib/subgraph'

export const revalidate = 300 // 5 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const asset = searchParams.get('asset') || 'USDC'

  try {
    const apys = await fetchAllApys(asset)
    return NextResponse.json({
      success: true,
      asset,
      apys,
      cachedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message, apys: null },
      { status: 500 }
    )
  }
}
