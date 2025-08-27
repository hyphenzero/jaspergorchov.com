import { Container } from '@/components/container'
import { formatDate, getAllProjects } from '@/lib/api'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
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

  const now = new Date()
  function isInCurrentMonth(dateStr?: string) {
    if (!dateStr) return false
    const d = new Date(dateStr)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }

  return (
    <Container className="relative mt-12 lg:mt-20">
      <h1 className="text-5xl font-medium tracking-tight text-balance text-zinc-950 lg:text-6xl dark:text-white">
        Projects
      </h1>
      <p className="mt-6 max-w-2xl text-lg/7 font-medium text-pretty text-zinc-600 dark:text-zinc-400">
        Browse my programming, design, and 3D art projects.
      </p>
      <CategorySelector tags={tags} category={category} />
      <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2">
        {posts.length === 0 ? (
          <p className="py-32 text-center text-zinc-500 dark:text-zinc-400">No posts found.</p>
        ) : (
          posts.map(({ meta, slug }) => {
            const m: any = meta
            const releaseDate = m.releaseDate ?? m.date
            const updatedDate = m.updatedDate ?? m.updated

            return (
              <article
                key={slug}
                className="group relative rounded-2xl bg-zinc-950/4 p-1 transition-colors hover:bg-zinc-950/7 dark:bg-zinc-900/70 dark:hover:bg-zinc-900"
              >
                <div className="relative aspect-16/10 h-auto w-full overflow-hidden rounded-xl not-dark:shadow-sm not-dark:ring-1 not-dark:ring-zinc-950/5">
                  <div className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-transparent ring-inset max-lg:hidden dark:ring-white/10" />
                  {meta.image?.src ? (
                    <Image priority unoptimized fill src={meta.image.src} alt="" className="size-full object-cover" />
                  ) : null}
                </div>
                <div className="flex flex-col p-4 pt-6">
                  <div className="mt-3 flex items-center gap-4">
                    <h2 className="text-xl font-medium tracking-tight text-pretty text-zinc-950 dark:text-white">
                      <Link href={`/projects/${slug}`}>
                        <span className="absolute inset-0 z-10 rounded-2xl" />
                        {meta.title}
                      </Link>
                    </h2>

                    {(() => {
                      if (isInCurrentMonth(updatedDate)) {
                        return (
                          <div className="group relative w-fit px-1.5 text-xs/5 text-sky-800 dark:text-sky-300">
                            <span className="absolute inset-0 border border-dashed border-sky-300/60 bg-sky-400/10 dark:border-sky-300/30 dark:bg-sky-400/15" />
                            Updated
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute top-[-2px] left-[-2px] fill-sky-300 dark:fill-sky-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute top-[-2px] right-[-2px] fill-sky-300 dark:fill-sky-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute bottom-[-2px] left-[-2px] fill-sky-300 dark:fill-sky-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute right-[-2px] bottom-[-2px] fill-sky-300 dark:fill-sky-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                          </div>
                        )
                      }

                      if (isInCurrentMonth(releaseDate)) {
                        return (
                          <div className="group relative w-fit px-1.5 text-xs/5 text-emerald-800 dark:text-emerald-300">
                            <span className="absolute inset-0 border border-dashed border-emerald-300 bg-emerald-400/12 dark:border-emerald-300/30 dark:bg-emerald-400/15" />
                            New
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute top-[-2px] left-[-2px] fill-emerald-400 dark:fill-emerald-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute top-[-2px] right-[-2px] fill-emerald-400 dark:fill-emerald-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute bottom-[-2px] left-[-2px] fill-emerald-400 dark:fill-emerald-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute right-[-2px] bottom-[-2px] fill-emerald-400 dark:fill-emerald-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                          </div>
                        )
                      }

                      return null
                    })()}

                    <svg
                      viewBox="0 0 10 10"
                      aria-hidden="true"
                      className="transtion-opacity h-2.5 w-2.5 flex-none text-zinc-400 opacity-0 transition duration-500 ease-[linear(0,0.009_1.2%,0.033_2.4%,0.074_3.7%,0.133_5.1%,0.26_7.6%,0.682_15%,0.796_17.3%,0.889_19.5%,0.965_21.7%,1.026_23.9%,1.071_26.2%,1.102_28.5%,1.122_32%,1.119_35.9%,1.018_52%,0.988_61.4%,0.985_68.8%,1)] not-group-hover:-translate-x-3 group-hover:opacity-100"
                    >
                      <path
                        fill="currentColor"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="m7.25 5-3.5-2.25v4.5L7.25 5Z"
                      />
                    </svg>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm/7 text-zinc-600 dark:text-zinc-400">{meta.description}</p>
                  <div className="order-first">
                    <dl className="mt-1 font-mono text-xs tracking-wider text-zinc-500 uppercase dark:text-zinc-400_">
                      {updatedDate ? (
                        <>
                          <dt className="inline">Updated </dt>
                          <dd className="inline">
                            <time dateTime={updatedDate}>{formatDate(updatedDate)}</time>
                          </dd>
                        </>
                      ) : releaseDate ? (
                        <>
                          <dt className="inline">Released </dt>
                          <dd className="inline">
                            <time dateTime={releaseDate}>{formatDate(releaseDate)}</time>
                          </dd>
                        </>
                      ) : null}
                    </dl>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </Container>
  )
}
