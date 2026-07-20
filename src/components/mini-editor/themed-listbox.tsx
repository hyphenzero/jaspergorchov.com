'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'
import type { ThemeId } from './types'

// ─── Jasper Gorchov theme (exact replica of src/components/listbox.tsx) ───────────

function JgButton({
  children,
  ...props
}: { children?: React.ReactNode } & Omit<Headless.ListboxButtonProps, 'as' | 'className'>) {
  return (
    <Headless.ListboxButton
      {...props}
      data-slot="control"
      className={clsx(
        'group relative block w-full',
        'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm',
        'dark:before:hidden',
        'focus:outline-hidden',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset data-focus:after:ring-2 data-focus:after:ring-blue-500',
        'data-disabled:opacity-50 data-disabled:before:bg-zinc-950/5 data-disabled:before:shadow-none'
      )}
    >
      {children}
    </Headless.ListboxButton>
  )
}

function JgSelectedOption({ placeholder, options }: { placeholder?: React.ReactNode; options?: React.ReactNode }) {
  return (
    <Headless.ListboxSelectedOption
      as="span"
      options={options}
      placeholder={placeholder && <span className="block truncate text-zinc-500">{placeholder}</span>}
      className={clsx(
        'relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
        'min-h-11 sm:min-h-9',
        'pr-[calc(--spacing(7)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pl-[calc(--spacing(3)-1px)]',
        'text-left text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]',
        'border border-zinc-950/10 group-data-active:border-zinc-950/20 group-data-hover:border-zinc-950/20 dark:border-white/10 dark:group-data-active:border-white/20 dark:group-data-hover:border-white/20',
        'bg-transparent dark:bg-white/5',
        'group-data-disabled:border-zinc-950/20 group-data-disabled:opacity-100 dark:group-data-disabled:border-white/15 dark:group-data-disabled:bg-white/2.5 dark:group-data-disabled:data-hover:border-white/15'
      )}
    />
  )
}

function JgChevron() {
  return (
    <svg
      className="size-5 stroke-zinc-500 group-data-disabled:stroke-zinc-600 sm:size-4 dark:stroke-zinc-400 forced-colors:stroke-[CanvasText]"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
    >
      <path d="M5.75 10.75L8 13L10.25 10.75" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.25 5.25L8 3L5.75 5.25" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function JgPanel({ children }: { children?: React.ReactNode }) {
  return (
    <Headless.ListboxOptions
      transition
      anchor="selection start"
      className={clsx(
        '[--anchor-offset:-1.625rem] [--anchor-padding:--spacing(4)] sm:[--anchor-offset:-1.375rem]',
        'isolate w-max min-w-[calc(var(--button-width)+1.75rem)] scroll-py-1 rounded-xl p-1 select-none',
        'outline outline-transparent focus:outline-hidden',
        'overflow-y-scroll overscroll-contain',
        'bg-white/75 backdrop-blur-xl dark:bg-zinc-800/75',
        'shadow-lg ring-1 ring-zinc-950/10 dark:ring-white/10 dark:ring-inset',
        'transition-opacity duration-100 ease-in data-closed:data-leave:opacity-0 data-transition:pointer-events-none'
      )}
    >
      {children}
    </Headless.ListboxOptions>
  )
}

function JgOption<T>({
  children,
  className,
  ...props
}: { className?: string; children?: React.ReactNode } & Omit<
  Headless.ListboxOptionProps<'div', T>,
  'as' | 'className'
>) {
  let sharedClasses = clsx(
    'flex min-w-0 items-center',
    '*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 sm:*:data-[slot=icon]:size-4',
    '*:data-[slot=icon]:text-zinc-500 group-data-focus/option:*:data-[slot=icon]:text-white dark:*:data-[slot=icon]:text-zinc-400',
    'forced-colors:*:data-[slot=icon]:text-[CanvasText] forced-colors:group-data-focus/option:*:data-[slot=icon]:text-[Canvas]',
    '*:data-[slot=avatar]:-mx-0.5 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:size-5'
  )

  return (
    <Headless.ListboxOption as={Fragment} {...props}>
      {({ selectedOption }) => {
        if (selectedOption) {
          return <div className={clsx(className, sharedClasses)}>{children}</div>
        }
        return (
          <div
            className={clsx(
              'group/option grid cursor-default grid-cols-[--spacing(5)_1fr] items-baseline gap-x-2 rounded-lg py-2.5 pr-3.5 pl-2 sm:grid-cols-[--spacing(4)_1fr] sm:py-1.5 sm:pr-3 sm:pl-1.5',
              'text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]',
              'outline-hidden data-focus:bg-blue-500 data-focus:text-white',
              'forced-color-adjust-none forced-colors:data-focus:bg-[Highlight] forced-colors:data-focus:text-[HighlightText]',
              'data-disabled:opacity-50'
            )}
          >
            <svg
              className="relative hidden size-5 self-center stroke-current group-data-selected/option:inline sm:size-4"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 8.5l3 3L12 4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={clsx(className, sharedClasses, 'col-start-2')}>{children}</span>
          </div>
        )
      }}
    </Headless.ListboxOption>
  )
}

// ─── Terminal theme ───────────────────────────────────────────────────────────

function TerminalButton({
  children,
  ...props
}: { children?: React.ReactNode } & Omit<Headless.ListboxButtonProps, 'as' | 'className'>) {
  return (
    <Headless.ListboxButton
      {...props}
      data-slot="control"
      className={clsx(
        'group relative block w-full',
        'focus:outline-hidden',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-none after:ring-transparent after:ring-inset data-focus:after:ring-2 data-focus:after:ring-green-400 data-focus:after:ring-offset-2 data-focus:after:ring-offset-zinc-950',
        'data-disabled:opacity-50'
      )}
    >
      {children}
    </Headless.ListboxButton>
  )
}

function TerminalSelectedOption({
  placeholder,
  options,
}: {
  placeholder?: React.ReactNode
  options?: React.ReactNode
}) {
  return (
    <Headless.ListboxSelectedOption
      as="span"
      options={options}
      placeholder={placeholder && <span className="block truncate text-green-500">{placeholder}</span>}
      className={clsx(
        'relative block w-full appearance-none rounded-none py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
        'min-h-11 sm:min-h-9',
        'pr-[calc(--spacing(7)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pl-[calc(--spacing(3)-1px)]',
        'text-left font-mono text-base/6 text-green-300 sm:text-sm/6',
        'border border-green-500 group-data-active:border-green-400 group-data-hover:border-green-400',
        'bg-zinc-950',
        'group-data-disabled:border-green-800 group-data-disabled:opacity-50'
      )}
    />
  )
}

function TerminalChevron() {
  return (
    <svg
      className="size-5 stroke-green-400 group-data-disabled:stroke-green-700 sm:size-4"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
    >
      <path d="M5.75 10.75L8 13L10.25 10.75" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.25 5.25L8 3L5.75 5.25" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TerminalPanel({ children }: { children?: React.ReactNode }) {
  return (
    <Headless.ListboxOptions
      transition
      anchor="selection start"
      className={clsx(
        '[--anchor-offset:-1.625rem] [--anchor-padding:--spacing(4)] sm:[--anchor-offset:-1.375rem]',
        'isolate w-max min-w-[calc(var(--button-width)+1.75rem)] scroll-py-1 rounded-none p-0.5 font-mono select-none',
        'outline outline-transparent focus:outline-hidden',
        'overflow-y-scroll overscroll-contain',
        'bg-zinc-950',
        'shadow-lg ring-1 ring-green-500',
        'transition-opacity duration-100 ease-in data-closed:data-leave:opacity-0 data-transition:pointer-events-none'
      )}
    >
      {children}
    </Headless.ListboxOptions>
  )
}

function TerminalOption<T>({
  children,
  className,
  ...props
}: { className?: string; children?: React.ReactNode } & Omit<
  Headless.ListboxOptionProps<'div', T>,
  'as' | 'className'
>) {
  return (
    <Headless.ListboxOption as={Fragment} {...props}>
      {({ selectedOption }) => {
        if (selectedOption) {
          return <div className={clsx(className, 'flex min-w-0 items-center')}>{children}</div>
        }
        return (
          <div
            className={clsx(
              'group/option grid cursor-default grid-cols-[--spacing(5)_1fr] items-baseline gap-x-2 rounded-none py-2.5 pr-3.5 pl-2 sm:grid-cols-[--spacing(4)_1fr] sm:py-1.5 sm:pr-3 sm:pl-1.5',
              'font-mono text-base/6 text-green-300 sm:text-sm/6',
              'outline-hidden data-focus:bg-green-900 data-focus:text-green-200',
              'data-disabled:opacity-50',
              'data-selected:bg-green-400 data-selected:text-black'
            )}
          >
            <svg
              className="relative hidden size-5 self-center stroke-current group-data-selected/option:inline sm:size-4"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 8.5l3 3L12 4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={clsx(className, 'col-start-2 flex min-w-0 items-center')}>{children}</span>
          </div>
        )
      }}
    </Headless.ListboxOption>
  )
}

// ─── Retro theme ──────────────────────────────────────────────────────────────

function RetroButton({
  children,
  ...props
}: { children?: React.ReactNode } & Omit<Headless.ListboxButtonProps, 'as' | 'className'>) {
  return (
    <Headless.ListboxButton
      {...props}
      data-slot="control"
      className={clsx(
        'group relative block w-full',
        'focus:outline-hidden',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-none after:ring-transparent after:ring-inset data-focus:after:ring-2 data-focus:after:ring-black data-focus:after:ring-offset-2 data-focus:after:ring-offset-white dark:data-focus:after:ring-zinc-300 dark:data-focus:after:ring-offset-zinc-500',
        'data-disabled:opacity-50'
      )}
    >
      {children}
    </Headless.ListboxButton>
  )
}

function RetroSelectedOption({ placeholder, options }: { placeholder?: React.ReactNode; options?: React.ReactNode }) {
  return (
    <Headless.ListboxSelectedOption
      as="span"
      options={options}
      placeholder={
        placeholder && <span className="block truncate text-zinc-400 dark:text-zinc-400">{placeholder}</span>
      }
      className={clsx(
        'relative block w-full appearance-none rounded-none py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
        'min-h-11 sm:min-h-9',
        'pr-[calc(--spacing(7)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pl-[calc(--spacing(3)-1px)]',
        'text-left font-mono text-base/6 font-bold text-black sm:text-sm/6 dark:text-zinc-100',
        'border-2 border-black group-data-active:border-black group-data-hover:border-black dark:border-zinc-300 dark:group-data-active:border-zinc-300 dark:group-data-hover:border-zinc-300',
        'bg-white dark:bg-zinc-500',
        'group-data-disabled:border-zinc-400 group-data-disabled:opacity-50 dark:group-data-disabled:border-zinc-600'
      )}
    />
  )
}

function RetroChevron() {
  return (
    <svg
      className="size-5 stroke-black group-data-disabled:stroke-zinc-400 sm:size-4 dark:stroke-zinc-100 dark:group-data-disabled:stroke-zinc-400"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
    >
      <path d="M5.75 10.75L8 13L10.25 10.75" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.25 5.25L8 3L5.75 5.25" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RetroPanel({ children }: { children?: React.ReactNode }) {
  return (
    <Headless.ListboxOptions
      transition
      anchor="selection start"
      className={clsx(
        '[--anchor-offset:-1.625rem] [--anchor-padding:--spacing(4)] sm:[--anchor-offset:-1.375rem]',
        'isolate w-max min-w-[calc(var(--button-width)+1.75rem)] scroll-py-1 rounded-none p-0.5 font-mono select-none',
        'outline outline-transparent focus:outline-hidden',
        'overflow-y-scroll overscroll-contain',
        'bg-white dark:bg-zinc-500',
        'shadow-lg ring-2 ring-black dark:ring-zinc-300',
        'transition-opacity duration-100 ease-in data-closed:data-leave:opacity-0 data-transition:pointer-events-none'
      )}
    >
      {children}
    </Headless.ListboxOptions>
  )
}

function RetroOption<T>({
  children,
  className,
  ...props
}: { className?: string; children?: React.ReactNode } & Omit<
  Headless.ListboxOptionProps<'div', T>,
  'as' | 'className'
>) {
  return (
    <Headless.ListboxOption as={Fragment} {...props}>
      {({ selectedOption }) => {
        if (selectedOption) {
          return <div className={clsx(className, 'flex min-w-0 items-center')}>{children}</div>
        }
        return (
          <div
            className={clsx(
              'group/option grid cursor-default grid-cols-[--spacing(5)_1fr] items-baseline gap-x-2 rounded-none py-2.5 pr-3.5 pl-2 sm:grid-cols-[--spacing(4)_1fr] sm:py-1.5 sm:pr-3 sm:pl-1.5',
              'font-mono text-base/6 font-bold text-black sm:text-sm/6 dark:text-zinc-100',
              'outline-hidden data-focus:bg-zinc-100 dark:data-focus:bg-zinc-400',
              'data-disabled:opacity-50',
              'data-selected:bg-black data-selected:text-white dark:data-selected:bg-zinc-200 dark:data-selected:text-zinc-900'
            )}
          >
            <svg
              className="relative hidden size-5 self-center stroke-current group-data-selected/option:inline sm:size-4"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 8.5l3 3L12 4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={clsx(className, 'col-start-2 flex min-w-0 items-center')}>{children}</span>
          </div>
        )
      }}
    </Headless.ListboxOption>
  )
}

// ─── Tactile theme ────────────────────────────────────────────────────────────

function TactileButton({
  children,
  ...props
}: { children?: React.ReactNode } & Omit<Headless.ListboxButtonProps, 'as' | 'className'>) {
  return (
    <Headless.ListboxButton
      {...props}
      data-slot="control"
      className={clsx(
        'group relative block w-full',
        'focus:outline-hidden',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-xl after:ring-transparent after:ring-inset data-focus:after:ring-2 data-focus:after:ring-sky-400/60 data-focus:after:ring-offset-2 data-focus:after:ring-offset-zinc-900',
        'data-disabled:opacity-50'
      )}
    >
      {children}
    </Headless.ListboxButton>
  )
}

function TactileSelectedOption({ placeholder, options }: { placeholder?: React.ReactNode; options?: React.ReactNode }) {
  return (
    <Headless.ListboxSelectedOption
      as="span"
      options={options}
      placeholder={placeholder && <span className="block truncate text-zinc-500">{placeholder}</span>}
      className={clsx(
        'relative block w-full appearance-none rounded-xl py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
        'min-h-11 sm:min-h-9',
        'pr-[calc(--spacing(7)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pl-[calc(--spacing(3)-1px)]',
        'text-left text-base/6 text-zinc-300 sm:text-sm/6',
        'border border-white/15 group-data-active:border-white/20 group-data-hover:border-white/20',
        'bg-linear-to-b from-white/12 to-white/5 dark:from-white/10 dark:to-white/5',
        'shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_8px_20px_rgb(0_0_0/0.5)] backdrop-blur-md',
        'group-data-disabled:opacity-50'
      )}
    />
  )
}

function TactileChevron() {
  return (
    <svg
      className="size-5 stroke-zinc-400 group-data-disabled:stroke-zinc-600 sm:size-4"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
    >
      <path d="M5.75 10.75L8 13L10.25 10.75" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.25 5.25L8 3L5.75 5.25" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TactilePanel({ children }: { children?: React.ReactNode }) {
  return (
    <Headless.ListboxOptions
      transition
      anchor="selection start"
      className={clsx(
        '[--anchor-offset:-1.625rem] [--anchor-padding:--spacing(4)] sm:[--anchor-offset:-1.375rem]',
        'isolate w-max min-w-[calc(var(--button-width)+1.75rem)] scroll-py-1 rounded-b-xl p-0.5 select-none',
        'outline outline-transparent focus:outline-hidden',
        'overflow-y-scroll overscroll-contain',
        'bg-linear-to-b from-white/12 to-white/5 backdrop-blur-md dark:from-white/10 dark:to-white/5',
        'shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_12px_28px_rgb(0_0_0/0.5)] ring-1 ring-white/15',
        'transition-opacity duration-100 ease-in data-closed:data-leave:opacity-0 data-transition:pointer-events-none'
      )}
    >
      {children}
    </Headless.ListboxOptions>
  )
}

function TactileOption<T>({
  children,
  className,
  ...props
}: { className?: string; children?: React.ReactNode } & Omit<
  Headless.ListboxOptionProps<'div', T>,
  'as' | 'className'
>) {
  return (
    <Headless.ListboxOption as={Fragment} {...props}>
      {({ selectedOption }) => {
        if (selectedOption) {
          return <div className={clsx(className, 'flex min-w-0 items-center')}>{children}</div>
        }
        return (
          <div
            className={clsx(
              'group/option grid cursor-default grid-cols-[--spacing(5)_1fr] items-baseline gap-x-2 rounded-lg py-2.5 pr-3.5 pl-2 sm:grid-cols-[--spacing(4)_1fr] sm:py-1.5 sm:pr-3 sm:pl-1.5',
              'text-base/6 text-zinc-400 sm:text-sm/6',
              'outline-hidden data-focus:text-white',
              'data-disabled:opacity-50',
              'data-selected:bg-linear-to-b data-selected:from-sky-300 data-selected:to-sky-600 data-selected:text-white data-selected:shadow-[inset_0_1px_0_rgb(255_255_255/0.5),0_0_8px_rgb(56_189_248/0.3)]'
            )}
          >
            <svg
              className="relative hidden size-5 self-center stroke-current group-data-selected/option:inline sm:size-4"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 8.5l3 3L12 4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={clsx(className, 'col-start-2 flex min-w-0 items-center')}>{children}</span>
          </div>
        )
      }}
    </Headless.ListboxOption>
  )
}

// ─── Listbox container props ──────────────────────────────────────────────────

type ThemedListboxProps<T> = {
  theme: ThemeId
  className?: string
  placeholder?: React.ReactNode
  autoFocus?: boolean
  'aria-label'?: string
  children?: React.ReactNode
  value?: T
  onChange?: (value: T) => void
  name?: string
  disabled?: boolean
}

// ─── Exported components ──────────────────────────────────────────────────────

export function ThemedListbox<T>({
  theme,
  className,
  placeholder,
  autoFocus,
  'aria-label': ariaLabel,
  children: options,
  value,
  onChange,
  name,
  disabled,
}: ThemedListboxProps<T>) {
  if (theme === 'terminal') {
    return (
      <Headless.Listbox value={value} onChange={onChange} name={name} disabled={disabled} multiple={false}>
        <TerminalButton autoFocus={autoFocus} aria-label={ariaLabel}>
          <TerminalSelectedOption placeholder={placeholder} options={options} />
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <TerminalChevron />
          </span>
        </TerminalButton>
        <TerminalPanel>{options}</TerminalPanel>
      </Headless.Listbox>
    )
  }

  if (theme === 'retro') {
    return (
      <Headless.Listbox value={value} onChange={onChange} name={name} disabled={disabled} multiple={false}>
        <RetroButton autoFocus={autoFocus} aria-label={ariaLabel}>
          <RetroSelectedOption placeholder={placeholder} options={options} />
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <RetroChevron />
          </span>
        </RetroButton>
        <RetroPanel>{options}</RetroPanel>
      </Headless.Listbox>
    )
  }

  if (theme === 'tactile') {
    return (
      <Headless.Listbox value={value} onChange={onChange} name={name} disabled={disabled} multiple={false}>
        <TactileButton autoFocus={autoFocus} aria-label={ariaLabel}>
          <TactileSelectedOption placeholder={placeholder} options={options} />
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <TactileChevron />
          </span>
        </TactileButton>
        <TactilePanel>{options}</TactilePanel>
      </Headless.Listbox>
    )
  }

  return (
    <Headless.Listbox value={value} onChange={onChange} name={name} disabled={disabled} multiple={false}>
      <JgButton autoFocus={autoFocus} aria-label={ariaLabel}>
        <JgSelectedOption placeholder={placeholder} options={options} />
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <JgChevron />
        </span>
      </JgButton>
      <JgPanel>{options}</JgPanel>
    </Headless.Listbox>
  )
}

export function ThemedListboxOption<T>({
  theme,
  ...props
}: { theme: ThemeId; className?: string; children?: React.ReactNode } & Omit<
  Headless.ListboxOptionProps<'div', T>,
  'as' | 'className'
>) {
  if (theme === 'terminal') return <TerminalOption {...props} />
  if (theme === 'retro') return <RetroOption {...props} />
  if (theme === 'tactile') return <TactileOption {...props} />
  return <JgOption {...props} />
}
