import { render } from '@react-email/render'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { NewsletterDigest } from '@/emails/newsletter'
import { getAllBlogPosts, getAllProjects } from '@/lib/api'
import { acquireAdvisoryLock, getSentSlugs, insertSendRecords } from '@/lib/db'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')
  return new Resend(apiKey)
}

const SITE_URL = process.env.SITE_URL ?? 'https://jaspergorchov.com'
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'Jasper Gorchov <jasper@jaspergorchov.com>'

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.NEWSLETTER_SECRET

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!audienceId) {
    return NextResponse.json({ error: 'RESEND_AUDIENCE_ID is not set' }, { status: 500 })
  }

  const lock = await acquireAdvisoryLock()
  if (!lock) {
    console.log('[newsletter] advisory lock held by another run, skipping')
    return NextResponse.json({ ok: false, message: 'another run is in progress' })
  }

  try {
    const [sentSlugs, blogPosts, projects] = await Promise.all([getSentSlugs(), getAllBlogPosts(), getAllProjects()])

    console.log(`[newsletter] scanned ${blogPosts.length} blog posts, ${projects.length} projects`)

    const rawPosts = [
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

    const unsentPosts = rawPosts
      .filter((p) => {
        if (sentSlugs.has(p.slug)) return false
        if (!p.date) return false
        const ts = new Date(p.date).getTime()
        if (Number.isNaN(ts)) return false
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    if (unsentPosts.length === 0) {
      console.log('[newsletter] no unsent posts found, skipping')
      return NextResponse.json({ ok: true, message: 'no new posts' })
    }

    console.log(`[newsletter] ${unsentPosts.length} unsent posts detected`)

    const entries = unsentPosts.map((p) => ({
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

    console.log(`[newsletter] rendering digest with ${entries.length} entries`)

    const emailHtml = await render(<NewsletterDigest siteUrl={SITE_URL} entries={entries} />)

    console.log(`[newsletter] sending broadcast to audience ${audienceId}`)

    const { data, error } = await getResend().broadcasts.create({
      audienceId,
      from: FROM_EMAIL,
      subject,
      html: emailHtml,
    })

    if (error || !data?.id) {
      console.error('[newsletter] Resend broadcast failed:', error?.message ?? 'no broadcast ID returned')
      return NextResponse.json({ error: error?.message ?? 'Failed to send broadcast' }, { status: 500 })
    }

    const broadcastId = data.id
    console.log(`[newsletter] broadcast sent successfully, id: ${broadcastId}`)

    const sendRecords = unsentPosts.map((p) => ({
      slug: p.slug,
      type: p.type,
      title: p.title,
      url: `${SITE_URL}/${p.type === 'blog' ? 'blog' : 'projects'}/${p.slug}`,
    }))

    await insertSendRecords(sendRecords, broadcastId)
    console.log(`[newsletter] persisted ${sendRecords.length} send records`)

    return NextResponse.json({
      ok: true,
      count: unsentPosts.length,
      slugs: unsentPosts.map((p) => p.slug),
      resendId: broadcastId,
    })
  } catch (error) {
    console.error('[newsletter] run failed:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  } finally {
    await lock.release()
  }
}
