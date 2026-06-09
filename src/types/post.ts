import type React from 'react'

/**
 * Blog posts: simple MDX pages that always expose a `date` field.
 * `excerpt` is a React element to allow rich summaries (rich text / JSX).
 */
export interface BlogPost {
  Component: React.FC
  meta: {
    title: string
    date: string
    excerpt: React.ReactElement
    tags: string[]
    description: string
    image?: { src: string }
    private?: boolean
  }
  slug: string
}

export type ProjectShowreelAnimation = 'website-mobile-rise' | 'stepped-scale-render'

export interface ProjectShowreel {
  animation: ProjectShowreelAnimation
  backgroundColor?: string
  desktopImage?: { src: string }
  mobileImage?: { src: string }
  renderImage?: { src: string }
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
    excerpt: React.ReactElement
    tags: string[]
    description: string
    image?: { src: string }
    showreel?: ProjectShowreel
    private?: boolean
  }
  slug: string
}

/** Convenience union for callers that accept either type. */
export type Post = BlogPost | Project

/** A serializable Project without the React Component (safe to send to client). */
export type SerializableProject = Omit<Project, 'Component'>
