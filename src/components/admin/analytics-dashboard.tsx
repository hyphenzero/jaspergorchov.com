'use client'

import type { AnalyticsSummary, ButtonClickRow, PageViewRow, PreviewClickRow } from '@/lib/db-analytics'
import { ContentAnalytics } from './content-analytics'
import { ViewsChart } from './views-chart'

interface Props {
  summary: AnalyticsSummary
  pageViews: PageViewRow[]
  previewClicks: PreviewClickRow[]
  buttonClicks: ButtonClickRow[]
}

const buttonLabels: Record<string, string> = {
  'hero-projects': 'Hero — Projects',
  'hero-blog': 'Hero — Blog',
  'hero-social-github': 'Hero — GitHub',
  'hero-social-youtube': 'Hero — YouTube',
  'hero-social-bluesky': 'Hero — Bluesky',
  'hero-social-behance': 'Hero — Behance',
  'carousel-view-more': 'Carousel — View more',
  'blog-section-view-more': 'Blog — View more',
  'notes-section-view-more': 'Notes — View more',
  'subscribe-homepage': 'Newsletter — Homepage',
  'subscribe-blog': 'Newsletter — Blog',
  'subscribe-projects': 'Newsletter — Projects',
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col border-zinc-950/10 border-l px-4 py-3 dark:border-white/10">
      <p className="font-mono font-semibold text-xs text-zinc-600 uppercase tracking-widest dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-4 text-5xl text-zinc-950 tabular-nums tracking-tight dark:text-white">{value}</p>
    </div>
  )
}

export function AnalyticsDashboard({ summary, pageViews, previewClicks, buttonClicks }: Props) {
  return (
    <div className="space-y-24">
      <div className="grid grid-cols-4">
        <StatCard label="Page views" value={summary.total_views} />
        <StatCard label="Pages viewed" value={summary.unique_pages} />
        <StatCard label="Button clicks" value={summary.total_button_clicks} />
        <StatCard label="Preview opens" value={summary.total_preview_clicks} />
      </div>

      <ViewsChart totalViews={summary.total_views} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContentAnalytics pageViews={pageViews} />

        <div className="relative rounded-xl bg-white p-5 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline">
          <h3 className="font-semibold text-sm text-zinc-950 dark:text-white">Button clicks</h3>
          {buttonClicks.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-zinc-400 dark:text-zinc-500">
              No button clicks recorded yet.
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex items-center justify-between border-zinc-100 border-b px-1 py-2 dark:border-zinc-800">
                <span className="font-medium font-mono text-xs text-zinc-500 uppercase tracking-widest">Button</span>
                <span className="font-medium font-mono text-xs text-zinc-500 uppercase tracking-widest">Clicks</span>
              </div>
              {buttonClicks.map((row) => {
                let maxClicks = Math.max(1, ...buttonClicks.map((b) => b.total_clicks))
                let pct = (row.total_clicks / maxClicks) * 100
                return (
                  <div
                    key={row.name}
                    className="relative flex items-center gap-3 border-zinc-100 border-b px-1 py-2.5 dark:border-zinc-800/50"
                  >
                    <div
                      className="absolute inset-y-0 left-0 rounded bg-sky-400/8 dark:bg-sky-400/5"
                      style={{ width: `${pct}%` }}
                    />
                    <span className="relative min-w-0 flex-1 truncate font-medium text-sm text-zinc-700 dark:text-zinc-300">
                      {buttonLabels[row.name] ?? row.name}
                    </span>
                    <span className="relative shrink-0 font-mono text-sm text-zinc-950 tabular-nums dark:text-white">
                      {row.total_clicks}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="relative rounded-xl bg-white p-5 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline">
        <h3 className="font-semibold text-sm text-zinc-950 dark:text-white">Site preview opens</h3>
        {previewClicks.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-zinc-400 dark:text-zinc-500">
            No preview opens recorded yet.
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex items-center justify-between border-zinc-100 border-b px-1 py-2 dark:border-zinc-800">
              <span className="font-medium font-mono text-xs text-zinc-500 uppercase tracking-widest">Page</span>
              <span className="font-medium font-mono text-xs text-zinc-500 uppercase tracking-widest">Opens</span>
            </div>
            {previewClicks.map((row) => {
              let maxClicks = Math.max(1, ...previewClicks.map((p) => p.total_clicks))
              let pct = (row.total_clicks / maxClicks) * 100
              return (
                <div
                  key={row.slug}
                  className="relative flex items-center gap-3 border-zinc-100 border-b px-1 py-2.5 dark:border-zinc-800/50"
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded bg-sky-400/8 dark:bg-sky-400/5"
                    style={{ width: `${pct}%` }}
                  />
                  <span className="relative shrink-0 rounded bg-zinc-950/5 px-1.5 py-0.5 font-mono text-xs text-zinc-700 dark:bg-white/5 dark:text-zinc-300">
                    {row.slug}
                  </span>
                  <span className="relative shrink-0 font-mono text-sm text-zinc-950 tabular-nums dark:text-white">
                    {row.total_clicks}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
