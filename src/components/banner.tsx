'use client'

import type React from 'react'

import { ChevronRightIcon, MegaphoneIcon } from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react'

interface Post {
  meta: {
    title: string
    date: string
    excerpt: React.ReactElement
    tags: string[]
    description: string
    image?: {
      src: string
    }
    private?: boolean
  }
  slug: string
}

export function Banner() {
  const [latestTitle, setLatestTitle] = useState('Tailwind UI is now Tailwind Plus')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLatestContent() {
      try {
        // Fetch latest blog posts and projects
        const [blogResponse, projectResponse] = await Promise.all([fetch('/api/blog'), fetch('/api/projects')])

        if (!blogResponse.ok || !projectResponse.ok) {
          throw new Error('Failed to fetch content')
        }

        const blogPosts = (await blogResponse.json()) as Post[]
        const projects = (await projectResponse.json()) as Post[]

        // Find the latest content by comparing dates
        let latestContent: Post | null = null

        if (blogPosts.length > 0 && projects.length > 0) {
          const latestBlog = blogPosts[0]
          const latestProject = projects[0]

          const latestBlogDate = new Date(latestBlog.meta.date).getTime()
          const latestProjectDate = new Date(latestProject.meta.date).getTime()

          latestContent = latestBlogDate > latestProjectDate ? latestBlog : latestProject
        } else if (blogPosts.length > 0) {
          latestContent = blogPosts[0]
        } else if (projects.length > 0) {
          latestContent = projects[0]
        }

        if (latestContent) {
          setLatestTitle(latestContent.meta.title)
        }
      } catch (error) {
        console.error('Error fetching latest content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestContent()
  }, [])

  if (isLoading) {
    return null // Or a skeleton loader if preferred
  }

  return (
    <div className="@container flex w-full justify-start pl-2 sm:pl-8">
      <a
        href="https://tailwindcss.com/blog/tailwind-plus"
        className="flex flex-nowrap items-center gap-2 rounded-full px-3 py-2 text-xs/4 whitespace-nowrap ring ring-zinc-950/8 hover:bg-zinc-950/2 hover:ring-zinc-950/10 @max-[22rem]:hidden dark:ring-white/8 dark:hover:bg-white/2 dark:hover:ring-white/10"
      >
        <MegaphoneIcon className="size-4 fill-sky-500 dark:fill-sky-400" />
        <span className="font-medium">{latestTitle}</span>
        <span className="size-0.75 rounded-full bg-current/50" />
        <div className="flex gap-0.5">
          <span>Learn more</span>
          <ChevronRightIcon className="-mr-1 size-4 fill-zinc-950/30 dark:fill-white/30" />
        </div>
      </a>
    </div>
  )
}
