import type { Metadata } from 'next'
import { Syne, IBM_Plex_Mono } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'ArcYield — DeFi Revenue Calculator on Arc Network',
  description: "Calculate daily, weekly & monthly DeFi revenue across Aave, Compound, Morpho, and Arc-native lending.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${ibmPlexMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
