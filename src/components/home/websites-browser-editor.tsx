'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import { Logo } from '@/components/logo'
import { Canvas } from '@/components/mini-editor/canvas'
import { EditorProvider } from '@/components/mini-editor/store'
import { BottomToolbar } from '@/components/mini-editor/toolbar'

// Realistic browser chrome + simplified canvas (fixed theme, no ThemeSwitcher)
function BrowserCanvasInner() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-950">
      {/* Browser header — tabs + back/forward + URL bar only */}
      <div className="flex items-center gap-3 border-b border-zinc-200 px-3 py-2.5 sm:px-4 dark:border-zinc-900">
        {/* Traffic lights */}
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="size-3 rounded-full bg-red-400 ring-1 ring-inset ring-zinc-950/5 dark:ring-white/5" />
          <span className="size-3 rounded-full bg-yellow-400 ring-1 ring-inset ring-zinc-950/5 dark:ring-white/5" />
          <span className="size-3 rounded-full bg-green-400 ring-1 ring-inset ring-zinc-950/5 dark:ring-white/5" />
        </div>

        {/* Back / forward */}
        <div className="hidden items-center gap-1 sm:flex">
            <ChevronLeftIcon className="size-4 text-zinc-500" />
          
            <ChevronRightIcon className="size-4 text-zinc-500" />
        </div>

        {/* URL bar — only other UI */}
        <div className="mx-auto ml-1 px-8 flex min-w-0 items-center gap-2 rounded-full bg-white py-1.5 text-xs text-zinc-500 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-white/10 sm:ml-2">
          <Logo className="h-2.5 w-auto shrink-0 text-zinc-400" />
          <span className="hidden truncate sm:inline">jaspergorchov.com</span>
        </div>
      </div>

      {/* Canvas area — same bg, no extra chrome */}
      <div className="relative flex-1" style={{ aspectRatio: '16/8.5' }}>
        <div className="absolute inset-0 [&>div]:rounded-none! [&>div]:bg-transparent! [&>div]:shadow-none! [&>div]:ring-0! [&>div]:before:hidden!">
          <Canvas />
        </div>
        {/* Bottom toolbar overlay — stays performant (pointer events only on toolbar) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3">
          <div className="pointer-events-auto">
            <BottomToolbar />
          </div>
        </div>
      </div>
    </div>
  )
}

export function WebsitesBrowserEditor() {
  return (
    <EditorProvider initialTheme="jg">
      <BrowserCanvasInner />
    </EditorProvider>
  )
}
