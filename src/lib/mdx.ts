import glob from 'fast-glob'
import { type ImageProps } from 'next/image'

async function loadEntries<T extends { date: string }>(
  directory: string,
  metaName: string
): Promise<Array<MDXEntry<T>>> {
  return (
    await Promise.all(
      (await glob('**/page.mdx', { cwd: `src/app/${directory}` })).map(async (filename) => {
        let metadata = (await import(`../app/${directory}/${filename}`))[metaName] as T
        return {
          ...metadata,
          metadata,
          href: `/${directory}/${filename.replace(/\/page\.mdx$/, '')}`,
        }
      })
    )
  ).sort((a, b) => b.date.localeCompare(a.date))
}

type ImagePropsWithOptionalAlt = Omit<ImageProps, 'alt'> & { alt?: string }

export type MDXEntry<T> = T & { href: string; metadata: T }

export interface Article {
  date: string
  title: string
  description: string
  cover: ImageProps['src']
  tags: Array<string>
}

export interface Project {
  date: string
  title: string
  description: string
  cover: ImageProps['src']
  tags: Array<string>
}

export function loadArticles() {
  return loadEntries<Article>('blog', 'article')
}

export function loadWork() {
  return loadEntries<Project>('work', 'project')
}
