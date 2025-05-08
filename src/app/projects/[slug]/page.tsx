import { TagButton } from '@/components/tag'
import { formatDate, getProjectBySlug, getProjectSlugs } from '@/lib/api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const post = await getProjectBySlug(props.params.slug)

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
      url: `/projects/${props.params.slug}`,
      images: [
        {
          url: post.meta.image ? post.meta.image.src : `/api/og?path=/projects/${props.params.slug}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta.title,
      description: post.meta.description,
      images: [
        {
          url: post.meta.image ? post.meta.image.src : `/api/og?path=/projects/${props.params.slug}`,
        },
      ],
      site: '@tailwindcss',
      creator: '@tailwindcss',
    },
  }
}

export default async function ArticlePage(props: Props) {
  const post = await getProjectBySlug(props.params.slug)

  if (!post) {
    return notFound()
  }

  return (
    <>
      {/* Add a placeholder div so the Next.js router can find the scrollable element. */}
      <div hidden />

      <div className="mx-auto mt-16 flex w-full max-w-(--breakpoint-md) flex-col px-6">
        <time
          className="font-mono text-sm/7 font-semibold tracking-widest text-sky-500 uppercase dark:text-sky-400"
          dateTime={post.meta.date}
        >
          {formatDate(post.meta.date)}
        </time>

        <h1 className="mt-2 inline-block max-w-(--breakpoint-md) text-5xl font-medium tracking-tight text-pretty text-zinc-950 dark:text-zinc-200">
          {post.meta.title}
        </h1>

        <div className="mt-6 flex items-center gap-x-3">
          {post.meta.tags.map((tag) => (
            <TagButton key={tag} href={`/projects?category=${tag.toLowerCase().replace(/\s+/g, '+')}`}>
              {tag}
            </TagButton>
          ))}
        </div>
      </div>

      <article className="prose prose-blog mt-6 px-6 *:mx-auto md:mt-12 lg:px-8">
        <post.Component />
      </article>
    </>
  )
}
