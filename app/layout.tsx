import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { getSiteContent } from '@/lib/content-store'

const display = Fraunces({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  axes: ['opsz', 'SOFT', 'WONK'],
  variable: '--font-display-face',
  display: 'swap',
})

const body = Be_Vietnam_Pro({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-mono-face',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await getSiteContent()
  return {
    title: copy.siteTitle,
    description: copy.siteDescription,
    icons: { icon: [{ url: '/icon.svg', type: 'image/svg+xml' }], apple: '/apple-icon.png' },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fcf7f6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
