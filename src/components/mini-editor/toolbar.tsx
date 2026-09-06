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
import { TOOL_IDS, type ToolId } from './types'

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



function ToolOptionsPopover({ tool }: { tool: ToolId }) {
  const { state, dispatch } = useEditor()

  return (
    <div className="relative mb-3 flex items-center gap-3 rounded-full bg-white p-2 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-full dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline">
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
              className="size-5 rounded-full ring-1 ring-zinc-300 ring-offset-1 ring-offset-white transition-transform hover:scale-110 dark:ring-zinc-600 dark:ring-offset-zinc-900"
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
          className="flex items-center gap-2 border-l border-zinc-200 pl-3 dark:border-zinc-700"
        >
          <input
            type="range"
            aria-label="Brush size"
            min={1}
            max={24}
            value={state.brushSize}
            onChange={(event) => dispatch({ type: 'SET_BRUSH_SIZE', size: Number(event.target.value) })}
            className="h-1 w-16 appearance-none rounded-full bg-zinc-200 outline-none dark:bg-zinc-700"
          />
          <span
            className="font-mono text-[11px] text-zinc-500 tabular-nums dark:text-zinc-400"
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
      <div className="pointer-events-auto relative flex items-center gap-1.5 rounded-full bg-white p-2 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-full dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline">
        <button
          type="button"
          aria-label="Undo"
          title="Undo (⌘Z)"
          disabled={!canUndo}
          suppressHydrationWarning
          onClick={() => dispatch({ type: 'UNDO' })}
          className="flex size-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
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
          className="flex size-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <ArrowUturnRightIcon className="size-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

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
                className={`flex size-8 items-center justify-center rounded-full transition-colors ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                <Icon className="size-4" />
              </button>
            </div>
          )
        })}

        <div className="mx-1 h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

        <button
          type="button"
          aria-label="Reset canvas"
          title="Reset canvas"
          onClick={() => dispatch({ type: 'LOAD_DEFAULT_COMPOSITION' })}
          className="flex size-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <ArrowPathIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}
