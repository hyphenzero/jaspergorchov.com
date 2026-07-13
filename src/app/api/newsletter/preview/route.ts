import { sessionCookieName, validateSession } from '@/lib/auth'
import { buildNewsletterPayload, getUnsentNewsletterContent } from '@/lib/newsletter'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get(sessionCookieName())?.value
  const valid = await validateSession(sessionToken)

  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { slugs?: string[]; subject?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  let unsent = await getUnsentNewsletterContent()

  if (body.slugs) {
    const slugSet = new Set(body.slugs)
    unsent = unsent.filter((p) => slugSet.has(p.slug))
  }

  if (unsent.length === 0) {
    return NextResponse.json({ html: null, subject: '' })
  }

  const payload = await buildNewsletterPayload(unsent)
  if (body.subject) {
    payload.subject = body.subject
  }

  return NextResponse.json({
    html: payload.html,
    subject: payload.subject,
    blogCount: payload.entries.filter((e) => e.type === 'blog').length,
    projectCount: payload.entries.filter((e) => e.type === 'project').length,
  })
}
