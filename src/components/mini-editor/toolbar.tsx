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
import { useEditor } from './store'
import { TOOL_IDS, type ThemeId, type ToolId } from './types'

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
    return 'pointer-events-auto flex items-center gap-1.5 rounded-none border border-green-400 bg-zinc-950 px-3 py-2 font-mono shadow-[0_0_0_1px_rgb(22_163_74),0_0_18px_rgb(34_197_94/0.18)]'
  }

  if (theme === 'retro') {
    return 'pointer-events-auto flex items-center gap-1.5 rounded-none border-2 border-zinc-950 bg-zinc-100 px-3 py-2 font-mono shadow-[4px_4px_0_0_rgb(24_24_27)] dark:border-white dark:bg-zinc-300 dark:shadow-[4px_4px_0_0_rgb(255_255_255)]'
  }

  if (theme === 'tactile') {
    return 'pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/60 bg-gradient-to-b from-white to-zinc-200 px-3 py-2 shadow-[inset_0_1px_0_rgb(255_255_255),inset_0_-1px_0_rgb(113_113_122/0.25),0_14px_30px_rgb(24_24_27/0.22)] dark:border-white/10 dark:from-zinc-700 dark:to-zinc-950 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.2),inset_0_-1px_0_rgb(0_0_0/0.7),0_14px_30px_rgb(0_0_0/0.45)]'
  }

  return 'pointer-events-auto flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-2 shadow-sm ring-1 ring-zinc-200 backdrop-blur-md dark:bg-zinc-900/90 dark:ring-zinc-700'
}

function popoverClassName(theme: ThemeId) {
  if (theme === 'terminal') {
    return 'mb-3 flex items-center gap-3 rounded-none border border-green-400 bg-zinc-950 px-4 py-2 font-mono text-green-300 shadow-[0_0_0_1px_rgb(22_163_74)]'
  }

  if (theme === 'retro') {
    return 'mb-3 flex items-center gap-3 rounded-none border-2 border-zinc-950 bg-zinc-100 px-4 py-2 font-mono shadow-[3px_3px_0_0_rgb(24_24_27)] dark:border-white dark:bg-zinc-300 dark:text-zinc-950 dark:shadow-[3px_3px_0_0_rgb(255_255_255)]'
  }

  if (theme === 'tactile') {
    return 'mb-3 flex items-center gap-3 rounded-full border border-white/60 bg-gradient-to-b from-white to-zinc-200 px-4 py-2 shadow-[inset_0_1px_0_rgb(255_255_255),0_10px_24px_rgb(24_24_27/0.18)] dark:border-white/10 dark:from-zinc-700 dark:to-zinc-950 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_10px_24px_rgb(0_0_0/0.4)]'
  }

  return 'mb-3 flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-sm ring-1 ring-zinc-200 backdrop-blur-md dark:bg-zinc-900/90 dark:ring-zinc-700'
}

function toolButtonClassName(theme: ThemeId, isActive: boolean) {
  if (theme === 'terminal') {
    return `flex size-8 items-center justify-center rounded-none border font-mono transition-colors ${
      isActive
        ? 'border-green-300 bg-zinc-950 text-green-200 shadow-[inset_0_0_0_1px_rgb(74_222_128)]'
        : 'border-green-700 bg-zinc-950 text-green-400 hover:border-green-300 hover:text-green-200 disabled:cursor-not-allowed disabled:opacity-30'
    }`
  }

  if (theme === 'retro') {
    return `flex size-8 items-center justify-center rounded-none border-2 border-zinc-950 transition-colors dark:border-zinc-950 ${
      isActive
        ? 'bg-zinc-950 text-white dark:bg-zinc-950 dark:text-white'
        : 'bg-zinc-100 text-zinc-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 dark:bg-zinc-300 dark:text-zinc-950 dark:hover:bg-white'
    }`
  }

  if (theme === 'tactile') {
    return `flex size-8 items-center justify-center rounded-full border transition-colors ${
      isActive
        ? 'border-sky-300 bg-gradient-to-b from-sky-300 to-sky-600 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.45),inset_0_-2px_0_rgb(3_105_161/0.55),0_3px_8px_rgb(14_165_233/0.45)]'
        : 'border-white/60 bg-gradient-to-b from-white to-zinc-200 text-zinc-500 shadow-[inset_0_1px_0_rgb(255_255_255),0_2px_5px_rgb(24_24_27/0.12)] hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:from-zinc-700 dark:to-zinc-900 dark:text-zinc-300 dark:hover:text-white'
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
  if (theme === 'retro') return 'mx-1 h-6 w-0.5 bg-zinc-950'
  if (theme === 'tactile') return 'mx-1 h-6 w-px bg-white shadow-[1px_0_0_rgb(113_113_122/0.35)] dark:bg-white/15'
  return 'mx-1 h-6 w-px bg-zinc-200 dark:bg-zinc-700'
}

function swatchClassName(theme: ThemeId) {
  if (theme === 'terminal') {
    return 'size-5 rounded-none border border-green-400 ring-1 ring-green-900 transition-transform hover:scale-110'
  }

  if (theme === 'retro') {
    return 'size-5 rounded-none border-2 border-zinc-950 transition-transform hover:scale-110'
  }

  if (theme === 'tactile') {
    return 'size-5 rounded-full border border-white/70 shadow-[inset_0_1px_1px_rgb(255_255_255/0.7),0_2px_4px_rgb(24_24_27/0.25)] transition-transform hover:scale-110'
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
                ? 'border-zinc-950'
                : state.theme === 'tactile'
                  ? 'border-white/70 dark:border-white/10'
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
                  ? 'rounded-none bg-zinc-950'
                  : state.theme === 'tactile'
                    ? 'rounded-full bg-zinc-300 shadow-inner dark:bg-zinc-950'
                    : 'rounded-full bg-zinc-200 dark:bg-zinc-700'
            }`}
          />
          <span
            className={`font-mono text-[11px] tabular-nums ${
              state.theme === 'terminal'
                ? 'text-green-300'
                : state.theme === 'retro'
                  ? 'text-zinc-950'
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
  const { state, dispatch } = useEditor()

  const canUndo = state.historyIndex > 0
  const canRedo = state.historyIndex < state.history.length - 1

  return (
    <div className="pointer-events-none flex justify-center px-4">
      <div className={toolbarClassName(state.theme)}>
        <button
          type="button"
          aria-label="Undo"
          title="Undo (⌘Z)"
          disabled={!canUndo}
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
