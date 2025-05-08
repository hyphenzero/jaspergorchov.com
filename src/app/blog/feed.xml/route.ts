import { Feed } from 'feed'
import { getBlogPostBySlug, getBlogPostSlugs } from '../api'

export async function GET(req: Request) {
  let siteUrl = new URL(req.url).origin

  let feed = new Feed({
    title: 'Jasper Gorchov’s Blog',
    description: 'Stay updated with the latest articles and projects by Jasper Gorchov',
    author: {
      name: 'Jasper Gorchov',
      email: 'jasper@example.com', // Replace with your actual email if desired
    },
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/blog/feed.xml`,
    },
  })

  // Get all blog post slugs and then fetch each post
  const slugs = await getBlogPostSlugs()
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      return await getBlogPostBySlug(slug)
    })
  )

  // Filter out any null posts and sort by date (newest first)
  const validPosts = posts
    .filter((post) => post !== null)
    .sort((a, b) => new Date(b!.meta.date).getTime() - new Date(a!.meta.date).getTime())

  validPosts.forEach((post) => {
    if (!post) return

    // Convert the React excerpt element to plain text if needed
    // Since we can't easily render React elements to string here,
    // we'll use the description as content
    const content = post.meta.description

    feed.addItem({
      title: post.meta.title,
      id: post.slug,
      link: `${siteUrl}/blog/${post.slug}`,
      content: content,
      description: post.meta.description,
      image: post.meta.image ? post.meta.image.src : undefined,
      date: new Date(post.meta.date),
      author: [{ name: 'Jasper Gorchov' }],
    })
  })

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'content-type': 'application/xml',
      'cache-control': 's-maxage=31556952',
    },
  })
}
