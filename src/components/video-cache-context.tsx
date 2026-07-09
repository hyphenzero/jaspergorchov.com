'use client'

import { createContext, useCallback, useContext, useRef } from 'react'

const STORAGE_KEY = 'vc'

function getToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function loadCache(): Map<string, string> {
  if (typeof window === 'undefined') return new Map()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Map()
    const parsed: { date?: string; urls?: Record<string, string> } = JSON.parse(raw)
    if (parsed.date !== getToday()) {
      localStorage.removeItem(STORAGE_KEY)
      return new Map()
    }
    return new Map(Object.entries(parsed.urls ?? {}))
  } catch {
    return new Map()
  }
}

function persistCache(cache: Map<string, string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getToday(), urls: Object.fromEntries(cache) }))
  } catch {
    /* storage full or unavailable */
  }
}

type VideoCacheContextValue = {
  getBlobUrl(originalUrl: string): string | null
  preload(originalUrl: string): Promise<string | null>
}

const VideoCacheContext = createContext<VideoCacheContextValue>({
  getBlobUrl: () => null,
  preload: async () => null,
})

export function VideoCacheProvider({ children }: { children: React.ReactNode }) {
  const cacheRef = useRef<Map<string, string>>(loadCache())
  const pendingRef = useRef<Map<string, Promise<string | null>>>(new Map())

  const getBlobUrl = useCallback((originalUrl: string): string | null => {
    return cacheRef.current.get(originalUrl) ?? null
  }, [])

  const preload = useCallback(async (originalUrl: string): Promise<string | null> => {
    const existing = cacheRef.current.get(originalUrl)
    if (existing) return existing

    const pending = pendingRef.current.get(originalUrl)
    if (pending) return pending

    const promise = (async () => {
      try {
        const res = await fetch(originalUrl)
        if (!res.ok) return null
        const blob = await res.blob()
        const blobUrl = URL.createObjectURL(blob)
        cacheRef.current.set(originalUrl, blobUrl)
        persistCache(cacheRef.current)
        pendingRef.current.delete(originalUrl)
        return blobUrl
      } catch {
        pendingRef.current.delete(originalUrl)
        return null
      }
    })()

    pendingRef.current.set(originalUrl, promise)
    return promise
  }, [])

  return <VideoCacheContext.Provider value={{ getBlobUrl, preload }}>{children}</VideoCacheContext.Provider>
}

export function useVideoCache() {
  return useContext(VideoCacheContext)
}
