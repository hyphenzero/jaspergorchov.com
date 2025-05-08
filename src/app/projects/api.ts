import glob from 'fast-glob'

interface Meta {
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

async function loadEntries(
  directory: string,
  metaName: string
): Promise<
  Array<{
    Component: React.FC
    meta: Meta
    slug: string
  }>
> {
  return (
    await Promise.all(
      (await glob('**/index.mdx', { cwd: `src/${directory}` })).map(async (filename) => {
        const module = await import(`../../${directory}/${filename}`)
        const metadata = module[metaName] as Meta
        return {
          Component: module.default,
          meta: metadata,
          slug: filename.replace(/\/index\.mdx$/, ''),
        }
      })
    )
  ).sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
}

export async function getProjectBySlug(slug: string) {
  const entries = await loadEntries('projects', 'meta')
  return entries.find((entry) => entry.slug === slug) || null
}

export async function getProjectSlugs() {
  const entries = await loadEntries('projects', 'meta')
  return entries.map((entry) => entry.slug)
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
