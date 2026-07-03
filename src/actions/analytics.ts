'use server'

import { headers } from 'next/headers'
import { getPageViewsTimeSeries, insertEvent } from '@/lib/db-analytics'

export async function trackEvent(event: {
  event_type: string
  slug?: string
  content_type?: string
  source?: string
  referrer?: string
  url?: string
}) {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  if (host === 'localhost' || host.startsWith('localhost:') || host === '127.0.0.1') {
    return { ok: true }
  }

  if (
    !event.event_type ||
    !['page_view', 'preview_click', 'preview_reload', 'button_click'].includes(event.event_type)
  ) {
    throw new Error('Invalid event_type')
  }

  await insertEvent(event)
  return { ok: true }
}

export async function getPageViewsTimeSeriesAction(from: string, to: string) {
  const fromDate = new Date(from)
  const toDate = new Date(to)

  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
    throw new Error('Invalid date format')
  }

  const data = await getPageViewsTimeSeries(fromDate, toDate)
  return { data }
}
