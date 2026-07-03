import { getPool } from './db'

export interface AnalyticsEvent {
  id: number
  event_type: string
  slug: string | null
  content_type: string | null
  source: string | null
  referrer: string | null
  url: string | null
  created_at: string
}

export async function insertEvent(event: {
  event_type: string
  slug?: string
  content_type?: string
  source?: string
  referrer?: string
  url?: string
}): Promise<void> {
  const pool = getPool()
  await pool.query(
    `INSERT INTO analytics_events (event_type, slug, content_type, source, referrer, url) VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      event.event_type,
      event.slug ?? null,
      event.content_type ?? null,
      event.source ?? null,
      event.referrer ?? null,
      event.url ?? null,
    ]
  )
}

export interface PageViewRow {
  slug: string
  content_type: string
  total_views: number
  source_breakdown: { source: string; count: number }[]
}

export async function getPageViews(): Promise<PageViewRow[]> {
  const pool = getPool()

  const { rows: totals } = await pool.query<{ slug: string; content_type: string; total_views: number }>(
    `SELECT slug, content_type, COUNT(*)::int AS total_views
     FROM analytics_events
     WHERE event_type = 'page_view' AND slug IS NOT NULL
     GROUP BY slug, content_type
     ORDER BY total_views DESC`
  )

  const result: PageViewRow[] = []
  for (const row of totals) {
    const { rows: sources } = await pool.query<{ source: string; count: number }>(
      `SELECT COALESCE(source, 'direct') AS source, COUNT(*)::int AS count
       FROM analytics_events
       WHERE event_type = 'page_view' AND slug = $1 AND content_type = $2
       GROUP BY source
       ORDER BY count DESC`,
      [row.slug, row.content_type]
    )
    result.push({
      slug: row.slug,
      content_type: row.content_type,
      total_views: row.total_views,
      source_breakdown: sources,
    })
  }

  return result
}

export interface PreviewClickRow {
  slug: string
  total_clicks: number
}

export async function getPreviewClicks(): Promise<PreviewClickRow[]> {
  const pool = getPool()

  const { rows } = await pool.query<{ slug: string; total_clicks: number }>(
    `SELECT slug, COUNT(*)::int AS total_clicks
     FROM analytics_events
     WHERE event_type = 'preview_click' AND slug IS NOT NULL
     GROUP BY slug
     ORDER BY total_clicks DESC`
  )

  return rows
}

export interface ButtonClickRow {
  name: string
  total_clicks: number
}

export async function getButtonClicks(): Promise<ButtonClickRow[]> {
  const pool = getPool()

  const { rows } = await pool.query<{ name: string; total_clicks: number }>(
    `SELECT slug AS name, COUNT(*)::int AS total_clicks
     FROM analytics_events
     WHERE event_type = 'button_click' AND slug IS NOT NULL
     GROUP BY slug
     ORDER BY total_clicks DESC`
  )

  return rows
}

export interface AnalyticsSummary {
  total_views: number
  total_preview_clicks: number
  unique_pages: number
  total_reloads: number
  total_button_clicks: number
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const pool = getPool()

  const { rows: viewCount } = await pool.query<{ count: number }>(
    `SELECT COUNT(*)::int FROM analytics_events WHERE event_type = 'page_view'`
  )
  const { rows: clickCount } = await pool.query<{ count: number }>(
    `SELECT COUNT(*)::int FROM analytics_events WHERE event_type = 'preview_click'`
  )
  const { rows: reloadCount } = await pool.query<{ count: number }>(
    `SELECT COUNT(*)::int FROM analytics_events WHERE event_type = 'preview_reload'`
  )
  const { rows: uniquePages } = await pool.query<{ count: number }>(
    `SELECT COUNT(DISTINCT slug)::int FROM analytics_events WHERE event_type = 'page_view' AND slug IS NOT NULL`
  )
  const { rows: buttonCount } = await pool.query<{ count: number }>(
    `SELECT COUNT(*)::int FROM analytics_events WHERE event_type = 'button_click'`
  )

  return {
    total_views: viewCount[0]?.count ?? 0,
    total_preview_clicks: clickCount[0]?.count ?? 0,
    unique_pages: uniquePages[0]?.count ?? 0,
    total_reloads: reloadCount[0]?.count ?? 0,
    total_button_clicks: buttonCount[0]?.count ?? 0,
  }
}

export interface TimeSeriesBucket {
  date: string
  count: number
}

export async function getPageViewsTimeSeries(from: Date, to: Date): Promise<TimeSeriesBucket[]> {
  const pool = getPool()

  const { rows } = await pool.query<{ date: string; count: number }>(
    `SELECT date_trunc('day', created_at)::date AS date, COUNT(*)::int AS count
     FROM analytics_events
     WHERE event_type = 'page_view'
       AND created_at >= $1
       AND created_at < $2
     GROUP BY date
     ORDER BY date`,
    [from.toISOString(), to.toISOString()]
  )

  return rows
}

export async function getAllAnalytics() {
  const [summary, pageViews, previewClicks, buttonClicks] = await Promise.all([
    getAnalyticsSummary(),
    getPageViews(),
    getPreviewClicks(),
    getButtonClicks(),
  ])
  return { summary, pageViews, previewClicks, buttonClicks }
}
