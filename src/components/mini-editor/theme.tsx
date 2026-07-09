'use client'

import { Field, Label } from '@/components/fieldset'
import { useEditor } from './store'
import { ThemedListbox, ThemedListboxOption } from './themed-listbox'
import { THEME_IDS, type ThemeId } from './types'

const themeNames: Record<ThemeId, string> = {
  jg: 'JG',
  terminal: 'Terminal',
  retro: 'Retro',
  tactile: 'Tactile',
}

export function ThemeSwitcher() {
  const { state, dispatch } = useEditor()

  return (
    <Field className="flex items-center gap-2 [&>[data-slot=label]+[data-slot=control]]:mt-0">
      <Label>Theme</Label>
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
    </Field>
  )
}
