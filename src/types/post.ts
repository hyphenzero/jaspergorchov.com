import type React from 'react'

/**
 * Blog posts: simple MDX pages that always expose a `date` field.
 * `lead` is a short summary string shown in listings and on the page.
 */
export interface BlogPost {
  Component: React.FC
  meta: {
    title: string
    date: string
    updatedDate?: string
    updated?: string
    lead: string
    tags: string[]
    image?: { src: string; width?: number; height?: number }
    imageDark?: { src: string; width?: number; height?: number }
    private?: boolean
  }
  slug: string
}

/**
 * Projects: similar to BlogPost but support both `releaseDate` and `updatedDate`.
 * `date` on Project is normalized server-side to `releaseDate ?? date` so
 * templates can always read `meta.date`.
 */
export interface Project {
  Component: React.FC
  meta: {
    title: string
    /** Normalized canonical date (releaseDate if present). */
    date: string
    /** Original release date, if explicitly provided in frontmatter. */
    releaseDate?: string
    updatedDate?: string
    updated?: string
    lead: string
    tags: string[]
    image?: { src: string; width?: number; height?: number }
    imageDark?: { src: string; width?: number; height?: number }
    video?: string
    private?: boolean
  }
  slug: string
}

/**
 * Notes: short-form content (like a quick social post) that lives only
 * on the /blog listing. No individual page, no tags, no "Read more".
 * `date` must include time in Pacific timezone (e.g. `2026-06-14T15:30:00-07:00`).
 * The MDX default export is rendered inline as the post content.
 */
export interface Note {
  Component: React.FC
  meta: {
    date: string
    image?: { src: string; width?: number; height?: number }
    imageDark?: { src: string; width?: number; height?: number }
  }
  slug: string
}

/** Convenience union for callers that accept either type. */
export type Post = BlogPost | Project | Note

/** A serializable Project without the React Component (safe to send to client). */
export type SerializableProject = Omit<Project, 'Component'>
