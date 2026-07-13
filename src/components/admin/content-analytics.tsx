'use client'

import type { PageViewRow } from '@/lib/db-analytics'

const sourceLabels: Record<string, string> = {
  homepage: 'Homepage',
  projects_page: 'Projects',
  blog_page: 'Blog',
  direct: 'Direct',
  external: 'External',
}

const cardClass =
  'relative rounded-xl bg-white p-5 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline'

function SourceChips({ sources }: { sources: { source: string; count: number }[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sources
        .sort((a, b) => b.count - a.count)
        .map((s) => (
          <span
            key={s.source}
            className="inline-flex items-center gap-1 rounded-full bg-zinc-950/5 px-2 py-0.5 font-mono text-[11px] dark:bg-white/5"
          >
            <span className="text-zinc-500 dark:text-zinc-400">{sourceLabels[s.source] || s.source}</span>
            <span className="text-zinc-950 tabular-nums dark:text-white">{s.count}</span>
          </span>
        ))}
    </div>
  )
}

function ContentSection({ title, rows }: { title: string; rows: PageViewRow[] }) {
  let maxViews = Math.max(1, ...rows.map((r) => r.total_views))

  return (
    <div className={cardClass}>
      <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">{title}</h3>
      {rows.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-zinc-400 dark:text-zinc-500">
          No page views recorded yet.
        </div>
      ) : (
        <div className="mt-4">
          {rows.map((row) => {
            let pct = (row.total_views / maxViews) * 100
            return (
              <div
                key={row.slug}
                className="relative border-b border-zinc-100 px-1 py-2.5 last:border-b-0 dark:border-zinc-800/50"
              >
                <div
                  className="absolute inset-y-0 left-0 rounded bg-sky-400/8 dark:bg-sky-400/5"
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between gap-4">
                  <span className="min-w-0 truncate font-mono text-sm text-zinc-700 dark:text-zinc-300">
                    {row.slug}
                  </span>
                  <span className="shrink-0 font-mono text-sm text-zinc-950 tabular-nums dark:text-white">
                    {row.total_views}
                    <span className="ml-0.5 font-sans text-xs text-zinc-400 dark:text-zinc-500">
                      view{row.total_views !== 1 ? 's' : ''}
                    </span>
                  </span>
                </div>
                <div className="relative mt-1.5">
                  <SourceChips sources={row.source_breakdown} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function ContentAnalytics({ pageViews }: { pageViews: PageViewRow[] }) {
  let blogPosts = pageViews.filter((p) => p.content_type === 'blog')
  let projects = pageViews.filter((p) => p.content_type === 'project')

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ContentSection title="Blog posts" rows={blogPosts} />
      <ContentSection title="Projects" rows={projects} />
    </div>
  )
}
