'use client'

import { ThemeIcon } from './icons'
import { useEditor } from './store'
import { THEME_IDS, type ThemeId } from './types'

const themeNames: Record<ThemeId, string> = {
  jg: 'JG',
  terminal: 'Terminal',
  retro: 'Retro',
  tactile: 'Tactile',
}

function switcherClassName(theme: ThemeId) {
  if (theme === 'terminal') {
    return 'flex items-center gap-1.5 rounded-none border border-green-500 bg-zinc-950 px-3 py-1.5 font-mono font-medium text-green-300 text-xs'
  }

  if (theme === 'retro') {
    return 'flex items-center gap-1.5 rounded-none border-2 border-black bg-white px-3 py-1.5 font-mono font-bold text-xs text-black dark:border-zinc-300 dark:bg-zinc-500 dark:text-zinc-100'
  }

  if (theme === 'tactile') {
    return 'flex items-center gap-1.5 rounded-full border border-white/70 bg-gradient-to-b from-white to-zinc-200 px-3 py-1.5 font-medium text-xs text-zinc-600 shadow-[inset_0_1px_0_rgb(255_255_255),0_8px_18px_rgb(24_24_27/0.18)] transition-colors hover:text-zinc-950 dark:border-white/10 dark:from-zinc-700 dark:to-zinc-900 dark:text-zinc-200 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_18px_rgb(0_0_0/0.38)]'
  }

  return 'flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 font-medium text-xs text-zinc-500 shadow-sm ring-1 ring-zinc-200 backdrop-blur-md transition-colors hover:text-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-400 dark:ring-zinc-700 dark:hover:text-zinc-200'
}

export function ThemeSwitcher() {
  const { state, dispatch } = useEditor()

  return (
    <label className={switcherClassName(state.theme)} title="Switch theme">
      <ThemeIcon size={14} />
      <span className="sr-only">Theme</span>
      <select
        aria-label="Theme"
        value={state.theme}
        onChange={(event) => dispatch({ type: 'SET_THEME', theme: event.target.value as ThemeId })}
        className="cursor-pointer appearance-none bg-transparent pr-4 outline-none"
      >
        {THEME_IDS.map((themeId) => (
          <option key={themeId} value={themeId}>
            {themeNames[themeId]}
          </option>
        ))}
      </select>
      <span className="-ml-3 pointer-events-none text-[10px]">v</span>
    </label>
  )
}
