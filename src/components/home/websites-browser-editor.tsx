'use client'

import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import { Logo } from '@/components/logo'
import { Canvas } from '@/components/mini-editor/canvas'
import { EditorProvider } from '@/components/mini-editor/store'
import { BottomToolbar } from '@/components/mini-editor/toolbar'

function BrowserCanvasInner() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white/30 shadow-lg ring-1 ring-zinc-950/5 backdrop-blur-xl dark:bg-transparent dark:ring-white/10">
      <div className="relative flex items-center gap-3 px-3 py-2.5 sm:px-4">
        {/* Traffic lights */}
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="size-3 rounded-full bg-red-400 ring-1 ring-white/10 ring-inset" />
          <span className="size-3 rounded-full bg-yellow-400 ring-1 ring-white/10 ring-inset" />
          <span className="size-3 rounded-full bg-green-400 ring-1 ring-white/10 ring-inset" />
        </div>

        {/* Back / forward */}
        <div className="hidden items-center gap-1 sm:flex">
          <ChevronLeftIcon className="size-4 text-zinc-500 dark:text-white/50" />
          <ChevronRightIcon className="size-4 text-zinc-500 dark:text-white/50" />
        </div>

        {/* URL bar */}
        <div className="absolute left-1/2 flex min-w-0 max-w-[55%] -translate-x-1/2 items-center gap-2 rounded-lg bg-white/70 px-5 py-1.5 text-xs text-zinc-600 shadow-sm dark:bg-zinc-950/50 dark:text-zinc-300 dark:shadow-none">
          <Logo className="h-2.5 w-auto shrink-0 text-zinc-400" />
          <span className="hidden sm:inline">jaspergorchov.com</span>
        </div>

        <div className="flex-1" />
        <Square2StackIcon className="size-4 text-zinc-500 dark:text-white/50" />
        <PlusIcon className="size-4 text-zinc-500 dark:text-white/50" />
      </div>

      {/* Canvas area — inset panel, concentrically rounded with the window */}
      <div className="flex-1 px-1 pb-1">
        {/* Bottom radius = outer rounded-xl (12px) − px-1/pb-1 (4px) = 8px, perfectly concentric */}
        <div className="relative h-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-950/90">
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
