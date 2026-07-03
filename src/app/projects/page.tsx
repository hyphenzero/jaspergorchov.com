import type { Metadata } from 'next'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { SubscribeForm } from '@/components/subscribe-form'
import { Tabs } from '@/components/tabs'
import { getAllProjects } from '@/lib/api'
import type { Project } from '@/types/post'
import { ProjectCard } from './project-card'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Browse my code, design, and 3D art projects.',
  openGraph: {
    type: 'article',
    title: 'Projects - Jasper Gorchov',
    description: 'Browse my code, design, and 3D art projects.',
    images: 'https://tailwindcss.com/api/og?path=/projects',
    url: 'https://tailwindcss.com/projects',
  },
}

export default async function Projects(props: { searchParams?: Promise<{ category?: string }> }) {
  const searchParams = await props.searchParams
  const allPosts = await getAllProjects()
  const publicPosts = allPosts.filter((post) => !post.meta.private)

  const tags = [
    { label: 'All categories', value: 'all' },
    ...Array.from(new Set(publicPosts.flatMap((post) => post.meta.tags))).map((t) => ({
      label: t,
      value: t.toLowerCase(),
    })),
  ]

  const category = searchParams?.category?.toLowerCase() ?? 'all'

  const posts: Project[] =
    category === 'all'
      ? (publicPosts as Project[])
      : (publicPosts as Project[]).filter((post) => post.meta.tags.some((tag) => tag.toLowerCase() === category))

  return (
    <Container className="relative mt-28">
      <span className="absolute -z-10 -mt-3 -ml-3 text-balance font-semibold text-7xl text-zinc-200 sm:-mt-4 sm:-ml-4 sm:text-8xl lg:-mt-6 lg:-ml-4 lg:text-9xl dark:text-zinc-800">
        /
      </span>
      <div className="flex w-full flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="w-full">
          <h1 className="text-balance text-6xl text-zinc-950 tracking-tighter sm:text-7xl lg:text-8xl dark:text-white">
            Projects
          </h1>
          <p className="mt-8 max-w-2xl text-pretty font-medium text-lg/9 text-zinc-600 dark:text-zinc-400">
            Browse my programming, design, and 3D art projects.
          </p>
        </div>
        <SubscribeForm label="Subscribe via email" className="shrink-0 sm:mb-3" source="projects" />
      </div>

      <Tabs
        tabs={tags}
        activeTab={category}
        layoutId="projects-selected-background"
        paramName="category"
        className="mt-28"
      />

      <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-18 md:grid-cols-2">
        {posts.length === 0 ? (
          <p className="py-32 text-center text-zinc-500 dark:text-zinc-400">No posts found.</p>
        ) : (
          posts.map(({ meta, slug }) => <ProjectCard key={slug} meta={meta} slug={slug} />)
        )}
      </div>
    </Container>
  )
}
