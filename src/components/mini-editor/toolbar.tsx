'use client'

import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ChatBubbleBottomCenterTextIcon,
  CursorArrowRaysIcon,
  PaintBrushIcon,
  StopCircleIcon,
  StopIcon,
} from '@heroicons/react/16/solid'
import { useEffect, useState } from 'react'
import { useEditor } from './store'
import { type ThemeId, TOOL_IDS, type ToolId } from './types'

const toolIcons: Record<ToolId, typeof CursorArrowRaysIcon> = {
  move: CursorArrowRaysIcon,
  brush: PaintBrushIcon,
  rectangle: StopIcon,
  ellipse: StopCircleIcon,
  text: ChatBubbleBottomCenterTextIcon,
}

const toolLabels: Record<ToolId, string> = {
  move: 'Move (V)',
  brush: 'Brush (B)',
  rectangle: 'Rectangle (R)',
  ellipse: 'Ellipse (E)',
  text: 'Text (T)',
}

const swatches = ['#0ea5e9', '#8b5cf6', '#14b8a6', '#f43f5e', '#f8fafc', '#18181b']

function toolbarClassName(theme: ThemeId) {
  if (theme === 'terminal') {
    return 'pointer-events-auto flex items-center gap-1.5 rounded-none border border-green-500 bg-zinc-950 p-2 font-mono'
  }

  if (theme === 'retro') {
    return 'pointer-events-auto flex items-center gap-1.5 rounded-none border-2 border-black bg-white font-mono dark:border-zinc-300 dark:bg-zinc-500'
  }

  if (theme === 'tactile') {
    return 'pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/15 bg-gradient-to-b from-white/12 to-white/5 px-3 py-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.15),inset_0_-1px_0_rgb(0_0_0/0.4),0_12px_28px_rgb(0_0_0/0.5)] backdrop-blur-md dark:border-white/15 dark:from-white/10 dark:to-white/5'
  }

  return 'pointer-events-auto relative flex items-center gap-1.5 rounded-full p-2 bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-full dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline'
}

function popoverClassName(theme: ThemeId) {
  if (theme === 'terminal') {
    return 'mb-3 flex items-center gap-3 rounded-none border border-green-500 bg-zinc-950 px-4 py-2 font-mono text-green-300'
  }

  if (theme === 'retro') {
    return 'mb-3 flex items-center gap-3 rounded-none border-2 border-black bg-white font-mono text-black dark:border-zinc-300 dark:bg-zinc-500 dark:text-zinc-100'
  }

  if (theme === 'tactile') {
    return 'mb-3 flex items-center gap-3 rounded-full border border-white/15 bg-gradient-to-b from-white/12 to-white/5 px-4 py-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_10px_24px_rgb(0_0_0/0.5)] backdrop-blur-md dark:border-white/15 dark:from-white/10 dark:to-white/5'
  }

  return 'mb-3 relative flex items-center gap-3 rounded-full p-2 bg-white shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-full dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline'
}

function toolButtonClassName(theme: ThemeId, isActive: boolean) {
  if (theme === 'terminal') {
    return `flex size-8 items-center justify-center rounded-none border font-mono transition-colors ${
      isActive
        ? 'border-green-500 bg-green-400 text-black'
        : 'border-green-700 bg-zinc-950 text-green-400 hover:border-green-300 hover:text-green-200 disabled:cursor-not-allowed disabled:opacity-30'
    }`
  }

  if (theme === 'retro') {
    return `flex size-8 items-center justify-center rounded-none border-2 transition-colors ${
      isActive
        ? 'border-black bg-black text-white dark:border-zinc-200 dark:bg-zinc-200 dark:text-zinc-900'
        : 'border-black bg-white text-black hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-300 dark:bg-zinc-500 dark:text-zinc-100 dark:hover:bg-zinc-400'
    }`
  }

  if (theme === 'tactile') {
    return `flex size-8 items-center justify-center rounded-full border transition-colors ${
      isActive
        ? 'border-sky-400/60 bg-gradient-to-b from-sky-300 to-sky-600 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.5),inset_0_-1px_0_rgb(3_105_161/0.6),0_0_12px_rgb(56_189_248/0.4),0_4px_12px_rgb(14_165_233/0.3)]'
        : 'border-white/10 bg-gradient-to-b from-white/8 to-white/3 text-zinc-400 shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_2px_6px_rgb(0_0_0/0.3)] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:from-white/8 dark:to-white/3 dark:text-zinc-400 dark:hover:text-white'
    }`
  }

  return `flex size-8 items-center justify-center rounded-full transition-colors ${
    isActive
      ? 'bg-sky-500 text-white shadow-sm'
      : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
  }`
}

function dividerClassName(theme: ThemeId) {
  if (theme === 'terminal') return 'mx-1 h-6 w-px bg-green-700'
  if (theme === 'retro') return 'mx-1 h-6 w-0.5 bg-black dark:bg-zinc-300'
  if (theme === 'tactile') return 'mx-1 h-6 w-px bg-white/10 dark:bg-white/10'
  return 'mx-1 h-6 w-px bg-zinc-200 dark:bg-zinc-700'
}

function swatchClassName(theme: ThemeId) {
  if (theme === 'terminal') {
    return 'size-5 rounded-none border border-green-600 transition-transform hover:scale-110'
  }

  if (theme === 'retro') {
    return 'size-5 rounded-none border-2 border-black transition-transform hover:scale-110 dark:border-zinc-300'
  }

  if (theme === 'tactile') {
    return 'size-5 rounded-full border border-white/15 shadow-[inset_0_1px_1px_rgb(255_255_255/0.3),0_2px_4px_rgb(0_0_0/0.3)] transition-transform hover:scale-110'
  }

  return 'size-5 rounded-full ring-1 ring-zinc-300 ring-offset-1 ring-offset-white transition-transform hover:scale-110 dark:ring-zinc-600 dark:ring-offset-zinc-900'
}

function ToolOptionsPopover({ tool }: { tool: ToolId }) {
  const { state, dispatch } = useEditor()

  return (
    <div className={popoverClassName(state.theme)}>
      <div className="flex items-center gap-1.5">
        {swatches.map((color) => {
          const selected = state.fillColor === color || state.brushColor === color
          return (
            <button
              key={color}
              type="button"
              aria-label={`Use ${color}`}
              title={color}
              onClick={() => {
                dispatch({ type: 'SET_FILL_COLOR', color })
                dispatch({ type: 'SET_BRUSH_COLOR', color })
              }}
              className={swatchClassName(state.theme)}
              style={{
                background: color,
                outline: selected ? '2px solid #0ea5e9' : undefined,
                outlineOffset: 2,
              }}
            />
          )
        })}
      </div>

      {tool === 'brush' && (
        <div
          className={`flex items-center gap-2 border-l pl-3 ${
            state.theme === 'terminal'
              ? 'border-green-700'
              : state.theme === 'retro'
                ? 'border-black dark:border-zinc-300'
                : state.theme === 'tactile'
                  ? 'border-white/10 dark:border-white/10'
                  : 'border-zinc-200 dark:border-zinc-700'
          }`}
        >
          <input
            type="range"
            aria-label="Brush size"
            min={1}
            max={24}
            value={state.brushSize}
            onChange={(event) => dispatch({ type: 'SET_BRUSH_SIZE', size: Number(event.target.value) })}
            className={`h-1 w-16 appearance-none outline-none ${
              state.theme === 'terminal'
                ? 'rounded-none bg-green-900'
                : state.theme === 'retro'
                  ? 'rounded-none bg-black dark:bg-zinc-300'
                  : state.theme === 'tactile'
                    ? 'rounded-full bg-white/10 shadow-[inset_0_1px_2px_rgb(0_0_0/0.4)] dark:bg-white/10'
                    : 'rounded-full bg-zinc-200 dark:bg-zinc-700'
            }`}
          />
          <span
            className={`font-mono text-[11px] tabular-nums ${
              state.theme === 'terminal'
                ? 'text-green-300'
                : state.theme === 'retro'
                  ? 'text-black dark:text-zinc-100'
                  : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {state.brushSize}px
          </span>
        </div>
      )}
    </div>
  )
}

export function BottomToolbar() {
  const { state, dispatch, history } = useEditor()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const canUndo = mounted ? history.canUndo : false
  const canRedo = mounted ? history.canRedo : false

  return (
    <div className="pointer-events-none flex justify-center px-4">
      <div className={toolbarClassName(state.theme)}>
        <button
          type="button"
          aria-label="Undo"
          title="Undo (⌘Z)"
          disabled={!canUndo}
          suppressHydrationWarning
          onClick={() => dispatch({ type: 'UNDO' })}
          className={toolButtonClassName(state.theme, false)}
        >
          <ArrowUturnLeftIcon className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Redo"
          title="Redo (⌘⇧Z)"
          disabled={!canRedo}
          suppressHydrationWarning
          onClick={() => dispatch({ type: 'REDO' })}
          className={toolButtonClassName(state.theme, false)}
        >
          <ArrowUturnRightIcon className="size-4" />
        </button>

        <div className={dividerClassName(state.theme)} />

        {TOOL_IDS.map((toolId) => {
          const Icon = toolIcons[toolId]
          const isActive = state.activeTool === toolId

          return (
            <div key={toolId} className="relative">
              {isActive && toolId !== 'move' && (
                <div className="absolute bottom-full left-1/2 z-10 -translate-x-1/2">
                  <ToolOptionsPopover tool={toolId} />
                </div>
              )}
              <button
                type="button"
                aria-label={toolLabels[toolId]}
                title={toolLabels[toolId]}
                onClick={() => dispatch({ type: 'SET_TOOL', tool: toolId })}
                className={toolButtonClassName(state.theme, isActive)}
              >
                <Icon className="size-4" />
              </button>
            </div>
          )
        })}

        <div className={dividerClassName(state.theme)} />

        <button
          type="button"
          aria-label="Reset canvas"
          title="Reset canvas"
          onClick={() => dispatch({ type: 'LOAD_DEFAULT_COMPOSITION' })}
          className={toolButtonClassName(state.theme, false)}
        >
          <ArrowPathIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}
