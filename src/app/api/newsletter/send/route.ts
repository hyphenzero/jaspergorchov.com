import { sessionCookieName, validateSession } from '@/lib/auth'
import { acquireAdvisoryLock } from '@/lib/db'
import {
  buildNewsletterPayload,
  getUnsentNewsletterContent,
  markNewsletterSent,
  sendNewsletter,
  sendTestEmail,
} from '@/lib/newsletter'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get(sessionCookieName())?.value
  const valid = await validateSession(sessionToken)

  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { dryRun?: boolean; testMode?: boolean; subject?: string; slugs?: string[] }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const dryRun = body.dryRun === true
  const testMode = body.testMode === true

  const lock = await acquireAdvisoryLock()
  if (!lock) {
    console.log('[newsletter/send] advisory lock held by another run, skipping')
    return NextResponse.json({ ok: false, message: 'another send is in progress' })
  }

  try {
    let unsent = await getUnsentNewsletterContent()

    if (body.slugs) {
      const slugSet = new Set(body.slugs)
      unsent = unsent.filter((p) => slugSet.has(p.slug))
    }

    if (unsent.length === 0) {
      console.log('[newsletter/send] no unsent content found')
      return NextResponse.json({ error: 'No unsent content to send' }, { status: 400 })
    }

    console.log(`[newsletter/send] ${unsent.length} unsent entries detected`)

    const payload = await buildNewsletterPayload(unsent)
    if (body.subject) {
      payload.subject = body.subject
    }

    if (dryRun) {
      console.log(`[newsletter/send] dry run: would send ${payload.entries.length} entries`)
      console.log(`[newsletter/send] dry run: subject "${payload.subject}"`)
      console.log(
        `[newsletter/send] dry run: entries:`,
        payload.entries.map((e) => e.title)
      )

      return NextResponse.json({
        ok: true,
        dryRun: true,
        count: payload.entries.length,
        subject: payload.subject,
        slugs: unsent.map((p) => p.slug),
      })
    }

    if (testMode) {
      console.log(`[newsletter/send] sending test email`)
      const result = await sendTestEmail(payload)

      return NextResponse.json({
        ok: true,
        count: result.count,
        slugs: result.slugs,
        resendId: result.broadcastId,
      })
    }

    console.log(`[newsletter/send] sending broadcast`)

    const result = await sendNewsletter(payload)

    console.log(`[newsletter/send] broadcast sent, id: ${result.broadcastId}`)

    await markNewsletterSent(unsent)

    console.log(`[newsletter/send] persisted ${result.count} send records`)

    return NextResponse.json({
      ok: true,
      count: result.count,
      slugs: result.slugs,
      resendId: result.broadcastId,
    })
  } catch (error) {
    console.error('[newsletter/send] failed:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'

    return NextResponse.json({ error: message }, { status: 500 })
  } finally {
    await lock.release()
  }
}
