'use client'

import * as Headless from '@headlessui/react'
import { PaperAirplaneIcon } from '@heroicons/react/16/solid'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/button'
import { Checkbox } from '@/components/checkbox'
import { Description, Field, Label } from '@/components/fieldset'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Switch } from '@/components/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Text } from '@/components/text'
import type { NewsletterPayload, UnsentContent } from '@/lib/newsletter'

interface Props {
  unsent: UnsentContent[]
  payload: NewsletterPayload | null
}

export function AdminClient({ unsent, payload }: Props) {
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set(unsent.map((p) => p.slug)))
  const [subject, setSubject] = useState(payload?.subject ?? '')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [dryRun, setDryRun] = useState(false)
  const [testMode, setTestMode] = useState(false)

  const blogPosts = unsent.filter((p) => p.type === 'blog')
  const projectPosts = unsent.filter((p) => p.type === 'project')
  const selected = unsent.filter((p) => selectedSlugs.has(p.slug))
  const selectedBlogCount = selected.filter((p) => p.type === 'blog').length
  const selectedProjectCount = selected.filter((p) => p.type === 'project').length

  const [previewHtml, setPreviewHtml] = useState<string | null>(payload?.html ?? null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (previewTimer.current) clearTimeout(previewTimer.current)

    previewTimer.current = setTimeout(async () => {
      setPreviewLoading(true)
      try {
        const res = await fetch('/api/newsletter/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slugs: [...selectedSlugs], subject }),
        })
        const data = await res.json()
        if (data.html) setPreviewHtml(data.html)
        else setPreviewHtml(null)
      } catch {
        setPreviewHtml(null)
      } finally {
        setPreviewLoading(false)
      }
    }, 150)

    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current)
    }
  }, [selectedSlugs, subject])

  function handleToggle(slug: string, checked: boolean) {
    setSelectedSlugs((prev) => {
      const next = new Set(prev)
      if (checked) next.add(slug)
      else next.delete(slug)
      return next
    })
  }

  function handleSelectAll(posts: UnsentContent[], current: boolean) {
    setSelectedSlugs((prev) => {
      const next = new Set(prev)
      for (const p of posts) {
        if (current) next.add(p.slug)
        else next.delete(p.slug)
      }
      return next
    })
  }

  function handleDryRunChange(checked: boolean) {
    setDryRun(checked)
    if (checked) setTestMode(false)
  }

  async function handleSend(dry: boolean) {
    setStatus('sending')
    setMessage(null)
    setShowConfirm(false)

    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun: dry, testMode, subject, slugs: [...selectedSlugs] }),
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
  const actionLabel = status === 'sending' ? 'Sending...' : dryRun ? 'Run dry run' : testMode ? 'Send test' : 'Send now'

  function renderTable(title: string, posts: UnsentContent[]) {
    if (posts.length === 0) return null

    const allInSet = posts.every((p) => selectedSlugs.has(p.slug))
    const noneInSet = posts.every((p) => !selectedSlugs.has(p.slug))

    return (
      <section>
        <div className="flex items-baseline justify-between">
          <Subheading level={2}>{title}</Subheading>
          <button
            type="button"
            onClick={() => handleSelectAll(posts, !allInSet)}
            className="font-medium text-sky-600 text-sm/6 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
          >
            {allInSet && !noneInSet ? 'Deselect all' : 'Select all'}
          </button>
        </div>
        <Table dense className="mt-3">
          <TableHead className="sr-only">
            <TableRow>
              <TableHeader>Select</TableHeader>
              <TableHeader>Title</TableHeader>
              <TableHeader>Date</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.slug}>
                <TableCell className="w-10 pr-0">
                  <Checkbox
                    color="sky"
                    checked={selectedSlugs.has(post.slug)}
                    onChange={(checked) => handleToggle(post.slug, checked)}
                  />
                </TableCell>
                <TableCell>
                  <span
                    className={
                      selectedSlugs.has(post.slug)
                        ? 'font-medium text-zinc-900 dark:text-white'
                        : 'text-zinc-500 dark:text-zinc-400'
                    }
                  >
                    {post.title}
                  </span>
                </TableCell>
                <TableCell className="text-right text-zinc-500 tabular-nums dark:text-zinc-400">
                  {formatEntryDate(post.date)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    )
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
      <div className="min-w-0 space-y-10">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Heading>Unsent content</Heading>
            <Text className="mt-1 text-pretty">
              {selected.length} of {unsent.length} entries selected for this digest.
            </Text>
          </div>
          <p className="text-base/7 text-zinc-500 tabular-nums sm:text-sm/6 dark:text-zinc-400">
            {selectedBlogCount} blog / {selectedProjectCount} project
          </p>
        </div>

        <div className="space-y-8">
          {renderTable('Blog posts', blogPosts)}
          {renderTable('Projects', projectPosts)}
        </div>

        {payload && (
          <section>
            <div className="flex items-center justify-between">
              <Heading>Email preview</Heading>
              {previewLoading && <span className="text-sm text-zinc-400 dark:text-zinc-500">Updating…</span>}
            </div>
            <div className="mt-5 overflow-hidden rounded-3xl ring ring-zinc-950/10 dark:ring-white/10">
              {previewHtml ? (
                <iframe title="Email preview" srcDoc={previewHtml} className="h-200 w-full" />
              ) : (
                <div className="flex h-200 items-center justify-center text-zinc-400 dark:text-zinc-500">
                  {selected.length === 0 ? 'Select items to preview' : 'No preview available'}
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {payload && (
        <aside className="lg:sticky lg:top-24">
          <section className="relative rounded-t-3xl rounded-b-[38px] bg-white p-5 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-3xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline">
            <div>
              <Heading level={2} className="text-balance">
                Send digest
              </Heading>
              <p className="mt-1 text-pretty text-base/7 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
                {selected.length} of {unsent.length} entries selected for this newsletter.
              </p>
            </div>

            <Field className="pt-5">
              <Label>Email subject</Label>
              <Input
                name="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isLocked}
              />
              <Description>Shown in the inbox before the digest content.</Description>
            </Field>

            <div className="mt-6 divide-y divide-zinc-950/10 dark:divide-white/10">
              <Headless.Field className="grid grid-cols-[1fr_auto] gap-4 py-4">
                <div className="min-w-0">
                  <Label>Dry run</Label>
                  <Description>Generate and log the send without emailing subscribers or writing records.</Description>
                </div>
                <Switch name="dry_run" color="sky" checked={dryRun} onChange={handleDryRunChange} disabled={isLocked} />
              </Headless.Field>

              <Headless.Field className="grid grid-cols-[1fr_auto] gap-4 py-4">
                <div className="min-w-0">
                  <Label>Send test</Label>
                  <Description>Email jasper@jaspergorchov.com without saving to the database.</Description>
                </div>
                <Switch
                  name="test_mode"
                  color="sky"
                  checked={testMode}
                  onChange={setTestMode}
                  disabled={isLocked || dryRun}
                />
              </Headless.Field>
            </div>

            <div className="pt-5">
              <Button
                color="sky"
                className="w-full"
                onClick={() => setShowConfirm(true)}
                disabled={isLocked || selected.length === 0}
              >
                {selected.length === 0 ? 'Select items to send' : actionLabel}
                <PaperAirplaneIcon />
              </Button>
            </div>

            {status === 'success' && (
              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-base/7 text-emerald-900 sm:text-sm/6 dark:text-emerald-200">
                {dryRun ? (
                  <p>{message}</p>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">Newsletter sent successfully!</p>
                    <p className="text-emerald-800 dark:text-emerald-300">{message}</p>
                    {!testMode && (
                      <a
                        href="/admin"
                        className="font-medium text-emerald-800 underline hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200"
                      >
                        Refresh to verify sent state
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {status === 'error' && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-base/7 text-red-900 sm:text-sm/6 dark:text-red-200">
                {message}
              </div>
            )}

            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl ring-1 ring-black/10 dark:bg-zinc-900 dark:shadow-none dark:ring-white/10">
                  {dryRun ? (
                    <>
                      <h3 className="text-balance font-semibold text-xl text-zinc-900 dark:text-white">
                        Run dry-run preview?
                      </h3>
                      <p className="mt-2 text-pretty text-base/7 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
                        This will generate the full digest and log the output, but will <strong>not</strong> send any
                        email or write to the database.
                      </p>
                      <p className="mt-3 text-pretty text-base/7 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
                        Subject: <span className="font-medium text-zinc-700 dark:text-zinc-300">{subject}</span>
                      </p>
                    </>
                  ) : testMode ? (
                    <>
                      <h3 className="text-balance font-semibold text-xl text-zinc-900 dark:text-white">
                        Send test email?
                      </h3>
                      <p className="mt-2 text-pretty text-base/7 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
                        A test email with the subject below will be sent to{' '}
                        <strong className="text-zinc-700 dark:text-zinc-300">jasper@jaspergorchov.com</strong>. No
                        records will be written to the database.
                      </p>
                      <p className="mt-3 text-pretty text-base/7 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
                        Subject: <span className="font-medium text-zinc-700 dark:text-zinc-300">{subject}</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-balance font-semibold text-xl text-zinc-900 dark:text-white">
                        Send newsletter to all subscribers?
                      </h3>
                      <div className="mt-3 space-y-2 text-pretty text-base/7 text-zinc-500 sm:text-sm/6 dark:text-zinc-400">
                        <p>
                          This will send a broadcast to your entire Resend audience with{' '}
                          <strong className="text-zinc-700 dark:text-zinc-300">{selected.length} entries</strong>:
                        </p>
                        <ul className="list-disc pl-5">
                          {selectedBlogCount > 0 && (
                            <li>
                              {selectedBlogCount} blog post{selectedBlogCount !== 1 ? 's' : ''}
                            </li>
                          )}
                          {selectedProjectCount > 0 && (
                            <li>
                              {selectedProjectCount} project{selectedProjectCount !== 1 ? 's' : ''}
                            </li>
                          )}
                        </ul>
                        <p className="pt-1">
                          Subject: <span className="font-medium text-zinc-700 dark:text-zinc-300">{subject}</span>
                        </p>
                        <p className="pt-2 text-zinc-400">
                          This action cannot be undone. Recipients will receive the email immediately.
                        </p>
                      </div>
                    </>
                  )}
                  <div className="mt-6 flex justify-end gap-3">
                    <Button type="button" outline onClick={() => setShowConfirm(false)}>
                      Cancel
                    </Button>
                    <Button type="button" color="sky" onClick={() => handleSend(dryRun)}>
                      {dryRun ? 'Run dry run' : testMode ? 'Send test' : 'Confirm send'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </aside>
      )}
    </div>
  )
}

function formatEntryDate(date?: string) {
  if (!date) return 'No date'
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
