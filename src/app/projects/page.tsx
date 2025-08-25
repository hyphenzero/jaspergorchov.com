import { Container } from '@/components/container'
import { formatDate, getAllProjects } from '@/lib/api'
import type { Metadata } from 'next'
import Image from 'next/image'
import { CategorySelector } from './category-selector'

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

  // const allTags = Array.from(new Set(publicPosts.flatMap((post) => post.meta.tags))).map((tag) => ({
  //   original: tag,
  //   normalized: tag.toLowerCase(),
  // }))

  const tags = [
    { label: 'All categories', value: 'all' },
    ...Array.from(new Set(publicPosts.flatMap((post) => post.meta.tags))).map((t) => ({
      label: t,
      value: t.toLowerCase(),
    })),
  ]

  const category = searchParams?.category?.toLowerCase() ?? 'all'

  const posts =
    category === 'all'
      ? publicPosts
      : publicPosts.filter((post) => post.meta.tags.some((tag) => tag.toLowerCase() === category))

  return (
    <Container className="relative mt-12 xl:mt-24">
      <h1 className="text-5xl font-medium tracking-tight text-balance text-zinc-950 lg:text-6xl dark:text-white">
        Projects
      </h1>
      <p className="mt-6 max-w-2xl text-lg/7 font-medium text-pretty text-zinc-600 dark:text-zinc-400">
        Browse my programming, design, and 3D art projects.
      </p>
      <CategorySelector tags={tags} category={category} />
      <div className="mt-6 grid grid-cols-1 gap-12 sm:grid-cols-2">
        {posts.length === 0 ? (
          <p className="py-32 text-center text-zinc-500 dark:text-zinc-400">No posts found.</p>
        ) : (
          posts.map(({ meta, slug }) => (
            <article key={slug} className="group relative rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-900">
              <div className="relative aspect-16/10 h-auto w-full overflow-hidden rounded-xl">
                <div className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-zinc-950/10 ring-inset max-lg:hidden dark:ring-white/10" />
                {meta.image?.src ? (
                  <Image priority unoptimized fill src={meta.image.src} alt="" className="size-full object-cover" />
                ) : null}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={meta.date} className="text-zinc-500 dark:text-zinc-400">
                    {formatDate(meta.date)}
                  </time>
                  {/* <Link
                    href={meta.tag}
                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {post.category.title}
                  </Link> */}
                </div>
                <h2 className="mt-3 text-xl font-medium tracking-tight text-pretty text-zinc-950 dark:text-white">
                  {meta.title}
                </h2>
              </div>
            </article>
          ))
        )}
      </div>
    </Container>
  )
}
