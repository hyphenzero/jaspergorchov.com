import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function getProjectBySlug(slug: string): Promise<{
  Component: React.FC
  meta: {
    title: string
    date: string
    excerpt: React.ReactElement
    description: string
    image?: {
      src: string
    }
    private?: boolean
  }
  slug: string
} | null> {
  try {
    // Check if the file exists
    if (!(await fs.stat(path.join(__dirname, `../../projects/${slug}/index.mdx`)).catch(() => null))) {
      return null
    }

    let module = await import(`../../projects/${slug}/index.mdx`)
    if (!module.default) {
      return null
    }

    return {
      Component: module.default,
      meta: {
        ...module.meta,
      },
      slug,
    }
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  let projects: { slug: string; date: number }[] = []

  let folders = await fs.readdir(path.join(__dirname, '../../blog'))

  await Promise.allSettled(
    folders.map(async (folder) => {
      if (folder.startsWith('.')) return
      try {
        let post = await getProjectBySlug(folder)
        if (!post) return

        projects.push({
          slug: post.slug,
          date: new Date(post.meta.date).getTime(),
        })
      } catch (e) {
        console.error(e)
      }
    })
  )

  projects.sort((a, b) => b.date - a.date)

  return projects.map((post) => post.slug)
}

export function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function nonNullable<T>(x: T | null): x is NonNullable<T> {
  return x !== null
}
