import { NewsletterDigest } from '@/emails/newsletter'
import { getAllBlogPosts, getAllProjects } from '@/lib/api'
import { getSentSlugs, insertSendRecords } from '@/lib/db'
import { render } from 'react-email'
import { Resend } from 'resend'

const SITE_URL = process.env.SITE_URL ?? 'https://jaspergorchov.com'
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'Jasper Gorchov <jasper@updates.jaspergorchov.com>'
const TEST_EMAIL = process.env.TEST_EMAIL ?? 'jasper@jaspergorchov.com'

export interface UnsentContent {
  slug: string
  type: 'blog' | 'project'
  title: string
  date: string | undefined
  lead: string
  tags: string[]
  image?: { src: string; width?: number; height?: number }
  imageDark?: { src: string; width?: number; height?: number }
}

export interface NewsletterEntry {
  title: string
  summary: string
  postUrl: string
  type: 'blog' | 'project'
  date: string
  tag: string
  image?: { src: string; width?: number; height?: number }
  imageDark?: { src: string; width?: number; height?: number }
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
      tags: p.meta.tags ?? [],
    })),
    ...projects.map((p) => ({
      slug: p.slug,
      type: 'project' as const,
      title: p.meta.title,
      date: p.meta.date,
      lead: p.meta.lead ?? '',
      tags: p.meta.tags ?? [],
      image: p.meta.image,
      imageDark: p.meta.imageDark,
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
    date: p.date!,
    tag: p.tags[0] ?? (p.type === 'blog' ? 'Writing' : 'Project'),
    image: p.image ? { ...p.image, src: `${SITE_URL}${p.image.src}` } : undefined,
    imageDark: p.imageDark ? { ...p.imageDark, src: `${SITE_URL}${p.imageDark.src}` } : undefined,
  }))

  const subject = unsentPosts.length === 1 ? unsentPosts[0].title : `${unsentPosts[0].title} & more`

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

export async function sendTestEmail(payload: NewsletterPayload): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')

  const resend = new Resend(apiKey)

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TEST_EMAIL,
    subject: payload.subject,
    html: payload.html,
  })

  if (error || !data?.id) {
    throw new Error(error?.message ?? 'Failed to send test email')
  }

  return {
    broadcastId: data.id,
    count: payload.entries.length,
    slugs: payload.entries.map((e) => e.postUrl.split('/').pop()!),
  }
}

export async function markNewsletterSent(unsentPosts: UnsentContent[]): Promise<void> {
  await insertSendRecords(unsentPosts.map((p) => p.slug))
}
