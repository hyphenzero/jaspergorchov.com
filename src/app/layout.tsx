import type { Metadata } from 'next'
import type React from 'react'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import './globals.css'

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh bg-white antialiased dark:bg-zinc-950">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
