'use client'

import { trackEvent } from '@/actions/analytics'
import { ArrowPathIcon, ArrowUpRightIcon } from '@heroicons/react/16/solid'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo, useRef, useState } from 'react'

export function SitePreview({ siteUrl }: { siteUrl: string }) {
  const url = useMemo(() => {
    try {
      return new URL(siteUrl)
    } catch {
      return null
    }
  }, [siteUrl])

  const pathname = usePathname()
  const slug = pathname.split('/').pop() ?? ''
  const contentType = pathname.startsWith('/blog') ? 'blog' : 'project'

  const [currentUrl, setCurrentUrl] = useState(siteUrl)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const trackPreviewEvent = useCallback(
    (eventType: 'preview_click' | 'preview_reload') => {
      trackEvent({
        event_type: eventType,
        slug,
        content_type: contentType,
        url: currentUrl,
      }).catch(() => {})
    },
    [slug, contentType, currentUrl]
  )

  const reload = useCallback(() => {
    const iframe = iframeRef.current
    if (iframe) {
      iframe.src = currentUrl
    }
    trackPreviewEvent('preview_reload')
  }, [currentUrl, trackPreviewEvent])

  const handleLoad = useCallback(() => {
    try {
      const href = iframeRef.current?.contentWindow?.location?.href
      if (href) {
        setCurrentUrl(href)
      }
    } catch {
      // Cross-origin iframe — can't read location
    }
  }, [])

  if (!url) return null

  const displayUrl = (() => {
    try {
      const u = new URL(currentUrl)
      return {
        host: u.host,
        path: u.pathname.replace(/\/$/, '') + u.search + u.hash,
      }
    } catch {
      return { host: url.host, path: url.pathname.replace(/\/$/, '') + url.search + url.hash }
    }
  })()

  return (
    <div data-media className="not-prose">
      <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-900/50">
        <div className="flex items-center justify-between p-2.5 text-xs/5">
          <span className="ml-2 truncate">
            <span className="text-zinc-950 dark:text-white">{displayUrl.host}</span>
            {displayUrl.path && <span className="text-zinc-600 dark:text-zinc-400">{displayUrl.path}</span>}
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={reload}
              className="shrink-0 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-200/50 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-zinc-300"
              aria-label="Reload preview"
            >
              <ArrowPathIcon className="size-4" />
            </button>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackPreviewEvent('preview_click')}
              className="shrink-0 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-200/50 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-white/5 dark:hover:text-zinc-300"
              aria-label={`Open ${currentUrl} in a new tab`}
            >
              <ArrowUpRightIcon className="size-4" />
            </a>
          </div>
        </div>
        <div className="px-1.25 pb-1.25 dark:px-1 dark:pb-1">
          <div className="relative overflow-hidden rounded-xl not-dark:shadow-sm not-dark:ring-1 not-dark:ring-zinc-950/7.5">
            <div className="pointer-events-none absolute inset-0 z-10 rounded-xl ring-1 ring-inset not-dark:hidden dark:ring-white/10" />
            <iframe
              ref={iframeRef}
              src={siteUrl}
              className="block aspect-16/10 h-auto w-full"
              loading="lazy"
              title={`Preview of ${siteUrl}`}
              sandbox="allow-scripts allow-forms"
              onLoad={handleLoad}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
