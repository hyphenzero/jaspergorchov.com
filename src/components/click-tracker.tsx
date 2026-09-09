'use client'

import { trackEvent } from '@/actions/analytics'
import { useEffect } from 'react'

export function ClickTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      let target = e.target as HTMLElement | null
      while (target && target !== document.body) {
        const trackName = target.getAttribute('data-track')
        if (trackName) {
          trackEvent({
            event_type: 'button_click',
            slug: trackName,
            url: window.location.href,
          }).catch(() => {})
          return
        }
        target = target.parentElement
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
