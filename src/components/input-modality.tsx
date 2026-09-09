'use client'

import { useEffect } from 'react'

// Tracks the user's input modality on <html data-mouse> so focus rings can
// be hidden for mouse/touch users while always showing for keyboard users.
// This works even in browsers that match :focus-visible on mouse click.
export function InputModality() {
  useEffect(() => {
    const onPointerDown = () => {
      document.documentElement.dataset.mouse = 'true'
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' || event.key.startsWith('Arrow')) {
        delete document.documentElement.dataset.mouse
      }
    }
    window.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true })
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, { capture: true } as AddEventListenerOptions)
      window.removeEventListener('keydown', onKeyDown, { capture: true } as AddEventListenerOptions)
    }
  }, [])

  return null
}
