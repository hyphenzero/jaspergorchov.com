'use client'

import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CursorArrowRaysIcon,
  PaintBrushIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { useRef, useState, useSyncExternalStore } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { Button } from '../button'
import { useEditor } from './store'
import { TOOL_IDS, type ToolId } from './types'

function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

type Icon = ComponentType<SVGProps<SVGSVGElement> & { 'data-slot'?: string }>

function SquareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden fill="currentColor" {...props}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="1.1" />
    </svg>
  )
}

function CircleIcon(props: SVGProps<SVGSVGElement>) {
  // Filled, same 12×12 footprint as square (centered at 8,8).
  return (
    <svg viewBox="0 0 16 16" aria-hidden fill="currentColor" {...props}>
      <circle cx="8" cy="8" r="6" />
    </svg>
  )
}

function SerifTextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden fill="none" {...props}>
      <path
        d="M2.5 2.2H13.5M8 2.2V13.8M2.5 2.2V3.6M13.5 2.2V3.6M5.5 13.8H10.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SelectIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 640 640" aria-hidden fill="currentColor" {...props}>
      <path d="M173.3 66.5C181.4 62.4 191.2 63.3 198.4 68.8L518.4 308.7C526.7 314.9 530 325.7 526.8 335.5C523.6 345.3 514.4 351.9 504 351.9L351.7 351.9L440.6 529.6C448.5 545.4 442.1 564.6 426.3 572.5C410.5 580.4 391.3 574 383.4 558.2L294.5 380.5L203.2 502.3C197 510.6 186.2 513.9 176.4 510.7C166.6 507.5 160 498.3 160 488L160 88C160 78.9 165.1 70.6 173.3 66.5z" />
    </svg>
  )
}

function SelectWidthIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden fill="none" {...props}>
      <path d="M3 8H13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6 5L3 8L6 11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 5L13 8L10 11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EraserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 640 640" aria-hidden fill="currentColor" {...props}>
      <path d="M210.5 480L333.5 480L398.8 414.7L225.3 241.2L98.6 367.9L210.6 479.9zM256 544L210.5 544C193.5 544 177.2 537.3 165.2 525.3L49 409C38.1 398.1 32 383.4 32 368C32 352.6 38.1 337.9 49 327L295 81C305.9 70.1 320.6 64 336 64C351.4 64 366.1 70.1 377 81L559 263C569.9 273.9 576 288.6 576 304C576 319.4 569.9 334.1 559 345L424 480L544 480C561.7 480 576 494.3 576 512C576 529.7 561.7 544 544 544L256 544z" />
    </svg>
  )
}


const toolIcons: Record<ToolId, Icon> = {
  move: SelectIcon,
  brush: PaintBrushIcon,
  eraser: EraserIcon,
  rectangle: SquareIcon,
  ellipse: CircleIcon,
  text: SerifTextIcon,
}

const toolLabels: Record<ToolId, string> = {
  move: 'Move (V)',
  brush: 'Brush (B)',
  eraser: 'Eraser',
  rectangle: 'Rectangle (R)',
  ellipse: 'Ellipse (E)',
  text: 'Text (T)',
}

// Tailwind palette, rainbow order: red-500, yellow-500, green-500,
// blue-500, white, zinc-900.
const swatches = ['#ef4444', '#eab308', '#22c55e', '#3b82f6', '#ffffff', '#18181b']



function SizeSlider({
  ariaLabel,
  min,
  max,
  value,
  onChange,
}: {
  ariaLabel: string
  min: number
  max: number
  value: number
  onChange: (size: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const setFromClientX = (clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    if (rect.width <= 0) return
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    onChange(Math.round(min + t * (max - min)))
  }

  const percent = ((value - min) / Math.max(max - min, 1)) * 100

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      className="relative h-4 w-16 cursor-ew-resize touch-none outline-none"
      onPointerDown={(event) => {
        draggingRef.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        setFromClientX(event.clientX)
      }}
      onPointerMove={(event) => {
        if (draggingRef.current) setFromClientX(event.clientX)
      }}
      onPointerUp={() => {
        draggingRef.current = false
      }}
      onPointerCancel={() => {
        draggingRef.current = false
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
          event.preventDefault()
          onChange(Math.max(min, value - 1))
        } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
          event.preventDefault()
          onChange(Math.min(max, value + 1))
        } else if (event.key === 'Home') {
          event.preventDefault()
          onChange(min)
        } else if (event.key === 'End') {
          event.preventDefault()
          onChange(max)
        }
      }}
    >
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      <div
        className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-sky-500"
        style={{ width: `${percent}%` }}
      />
      <div
        className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow ring-1 ring-zinc-950/10 dark:bg-zinc-200"
        style={{ left: `${percent}%` }}
      />
    </div>
  )
}

function ToolOptionsPopover({ tool }: { tool: ToolId }) {
  const { state, dispatch } = useEditor()
  const selectedLayer = state.layers.find((l) => l.id === state.selectedLayerId) ?? null

  const canRecolor = selectedLayer && state.activeTool === 'move'
  const applySwatch = (color: string) => {
    if (canRecolor && selectedLayer) {
      dispatch({
        type: 'SET_LAYER_PROPERTY',
        id: selectedLayer.id,
        property: selectedLayer.type === 'brush' ? 'strokeColor' : 'fill',
        value: color,
      })
      return
    }
    dispatch({ type: 'SET_FILL_COLOR', color })
    dispatch({ type: 'SET_BRUSH_COLOR', color })
  }

  return (
    <div className="relative mb-3 flex items-center gap-3 rounded-full bg-white h-9 px-2 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-full dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline">
      {tool === 'eraser' ? (
        <div className="flex items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
          {(['pixels', 'objects'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => dispatch({ type: 'SET_ERASER_MODE', mode })}
              className={
                state.eraserMode === mode
                  ? 'rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-white'
                  : 'rounded-full px-2.5 py-1 text-[11px] text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }
            >
              {mode === 'pixels' ? 'Pixels' : 'Objects'}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          {swatches.map((color) => {
            const selected =
              canRecolor && selectedLayer
                ? (selectedLayer.type === 'brush' ? selectedLayer.strokeColor : selectedLayer.fill) === color
                : tool === 'brush'
                  ? state.brushColor === color
                  : state.fillColor === color
            return (
              <button
                key={color}
                type="button"
                aria-label={`Use ${color}`}
                title={color}
              onClick={() => applySwatch(color)}
                className={`relative size-5 rounded-full ${color === '#18181b' ? 'dark:ring-1 dark:ring-white/30 dark:ring-inset' : ''} ${color === '#ffffff' ? 'not-dark:ring-1 not-dark:ring-zinc-950/25 not-dark:ring-inset' : ''}`}
                style={{ background: color }}
              >
                {selected && (
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -inset-[3px] rounded-full border ${
                      color === '#18181b'
                        ? 'border-[#18181b] dark:border-white'
                        : color === '#ffffff'
                          ? 'border-zinc-950 dark:border-white'
                          : ''
                    }`}
                    style={color === '#18181b' || color === '#ffffff' ? undefined : { borderColor: color }}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {(tool === 'brush' || tool === 'eraser') && (
        <div className="flex items-center gap-2 border-l border-zinc-200 pl-3 dark:border-zinc-700">
          <SizeSlider
            ariaLabel={tool === 'eraser' ? 'Eraser size' : 'Brush size'}
            min={1}
            max={tool === 'eraser' ? 64 : 24}
            value={tool === 'eraser' ? state.eraserSize : state.brushSize}
            onChange={(size) =>
              dispatch(tool === 'eraser' ? { type: 'SET_ERASER_SIZE', size } : { type: 'SET_BRUSH_SIZE', size })
            }
          />
          <span className="font-mono text-[11px] text-zinc-500 tabular-nums dark:text-zinc-400">
            {tool === 'eraser' ? state.eraserSize : state.brushSize}px
          </span>
        </div>
      )}
    </div>
  )
}

export function BottomToolbar() {
  const { state, dispatch, history } = useEditor()
  const mounted = useMounted()
  const [confirmClear, setConfirmClear] = useState(false)

  const canUndo = mounted ? history.canUndo : false
  const canRedo = mounted ? history.canRedo : false

  return (
    <div className="pointer-events-none flex justify-center px-4">
      <div className="pointer-events-auto relative flex items-center gap-1 rounded-full bg-white p-1 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-full dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline">
        <button
          type="button"
          aria-label="Undo"
          title="Undo (⌘Z)"
          disabled={!canUndo}
          suppressHydrationWarning
          onClick={() => dispatch({ type: 'UNDO' })}
          className="flex size-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <ArrowUturnLeftIcon data-slot="icon" className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Redo"
          title="Redo (⌘⇧Z)"
          disabled={!canRedo}
          suppressHydrationWarning
          onClick={() => dispatch({ type: 'REDO' })}
          className="flex size-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <ArrowUturnRightIcon data-slot="icon" className="size-4" />
        </button>

        <div className="mx-0.5 h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

        {TOOL_IDS.map((toolId) => {
          const Icon = toolIcons[toolId]
          const isActive = state.activeTool === toolId

          return (
            <div key={toolId}>
              <button
                type="button"
                aria-label={toolLabels[toolId]}
                title={toolLabels[toolId]}
                onClick={() => dispatch({ type: 'SET_TOOL', tool: toolId })}
                className={`flex size-7 items-center justify-center rounded-full transition-colors ${
                  isActive
                    ? 'bg-sky-500 text-white'
                    : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                <Icon data-slot="icon" className="size-4" />
              </button>
            </div>
          )
        })}

        <div className="mx-0.5 h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

        <button
          type="button"
          aria-label="Reset canvas"
          title="Reset canvas"
          onClick={() => setConfirmClear((open) => !open)}
          className="flex size-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <TrashIcon data-slot="icon" className="size-4" />
        </button>
        {confirmClear ? (
          <div className="absolute inset-x-0 bottom-full z-10 mb-3 flex justify-center">
            <div className="w-64 rounded-2xl bg-white p-4 text-left shadow-xl ring-1 ring-zinc-950/10 dark:bg-zinc-900 dark:ring-white/10">
              <p className="text-sm font-semibold text-zinc-950 dark:text-white">Clear canvas</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                Are you sure you want to clear the canvas?
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <Button plain onClick={() => setConfirmClear(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    dispatch({ type: 'LOAD_DEFAULT_COMPOSITION' })
                    setConfirmClear(false)
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        ) : (
          (state.activeTool !== 'move' || state.selectedLayerId) && (
            <div className="absolute inset-x-0 bottom-full z-10 flex justify-center">
              <ToolOptionsPopover tool={state.activeTool} />
            </div>
          )
        )}
      </div>
    </div>
  )
}
