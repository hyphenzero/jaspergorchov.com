import { Header } from '@/components/header'
import { getAllBlogPosts, getAllProjects } from '@/lib/api'
import { getLatestContent, serializeForHeader } from '@/lib/api-utils'
import type { Metadata } from 'next'
import type React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Jasper Gorchov',
    default: 'Jasper Gorchov - 14-year-old creative developer',
  },
  description: '',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Fetch blog posts and projects
  const blogPosts = await getAllBlogPosts()
  const projects = await getAllProjects()

  // Filter out private posts
  const publicBlogPosts = blogPosts.filter((post) => !post.meta.private)
  const publicProjects = projects.filter((project) => !project.meta.private)

  // Serialize posts for client components - only passing what's needed
  const headerBlogPosts = serializeForHeader(publicBlogPosts)
  const headerProjects = serializeForHeader(publicProjects)

  // Pre-calculate latest content for the banner
  const latestContent = getLatestContent(headerBlogPosts, headerProjects)

  // Default values in case there's no content
  const latestTitle = latestContent?.latestTitle || 'Welcome'
  const latestUrl = latestContent?.latestUrl || '/'

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="min-h-dvh bg-white text-zinc-950 antialiased dark:bg-zinc-950 dark:text-white">
        <Header latestTitle={latestTitle} latestUrl={latestUrl} />
        {children}
      </body>
    </html>
  )
}
