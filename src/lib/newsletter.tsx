import { render } from '@react-email/render'
import { Resend } from 'resend'
import { NewsletterDigest } from '@/emails/newsletter'
import { getAllBlogPosts, getAllProjects } from '@/lib/api'
import { acquireAdvisoryLock, getSentSlugs, insertSendRecords } from '@/lib/db'

const SITE_URL = process.env.SITE_URL ?? 'https://jaspergorchov.com'
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'Jasper Gorchov <jasper@jaspergorchov.com>'

export interface UnsentContent {
  slug: string
  type: 'blog' | 'project'
  title: string
  date: string | undefined
  lead: string
}

export interface NewsletterEntry {
  title: string
  summary: string
  postUrl: string
  type: 'blog' | 'project'
}

export interface NewsletterPayload {
  subject: string
  entries: NewsletterEntry[]
  html: string
}

export interface SendResult {
  broadcastId: string
  count: number
  slugs: string[]
}

export async function getUnsentNewsletterContent(): Promise<UnsentContent[]> {
  const [sentSlugs, blogPosts, projects] = await Promise.all([getSentSlugs(), getAllBlogPosts(), getAllProjects()])

  const rawPosts: UnsentContent[] = [
    ...blogPosts.map((p) => ({
      slug: p.slug,
      type: 'blog' as const,
      title: p.meta.title,
      date: p.meta.date,
      lead: p.meta.lead ?? '',
    })),
    ...projects.map((p) => ({
      slug: p.slug,
      type: 'project' as const,
      title: p.meta.title,
      date: p.meta.date,
      lead: p.meta.lead ?? '',
    })),
  ]

  return rawPosts
    .filter((p) => {
      if (sentSlugs.has(p.slug)) return false
      if (!p.date) return false
      const ts = new Date(p.date).getTime()
      if (Number.isNaN(ts)) return false
      return true
    })
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
}

export async function buildNewsletterPayload(unsentPosts: UnsentContent[]): Promise<NewsletterPayload> {
  const entries: NewsletterEntry[] = unsentPosts.map((p) => ({
    title: p.title,
    summary: p.lead || `A new ${p.type === 'blog' ? 'blog post' : 'project'} has been published.`,
    postUrl: `${SITE_URL}/${p.type === 'blog' ? 'blog' : 'projects'}/${p.slug}`,
    type: p.type,
  }))

  const totalCount = unsentPosts.length
  const subject =
    totalCount === 1
      ? `New ${unsentPosts[0].type === 'blog' ? 'blog post' : 'project'}: ${unsentPosts[0].title}`
      : `New posts from jaspergorchov.com`

  const html = await render(<NewsletterDigest siteUrl={SITE_URL} entries={entries} />)

  return { subject, entries, html }
}

export async function sendNewsletter(payload: NewsletterPayload): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')

  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!audienceId) throw new Error('RESEND_AUDIENCE_ID is not set')

  const resend = new Resend(apiKey)

  const { data, error } = await resend.broadcasts.create({
    audienceId,
    from: FROM_EMAIL,
    subject: payload.subject,
    html: payload.html,
  })

  if (error || !data?.id) {
    throw new Error(error?.message ?? 'Failed to send broadcast')
  }

  return {
    broadcastId: data.id,
    count: payload.entries.length,
    slugs: payload.entries.map((e) => e.postUrl.split('/').pop()!),
  }
}

export async function markNewsletterSent(unsentPosts: UnsentContent[], broadcastId: string): Promise<void> {
  const sendRecords = unsentPosts.map((p) => ({
    slug: p.slug,
    type: p.type,
    title: p.title,
    url: `${SITE_URL}/${p.type === 'blog' ? 'blog' : 'projects'}/${p.slug}`,
  }))

  await insertSendRecords(sendRecords, broadcastId)
}
