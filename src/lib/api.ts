import fs from 'node:fs/promises'
import path from 'node:path'
import type React from 'react'
import type { BlogPost, Note, Project } from '../types/post'
import { formatDate as _formatDate, formatTimeLocal as _formatTimeLocal } from './api-utils'

export const formatDate = _formatDate
export const formatTimeLocal = _formatTimeLocal

/** Allow only simple, filesystem-safe slugs used in dynamic imports. */
function isValidSlug(slug: string) {
  return /^[a-zA-Z0-9_-]+$/.test(slug)
}

/**
 * Normalize various frontmatter image shapes into { src, width, height }.
 * Accepts string paths, imported image objects, or already-normalized shapes.
 * Preserves width/height from static imports so downstream consumers can
 * pass the full object to Next.js Image or derive the correct aspect ratio.
 */
interface MdxFrontmatter {
  [key: string]: unknown
  title?: string
  date?: string
  releaseDate?: string
  updatedDate?: string
  updated?: string
  lead?: string
  excerpt?: string
  description?: string
  tags?: string[]
  image?: unknown
  imageDark?: unknown
  video?: string
  private?: boolean
}

interface MdxModule {
  default: React.FC
  meta?: MdxFrontmatter
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function normalizeImage(img: unknown): { src: string; width?: number; height?: number } | undefined {
  if (!img) return undefined
  if (typeof img === 'string') return { src: img }
  if (typeof img === 'object') {
    const record = img as Record<string, unknown>
    const raw = record.src ?? record.default
    return {
      src: typeof raw === 'string' ? raw : String(img),
      width: typeof record.width === 'number' ? record.width : undefined,
      height: typeof record.height === 'number' ? record.height : undefined,
    }
  }
  return { src: String(img) }
}

// resolved paths are constructed from process.cwd() when needed

// Blog post functions
/** Load a blog MDX module by slug and normalize its frontmatter. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!isValidSlug(slug)) return null

    const absolutePath = path.join(process.cwd(), `src/app/blog/${slug}/index.mdx`)
    if (!(await fs.stat(absolutePath).catch(() => null))) return null

    const mod: MdxModule = await import(`../app/blog/${slug}/index.mdx`)
    if (!mod?.default) return null

    const meta = mod.meta ?? {}
    const normalized: BlogPost['meta'] = {
      title: asString(meta.title) ?? '',
      date: asString(meta.date) ?? asString(meta.releaseDate) ?? '',
      lead: asString(meta.lead) ?? asString(meta.excerpt) ?? asString(meta.description) ?? '',
      tags: Array.isArray(meta.tags) ? meta.tags.filter((t): t is string => typeof t === 'string') : [],
      image: normalizeImage(meta.image),
      imageDark: normalizeImage(meta.imageDark),
    }
    if (typeof meta.private === 'boolean') normalized.private = meta.private

    return {
      Component: mod.default,
      meta: normalized,
      slug,
    }
  } catch (e) {
    // Keep error handling minimal; callers can treat `null` as not-found.
    console.error(e)
    return null
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  try {
    const folders = (await fs.readdir(path.join(process.cwd(), 'src/app/blog'))).filter(
      (folder) => !folder.startsWith('.')
    )

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
/** Load a project MDX module and normalize project-specific frontmatter. */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    if (!isValidSlug(slug)) return null

    const absolutePath = path.join(process.cwd(), `src/app/projects/${slug}/index.mdx`)
    if (!(await fs.stat(absolutePath).catch(() => null))) return null

    const mod: MdxModule = await import(`../app/projects/${slug}/index.mdx`)
    if (!mod?.default) return null

    const meta = mod.meta ?? {}
    const normalizedMeta: Project['meta'] = {
      title: asString(meta.title) ?? '',
      // Normalized canonical date for consumers. Prefer explicit releaseDate.
      date: asString(meta.releaseDate) ?? asString(meta.date) ?? '',
      releaseDate: asString(meta.releaseDate),
      // Support both `updatedDate` and legacy `updated` fields.
      updatedDate: asString(meta.updatedDate) ?? asString(meta.updated),
      lead: asString(meta.lead) ?? asString(meta.excerpt) ?? asString(meta.description) ?? '',
      tags: Array.isArray(meta.tags) ? meta.tags.filter((t): t is string => typeof t === 'string') : [],
      image: normalizeImage(meta.image),
      imageDark: normalizeImage(meta.imageDark),
      video: asString(meta.video),
    }
    if (typeof meta.private === 'boolean') normalizedMeta.private = meta.private

    return {
      Component: mod.default,
      meta: normalizedMeta,
      slug,
    }
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  try {
    const folders = (await fs.readdir(path.join(process.cwd(), 'src/app/projects'))).filter(
      (folder) => !folder.startsWith('.')
    )

    const results = await Promise.all(folders.map((folder) => getProjectBySlug(folder)))

    return results
      .filter(nonNullable)
      .sort((a, b) => {
        const aDate = a.meta.updatedDate ?? a.meta.date
        const bDate = b.meta.updatedDate ?? b.meta.date
        return new Date(bDate).getTime() - new Date(aDate).getTime()
      })
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

// Note functions
/** Load a note MDX module and normalize its frontmatter. */
export async function getNoteBySlug(slug: string): Promise<Note | null> {
  try {
    if (!isValidSlug(slug)) return null

    const absolutePath = path.join(process.cwd(), `src/app/blog/_notes/${slug}/index.mdx`)
    if (!(await fs.stat(absolutePath).catch(() => null))) return null

    const mod: MdxModule = await import(`../app/blog/_notes/${slug}/index.mdx`)
    if (!mod?.default) return null

    const meta = mod.meta ?? {}
    const normalized: Note['meta'] = {
      date: asString(meta.date) ?? '',
      image: normalizeImage(meta.image),
      imageDark: normalizeImage(meta.imageDark),
    }

    return {
      Component: mod.default,
      meta: normalized,
      slug,
    }
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function getNoteSlugs(): Promise<string[]> {
  try {
    const notesDir = path.join(process.cwd(), 'src/app/blog/_notes')
    const entries = await fs.readdir(notesDir, { withFileTypes: true })
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .filter(isValidSlug)
  } catch (error) {
    console.error('Error reading notes directory:', error)
    return []
  }
}

export async function getAllNotes(): Promise<Note[]> {
  const slugs = await getNoteSlugs()
  const posts = await Promise.all(slugs.map(getNoteBySlug))
  return posts.filter(nonNullable)
}

// Utility functions
export function nonNullable<T>(x: T | null): x is NonNullable<T> {
  return x !== null
}
