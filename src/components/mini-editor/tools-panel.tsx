'use client'

import {
  ChatBubbleBottomCenterTextIcon,
  CursorArrowRaysIcon,
  PaintBrushIcon,
  StopCircleIcon,
  StopIcon,
} from '@heroicons/react/16/solid'
import type { ComponentType, SVGProps } from 'react'
import { useEditor } from './store'
import { TOOL_IDS, type ToolId } from './types'

const toolIcons: Record<ToolId, ComponentType<SVGProps<SVGSVGElement>>> = {
  move: CursorArrowRaysIcon,
  brush: PaintBrushIcon,
  rectangle: StopIcon,
  ellipse: StopCircleIcon,
  text: ChatBubbleBottomCenterTextIcon,
}

const toolLabels: Record<ToolId, string> = {
  move: 'Move',
  brush: 'Brush',
  rectangle: 'Rectangle',
  ellipse: 'Ellipse',
  text: 'Text',
}

const swatches = ['#0ea5e9', '#8b5cf6', '#14b8a6', '#f43f5e', '#f8fafc', '#18181b']

export function ToolsPanel() {
  const { state, dispatch } = useEditor()

  return (
    <div className="editor-tools flex w-18 shrink-0 flex-col items-center gap-3 border-r border-(--panel-border) bg-(--panel-bg) px-2 py-3 select-none">
      <div className="flex flex-col gap-1.5">
        {TOOL_IDS.map((toolId) => {
          const Icon = toolIcons[toolId]
          const isActive = state.activeTool === toolId

          return (
            <button
              key={toolId}
              type="button"
              aria-label={toolLabels[toolId]}
              title={toolLabels[toolId]}
              onClick={() => dispatch({ type: 'SET_TOOL', tool: toolId })}
              className={`relative inline-flex size-9 items-center justify-center rounded-sm ${
                isActive
                  ? 'bg-(--accent) fill-white'
                  : 'fill-(--text-secondary) hover:bg-(--control-hover) hover:fill-(--text-primary)'
              }`}
            >
              <span
                className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
                aria-hidden="true"
              />
              <Icon className="size-4 shrink-0" />
            </button>
          )
        })}
      </div>

      <div className="h-px w-10 bg-(--panel-border)" />

      <div className="grid grid-cols-2 gap-1.5" aria-label="Color swatches">
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
              className="size-5 rounded-xs ring-1 ring-(--swatch-ring) ring-offset-1 ring-offset-(--panel-bg)"
              style={{
                background: color,
                outline: selected ? '2px solid var(--accent)' : undefined,
                outlineOffset: 2,
              }}
            />
          )
        })}
      </div>

      <label className="mt-auto flex flex-col items-center gap-2">
        <span className="font-mono text-[0.625rem]/4 tracking-wide text-(--text-tertiary) uppercase">Brush</span>
        <input
          type="range"
          name="brush-size"
          aria-label="Brush size"
          min={1}
          max={24}
          value={state.brushSize}
          onChange={(event) => dispatch({ type: 'SET_BRUSH_SIZE', size: Number(event.target.value) })}
          className="editor-vertical-range"
        />
        <span className="font-mono text-[0.625rem]/4 text-(--text-secondary) tabular-nums">{state.brushSize}px</span>
      </label>
    </div>
  )
}
