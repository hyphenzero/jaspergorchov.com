'use client'

import {
  type CSSProperties,
  type PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useEditor } from './store'
import {
  ARTBOARD_HEIGHT,
  ARTBOARD_WIDTH,
  type BrushLayer,
  type EllipseLayer,
  isBrushLayer,
  type Layer,
  type Point,
  type RectangleLayer,
  type TextLayer,
  type ThemeId,
} from './types'

const MIN_LAYER_SIZE = 8
const DEFAULT_VIEWPORT = { width: ARTBOARD_WIDTH, height: ARTBOARD_HEIGHT }

function generateId() {
  return `layer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
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

function getArtboardPoint(event: PointerEvent, artboard: HTMLDivElement, scale: number): Point {
  const rect = artboard.getBoundingClientRect()

  return {
    x: (event.clientX - rect.left) / scale,
    y: (event.clientY - rect.top) / scale,
  }
}

type Interaction =
  | { type: 'idle' }
  | { type: 'dragging'; layerId: string; offsetX: number; offsetY: number; changed: boolean }
  | {
      type: 'resizing'
      layerId: string
      handle: string
      startX: number
      startY: number
      origX: number
      origY: number
      origW: number
      origH: number
      changed: boolean
    }
  | { type: 'drawing'; layerId: string; changed: boolean }
  | { type: 'creating'; layerId: string; startX: number; startY: number; changed: boolean }

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

function renderBrush(layer: BrushLayer) {
  if (layer.points.length === 1) {
    const [point] = layer.points
    return (
      <circle cx={point.x} cy={point.y} r={layer.strokeWidth / 2} fill={layer.strokeColor} opacity={layer.opacity} />
    )
  }

  const points = layer.points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <polyline
      points={points}
      stroke={layer.strokeColor}
      strokeWidth={layer.strokeWidth}
      fill="none"
      opacity={layer.opacity}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

function getHandlePosition(handle: string): CSSProperties {
  switch (handle) {
    case 'top-left':
      return { left: -5, top: -5, cursor: 'nwse-resize' }
    case 'top':
      return { left: '50%', top: -5, cursor: 'ns-resize', transform: 'translateX(-50%)' }
    case 'top-right':
      return { right: -5, top: -5, cursor: 'nesw-resize' }
    case 'right':
      return { right: -5, top: '50%', cursor: 'ew-resize', transform: 'translateY(-50%)' }
    case 'bottom-right':
      return { right: -5, bottom: -5, cursor: 'nwse-resize' }
    case 'bottom':
      return { left: '50%', bottom: -5, cursor: 'ns-resize', transform: 'translateX(-50%)' }
    case 'bottom-left':
      return { left: -5, bottom: -5, cursor: 'nesw-resize' }
    case 'left':
      return { left: -5, top: '50%', cursor: 'ew-resize', transform: 'translateY(-50%)' }
    default:
      return { left: -5, top: -5 }
  }
}

function viewportClassName(theme: ThemeId) {
  if (theme === 'terminal') return 'relative size-full min-w-0 overflow-hidden bg-zinc-950'
  if (theme === 'retro') return 'relative size-full min-w-0 overflow-hidden bg-zinc-300 dark:bg-zinc-700'
  if (theme === 'tactile') {
    return 'relative size-full min-w-0 overflow-hidden bg-gradient-to-b from-zinc-50 to-zinc-300 dark:from-zinc-800 dark:to-zinc-950'
  }
  return 'relative size-full min-w-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900'
}

function artboardClassName(theme: ThemeId, cursorClass: string) {
  if (theme === 'terminal') {
    return `absolute top-0 left-0 overflow-hidden border border-green-500 bg-zinc-950 ${cursorClass}`
  }
  if (theme === 'retro') {
    return `absolute top-0 left-0 overflow-hidden border border-black bg-white dark:border-zinc-300 dark:bg-zinc-500 ${cursorClass}`
  }
  if (theme === 'tactile') {
    return `absolute top-0 left-0 overflow-hidden border border-white/70 bg-gradient-to-b from-zinc-50 to-zinc-200 shadow-[inset_0_1px_0_rgb(255_255_255),inset_0_-1px_0_rgb(113_113_122/0.3),0_18px_40px_rgb(24_24_27/0.25)] dark:border-white/10 dark:from-zinc-800 dark:to-zinc-950 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.16),inset_0_-1px_0_rgb(0_0_0/0.8),0_18px_40px_rgb(0_0_0/0.5)] ${cursorClass}`
  }
  return `absolute top-0 left-0 overflow-hidden border border-transparent bg-zinc-100 dark:bg-zinc-950 ${cursorClass}`
}

function edgeRingClassName(theme: ThemeId) {
  if (theme === 'terminal') return 'pointer-events-none absolute inset-0 z-10 ring-1 ring-green-400 ring-inset'
  if (theme === 'retro') return 'pointer-events-none absolute inset-0 z-10 ring-2 ring-black ring-inset dark:ring-zinc-300'
  if (theme === 'tactile') return 'pointer-events-none absolute inset-0 z-10 ring-1 ring-white/70 ring-inset dark:ring-white/10'
  return 'pointer-events-none absolute inset-0 z-10 ring-1 ring-zinc-950/10 ring-inset dark:ring-white/10'
}

function selectionBorderClassName(theme: ThemeId) {
  if (theme === 'terminal') return 'absolute inset-0 border border-green-400'
  if (theme === 'retro') return 'absolute inset-0 border-2 border-black dark:border-zinc-200'
  if (theme === 'tactile') return 'absolute inset-0 border border-sky-500 shadow-[0_0_0_1px_rgb(255_255_255/0.7)] dark:border-sky-300'
  return 'absolute inset-0 border border-sky-500 dark:border-sky-400'
}

function selectionHandleClassName(theme: ThemeId) {
  if (theme === 'terminal') return 'pointer-events-auto absolute size-2 bg-zinc-950 ring-2 ring-green-400'
  if (theme === 'retro') return 'pointer-events-auto absolute size-2 bg-white ring-2 ring-black dark:bg-zinc-500 dark:ring-zinc-200'
  if (theme === 'tactile') {
    return 'pointer-events-auto absolute size-2 rounded-sm bg-gradient-to-b from-white to-sky-100 ring-2 ring-sky-500 shadow-[inset_0_1px_0_rgb(255_255_255),0_1px_3px_rgb(24_24_27/0.3)] dark:ring-sky-300'
  }
  return 'pointer-events-auto absolute size-1.5 bg-white ring ring-sky-500 dark:ring-sky-400'
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
      style={{ left: layer.x - 1, top: layer.y - 2, width: layer.width + 4, height: layer.height + 4 }}
    >
      <div className={selectionBorderClassName(theme)} />
      {handles.map((handle) => (
        <button
          key={handle}
          type="button"
          aria-label={`Resize from ${handle.replace('-', ' ')}`}
          className={selectionHandleClassName(theme)}
          style={getHandlePosition(handle)}
          onPointerDown={(event) => {
            event.stopPropagation()
            onResizePointerDown(event, handle)
          }}
        />
      ))}
    </div>
  )
}

function CanvasLayer({ layer, zIndex }: { layer: Layer; zIndex: number }) {
  if (!layer.visible) return null

  if (isBrushLayer(layer)) {
    return (
      <svg className="pointer-events-none absolute inset-0 overflow-visible" style={{ zIndex }}>
        {renderBrush(layer)}
      </svg>
    )
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
  const { state, dispatch } = useEditor()
  const viewportRef = useRef<HTMLDivElement>(null)
  const artboardRef = useRef<HTMLDivElement>(null)
  const interactionRef = useRef<Interaction>({ type: 'idle' })
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT)
  useEffect(() => {
    const viewportNode = viewportRef.current
    if (!viewportNode) return

    const update = () => {
      const rect = viewportNode.getBoundingClientRect()
      setViewport({ width: rect.width, height: rect.height })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(viewportNode)

    return () => observer.disconnect()
  }, [])

  const scale = useMemo(() => {
    if (viewport.width === 0 || viewport.height === 0) return 1
    return Math.max(viewport.width / ARTBOARD_WIDTH, viewport.height / ARTBOARD_HEIGHT)
  }, [viewport])

  const commit = useCallback(() => {
    const interaction = interactionRef.current
    if (interaction.type !== 'idle' && interaction.changed) {
      dispatch({ type: 'PUSH_HISTORY' })
    }

    interactionRef.current = { type: 'idle' }
  }, [dispatch])

  const getPoint = useCallback(
    (event: PointerEvent) => {
      const artboard = artboardRef.current
      if (!artboard) return null

      const point = getArtboardPoint(event, artboard, scale || 1)
      return {
        x: clamp(point.x, 0, ARTBOARD_WIDTH),
        y: clamp(point.y, 0, ARTBOARD_HEIGHT),
      }
    },
    [scale]
  )

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      if (interactionRef.current.type !== 'idle') return

      const point = getPoint(event)
      if (!point) return

      switch (state.activeTool) {
        case 'move': {
          const hit = hitTest(state.layers, point)
          if (!hit) {
            dispatch({ type: 'DESELECT' })
            break
          }

          dispatch({ type: 'SELECT_LAYER', id: hit.id })
          interactionRef.current = {
            type: 'dragging',
            layerId: hit.id,
            offsetX: point.x - hit.x,
            offsetY: point.y - hit.y,
            changed: false,
          }
          break
        }

        case 'brush': {
          const id = generateId()
          dispatch({
            type: 'START_BRUSH_STROKE',
            id,
            point,
            color: state.brushColor,
            size: state.brushSize,
          })
          interactionRef.current = { type: 'drawing', layerId: id, changed: true }
          break
        }

        case 'rectangle':
        case 'ellipse': {
          const id = generateId()
          dispatch({
            type: 'START_CREATE',
            id,
            shapeType: state.activeTool,
            point,
            fill: state.fillColor,
          })
          interactionRef.current = {
            type: 'creating',
            layerId: id,
            startX: point.x,
            startY: point.y,
            changed: true,
          }
          break
        }

        case 'text': {
          const id = generateId()
          const textLayer: TextLayer = {
            id,
            type: 'text',
            name: 'Text',
            x: clamp(point.x - 54, 0, ARTBOARD_WIDTH - 108),
            y: clamp(point.y - 18, 0, ARTBOARD_HEIGHT - 36),
            width: 108,
            height: 36,
            rotation: 0,
            opacity: 1,
            visible: true,
            text: 'Text',
            fontSize: 22,
            fill: state.fillColor,
          }
          dispatch({ type: 'CREATE_LAYER', layer: textLayer })
          break
        }
      }

      artboardRef.current?.setPointerCapture(event.pointerId)
    },
    [dispatch, getPoint, state.activeTool, state.brushColor, state.brushSize, state.fillColor, state.layers]
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const interaction = interactionRef.current
      if (interaction.type === 'idle') return

      const point = getPoint(event)
      if (!point) return

      switch (interaction.type) {
        case 'dragging': {
          const layer = state.layers.find((candidate) => candidate.id === interaction.layerId)
          if (!layer) return

          const nextX = clamp(
            point.x - interaction.offsetX,
            -layer.width + MIN_LAYER_SIZE,
            ARTBOARD_WIDTH - MIN_LAYER_SIZE
          )
          const nextY = clamp(
            point.y - interaction.offsetY,
            -layer.height + MIN_LAYER_SIZE,
            ARTBOARD_HEIGHT - MIN_LAYER_SIZE
          )

          interactionRef.current = { ...interaction, changed: true }
          dispatch({
            type: 'MOVE_LAYER',
            id: interaction.layerId,
            x: nextX,
            y: nextY,
          })
          break
        }

        case 'resizing': {
          const dx = point.x - interaction.startX
          const dy = point.y - interaction.startY
          let nextX = interaction.origX
          let nextY = interaction.origY
          let nextWidth = interaction.origW
          let nextHeight = interaction.origH

          if (interaction.handle.includes('left')) {
            nextX = interaction.origX + dx
            nextWidth = interaction.origW - dx
          }
          if (interaction.handle.includes('right')) nextWidth = interaction.origW + dx
          if (interaction.handle.includes('top')) {
            nextY = interaction.origY + dy
            nextHeight = interaction.origH - dy
          }
          if (interaction.handle.includes('bottom')) nextHeight = interaction.origH + dy

          if (nextWidth < MIN_LAYER_SIZE) {
            if (interaction.handle.includes('left')) nextX = interaction.origX + interaction.origW - MIN_LAYER_SIZE
            nextWidth = MIN_LAYER_SIZE
          }
          if (nextHeight < MIN_LAYER_SIZE) {
            if (interaction.handle.includes('top')) nextY = interaction.origY + interaction.origH - MIN_LAYER_SIZE
            nextHeight = MIN_LAYER_SIZE
          }

          interactionRef.current = { ...interaction, changed: true }
          dispatch({
            type: 'RESIZE_LAYER',
            id: interaction.layerId,
            x: nextX,
            y: nextY,
            width: nextWidth,
            height: nextHeight,
          })
          break
        }

        case 'drawing':
          dispatch({ type: 'ADD_BRUSH_POINT', id: interaction.layerId, point })
          interactionRef.current = { ...interaction, changed: true }
          break

        case 'creating': {
          const x = Math.min(interaction.startX, point.x)
          const y = Math.min(interaction.startY, point.y)
          const width = Math.max(Math.abs(point.x - interaction.startX), MIN_LAYER_SIZE)
          const height = Math.max(Math.abs(point.y - interaction.startY), MIN_LAYER_SIZE)

          dispatch({
            type: 'UPDATE_CREATING',
            id: interaction.layerId,
            x,
            y,
            width,
            height,
          })
          interactionRef.current = { ...interaction, changed: true }
          break
        }
      }
    },
    [dispatch, getPoint, state.layers]
  )

  const handleResizePointerDown = useCallback(
    (event: PointerEvent, handle: string) => {
      const layer = state.layers.find((candidate) => candidate.id === state.selectedLayerId)
      const point = getPoint(event)
      if (!layer || !point) return

      interactionRef.current = {
        type: 'resizing',
        layerId: layer.id,
        handle,
        startX: point.x,
        startY: point.y,
        origX: layer.x,
        origY: layer.y,
        origW: layer.width,
        origH: layer.height,
        changed: false,
      }

      artboardRef.current?.setPointerCapture(event.pointerId)
    },
    [getPoint, state.layers, state.selectedLayerId]
  )

  const selectedLayer = state.layers.find((layer) => layer.id === state.selectedLayerId) ?? null
  const showSelection = selectedLayer && state.activeTool === 'move' && selectedLayer.visible
  const cursorClass =
    state.activeTool === 'move' ? 'cursor-default' : state.activeTool === 'text' ? 'cursor-text' : 'cursor-crosshair'

  return (
    <div
      ref={viewportRef}
      className={viewportClassName(state.theme)}
    >
      <div className={edgeRingClassName(state.theme)} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative"
          style={{
            width: ARTBOARD_WIDTH * scale,
            height: ARTBOARD_HEIGHT * scale,
          }}
        >
          <div
            ref={artboardRef}
            className={artboardClassName(state.theme, cursorClass)}
            style={{
              width: ARTBOARD_WIDTH,
              height: ARTBOARD_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              touchAction: 'none',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={commit}
            onPointerCancel={commit}
          >
            {state.layers.map((layer, index) => (
              <CanvasLayer key={layer.id} layer={layer} zIndex={index + 1} />
            ))}

            {showSelection && (
              <SelectionHandles layer={selectedLayer} theme={state.theme} onResizePointerDown={handleResizePointerDown} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
