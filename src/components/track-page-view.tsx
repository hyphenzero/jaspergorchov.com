'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { trackEvent } from '@/actions/analytics'

function deriveSource(referrer: string): string {
  if (!referrer) return 'direct'
  try {
    const referrerUrl = new URL(referrer)
    const currentHost = typeof window !== 'undefined' ? window.location.host : ''

    if (referrerUrl.host !== currentHost) return 'external'

    const path = referrerUrl.pathname
    if (path === '/' || path.startsWith('/#')) return 'homepage'
    if (path.startsWith('/projects')) return 'projects_page'
    if (path.startsWith('/blog')) return 'blog_page'
    return 'direct'
  } catch {
    return 'direct'
  }
}

export function TrackPageView() {
  const pathname = usePathname()

  useEffect(() => {
    if (document.cookie.includes('admin_logged_in=true')) return

    const parts = pathname.split('/').filter(Boolean)
    if (parts.length < 2) return

    const contentType = parts[0]
    const slug = parts[1]
    const referrer = document.referrer
    const source = deriveSource(referrer)

    trackEvent({
      event_type: 'page_view',
      slug,
      content_type: contentType,
      source,
      referrer: referrer || undefined,
      url: window.location.href,
    }).catch(() => {})
  }, [pathname])

  return null
}
