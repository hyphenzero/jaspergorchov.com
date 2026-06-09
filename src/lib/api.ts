import fs from 'node:fs/promises'
import path from 'node:path'
import type { BlogPost, Project, ProjectShowreelAnimation } from '../types/post'
import { formatDate as _formatDate } from './api-utils'

export const formatDate = _formatDate

/** Allow only simple, filesystem-safe slugs used in dynamic imports. */
function isValidSlug(slug: string) {
  return /^[a-zA-Z0-9_-]+$/.test(slug)
}

/**
 * Normalize various frontmatter image shapes into { src: string }.
 * Accepts string paths, imported image objects, or already-normalized shapes.
 */
function normalizeImage(img: any): { src: string } | undefined {
  if (!img) return undefined
  if (typeof img === 'string') return { src: img }
  if (typeof img === 'object') return { src: img.src ?? img.default ?? String(img) }
  return { src: String(img) }
}

function isShowreelAnimation(animation: unknown): animation is ProjectShowreelAnimation {
  return animation === 'website-mobile-rise' || animation === 'stepped-scale-render'
}

function normalizeShowreel(value: unknown, fallbackImage: unknown): Project['meta']['showreel'] | undefined {
  if (!value || typeof value !== 'object') return undefined
  const input = value as Record<string, unknown>
  const animation = input.animation
  if (!isShowreelAnimation(animation)) return undefined

  const backgroundColor = typeof input.backgroundColor === 'string' ? input.backgroundColor : undefined

  if (animation === 'website-mobile-rise') {
    const desktopImage = normalizeImage(input.desktopImage ?? fallbackImage)
    const mobileImage = normalizeImage(input.mobileImage ?? input.desktopImage ?? fallbackImage)
    if (!desktopImage && !mobileImage) return undefined
    return { animation, backgroundColor, desktopImage, mobileImage }
  }

  const renderImage = normalizeImage(input.renderImage ?? fallbackImage)
  if (!renderImage) return undefined
  return { animation, backgroundColor, renderImage }
}

// resolved paths are constructed from process.cwd() when needed

// Blog post functions
/** Load a blog MDX module by slug and normalize its frontmatter. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    if (!isValidSlug(slug)) return null

    const absolutePath = path.join(process.cwd(), `src/app/blog/${slug}/index.mdx`)
    if (!(await fs.stat(absolutePath).catch(() => null))) return null

    const module = await import(`../app/blog/${slug}/index.mdx`)
    if (!module?.default) return null

    const meta = module.meta || {}
    const normalized: any = {
      ...meta,
      // Prefer an explicit `date`, but allow `releaseDate` on blog pages for robustness.
      date: meta.date ?? meta.releaseDate,
      image: normalizeImage(meta.image),
    }

    return {
      Component: module.default,
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

    const module = await import(`../app/projects/${slug}/index.mdx`)
    if (!module?.default) return null

    const meta = module.meta || {}
    const normalizedImage = normalizeImage(meta.image)
    const normalizedMeta: any = {
      ...meta,
      // Normalized canonical date for consumers. Prefer explicit releaseDate.
      date: meta.releaseDate ?? meta.date,
      releaseDate: meta.releaseDate,
      // Support both `updatedDate` and legacy `updated` fields.
      updatedDate: meta.updatedDate ?? meta.updated,
      image: normalizedImage,
      showreel: normalizeShowreel(meta.showreel, normalizedImage),
    }

    return {
      Component: module.default,
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
export function nonNullable<T>(x: T | null): x is NonNullable<T> {
  return x !== null
}
