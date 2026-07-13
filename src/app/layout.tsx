import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { VideoCacheProvider } from '@/components/video-cache-context'
import type { Metadata } from 'next'
import { Fira_Code } from 'next/font/google'
import Script from 'next/script'
import type React from 'react'
import './globals.css'

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s - Jasper Gorchov',
    default: 'Jasper Gorchov - Web developer, design engineer, and 3D artist.',
  },
  description: '',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={firaCode.variable}>
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-title" content="Jasper G" />
      </head>
      <body className="min-h-dvh bg-white antialiased dark:bg-zinc-950">
        <VideoCacheProvider>
          <Header />
          {children}
          <Footer />
        </VideoCacheProvider>
        <Script src="https://ui.sh/ui-picker.js" />
      </body>
    </html>
  )
}
