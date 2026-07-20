import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Jasper Gorchov',
    default: 'Jasper Gorchov - 14-year-old creative developer',
  },
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="min-h-dvh bg-white text-zinc-950 antialiased dark:bg-zinc-950 dark:text-white">{children}</body>
    </html>
  )
}
