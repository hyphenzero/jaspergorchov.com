import { cookies } from 'next/headers'
import { sessionCookieName, validateSession } from '@/lib/auth'
import { logAuditAction } from '@/lib/db'
import { buildNewsletterPayload, getUnsentNewsletterContent } from '@/lib/newsletter'
import { AdminClient } from './client'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(sessionCookieName())?.value
  const valid = await validateSession(session)

  if (!valid) {
    return <AdminLogin />
  }

  const scanStart = Date.now()
  const unsent = await getUnsentNewsletterContent()
  const scanEnd = Date.now()

  await logAuditAction('scan', {
    totalFound: unsent.length,
    blogCount: unsent.filter((p) => p.type === 'blog').length,
    projectCount: unsent.filter((p) => p.type === 'project').length,
    scanDurationMs: scanEnd - scanStart,
  })

  const payload = unsent.length > 0 ? await buildNewsletterPayload(unsent) : null

  if (payload) {
    await logAuditAction('preview', {
      entryCount: payload.entries.length,
      subject: payload.subject,
    })
  }

  const scanTimestamp = new Date(scanStart).toISOString()
  const blogCount = unsent.filter((p) => p.type === 'blog').length
  const projectCount = unsent.filter((p) => p.type === 'project').length

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-zinc-900 tracking-tight sm:text-3xl dark:text-white">
          Newsletter Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Review unsent content and send a newsletter digest.
        </p>
      </div>

      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-400">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Last scanned:{' '}
        <time dateTime={scanTimestamp}>
          {new Date(scanTimestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
          })}
        </time>
      </div>

      {unsent.length === 0 ? (
        <div className="rounded-lg border border-zinc-300 border-dashed p-12 text-center dark:border-zinc-700">
          <p className="font-medium text-lg text-zinc-900 dark:text-white">Nothing new to send.</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            All published posts and projects have been sent.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">Unsent Content ({unsent.length})</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{blogCount}</span> blog post
              {blogCount !== 1 ? 's' : ''}
              {projectCount > 0 && (
                <>
                  {' '}
                  and <span className="font-medium text-zinc-700 dark:text-zinc-300">{projectCount}</span> project
                  {projectCount !== 1 ? 's' : ''}
                </>
              )}{' '}
              ready to send.
            </p>

            <ul className="mt-4 divide-y divide-zinc-100 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-700">
              {unsent.map((post) => (
                <li key={post.slug} className="flex items-center gap-3 px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-700 text-xs uppercase tracking-wider dark:bg-sky-950 dark:text-sky-300">
                    {post.type === 'blog' ? 'Blog' : 'Project'}
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">{post.title}</span>
                  <span className="ml-auto text-xs text-zinc-400">{post.date}</span>
                </li>
              ))}
            </ul>
          </section>

          {payload && (
            <>
              <section>
                <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">Subject Preview</h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{payload.subject}</p>
              </section>

              <section>
                <div className="flex items-baseline justify-between">
                  <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">Email Preview</h2>
                  <span className="text-xs text-zinc-400">Live preview &mdash; generated from filesystem</span>
                </div>
                <p className="mt-1 mb-3 text-sm text-zinc-500 dark:text-zinc-400">
                  This is exactly what subscribers will receive.
                </p>
                <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <iframe
                    title="Email preview"
                    srcDoc={payload.html}
                    className="w-full"
                    style={{ height: '600px', border: 'none' }}
                  />
                </div>
              </section>

              <section className="border-zinc-200 border-t pt-6 dark:border-zinc-700">
                <AdminClient entryCount={payload.entries.length} blogCount={blogCount} projectCount={projectCount} />
              </section>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function AdminLogin() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-sm items-center justify-center px-4">
      <div className="w-full space-y-6">
        <div className="text-center">
          <h1 className="font-bold text-2xl text-zinc-900 tracking-tight dark:text-white">Admin Access</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Enter the admin token to continue.</p>
        </div>

        <form action="/api/admin/login" method="POST" className="space-y-4">
          <input type="hidden" name="from" value="/admin" />
          <div>
            <label htmlFor="token" className="sr-only">
              Token
            </label>
            <input
              id="token"
              name="token"
              type="password"
              placeholder="Enter admin token"
              required
              autoFocus
              className="block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
            />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 font-semibold text-sm text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
