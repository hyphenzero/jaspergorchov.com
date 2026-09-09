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
import { getResizeCursor, getToolForId, isSelectionSuppressed, type ToolContext, type ToolRuntime } from './tools'
import {
  type BrushLayer,
  type EllipseLayer,
  isBrushLayer,
  type Layer,
  type Point,
  type RectangleLayer,
  type TextLayer,
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

function erasureHoles(layer: Layer) {
  const erasures = layer.erasures ?? []
  if (erasures.length === 0) return null
  // Holes in the layer's own local coordinates, rendered as smooth eraser
  // paths exactly like brush strokes.
  return erasures.map((stroke, index) => {
    const local = stroke.points.map((p) => ({ x: p.x - layer.x, y: p.y - layer.y }))
    return local.length === 1 ? (
      <circle key={index} cx={local[0].x} cy={local[0].y} r={stroke.width / 2} fill="black" />
    ) : (
      <path
        key={index}
        d={pointsToSmoothPath(local)}
        stroke="black"
        strokeWidth={stroke.width}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )
  })
}

function shapeMaskDef(layer: Layer) {
  const erasures = layer.erasures ?? []
  if (erasures.length === 0 || layer.width <= 0 || layer.height <= 0) return null
  // Explicit user-space units: the referencing shape lives in this same SVG
  // viewport (which spans the layer box 1:1), so local coordinates line up.
  // The region is padded generously so overflowing content (e.g. long text)
  // is never clipped by the mask itself.
  const pad = 200
  return (
    <mask
      id={`shape-erase-${layer.id}`}
      maskUnits="userSpaceOnUse"
      maskContentUnits="userSpaceOnUse"
      x={-pad}
      y={-pad}
      width={layer.width + pad * 2}
      height={layer.height + pad * 2}
    >
      <rect x={-pad} y={-pad} width={layer.width + pad * 2} height={layer.height + pad * 2} fill="white" />
      {erasureHoles(layer)}
    </mask>
  )
}

function renderRectangle(layer: RectangleLayer) {
  const maskId = `shape-erase-${layer.id}`
  const hasErasures = (layer.erasures ?? []).length > 0
  return (
    <svg className="pointer-events-none absolute inset-0 overflow-visible">
      {hasErasures ? shapeMaskDef(layer) : null}
      {layer.fill === 'url(#bg-gradient)' ? (
        <linearGradient id="bg-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0ea5e9" />
          <stop offset="0.48" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      ) : null}
      <rect
        x="0"
        y="0"
        width={layer.width}
        height={layer.height}
        rx={layer.cornerRadius}
        fill={layer.fill}
        opacity={layer.opacity}
        mask={hasErasures ? `url(#${maskId})` : undefined}
      />
    </svg>
  )
}

function renderEllipse(layer: EllipseLayer) {
  const maskId = `shape-erase-${layer.id}`
  const hasErasures = (layer.erasures ?? []).length > 0
  return (
    <svg className="pointer-events-none absolute inset-0 overflow-visible">
      {hasErasures ? shapeMaskDef(layer) : null}
      <ellipse
        cx={layer.width / 2}
        cy={layer.height / 2}
        rx={layer.width / 2}
        ry={layer.height / 2}
        fill={layer.fill}
        opacity={layer.opacity}
        mask={hasErasures ? `url(#${maskId})` : undefined}
      />
    </svg>
  )
}

function renderText(layer: TextLayer) {
  const maskId = `shape-erase-${layer.id}`
  const hasErasures = (layer.erasures ?? []).length > 0
  return (
    <svg className="pointer-events-none absolute inset-0 overflow-visible">
      {hasErasures ? shapeMaskDef(layer) : null}
      <text
        x="0"
        y={layer.height / 2}
        dominantBaseline="central"
        fill={layer.fill}
        fontSize={layer.fontSize}
        fontWeight={600}
        opacity={layer.opacity}
        mask={hasErasures ? `url(#${maskId})` : undefined}
        className="select-none"
      >
        {layer.text}
      </text>
    </svg>
  )
}

function renderBrush(layer: BrushLayer, zIndex: number) {
  const hasErasures = layer.erasures.length > 0
  const maskId = `erase-${layer.id}`

  let mask: React.ReactNode = null
  if (hasErasures) {
    // Mask in the same canvas coordinate space as the path itself, so the
    // holes line up exactly and nothing gets sliced at a bounding box.
    // Each eraser gesture renders as one smooth path, just like a brush stroke.
    const xs = layer.points.map((p) => p.x)
    const ys = layer.points.map((p) => p.y)
    const margin = Math.max(...layer.erasures.map((s) => s.width / 2)) + layer.strokeWidth
    const minX = Math.min(...xs) - margin
    const minY = Math.min(...ys) - margin
    const w = Math.max(Math.max(...xs) + margin - minX, 1)
    const h = Math.max(Math.max(...ys) + margin - minY, 1)
    mask = (
      <mask
        id={maskId}
        maskUnits="userSpaceOnUse"
        maskContentUnits="userSpaceOnUse"
        x={minX}
        y={minY}
        width={w}
        height={h}
      >
        <rect x={minX} y={minY} width={w} height={h} fill="white" />
        {layer.erasures.map((stroke, index) =>
          stroke.points.length === 1 ? (
            <circle key={index} cx={stroke.points[0].x} cy={stroke.points[0].y} r={stroke.width / 2} fill="black" />
          ) : (
            <path
              key={index}
              d={pointsToSmoothPath(stroke.points)}
              stroke="black"
              strokeWidth={stroke.width}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )
        )}
      </mask>
    )
  }
  const maskProp = hasErasures ? { mask: `url(#${maskId})` } : {}

  if (layer.points.length === 1) {
    const [point] = layer.points
    return (
      <svg className="pointer-events-none absolute inset-0 overflow-visible" style={{ zIndex }}>
        {mask}
        <circle
          cx={point.x}
          cy={point.y}
          r={layer.strokeWidth / 2}
          fill={layer.strokeColor}
          opacity={layer.opacity}
          {...maskProp}
        />
      </svg>
    )
  }

  const d = pointsToSmoothPath(layer.points)

  return (
    <svg className="pointer-events-none absolute inset-0 overflow-visible" style={{ zIndex }}>
      {mask}
      <path
        d={d}
        stroke={layer.strokeColor}
        strokeWidth={layer.strokeWidth}
        fill="none"
        opacity={layer.opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...maskProp}
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

let measureContext: CanvasRenderingContext2D | null = null

function measureText(fontSize: number, text: string): { width: number; height: number } {
  if (typeof document === 'undefined') return { width: Math.max(text.length * fontSize * 0.55, 20), height: fontSize * 1.2 }
  if (!measureContext) measureContext = document.createElement('canvas').getContext('2d')
  if (!measureContext) return { width: Math.max(text.length * fontSize * 0.55, 20), height: fontSize * 1.2 }
  measureContext.font = `600 ${fontSize}px Inter, system-ui, sans-serif`
  const width = measureContext.measureText(text || ' ').width + 4
  return { width: Math.max(width, 20), height: fontSize * 1.2 }
}

function brushBounds(points: Point[], strokeWidth: number) {
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  return {
    x: minX - strokeWidth,
    y: minY - strokeWidth,
    width: Math.max(...xs) - minX + strokeWidth * 2,
    height: Math.max(...ys) - minY + strokeWidth * 2,
  }
}

function createDefaultDoodles(): Layer[] {
  return []
}

function getHandlePosition(handle: string, width: number, height: number): CSSProperties {
  const positions: Record<string, { left?: number | string; top?: number | string; cursor: string }> = {
    'top-left': { left: 0.5, top: 0.5, cursor: 'nwse-resize' },
    'top-right': { left: width - 0.5, top: 0.5, cursor: 'nesw-resize' },
    'bottom-right': { left: width - 0.5, top: height - 0.5, cursor: 'nwse-resize' },
    'bottom-left': { left: 0.5, top: height - 0.5, cursor: 'nesw-resize' },
  }
  const pos = positions[handle] ?? { left: 0, top: 0, cursor: 'default' }
  return { ...pos, transform: 'translate(-50%, -50%)' }
}

function SelectionHandles({
  layer,
  onResizePointerDown,
}: {
  layer: Layer
  onResizePointerDown: (event: PointerEvent, handle: string) => void
}) {
  const handles = ['top-left', 'top-right', 'bottom-right', 'bottom-left']

  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: layer.x, top: layer.y, width: layer.width, height: layer.height, zIndex: 10 }}
    >
      <div className="absolute inset-0 border border-sky-500 dark:border-sky-400" />
      {handles.map((handle) => (
        <button
          key={handle}
          type="button"
          aria-label={`Resize from ${handle.replace('-', ' ')}`}
          className="pointer-events-auto absolute size-[9px] border border-sky-500 bg-white dark:border-sky-400"
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
  const [draftLength, setDraftLength] = useState((layer as TextLayer).text?.length ?? 0)

  const wasEditingRef = useRef(false)
  useEffect(() => {
    if (isEditing && !wasEditingRef.current) {
      setDraftLength((layer as TextLayer).text?.length ?? 0)
      inputRef.current?.focus()
    }
    wasEditingRef.current = isEditing
  }, [isEditing, layer])

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
          className="h-full cursor-text bg-transparent outline-none"
          style={{
            color: textLayer.fill,
            fontSize: textLayer.fontSize,
            fontWeight: 600,
            lineHeight: 1.04,
            opacity: textLayer.opacity,
            border: 'none',
            padding: 0,
            width: `${Math.max(draftLength + 1, 4)}ch`,
            maxWidth: '80vw',
          }}
          onChange={(e) => setDraftLength(e.currentTarget.value.length)}
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
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const pointerCapturedRef = useRef(false)

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

  const startEditingText = useCallback((id: string) => {
    requestAnimationFrame(() => setEditingTextId(id))
  }, [])

  const stopEditingText = useCallback(() => {
    setEditingTextId(null)
  }, [])

  const handleFinishEdit = useCallback(
    (id: string, text: string) => {
      const layers = state.layers
      const layer = layers.find((l) => l.id === id)
      if (layer && layer.type === 'text' && text.trim() === '') {
        dispatch({ type: 'DELETE_LAYER', id })
      } else if (layer && layer.type === 'text') {
        const { width, height } = measureText(layer.fontSize, text)
        const next = layers.map((l) => (l.id === id ? { ...l, text, width, height } : l))
        history.record({ apply: () => next, undo: () => layers })
        dispatch({ type: 'SET_TEXT_CONTENT', id, text, width, height })
        dispatch({ type: 'SELECT_LAYER', id })
      } else if (layer) {
        const finalLayer = { ...layer, text }
        history.record(createLayerCmd(finalLayer))
        dispatch({ type: 'SET_LAYER_PROPERTY', id, property: 'text', value: text })
      }
      setEditingTextId(null)
    },
    [state.layers, dispatch, history]
  )

  const buildToolContext = useCallback(
    (): ToolContext => ({
      layers: state.layers,
      selectedLayerId: state.selectedLayerId,
      fillColor: state.fillColor,
      brushColor: state.brushColor,
      brushSize: state.brushSize,
      eraserSize: state.eraserSize,
      eraserMode: state.eraserMode,
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
      state.eraserSize,
      state.eraserMode,
      dispatch,
      recordCommand,
      editingTextId,
      startEditingText,
      stopEditingText,
      getPoint,
    ]
  )

  const cursorRef = useRef('default')
  const seededRef = useRef(false)

  // Seed corner doodles once on load: a smiley bottom-right and a loopy
  // line top-right. Skipped if layers already exist (StrictMode remount,
  // HMR state restore) so they never duplicate.
  useEffect(() => {
    if (seededRef.current || state.layers.length > 0) return
    const viewport = viewportRef.current
    if (!viewport) return
    const rect = viewport.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    seededRef.current = true
    dispatch({ type: 'SET_LAYERS', layers: createDefaultDoodles() })
    // Only the mount values matter; later renders must not reseed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      const layer = state.layers.find((l) => l.id === state.selectedLayerId) ?? null
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
    [state.activeTool, state.layers, state.selectedLayerId, buildToolContext, getPoint]
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

      if (viewportRef.current && state.activeTool !== 'brush' && state.activeTool !== 'eraser') {
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
  const showSelection =
    selectedLayer && selectedLayer.visible && !isSelectionSuppressed() && state.activeTool !== 'brush'
  const cursorClass = getToolForId(state.activeTool).cursor
  const brushCursor =
    state.activeTool === 'brush'
      ? brushCursorUrl(state.brushSize)
      : state.activeTool === 'eraser'
        ? brushCursorUrl(state.eraserSize)
        : undefined

  return (
    <div
      ref={viewportRef}
      className={`relative size-full min-w-0 rounded-3xl bg-zinc-100 shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)] dark:bg-zinc-900/50 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)] dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-3xl dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset] forced-colors:outline ${cursorClass} isolate`}
      style={{ touchAction: 'none', cursor: brushCursor }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onDoubleClick={handleDoubleClick}
    >
      <div className="pointer-events-none absolute inset-0 z-10" />
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
            onResizePointerDown={(event, handle) => {
              const ctx = buildToolContext()
              ctx.dispatch({ type: 'SELECT_LAYER', id: selectedLayer.id })
              const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
              if (!pt) return
              const tool = getToolForId(state.activeTool) as ToolRuntime
              ;tool._resizeState = {
                layerId: selectedLayer.id,
                handle,
                startX: pt.x,
                startY: pt.y,
                layerStartX: selectedLayer.x,
                layerStartY: selectedLayer.y,
                layerStartW: selectedLayer.width,
                layerStartH: selectedLayer.height,
                startFontSize: (selectedLayer as TextLayer).fontSize ?? 16,
                oldPoints: selectedLayer.type === 'brush' ? [...selectedLayer.points] : undefined,
                initialLayers: state.layers,
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
