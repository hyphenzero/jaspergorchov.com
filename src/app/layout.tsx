import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { InputModality } from '../components/input-modality'
import type { Metadata } from 'next'
import { Fira_Code, IBM_Plex_Mono } from 'next/font/google'
import Script from 'next/script'
import type React from 'react'
import './globals.css'

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
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
    <html lang="en" className={`${firaCode.variable} ${ibmPlexMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        {/* The canvas's white-on-dark default is decided purely
            client-side (see store.tsx). This comment exists only so the
            placeholder string __DARK_AT_LOAD__ isn't needed anywhere. */}
        <meta name="apple-mobile-web-app-title" content="Jasper G" />
      </head>
      <body className="min-h-dvh bg-white antialiased dark:bg-zinc-950">
        <InputModality />
        <Header />
        {children}
        <Footer />
        <Script src="https://ui.sh/ui-picker.js" />
      </body>
    </html>
  )
}
