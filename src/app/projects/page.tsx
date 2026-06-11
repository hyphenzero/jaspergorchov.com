import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/container'
import { formatDate, getAllProjects } from '@/lib/api'
import type { Project } from '@/types/post'
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

  const posts: Project[] =
    category === 'all'
      ? (publicPosts as Project[])
      : (publicPosts as Project[]).filter((post) => post.meta.tags.some((tag) => tag.toLowerCase() === category))

  const now = new Date()
  function isRecent(dateStr?: string) {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const diffMs = now.getTime() - d.getTime()
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
    return diffMs >= 0 && diffMs <= THIRTY_DAYS_MS
  }

  return (
    <Container className="relative mt-28">
      <span className="absolute -z-10 -mt-6 -ml-4 text-balance font-bold text-5xl text-zinc-300 lg:text-8xl dark:text-zinc-800">
        /
      </span>
      <h1 className="text-balance font-medium text-5xl text-zinc-950 tracking-tight lg:text-6xl dark:text-white">
        Projects
      </h1>

      <p className="mt-8 max-w-2xl text-pretty font-medium text-lg/9 text-zinc-600 dark:text-zinc-400">
        Browse my programming, design, and 3D art projects.
      </p>
      <CategorySelector tags={tags} category={category} />
      <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-18 md:grid-cols-2">
        {posts.length === 0 ? (
          <p className="py-32 text-center text-zinc-500 dark:text-zinc-400">No posts found.</p>
        ) : (
          posts.map(({ meta, slug }) => {
            const hasExplicitReleaseDate = meta.releaseDate !== undefined && meta.releaseDate !== null
            const hasDate = meta.date !== undefined && meta.date !== null
            const releaseOrDate = hasExplicitReleaseDate ? meta.releaseDate : hasDate ? meta.date : undefined
            const updatedDate = meta.updatedDate ?? meta.updated

            // Skip entries that do not expose any date field; downstream UI
            // expects a canonical `meta.date`/releaseDate to render badges and times.
            if (!releaseOrDate) return null

            return (
              <article key={slug} className="group relative cursor-pointer rounded-2xl transition-colors">
                <div className="relative aspect-16/10 h-auto w-full overflow-hidden rounded-xl not-dark:shadow-sm not-dark:ring-1 not-dark:ring-zinc-950/5 transition-transform duration-400 ease-out group-hover:scale-105_">
                  <div className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-transparent ring-inset max-lg:hidden dark:ring-white/10" />
                  {meta.image?.src ? (
                    <Image
                      priority
                      unoptimized
                      fill
                      src={meta.image.src}
                      alt={meta.title ?? ''}
                      className="size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="mt-10 flex flex-col rounded-xl p-4_ transition-colors_ group-hover:bg-zinc-950/7_ dark:group-hover:bg-zinc-900_">
                  {/*<div className="absolute -inset-4 -z-10 rounded-xl bg-zinc-950/7 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-zinc-900" />*/}
                  <div className="flex items-center">
                    <div className="flex items-center font-medium font-mono text-xs text-zinc-500 uppercase tracking-widest">
                      {updatedDate ? (
                        <div className="flex items-center">
                          <span>Updated&nbsp;</span>
                          <time dateTime={updatedDate}>{formatDate(updatedDate)}</time>
                        </div>
                      ) : hasExplicitReleaseDate ? (
                        <div className="flex items-center">
                          <span>Released&nbsp;</span>
                          <time dateTime={releaseOrDate}>{formatDate(releaseOrDate as string)}</time>
                        </div>
                      ) : releaseOrDate ? (
                        <div className="flex items-center">
                          <time dateTime={releaseOrDate}>{formatDate(releaseOrDate as string)}</time>
                        </div>
                      ) : null}
                    </div>

                    <ul className="m-0 flex list-none items-center font-medium font-mono text-xs text-zinc-500 uppercase tracking-widest">
                      {meta.tags.map((tag, i) => (
                        <li key={i} className="inline-flex items-center">
                          <span className="mx-4 inline-block size-0.75 rounded-full bg-current" />
                          <span className="leading-none">{tag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 flex items-center gap-4">
                    <h2 className="text-pretty font-medium text-xl text-zinc-950 tracking-tight transition-colors duration-150 hover:text-sky-500 dark:text-white dark:hover:text-sky-400">
                      <Link href={`/projects/${slug}`} className="flex items-center">
                        <span className="absolute inset-0 z-10 rounded-2xl" />
                        {meta.title}
                        <svg
                          viewBox="0 0 10 10"
                          aria-hidden="true"
                          className="ml-2 size-2.5 flex-none not-group-hover:-translate-x-6 not-group-hover:opacity-0 opacity-60 transition duration-1000 ease-[linear(0,0.002_0.3%,0.007_0.6%,0.029_1.3%,0.065_2%,0.119_2.8%,0.237_4.2%,0.659_8.7%,0.778_10.2%,0.871_11.6%,0.95_13.1%,1.009_14.6%,1.033_15.4%,1.052_16.2%,1.066_17%,1.078_17.9%,1.085_18.8%,1.088_19.7%,1.088_20.7%,1.085_21.7%,1.074_23.6%,1.032_28.7%,1.014_31.4%,1.006_33%,1_34.6%,0.993_38%,0.992_41.9%,0.999_51.4%,1.001_57.6%,1)] before:transition-opacity before:ease-[linear(0,0.002_0.3%,0.007_0.6%,0.029_1.3%,0.065_2%,0.119_2.8%,0.237_4.2%,0.659_8.7%,0.778_10.2%,0.871_11.6%,0.95_13.1%,1.009_14.6%,1.033_15.4%,1.052_16.2%,1.066_17%,1.078_17.9%,1.085_18.8%,1.088_19.7%,1.088_20.7%,1.085_21.7%,1.074_23.6%,1.032_28.7%,1.014_31.4%,1.006_33%,1_34.6%,0.993_38%,0.992_41.9%,0.999_51.4%,1.001_57.6%,1)] dark:text-sky-400!"
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
                      </Link>
                    </h2>

                    {(() => {
                      if (isRecent(updatedDate)) {
                        return (
                          <div className="group relative w-fit px-1.5 text-sky-800 text-xs/5 dark:text-sky-300">
                            <span className="absolute inset-0 border border-sky-300/60 border-dashed bg-sky-400/10 dark:border-sky-300/30 dark:bg-sky-400/15" />
                            Updated
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute -top-0.5 -left-0.5 fill-sky-300 dark:fill-sky-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute -top-0.5 -right-0.5 fill-sky-300 dark:fill-sky-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute -bottom-0.5 -left-0.5 fill-sky-300 dark:fill-sky-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute -right-0.5 -bottom-0.5 fill-sky-300 dark:fill-sky-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                          </div>
                        )
                      }

                      if (isRecent(releaseOrDate)) {
                        return (
                          <div className="group relative w-fit px-1.5 text-emerald-800 text-xs/5 dark:text-emerald-300">
                            <span className="absolute inset-0 border border-emerald-300 border-dashed bg-emerald-400/12 dark:border-emerald-300/30 dark:bg-emerald-400/15" />
                            New
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute -top-0.5 -left-0.5 fill-emerald-400 dark:fill-emerald-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute -top-0.5 -right-0.5 fill-emerald-400 dark:fill-emerald-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute -bottom-0.5 -left-0.5 fill-emerald-400 dark:fill-emerald-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                            <svg
                              width="5"
                              height="5"
                              viewBox="0 0 5 5"
                              className="absolute -right-0.5 -bottom-0.5 fill-emerald-400 dark:fill-emerald-300/50"
                            >
                              <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
                            </svg>
                          </div>
                        )
                      }

                      return null
                    })()}

                    {/* <svg
                      viewBox="0 0 10 10"
                      aria-hidden="true"
                      className="transtion-opacity mt-0.5 size-2.5 flex-none text-zinc-400 opacity-0 transition duration-150 ease-out not-group-hover:-translate-x-3 group-hover:opacity-100 group-hover:duration-600 group-hover:ease-[linear(0,0.009_0.9%,0.037_1.9%,0.154_4.1%,0.304_6.1%,0.774_11.7%,0.995_15%,1.075_16.6%,1.136_18.2%,1.178_19.8%,1.203_21.5%,1.212_23.7%,1.196_26.1%,1.162_28.6%,1.057_34.5%,1.01_37.6%,0.975_41%,0.958_44.5%,0.958_49.4%,0.997_60.7%,1.009_67.2%,1)]"
                    >
                      <path
                        fill="currentColor"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="m7.25 5-3.5-2.25v4.5L7.25 5Z"
                      />
                    </svg> */}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm/7 text-zinc-600 dark:text-zinc-400">{meta.description}</p>
                </div>
              </article>
            )
          })
        )}
      </div>
    </Container>
  )
}
