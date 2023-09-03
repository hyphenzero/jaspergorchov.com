import { RootLayout } from '@/components/RootLayout'
import '@/styles/tailwind.css'

export const metadata = {
  title: {
    template: '%s - Jasper Gorchov',
    default: 'Jasper Gorchov - Full-Stack Developer & 3D Designer',
  },
}

export default function Layout({ children }) {
  return (
    <html lang="en" className="h-full bg-primary antialiased accent-sky-300">
      <body className="flex min-h-full flex-col">
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  )
}
