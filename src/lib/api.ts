import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type React from 'react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Blog post functions
export async function getBlogPostBySlug(slug: string): Promise<{
  Component: React.FC
  meta: {
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
  slug: string
} | null> {
  try {
    // Check if the file exists using process.cwd() for absolute path
    if (!(await fs.stat(path.join(process.cwd(), `src/blog/${slug}/index.mdx`)).catch(() => null))) {
      return null
    }

    const module = await import(`../blog/${slug}/index.mdx`)
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

export async function getBlogPostSlugs(): Promise<string[]> {
  try {
    // Use process.cwd() to get the absolute path to your project root
    const folders = (await fs.readdir(path.join(process.cwd(), 'src/blog'))).filter((folder) => !folder.startsWith('.'))

    const results = await Promise.all(folders.map((folder) => getBlogPostBySlug(folder)))

    return results
      .filter(nonNullable)
      .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
      .map((post) => post.slug)
  } catch (error) {
    console.error('Error reading blog directory:', error)
    // Return empty array if directory doesn't exist
    return []
  }
}

export async function getAllBlogPosts() {
  const slugs = await getBlogPostSlugs()
  const posts = await Promise.all(slugs.map(getBlogPostBySlug))
  return posts.filter(nonNullable)
}

// Project functions
export async function getProjectBySlug(slug: string): Promise<{
  Component: React.FC
  meta: {
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
  slug: string
} | null> {
  try {
    // Check if the file exists using process.cwd() for absolute path
    if (!(await fs.stat(path.join(process.cwd(), `src/projects/${slug}/index.mdx`)).catch(() => null))) {
      return null
    }

    const module = await import(`../projects/${slug}/index.mdx`)
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
  try {
    // Use process.cwd() to get the absolute path to your project root
    const folders = (await fs.readdir(path.join(process.cwd(), 'src/projects'))).filter(
      (folder) => !folder.startsWith('.')
    )

    const results = await Promise.all(folders.map((folder) => getProjectBySlug(folder)))

    return results
      .filter(nonNullable)
      .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
      .map((post) => post.slug)
  } catch (error) {
    console.error('Error reading projects directory:', error)
    // Return empty array if directory doesn't exist
    return []
  }
}

export async function getAllProjects() {
  const slugs = await getProjectSlugs()
  const projects = await Promise.all(slugs.map(getProjectBySlug))
  return projects.filter(nonNullable)
}

// Utility functions
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
