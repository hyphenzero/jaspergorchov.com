'use client'

import { useEditor } from './store'
import { ThemedListbox, ThemedListboxOption } from './themed-listbox'
import { THEME_IDS, type ThemeId } from './types'

const themeNames: Record<ThemeId, string> = {
  jg: 'Jasper Gorchov',
  terminal: 'Terminal',
  retro: 'Retro',
  tactile: 'Tactile',
}

export function ThemeSwitcher() {
  const { state, dispatch } = useEditor()

  return (
    <div className="flex items-center gap-2">
      <span className="text-base/6 text-zinc-950 select-none sm:text-sm/6 dark:text-white">Theme</span>
      <ThemedListbox
        theme={state.theme}
        value={state.theme}
        onChange={(theme) => dispatch({ type: 'SET_THEME', theme })}
        aria-label="Theme"
      >
        {THEME_IDS.map((themeId) => (
          <ThemedListboxOption key={themeId} theme={state.theme} value={themeId}>
            {themeNames[themeId]}
          </ThemedListboxOption>
        ))}
      </ThemedListbox>
    </div>
  )
}
