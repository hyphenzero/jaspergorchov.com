'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { useEditor } from './store'
import { THEME_IDS, type ThemeId } from './types'

const themeNames: Record<ThemeId, string> = {
  jg: 'JG',
  terminal: 'Terminal',
  retro: 'Retro',
  tactile: 'Tactile',
}

type ThemeMenuStyles = {
  trigger: string
  panel: string
  option: string
  chevron: string
}

function getThemeMenuStyles(theme: ThemeId): ThemeMenuStyles {
  if (theme === 'terminal') {
    return {
      trigger: clsx(
        'pointer-events-auto relative flex w-full min-w-28 cursor-pointer items-center justify-between rounded-none border border-green-500 bg-zinc-950 px-3 py-1.5 pr-7 font-medium font-mono text-green-300 text-xs outline-none',
        'data-focus:ring-2 data-focus:ring-green-400 data-focus:ring-offset-2 data-focus:ring-offset-zinc-950',
        'data-open:rounded-b-none data-open:border-b-green-700'
      ),
      panel: clsx(
        'isolate z-20 w-[var(--button-width)] overflow-hidden rounded-none border border-green-500 border-t-0 bg-zinc-950 py-0.5 font-mono shadow-lg outline-none',
        '[--anchor-gap:0px]'
      ),
      option: clsx(
        'group grid cursor-default grid-cols-[1rem_1fr] items-center gap-x-2 px-3 py-1.5 text-green-300 text-xs outline-none',
        'data-selected:bg-green-400 data-selected:text-black',
        'data-focus:bg-green-900 data-focus:text-green-200'
      ),
      chevron: 'size-3.5 stroke-green-400',
    }
  }

  if (theme === 'retro') {
    return {
      trigger: clsx(
        'pointer-events-auto relative flex w-full min-w-28 cursor-pointer items-center justify-between rounded-none border-2 border-black bg-white px-3 py-1.5 pr-7 font-bold font-mono text-black text-xs outline-none dark:border-zinc-300 dark:bg-zinc-500 dark:text-zinc-100',
        'data-focus:ring-2 data-focus:ring-black data-focus:ring-offset-2 dark:data-focus:ring-zinc-300 dark:data-focus:ring-offset-zinc-500',
        'data-open:rounded-b-none data-open:border-b-black dark:data-open:border-b-zinc-300'
      ),
      panel: clsx(
        'isolate z-20 w-[var(--button-width)] overflow-hidden rounded-none border-2 border-black border-t-0 bg-white py-0.5 font-mono shadow-lg outline-none dark:border-zinc-300 dark:bg-zinc-500',
        '[--anchor-gap:0px]'
      ),
      option: clsx(
        'group grid cursor-default grid-cols-[1rem_1fr] items-center gap-x-2 px-3 py-1.5 font-bold text-black text-xs outline-none dark:text-zinc-100',
        'data-selected:bg-black data-selected:text-white dark:data-selected:bg-zinc-200 dark:data-selected:text-zinc-900',
        'data-focus:bg-zinc-100 dark:data-focus:bg-zinc-400'
      ),
      chevron: 'size-3.5 stroke-black dark:stroke-zinc-100',
    }
  }

  if (theme === 'tactile') {
    return {
      trigger: clsx(
        'pointer-events-auto relative flex w-full min-w-28 cursor-pointer items-center justify-between rounded-xl border border-white/15 bg-gradient-to-b from-white/12 to-white/5 px-3 py-1.5 pr-7 font-medium text-xs text-zinc-300 shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_8px_20px_rgb(0_0_0/0.5)] outline-none backdrop-blur-md dark:border-white/15 dark:from-white/10 dark:to-white/5',
        'data-focus:ring-2 data-focus:ring-sky-400/60 data-focus:ring-offset-2 data-focus:ring-offset-zinc-900',
        'data-open:rounded-b-none data-open:border-b-white/10'
      ),
      panel: clsx(
        'isolate z-20 w-[var(--button-width)] overflow-hidden rounded-b-xl border border-white/15 border-t-0 bg-gradient-to-b from-white/12 to-white/5 py-0.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_12px_28px_rgb(0_0_0/0.5)] outline-none backdrop-blur-md dark:border-white/15 dark:from-white/10 dark:to-white/5',
        '[--anchor-gap:0px]'
      ),
      option: clsx(
        'group grid cursor-default grid-cols-[1rem_1fr] items-center gap-x-2 px-3 py-1.5 text-xs text-zinc-400 outline-none',
        'data-selected:bg-gradient-to-b data-selected:from-sky-300 data-selected:to-sky-600 data-selected:text-white data-selected:shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_0_8px_rgb(56_189_248/0.3)]',
        'data-focus:text-white'
      ),
      chevron: 'size-3.5 stroke-zinc-400',
    }
  }

  return {
    trigger: clsx(
      'pointer-events-auto relative flex w-full min-w-28 cursor-pointer items-center justify-between rounded-xl bg-white/90 px-3 py-1.5 pr-7 font-medium text-xs text-zinc-700 shadow-sm outline-none ring-1 ring-zinc-200 backdrop-blur-md dark:bg-zinc-900/90 dark:text-zinc-300 dark:ring-zinc-700',
      'data-focus:ring-2 data-focus:ring-sky-500 data-focus:ring-offset-2 dark:data-focus:ring-offset-zinc-900',
      'data-open:rounded-b-none data-open:border-zinc-200 data-open:border-b dark:data-open:border-zinc-700'
    ),
    panel: clsx(
      'isolate z-20 w-[var(--button-width)] overflow-hidden rounded-b-xl bg-white/90 py-0.5 shadow-lg outline-none ring-1 ring-zinc-200 backdrop-blur-md dark:bg-zinc-900/90 dark:ring-zinc-700',
      '[--anchor-gap:0px]'
    ),
    option: clsx(
      'group grid cursor-default grid-cols-[1rem_1fr] items-center gap-x-2 px-3 py-1.5 text-xs text-zinc-600 outline-none dark:text-zinc-400',
      'data-selected:bg-sky-500 data-selected:text-white',
      'data-focus:bg-zinc-100 data-focus:text-zinc-900 dark:data-focus:bg-zinc-800 dark:data-focus:text-zinc-200'
    ),
    chevron: 'size-3.5 stroke-zinc-500 dark:stroke-zinc-400',
  }
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true" fill="none">
      <path
        d="M5.75 10.75L8 13L10.25 10.75"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M10.25 5.25L8 3L5.75 5.25"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="size-3.5 stroke-current" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 8.5l3 3L12 4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ThemeSwitcher() {
  const { state, dispatch } = useEditor()
  const styles = getThemeMenuStyles(state.theme)

  return (
    <Headless.Listbox value={state.theme} onChange={(theme) => dispatch({ type: 'SET_THEME', theme })}>
      <Headless.ListboxButton aria-label="Theme" className={styles.trigger}>
        {themeNames[state.theme]}
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronIcon className={styles.chevron} />
        </span>
      </Headless.ListboxButton>

      <Headless.ListboxOptions
        transition
        anchor="bottom start"
        className={clsx(
          styles.panel,
          'transition-opacity duration-100 ease-in data-closed:data-leave:opacity-0 data-transition:pointer-events-none'
        )}
      >
        {THEME_IDS.map((themeId) => (
          <Headless.ListboxOption key={themeId} value={themeId} className={styles.option}>
            <span className="invisible flex items-center justify-center group-data-selected:visible">
              <CheckIcon />
            </span>
            <span>{themeNames[themeId]}</span>
          </Headless.ListboxOption>
        ))}
      </Headless.ListboxOptions>
    </Headless.Listbox>
  )
}
