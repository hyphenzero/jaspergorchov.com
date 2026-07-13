'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function NotesToggle({ defaultValue }: { defaultValue: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const showNotes = (searchParams.get('notes') ?? defaultValue) !== 'hide'

  function handleToggle() {
    const params = new URLSearchParams(searchParams.toString())
    if (showNotes) {
      params.set('notes', 'hide')
    } else {
      params.delete('notes')
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="text-sm font-medium text-zinc-600 transition-colors duration-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
    >
      {showNotes ? 'Hide notes' : 'Show notes'}
    </button>
  )
}
