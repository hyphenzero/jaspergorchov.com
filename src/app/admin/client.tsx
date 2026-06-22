'use client'

import { useState } from 'react'

interface Props {
  entryCount: number
  blogCount: number
  projectCount: number
}

export function AdminClient({ entryCount, blogCount, projectCount }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [dryRun, setDryRun] = useState(false)

  async function handleSend(dry: boolean) {
    setStatus('sending')
    setMessage(null)
    setShowConfirm(false)

    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun: dry }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error ?? 'Failed to send newsletter')
        return
      }

      if (dry) {
        setStatus('success')
        setMessage('Dry run completed. No email was sent and no records were written.')
        return
      }

      setStatus('success')
      setMessage(`Newsletter sent successfully! Broadcast ID: ${data.resendId}`)
    } catch {
      setStatus('error')
      setMessage('Network error — could not reach the server')
    }
  }

  const isLocked = status === 'sending' || status === 'success'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          disabled={isLocked}
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 font-semibold text-sm text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'sending' ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sending...
            </>
          ) : (
            'Send Now'
          )}
        </button>

        <label className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
            disabled={isLocked}
            className="h-4 w-4 rounded border-zinc-300 text-sky-600 focus:ring-sky-500 dark:border-zinc-600 dark:bg-zinc-800"
          />
          Dry run (no send, no DB write)
        </label>
      </div>

      {status === 'success' && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 text-sm dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          {dryRun ? (
            <p>{message}</p>
          ) : (
            <div className="space-y-2">
              <p className="font-medium">Newsletter sent successfully!</p>
              <p className="text-emerald-700 dark:text-emerald-300">{message}</p>
              <a
                href="/admin"
                className="inline-block text-emerald-700 underline hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
              >
                Refresh to verify sent state
              </a>
            </div>
          )}
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {message}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-900">
            {dryRun ? (
              <>
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">Run dry-run preview?</h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  This will generate the full digest and log the output, but will <strong>not</strong> send any email or
                  write to the database.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">
                  Send newsletter to all subscribers?
                </h3>
                <div className="mt-3 space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                  <p>
                    This will send a broadcast to your entire Resend audience with{' '}
                    <strong className="text-zinc-700 dark:text-zinc-300">{entryCount} entries</strong>:
                  </p>
                  <ul className="list-disc pl-5">
                    {blogCount > 0 && (
                      <li>
                        {blogCount} blog post{blogCount !== 1 ? 's' : ''}
                      </li>
                    )}
                    {projectCount > 0 && (
                      <li>
                        {projectCount} project{projectCount !== 1 ? 's' : ''}
                      </li>
                    )}
                  </ul>
                  <p className="pt-2 text-xs text-zinc-400">
                    This action cannot be undone. Recipients will receive the email immediately.
                  </p>
                </div>
              </>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-lg border border-zinc-300 px-4 py-2 font-medium text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSend(dryRun)}
                className="rounded-lg bg-sky-600 px-4 py-2 font-semibold text-sm text-white hover:bg-sky-500"
              >
                {dryRun ? 'Run dry run' : 'Confirm send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
