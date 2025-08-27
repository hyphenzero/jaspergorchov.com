import { TagButton } from '@/components/tag'
import { formatDate, getProjectBySlug, getProjectSlugs } from '@/lib/api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const post = await getProjectBySlug((await props.params).slug)

  if (!post) {
    return notFound()
  }

  return {
    metadataBase: new URL('https://tailwindcss.com'),
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: 'article',
      url: `/projects/${(await props.params).slug}`,
      images: [
        {
          url: post.meta.image ? post.meta.image.src : `/api/og?path=/projects/${(await props.params).slug}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.description,
      images: [
        {
          url: post.meta.image ? post.meta.image.src : `/api/og?path=/projects/${(await props.params).slug}`,
        },
      ],
      site: '@tailwindcss',
      creator: '@tailwindcss',
    },
  }
}

export default async function ArticlePage(props: Props) {
  const post = await getProjectBySlug((await props.params).slug)

  if (!post) {
    return notFound()
  }

  const now = new Date()
  function isInCurrentMonth(dateStr?: string) {
    if (!dateStr) return false
    const d = new Date(dateStr)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }

  const m: any = post.meta
  const releaseDate = m.releaseDate ?? m.date
  const updatedDate = m.updatedDate ?? m.updated

  return (
    <>
      {/* Add a placeholder div so the Next.js router can find the scrollable element. */}
      <div hidden />
      <div className="mx-auto mt-16 flex w-full max-w-3xl flex-col">
        <time
          className="font-mono text-sm/7 font-semibold tracking-widest text-sky-500 uppercase dark:text-sky-400"
          dateTime={releaseDate}
        >
          {formatDate(releaseDate)}
        </time>

        {updatedDate && updatedDate !== releaseDate ? (
          <div className="mt-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            Updated {formatDate(updatedDate)}
          </div>
        ) : null}

        <h1 className="mt-2 inline-block max-w-3xl text-5xl font-medium tracking-tight text-pretty text-zinc-950 dark:text-zinc-200">
          {post.meta.title}
        </h1>

        <div className="mt-6 flex items-center gap-x-3">
          {post.meta.tags.map((tag) => (
            <TagButton key={tag} href={`/projects?category=${tag.toLowerCase().replace(/\s+/g, '+')}`}>
              {tag}
            </TagButton>
          ))}

          {/* Badge: Updated takes precedence over New */}
          {isInCurrentMonth(updatedDate) ? (
            <div className="ml-2 inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-zinc-800 dark:text-sky-300">
              Updated
            </div>
          ) : isInCurrentMonth(releaseDate) ? (
            <div className="ml-2 inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-zinc-800 dark:text-sky-300">
              New
            </div>
          ) : null}
        </div>
      </div>
      <article className="prose prose-blog mx-auto mt-6 max-w-288 px-6 *:mx-auto md:mt-12 lg:px-8">
        <post.Component />
      </article>
    </>
  )
}
