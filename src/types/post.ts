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
    lead: string
    tags: string[]
    image?: { src: string; width?: number; height?: number }
    imageDark?: { src: string; width?: number; height?: number }
    private?: boolean
  }
  slug: string
}

export type ProjectShowreelAnimation = 'website-mobile-rise' | 'stepped-scale-render' | 'diagonal-wipe'

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
    lead: string
    tags: string[]
    image?: { src: string; width?: number; height?: number }
    imageDark?: { src: string; width?: number; height?: number }
    showreel?: ProjectShowreel
    private?: boolean
  }
  slug: string
}

/** Convenience union for callers that accept either type. */
export type Post = BlogPost | Project

/** A serializable Project without the React Component (safe to send to client). */
export type SerializableProject = Omit<Project, 'Component'>
