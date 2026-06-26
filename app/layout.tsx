import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { AuthProvider } from '@/components/providers/auth-provider'
import { AppToaster } from '@/components/providers/app-toaster'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: 'Pintal — Digital Material Passport untuk Brand Fashion Lokal',
  description:
    'Pintal membantu brand fashion lokal Indonesia memenuhi regulasi ekspor EU CSRD. Material passport terverifikasi dalam 72 jam, 94% lebih murah dari sertifikasi manual.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${inter.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <AppToaster />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
