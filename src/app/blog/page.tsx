import { FadeIn, FadeInStagger } from '@/components/fade-in'
import { PageIntro } from '@/components/page-intro'
import { Tag } from '@/components/tag'
import { Text } from '@/components/text'
import { formatDate } from '@/lib/formatDate'
import { loadArticles } from '@/lib/mdx'
import { ArrowRightIcon } from '@heroicons/react/16/solid'
import { type Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Updates on my projects and things I find interesting.',
}

export default async function Blog() {
	let articles = await loadArticles()

  return (
    <>
      <PageIntro eyebrow="Blog" title="Updates on my projects and things I find interesting.">
        <p>
          The latest news on my projects, as well as tools I like, tricks I learn, and cool things I find on the Internet.
        </p>
      </PageIntro>

      <main className="mx-auto flex max-w-4xl flex-col justify-center space-y-2">
        <FadeInStagger>
          {articles.map((article) => (
            <FadeIn key={article.date}>
              <article className="flex gap-x-16 py-12">
                <div className="space-y-4">
                  <dl className="w-[132.5px]">
                    <dt className="sr-only">Date</dt>
                    <dd className="whitespace-nowrap">
                      <time className="block" dateTime={article.date}>
                        <Text>{formatDate(article.date, false)}</Text>
                      </time>
                    </dd>
                  </dl>
                  {article.tags.map((tag) => (
                    <Tag key={tag} tag={tag} />
                  ))}
                </div>

                <div aria-hidden="true" className="inset-y-0 border-l border-zinc-950/10 dark:border-white/10" />

                <Link
                  className="-m-4 flex-1 rounded-xl p-4 transition hover:bg-zinc-950/5 dark:hover:bg-white/5"
                  href={article.href}
                >
                  <h3 className="pt-8 text-base font-medium text-zinc-950 lg:pt-0 dark:text-white">
                    {article.metadata.title}
                  </h3>
                  <Text className="mt-2 line-clamp-2">{article.metadata.description}</Text>
                  <p className="mt-5 gap-x-2 text-base font-semibold text-sky-500 sm:text-sm/6 dark:text-sky-400">
                    Read more <ArrowRightIcon className="inline size-4 text-sky-500/50 dark:text-sky-400/50" />
                  </p>
                </Link>
              </article>
            </FadeIn>
          ))}
        </FadeInStagger>
      </main>
    </>
  )
}
