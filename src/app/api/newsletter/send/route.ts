import { NextRequest, NextResponse } from 'next/server'
import { sessionCookieName, validateSession } from '@/lib/auth'
import { acquireAdvisoryLock, logAuditAction } from '@/lib/db'
import {
  buildNewsletterPayload,
  getUnsentNewsletterContent,
  markNewsletterSent,
  sendNewsletter,
} from '@/lib/newsletter'

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get(sessionCookieName())?.value
  const valid = await validateSession(sessionToken)

  if (!valid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { dryRun?: boolean }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const dryRun = body.dryRun === true

  const lock = await acquireAdvisoryLock()
  if (!lock) {
    console.log('[newsletter/send] advisory lock held by another run, skipping')
    return NextResponse.json({ ok: false, message: 'another send is in progress' })
  }

  try {
    const unsent = await getUnsentNewsletterContent()

    if (unsent.length === 0) {
      console.log('[newsletter/send] no unsent content found')
      await logAuditAction('send_failure', { reason: 'no unsent content', dryRun })
      return NextResponse.json({ error: 'No unsent content to send' }, { status: 400 })
    }

    console.log(`[newsletter/send] ${unsent.length} unsent entries detected`)

    await logAuditAction('send_attempt', {
      entryCount: unsent.length,
      slugs: unsent.map((p) => p.slug),
      dryRun,
    })

    const payload = await buildNewsletterPayload(unsent)

    if (dryRun) {
      console.log(`[newsletter/send] dry run: would send ${payload.entries.length} entries`)
      console.log(`[newsletter/send] dry run: subject "${payload.subject}"`)
      console.log(
        `[newsletter/send] dry run: entries:`,
        payload.entries.map((e) => e.title)
      )

      await logAuditAction('send_success', {
        dryRun: true,
        entryCount: payload.entries.length,
        subject: payload.subject,
        slugs: unsent.map((p) => p.slug),
      })

      return NextResponse.json({
        ok: true,
        dryRun: true,
        count: payload.entries.length,
        subject: payload.subject,
        slugs: unsent.map((p) => p.slug),
      })
    }

    console.log(`[newsletter/send] sending broadcast`)

    const result = await sendNewsletter(payload)

    console.log(`[newsletter/send] broadcast sent, id: ${result.broadcastId}`)

    await markNewsletterSent(unsent, result.broadcastId)

    console.log(`[newsletter/send] persisted ${result.count} send records`)

    await logAuditAction('send_success', {
      broadcastId: result.broadcastId,
      entryCount: result.count,
      slugs: result.slugs,
      dryRun: false,
    })

    return NextResponse.json({
      ok: true,
      count: result.count,
      slugs: result.slugs,
      resendId: result.broadcastId,
    })
  } catch (error) {
    console.error('[newsletter/send] failed:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'

    await logAuditAction('send_failure', {
      error: message,
      dryRun,
    })

    return NextResponse.json({ error: message }, { status: 500 })
  } finally {
    await lock.release()
  }
}
