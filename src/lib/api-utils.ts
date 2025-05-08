import type { Post } from '../types/post'

export interface SerializablePost {
  title: string
  date: string
  slug: string
  private?: boolean
}

// Simple serializer that only extracts what's needed for the header component
export function serializeForHeader(posts: Post[]): SerializablePost[] {
  return posts.map((post) => ({
    title: post.meta.title,
    date: post.meta.date,
    slug: post.slug,
    private: post.meta.private,
  }))
}

// Calculate latest content for banner (to avoid client-side flashing)
export function getLatestContent(
  blogPosts: SerializablePost[],
  projects: SerializablePost[]
): {
  latestTitle: string
  latestUrl: string
} | null {
  if (!blogPosts.length && !projects.length) {
    return null
  }

  let latestContent: SerializablePost | null = null
  let latestUrl = ''

  if (blogPosts.length > 0 && projects.length > 0) {
    const latestBlog = blogPosts[0]
    const latestProject = projects[0]

    const latestBlogDate = new Date(latestBlog.date).getTime()
    const latestProjectDate = new Date(latestProject.date).getTime()

    latestContent = latestBlogDate > latestProjectDate ? latestBlog : latestProject
    latestUrl = latestBlogDate > latestProjectDate ? `/blog/${latestBlog.slug}` : `/projects/${latestProject.slug}`
  } else if (blogPosts.length > 0) {
    latestContent = blogPosts[0]
    latestUrl = `/blog/${blogPosts[0].slug}`
  } else if (projects.length > 0) {
    latestContent = projects[0]
    latestUrl = `/projects/${projects[0].slug}`
  }

  return latestContent
    ? {
        latestTitle: latestContent.title,
        latestUrl,
      }
    : null
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
