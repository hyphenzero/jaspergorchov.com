import '@/styles/tailwind.css'
import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import { RootLayout } from './root-layout'

const ibm_plex_mono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'block',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
})

export const metadata: Metadata = {
  title: {
    template: '%s - Jasper Gorchov',
    default: 'Jasper Gorchov — 13-year-old developer, designer, and digital artist.',
  },
  description:
    'I’m Jasper Gorchov, and I create sites, illustrations, and experiences with professional tools and technologies.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibm_plex_mono.variable} h-full bg-white antialiased dark:bg-zinc-950`}>
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="flex min-h-full flex-col">
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  )
}
