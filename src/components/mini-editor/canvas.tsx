'use client'

import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { type Command, createLayer as createLayerCmd } from './commands'
import { useEditor } from './store'
import { getToolForId, getResizeCursor, type ToolContext } from './tools'
import {
  type BrushLayer,
  type EllipseLayer,
  isBrushLayer,
  type Layer,
  type Point,
  type RectangleLayer,
  type TextLayer,
  type ThemeId,
} from './types'

function brushCursorUrl(size: number): string {
  const d = Math.max(size, 8)
  if (d > 128) return 'none'
  const r = d / 2
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${d}" viewBox="0 0 ${d} ${d}">
    <circle cx="${r}" cy="${r}" r="${r - 0.5}" fill="none" stroke="rgba(161,161,170,0.6)" stroke-width="1"/>
  </svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${r} ${r}, none`
}

function hitTest(layers: Layer[], point: Point): Layer | null {
  for (let index = layers.length - 1; index >= 0; index--) {
    const layer = layers[index]
    if (!layer.visible) continue
    if (
      point.x >= layer.x &&
      point.x <= layer.x + layer.width &&
      point.y >= layer.y &&
      point.y <= layer.y + layer.height
    ) {
      return layer
    }
  }
  return null
}

function renderRectangle(layer: RectangleLayer) {
  const fill =
    layer.fill === 'url(#bg-gradient)' ? 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 48%, #14b8a6 100%)' : layer.fill

  return (
    <div
      className="pointer-events-none size-full"
      style={{
        background: fill,
        borderRadius: layer.cornerRadius,
        boxShadow: layer.fill === '#f8fafc' ? '0 18px 45px rgb(15 23 42 / 0.16)' : undefined,
        opacity: layer.opacity,
      }}
    />
  )
}

function renderEllipse(layer: EllipseLayer) {
  return (
    <div
      className="pointer-events-none size-full"
      style={{
        background: layer.fill,
        borderRadius: '50%',
        filter: layer.name.toLowerCase().includes('glow') ? 'blur(0.5px)' : undefined,
        opacity: layer.opacity,
      }}
    />
  )
}

function renderText(layer: TextLayer) {
  return (
    <div
      className="pointer-events-none flex size-full select-none items-center text-pretty"
      style={{
        color: layer.fill,
        fontSize: layer.fontSize,
        fontWeight: 600,
        lineHeight: 1.04,
        opacity: layer.opacity,
      }}
    >
      {layer.text}
    </div>
  )
}

function renderBrush(layer: BrushLayer, zIndex: number) {
  if (layer.points.length === 1) {
    const [point] = layer.points
    return (
      <svg className="pointer-events-none absolute inset-0 overflow-visible" style={{ zIndex }}>
        <circle cx={point.x} cy={point.y} r={layer.strokeWidth / 2} fill={layer.strokeColor} opacity={layer.opacity} />
      </svg>
    )
  }

  const d = pointsToSmoothPath(layer.points)

  return (
    <svg className="pointer-events-none absolute inset-0 overflow-visible" style={{ zIndex }}>
      <path
        d={d}
        stroke={layer.strokeColor}
        strokeWidth={layer.strokeWidth}
        fill="none"
        opacity={layer.opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function pointsToSmoothPath(points: Point[]): string {
  let d = `M ${points[0].x},${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i]
    const next = points[i + 1]
    const midX = (curr.x + next.x) / 2
    const midY = (curr.y + next.y) / 2

    if (i < points.length - 2) {
      d += ` Q ${curr.x},${curr.y} ${midX},${midY}`
    } else {
      d += ` Q ${curr.x},${curr.y} ${next.x},${next.y}`
    }
  }

  return d
}

function getHandlePosition(handle: string, width: number, height: number): CSSProperties {
  const positions: Record<string, { left?: number | string; top?: number | string; cursor: string }> = {
    'top-left':     { left: 0.5,          top: 0.5,          cursor: 'nwse-resize' },
    'top-right':    { left: width - 0.5,  top: 0.5,          cursor: 'nesw-resize' },
    'bottom-right': { left: width - 0.5,  top: height - 0.5, cursor: 'nwse-resize' },
    'bottom-left':  { left: 0.5,          top: height - 0.5, cursor: 'nesw-resize' },
  }
  const pos = positions[handle] ?? { left: 0, top: 0, cursor: 'default' }
  return { ...pos, transform: 'translate(-50%, -50%)' }
}

function viewportClassName(theme: ThemeId, cursorClass: string) {
  if (theme === 'terminal') {
    return `relative size-full min-w-0 overflow-hidden border border-green-500 bg-zinc-950 ${cursorClass}`
  }
  if (theme === 'retro') {
    return `relative size-full min-w-0 overflow-hidden border border-black bg-white dark:border-zinc-300 dark:bg-zinc-500 ${cursorClass}`
  }
  if (theme === 'tactile') {
    return `relative size-full min-w-0 overflow-hidden border border-white/10 bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-1px_0_rgb(0_0_0/0.5),0_18px_40px_rgb(0_0_0/0.5)] dark:border-white/10 dark:from-zinc-700 dark:to-zinc-900 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_-1px_0_rgb(0_0_0/0.5),0_18px_40px_rgb(0_0_0/0.5)] ${cursorClass}`
  }
  return `relative size-full min-w-0 rounded-3xl bg-zinc-100 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900/50 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-3xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline ${cursorClass}`
}

function edgeRingClassName(theme: ThemeId) {
  if (theme === 'terminal') return 'pointer-events-none absolute inset-0 z-10 ring-1 ring-green-400 ring-inset'
  if (theme === 'retro')
    return 'pointer-events-none absolute inset-0 z-10 ring-2 ring-black ring-inset dark:ring-zinc-300'
  if (theme === 'tactile')
    return 'pointer-events-none absolute inset-0 z-10 ring-1 ring-white/10 ring-inset dark:ring-white/10'
  return 'pointer-events-none absolute inset-0 z-10'
}

function selectionBorderClassName(theme: ThemeId) {
  if (theme === 'terminal') return 'absolute inset-0 border border-green-400'
  if (theme === 'retro') return 'absolute inset-0 border-2 border-black dark:border-zinc-200'
  if (theme === 'tactile')
    return 'absolute inset-0 border border-sky-500/80 shadow-[0_0_0_1px_rgb(255_255_255/0.3)] dark:border-sky-400/80'
  return 'absolute inset-0 border border-sky-500 dark:border-sky-400'
}

function selectionHandleClassName(theme: ThemeId) {
  if (theme === 'terminal') return 'pointer-events-auto absolute size-[9px] border-2 border-green-400 bg-zinc-950'
  if (theme === 'retro')
    return 'pointer-events-auto absolute size-[9px] border-2 border-black bg-white dark:bg-zinc-500 dark:border-zinc-200'
  if (theme === 'tactile') {
    return 'pointer-events-auto absolute size-[9px] rounded-full border-2 border-sky-500 bg-gradient-to-b from-white to-sky-200 shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_1px_4px_rgb(0_0_0/0.4)] dark:border-sky-400'
  }
  return 'pointer-events-auto absolute size-[9px] border border-sky-500 bg-white dark:border-sky-400'
}

function SelectionHandles({
  layer,
  theme,
  onResizePointerDown,
}: {
  layer: Layer
  theme: ThemeId
  onResizePointerDown: (event: PointerEvent, handle: string) => void
}) {
  const handles = ['top-left', 'top-right', 'bottom-right', 'bottom-left']

  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: layer.x, top: layer.y, width: layer.width, height: layer.height, zIndex: 10 }}
    >
      <div className={selectionBorderClassName(theme)} />
      {handles.map((handle) => (
        <button
          key={handle}
          type="button"
          aria-label={`Resize from ${handle.replace('-', ' ')}`}
          className={selectionHandleClassName(theme)}
          style={getHandlePosition(handle, layer.width, layer.height)}
          onPointerDown={(event) => {
            event.stopPropagation()
            onResizePointerDown(event, handle)
          }}
        />
      ))}
    </div>
  )
}

function CanvasLayer({
  layer,
  zIndex,
  editingTextId,
  onFinishEdit,
}: {
  layer: Layer
  zIndex: number
  editingTextId: string | null
  onFinishEdit: (id: string, text: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isEditing = layer.id === editingTextId && layer.type === 'text'

  useEffect(() => {
    if (!isEditing) return
    inputRef.current?.focus()
  }, [isEditing])

  if (!layer.visible) return null

  if (isEditing) {
    const textLayer = layer as TextLayer
    return (
      <div
        className="absolute"
        style={{
          left: layer.x,
          top: layer.y,
          width: layer.width,
          height: layer.height,
          zIndex,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          defaultValue={textLayer.text}
          className="size-full cursor-text bg-transparent outline-none"
          style={{
            color: textLayer.fill,
            fontSize: textLayer.fontSize,
            fontWeight: 600,
            lineHeight: 1.04,
            opacity: textLayer.opacity,
            border: 'none',
            padding: 0,
          }}
          onBlur={(e) => onFinishEdit(layer.id, e.currentTarget.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.currentTarget.blur()
            }
            if (e.key === 'Escape') {
              e.currentTarget.value = textLayer.text
              e.currentTarget.blur()
            }
          }}
        />
      </div>
    )
  }

  if (isBrushLayer(layer)) {
    return renderBrush(layer, zIndex)
  }

  const content =
    layer.type === 'rectangle'
      ? renderRectangle(layer)
      : layer.type === 'ellipse'
        ? renderEllipse(layer)
        : renderText(layer as TextLayer)

  return (
    <div
      className="absolute"
      style={{
        left: layer.x,
        top: layer.y,
        width: layer.width,
        height: layer.height,
        zIndex,
      }}
    >
      {content}
    </div>
  )
}

export function Canvas() {
  const { state, dispatch, history } = useEditor()
  const viewportRef = useRef<HTMLDivElement>(null)
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const pointerCapturedRef = useRef(false)

  useEffect(() => {
    const viewportNode = viewportRef.current
    if (!viewportNode) return

    const update = () => {
      const rect = viewportNode.getBoundingClientRect()
      setViewportSize({ width: rect.width, height: rect.height })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(viewportNode)

    return () => observer.disconnect()
  }, [])

  const layersRef = useRef(state.layers)
  layersRef.current = state.layers

  const getPoint = useCallback((clientX: number, clientY: number): Point => {
    const el = viewportRef.current
    const rect = el?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }, [])

  const recordCommand = useCallback(
    (cmd: Command) => {
      history.record(cmd)
    },
    [history]
  )

  const startEditingText = useCallback((id: string, _text: string, _x: number, _y: number) => {
    requestAnimationFrame(() => setEditingTextId(id))
  }, [])

  const stopEditingText = useCallback(() => {
    setEditingTextId(null)
  }, [])

  const handleFinishEdit = useCallback(
    (id: string, text: string) => {
      const layer = layersRef.current.find((l) => l.id === id)
      if (layer) {
        const finalLayer = { ...layer, text }
        history.record(createLayerCmd(finalLayer))
      }
      dispatch({ type: 'SET_LAYER_PROPERTY', id, property: 'text', value: text })
      setEditingTextId(null)
    },
    [dispatch, history]
  )

  const buildToolContext = useCallback(
    (): ToolContext => ({
      layers: state.layers,
      selectedLayerId: state.selectedLayerId,
      fillColor: state.fillColor,
      brushColor: state.brushColor,
      brushSize: state.brushSize,
      dispatch,
      recordCommand,
      editingTextId,
      startEditingText,
      stopEditingText,
      getCanvasPoint: getPoint,
    }),
    [
      state.layers,
      state.selectedLayerId,
      state.fillColor,
      state.brushColor,
      state.brushSize,
      dispatch,
      recordCommand,
      editingTextId,
      startEditingText,
      stopEditingText,
      getPoint,
    ]
  )

  const cursorRef = useRef('default')
  const selectedLayerRef = useRef(state.layers.find((layer) => layer.id === state.selectedLayerId) ?? null)
  selectedLayerRef.current = state.layers.find((layer) => layer.id === state.selectedLayerId) ?? null

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const tool = getToolForId(state.activeTool)
      const ctx = buildToolContext()
      tool.onPointerDown(event, ctx)

      if (state.activeTool !== 'text') {
        viewportRef.current?.setPointerCapture(event.pointerId)
        pointerCapturedRef.current = true
      }
    },
    [state.activeTool, buildToolContext]
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const tool = getToolForId(state.activeTool)
      const ctx = buildToolContext()
      tool.onPointerMove(event, ctx)

      if (state.activeTool === 'brush') return

      const layer = selectedLayerRef.current
      if (state.activeTool === 'move' && layer && viewportRef.current) {
        const pt = getPoint(event.clientX, event.clientY)
        const handle = getResizeCursor(layer, pt)
        const newCursor = handle ?? 'default'
        if (newCursor !== cursorRef.current) {
          cursorRef.current = newCursor
          viewportRef.current.style.cursor = newCursor
        }
      }
    },
    [state.activeTool, buildToolContext, getPoint]
  )

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const tool = getToolForId(state.activeTool)
      const ctx = buildToolContext()
      tool.onPointerUp(event, ctx)

      if (pointerCapturedRef.current) {
        viewportRef.current?.releasePointerCapture(event.pointerId)
        pointerCapturedRef.current = false
      }

      if (viewportRef.current && state.activeTool !== 'brush') {
        const resetCursor = 'default'
        cursorRef.current = resetCursor
        viewportRef.current.style.cursor = resetCursor
      }
    },
    [state.activeTool, buildToolContext]
  )

  const handlePointerCancel = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const tool = getToolForId(state.activeTool)
      const ctx = buildToolContext()
      tool.onCancel(ctx)

      if (pointerCapturedRef.current) {
        viewportRef.current?.releasePointerCapture(event.pointerId)
        pointerCapturedRef.current = false
      }
    },
    [state.activeTool, buildToolContext]
  )

  const handleDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const point = getPoint(event.clientX, event.clientY)

      const hit = hitTest(state.layers, point)
      if (hit && hit.type === 'text') {
        setEditingTextId(hit.id)
      }
    },
    [getPoint, state.layers]
  )

  const selectedLayer = state.layers.find((layer) => layer.id === state.selectedLayerId) ?? null
  const showSelection = selectedLayer && state.activeTool === 'move' && selectedLayer.visible
  const cursorClass = getToolForId(state.activeTool).cursor
  const brushCursor = state.activeTool === 'brush' ? brushCursorUrl(state.brushSize) : undefined

  return (
    <div
      ref={viewportRef}
      className={viewportClassName(state.theme, cursorClass) + ' isolate'}
      style={{ touchAction: 'none', cursor: brushCursor }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onDoubleClick={handleDoubleClick}
    >
      <div className={edgeRingClassName(state.theme)} />
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        {state.layers.map((layer, index) => (
          <CanvasLayer
            key={layer.id}
            layer={layer}
            zIndex={index + 1}
            editingTextId={editingTextId}
            onFinishEdit={handleFinishEdit}
          />
        ))}

        {showSelection && (
          <SelectionHandles
            layer={selectedLayer}
            theme={state.theme}
            onResizePointerDown={(event, handle) => {
              const ctx = buildToolContext()
              ctx.dispatch({ type: 'SELECT_LAYER', id: selectedLayer.id })
              const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
              if (!pt) return
              const tool = getToolForId('move')
              ;(tool as any)._resizeState = {
                layerId: selectedLayer.id,
                handle,
                startX: pt.x,
                startY: pt.y,
                layerStartX: selectedLayer.x,
                layerStartY: selectedLayer.y,
                layerStartW: selectedLayer.width,
                layerStartH: selectedLayer.height,
                oldPoints: selectedLayer.type === 'brush' ? [...selectedLayer.points] : undefined,
              }
              viewportRef.current?.setPointerCapture(event.pointerId)
              pointerCapturedRef.current = true
            }}
          />
        )}
      </div>
    </div>
  )
}
