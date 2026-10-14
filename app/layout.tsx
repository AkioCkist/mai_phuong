import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'

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

export const metadata: Metadata = {
  title: 'Mai Phương (Calliope) — Portfolio',
  description:
    'Portfolio của Mai Phương (Calliope): sinh viên Quản trị kinh doanh, làm sự kiện, truyền thông và Hành chính – Nhân sự. Nơi gom lại những gì mình đã làm.',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
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
