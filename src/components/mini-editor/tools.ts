import type { Command } from './commands'
import { createLayer as createLayerCmd, resizeLayer, setLayerPosition } from './commands'
import type { BrushLayer, EditorAction, EraserMode, EraserStroke, Layer, Point, TextLayer, ToolId } from './types'

let nextId = 1
function generateId(): string {
  return `layer-${Date.now()}-${nextId++}`
}

export interface ToolContext {
  layers: Layer[]
  selectedLayerId: string | null
  fillColor: string
  brushColor: string
  brushSize: number
  eraserSize: number
  eraserMode: EraserMode
  dispatch: React.Dispatch<EditorAction>
  recordCommand: (cmd: Command) => void
  editingTextId: string | null
  startEditingText: (id: string) => void
  stopEditingText: () => void
  getCanvasPoint: (clientX: number, clientY: number) => Point
}

export interface Tool {
  id: ToolId
  cursor: string
  onPointerDown(event: { clientX: number; clientY: number }, ctx: ToolContext): void
  onPointerMove(event: { clientX: number; clientY: number }, ctx: ToolContext): void
  onPointerUp(event: { clientX: number; clientY: number }, ctx: ToolContext): void
  onCancel(ctx: ToolContext): void
}

// Per-gesture runtime state hung off tool objects. Typed (not `any`) so a
// typo in a state key is a compile error, not a silent no-op.
export interface ToolRuntimeState {
  _dragState?: DragState | null
  _resizeState?: ShapeResizeState | null
  _createState?: CreateState | null
  _brushState?: BrushState | null
  _eraseState?: EraseState | null
}

export type ToolRuntime = Tool & ToolRuntimeState

function hitTest(layers: Layer[], point: Point): Layer | null {
  for (let i = layers.length - 1; i >= 0; i--) {
    const l = layers[i]
    if (!l.visible) continue
    if (point.x >= l.x && point.x <= l.x + l.width && point.y >= l.y && point.y <= l.y + l.height) {
      return l
    }
  }
  return null
}

function isOnResizeHandle(layer: Layer, point: Point, handleSize: number): string | null {
  const hs = handleSize
  const corners: { key: string; x: number; y: number }[] = [
    { key: 'top-left', x: layer.x, y: layer.y },
    { key: 'top-right', x: layer.x + layer.width, y: layer.y },
    { key: 'bottom-right', x: layer.x + layer.width, y: layer.y + layer.height },
    { key: 'bottom-left', x: layer.x, y: layer.y + layer.height },
  ]
  for (const c of corners) {
    if (Math.abs(point.x - c.x) <= hs && Math.abs(point.y - c.y) <= hs) {
      return c.key
    }
  }

  const edgeThreshold = 6
  const { x, y, width, height } = layer
  const withinTop = Math.abs(point.y - y) <= edgeThreshold
  const withinBottom = Math.abs(point.y - (y + height)) <= edgeThreshold
  const withinLeft = Math.abs(point.x - x) <= edgeThreshold
  const withinRight = Math.abs(point.x - (x + width)) <= edgeThreshold
  const inHorizontalRange = point.x > x + hs && point.x < x + width - hs
  const inVerticalRange = point.y > y + hs && point.y < y + height - hs

  if (withinTop && inHorizontalRange) return 'top'
  if (withinBottom && inHorizontalRange) return 'bottom'
  if (withinLeft && inVerticalRange) return 'left'
  if (withinRight && inVerticalRange) return 'right'

  return null
}

export function getResizeCursor(layer: Layer, point: Point): string | null {
  const handle = isOnResizeHandle(layer, point, 6)
  if (!handle) return null
  const cursors: Record<string, string> = {
    'top-left': 'nwse-resize',
    top: 'ns-resize',
    'top-right': 'nesw-resize',
    right: 'ew-resize',
    'bottom-right': 'nwse-resize',
    bottom: 'ns-resize',
    'bottom-left': 'nesw-resize',
    left: 'ew-resize',
  }
  return cursors[handle] ?? 'default'
}

interface DragState {
  layerId: string
  startX: number
  startY: number
  layerStartX: number
  layerStartY: number
  initialLayers: Layer[]
  oldPoints?: Point[]
}

function pointInLayer(layer: Layer, point: Point, pad: number): boolean {
  return (
    point.x >= layer.x - pad &&
    point.x <= layer.x + layer.width + pad &&
    point.y >= layer.y - pad &&
    point.y <= layer.y + layer.height + pad
  )
}

function detachLayerErasures(layer: Layer): Layer {
  const erasures = layer.erasures ?? []
  if (erasures.length === 0) return layer
  const kept: EraserStroke[] = []
  for (const stroke of erasures) {
    let run: Point[] = []
    const flush = () => {
      if (run.length > 0) {
        kept.push({ points: run, width: stroke.width })
        run = []
      }
    }
    for (const point of stroke.points) {
      if (pointInLayer(layer, point, stroke.width / 2)) run.push(point)
      else flush()
    }
    flush()
  }
  return { ...layer, erasures: kept }
}

interface CreateState {
  layerId: string | null
  startX: number
  startY: number
}

const DEFAULT_SHAPE_SIZE = 128

interface BrushState {
  layerId: string
  points: Point[]
}

const MIN_LAYER_SIZE = 8

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export const moveTool: Tool = {
  id: 'move',
  cursor: 'default',

  onPointerDown(event, ctx) {
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)

    if (ctx.selectedLayerId) {
      const layer = ctx.layers.find((l) => l.id === ctx.selectedLayerId)
      if (layer) {
        const handle = isOnResizeHandle(layer, pt, 6)
        if (handle) {
          ;(moveTool as ToolRuntime)._resizeState = {
            layerId: layer.id,
            handle,
            startX: pt.x,
            startY: pt.y,
            layerStartX: layer.x,
            layerStartY: layer.y,
            layerStartW: layer.width,
            layerStartH: layer.height,
            startFontSize: (layer as TextLayer).fontSize ?? 16,
            oldPoints: layer.type === 'brush' ? [...layer.points] : undefined,
            initialLayers: ctx.layers,
          }
          return
        }
      }
    }

    const hit = hitTest(ctx.layers, pt)
    if (!hit) {
      if (ctx.selectedLayerId) {
        ctx.dispatch({ type: 'DESELECT' })
      }
      ;(moveTool as ToolRuntime)._dragState = null
      return
    }

    ctx.dispatch({ type: 'SELECT_LAYER', id: hit.id })
    // Detach this layer's share of any eraser paths so moving it only
    // carries the parts that intersect it; the rest stays behind.
    const detached = detachLayerErasures(hit)
    if (detached !== hit) {
      ctx.dispatch({ type: 'SET_LAYERS', layers: ctx.layers.map((l) => (l.id === hit.id ? detached : l)) })
    }
    ;(moveTool as ToolRuntime)._dragState = {
      layerId: hit.id,
      startX: pt.x,
      startY: pt.y,
      layerStartX: hit.x,
      layerStartY: hit.y,
      initialLayers: ctx.layers,
      oldPoints: hit.type === 'brush' ? [...(hit as BrushLayer).points] : undefined,
    } as DragState
  },

  onPointerMove(event, ctx) {
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)

    const resizeState = (moveTool as ToolRuntime)._resizeState
    if (resizeState) {
      const dx = pt.x - resizeState.startX
      const dy = pt.y - resizeState.startY
      let { x, y, w, h } = {
        x: resizeState.layerStartX,
        y: resizeState.layerStartY,
        w: resizeState.layerStartW,
        h: resizeState.layerStartH,
      }
      const handle = resizeState.handle
      if (handle.includes('right')) w = resizeState.layerStartW + dx
      if (handle.includes('left')) {
        x = resizeState.layerStartX + dx
        w = resizeState.layerStartW - dx
      }
      if (handle.includes('bottom')) h = resizeState.layerStartH + dy
      if (handle.includes('top')) {
        y = resizeState.layerStartY + dy
        h = resizeState.layerStartH - dy
      }
      ctx.dispatch({ type: 'RESIZE_LAYER', id: resizeState.layerId, x, y, width: w, height: h })
      return
    }

    const dragState = (moveTool as ToolRuntime)._dragState as DragState | undefined
    if (dragState) {
      const layer = ctx.layers.find((l) => l.id === dragState.layerId)
      if (!layer) return
      const dx = pt.x - dragState.startX
      const dy = pt.y - dragState.startY
      const nextX = clamp(dragState.layerStartX + dx, -layer.width + MIN_LAYER_SIZE, Infinity)
      const nextY = clamp(dragState.layerStartY + dy, -layer.height + MIN_LAYER_SIZE, Infinity)
      ctx.dispatch({ type: 'MOVE_LAYER', id: dragState.layerId, x: nextX, y: nextY })
    }
  },

  onPointerUp(_event, ctx) {
    const dragState = (moveTool as ToolRuntime)._dragState as DragState | undefined
    if (dragState) {
      const layer = ctx.layers.find((l) => l.id === dragState.layerId)
      if (layer && (layer.x !== dragState.layerStartX || layer.y !== dragState.layerStartY)) {
        if ((layer.erasures?.length ?? 0) > 0 || (dragState.initialLayers.find((l) => l.id === dragState.layerId)?.erasures?.length ?? 0) > 0) {
          // Erasures moved along (or were detached): snapshot the whole
          // thing so one undo restores position and holes together.
          const final = ctx.layers
          const initial = dragState.initialLayers
          ctx.recordCommand({ apply: () => final, undo: () => initial })
        } else {
          ctx.recordCommand(
            setLayerPosition(
              dragState.layerId,
              dragState.layerStartX,
              dragState.layerStartY,
              layer.x,
              layer.y,
              dragState.oldPoints,
              layer.type === 'brush' ? (layer as BrushLayer).points : undefined
            )
          )
        }
      }
    }

    const resizeState = (moveTool as ToolRuntime)._resizeState
    if (resizeState) {
      const layer = ctx.layers.find((l) => l.id === resizeState.layerId)
      if (layer) {
        ctx.recordCommand(
          resizeLayer(
            resizeState.layerId,
            resizeState.layerStartX,
            resizeState.layerStartY,
            resizeState.layerStartW,
            resizeState.layerStartH,
            layer.x,
            layer.y,
            layer.width,
            layer.height,
            resizeState.oldPoints,
            layer.type === 'brush' ? (layer as BrushLayer).points : undefined
          )
        )
      }
    }

    ;(moveTool as ToolRuntime)._dragState = null
    ;(moveTool as ToolRuntime)._resizeState = null
  },

  onCancel() {
    ;(moveTool as ToolRuntime)._dragState = null
    ;(moveTool as ToolRuntime)._resizeState = null
  },
}

interface ShapeResizeState {
  layerId: string
  handle: string
  startX: number
  startY: number
  layerStartX: number
  layerStartY: number
  layerStartW: number
  layerStartH: number
  startFontSize: number
  oldPoints?: { x: number; y: number }[]
  initialLayers: Layer[]
}

function grabResizeHandle(ctx: ToolContext, toolObj: ToolRuntime, pt: Point): boolean {
  const layer = ctx.layers.find((l) => l.id === ctx.selectedLayerId)
  if (!layer || !layer.visible) return false
  const handle = isOnResizeHandle(layer, pt, 9)
  if (!handle) return false
  ;toolObj._resizeState = {
    layerId: layer.id,
    handle,
    startX: pt.x,
    startY: pt.y,
    layerStartX: layer.x,
    layerStartY: layer.y,
    layerStartW: layer.width,
    layerStartH: layer.height,
    startFontSize: (layer as TextLayer).fontSize ?? 16,
    oldPoints: layer.type === 'brush' ? [...(layer as BrushLayer).points] : undefined,
    initialLayers: ctx.layers,
  } as ShapeResizeState
  return true
}

function resizeBoxFromHandle(rs: ShapeResizeState, pt: Point) {
  const dx = pt.x - rs.startX
  const dy = pt.y - rs.startY
  let x = rs.layerStartX
  let y = rs.layerStartY
  let width = rs.layerStartW
  let height = rs.layerStartH
  if (rs.handle.includes('right')) width = rs.layerStartW + dx
  if (rs.handle.includes('left')) {
    x = rs.layerStartX + dx
    width = rs.layerStartW - dx
  }
  if (rs.handle.includes('bottom')) height = rs.layerStartH + dy
  if (rs.handle.includes('top')) {
    y = rs.layerStartY + dy
    height = rs.layerStartH - dy
  }
  return { x, y, width, height }
}

function moveResizeHandle(ctx: ToolContext, toolObj: ToolRuntime, pt: Point): boolean {
  const rs = toolObj._resizeState as ShapeResizeState | undefined
  if (!rs) return false
  const layer = ctx.layers.find((l) => l.id === rs.layerId)
  if (!layer) return false
  const box = resizeBoxFromHandle(rs, pt)
  if (layer.type === 'text') {
    const scale = Math.max(box.width / Math.max(rs.layerStartW, 1), box.height / Math.max(rs.layerStartH, 1))
    ctx.dispatch({
      type: 'RESIZE_TEXT',
      id: rs.layerId,
      fontSize: Math.max(4, rs.startFontSize * scale),
      ...box,
    })
  } else {
    ctx.dispatch({ type: 'RESIZE_LAYER', id: rs.layerId, ...box })
  }
  return true
}

function endResizeHandle(ctx: ToolContext, toolObj: ToolRuntime) {
  const rs = toolObj._resizeState as ShapeResizeState | undefined
  ;toolObj._resizeState = null
  if (!rs) return
  const layer = ctx.layers.find((l) => l.id === rs.layerId)
  if (!layer) return
  if (layer.type === 'text') {
    ctx.recordCommand({ apply: () => ctx.layers, undo: () => rs.initialLayers })
  } else {
    ctx.recordCommand(
      resizeLayer(
        rs.layerId,
        rs.layerStartX,
        rs.layerStartY,
        rs.layerStartW,
        rs.layerStartH,
        layer.x,
        layer.y,
        layer.width,
        layer.height,
        rs.oldPoints,
        layer.type === 'brush' ? (layer as BrushLayer).points : undefined
      )
    )
  }
}

export const rectangleTool: Tool = {
  id: 'rectangle',
  cursor: 'crosshair',

  onPointerDown(event, ctx) {
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
    if (grabResizeHandle(ctx, rectangleTool, pt)) return
    setSelectionSuppressed(true)
    ;(rectangleTool as ToolRuntime)._createState = { layerId: null, startX: pt.x, startY: pt.y } as CreateState
  },

  onPointerMove(event, ctx) {
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
    if (moveResizeHandle(ctx, rectangleTool, pt)) return
    const createState = (rectangleTool as ToolRuntime)._createState as CreateState | undefined
    if (!createState) return
    const x = Math.min(createState.startX, pt.x)
    const y = Math.min(createState.startY, pt.y)
    const w = Math.abs(pt.x - createState.startX)
    const h = Math.abs(pt.y - createState.startY)
    if (!createState.layerId) {
      const id = generateId()
      createState.layerId = id
      dispatchCreateLayer(ctx, 'rectangle', id, x, y)
    }
    ctx.dispatch({ type: 'RESIZE_LAYER', id: createState.layerId, x, y, width: w, height: h })
  },

  onPointerUp(_event, ctx) {
    setSelectionSuppressed(false)
    const createState = (rectangleTool as ToolRuntime)._createState as CreateState | undefined
    if (createState) {
      if (createState.layerId) {
        const layer = ctx.layers.find((l) => l.id === createState.layerId)
        if (layer) {
          if (layer.width < 5 && layer.height < 5) {
            ctx.dispatch({ type: 'DELETE_LAYER', id: createState.layerId })
          } else {
            // New shape takes the selection once released.
            ctx.dispatch({ type: 'SELECT_LAYER', id: createState.layerId })
            ctx.recordCommand(createLayerCmd(layer))
          }
        }
      } else {
        const id = generateId()
        const defaultLayer: Layer = {
          id,
          type: 'rectangle',
          name: `Rectangle ${id.slice(-4)}`,
          x: createState.startX - DEFAULT_SHAPE_SIZE / 2,
          y: createState.startY - DEFAULT_SHAPE_SIZE / 2,
          width: DEFAULT_SHAPE_SIZE,
          height: DEFAULT_SHAPE_SIZE,
          rotation: 0,
          opacity: 1,
          visible: true,
          fill: ctx.fillColor,
          cornerRadius: 0,
        }
        ctx.dispatch({ type: 'CREATE_LAYER', layer: defaultLayer })
        ctx.dispatch({ type: 'SELECT_LAYER', id })
        ctx.recordCommand(createLayerCmd(defaultLayer))
      }
    }
    ;(rectangleTool as ToolRuntime)._createState = null
    endResizeHandle(ctx, rectangleTool)
  },

  onCancel() {
    ;(rectangleTool as ToolRuntime)._createState = null
    ;(rectangleTool as ToolRuntime)._resizeState = null
    setSelectionSuppressed(false)
  },
}

export const ellipseTool: Tool = {
  id: 'ellipse',
  cursor: 'crosshair',

  onPointerDown(event, ctx) {
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
    if (grabResizeHandle(ctx, ellipseTool, pt)) return
    setSelectionSuppressed(true)
    ;(ellipseTool as ToolRuntime)._createState = { layerId: null, startX: pt.x, startY: pt.y } as CreateState
  },

  onPointerMove(event, ctx) {
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
    if (moveResizeHandle(ctx, ellipseTool, pt)) return
    const createState = (ellipseTool as ToolRuntime)._createState as CreateState | undefined
    if (!createState) return
    const x = Math.min(createState.startX, pt.x)
    const y = Math.min(createState.startY, pt.y)
    const w = Math.abs(pt.x - createState.startX)
    const h = Math.abs(pt.y - createState.startY)
    if (!createState.layerId) {
      const id = generateId()
      createState.layerId = id
      dispatchCreateLayer(ctx, 'ellipse', id, x, y)
    }
    ctx.dispatch({ type: 'RESIZE_LAYER', id: createState.layerId, x, y, width: w, height: h })
  },

  onPointerUp(_event, ctx) {
    const createState = (ellipseTool as ToolRuntime)._createState as CreateState | undefined
    if (createState) {
      if (createState.layerId) {
        const layer = ctx.layers.find((l) => l.id === createState.layerId)
        if (layer) {
          if (layer.width < 5 && layer.height < 5) {
            ctx.dispatch({ type: 'DELETE_LAYER', id: createState.layerId })
          } else {
            // New shape takes the selection once released.
            ctx.dispatch({ type: 'SELECT_LAYER', id: createState.layerId })
            ctx.recordCommand(createLayerCmd(layer))
          }
        }
      } else {
        const id = generateId()
        const defaultLayer: Layer = {
          id,
          type: 'ellipse',
          name: `Ellipse ${id.slice(-4)}`,
          x: createState.startX - DEFAULT_SHAPE_SIZE / 2,
          y: createState.startY - DEFAULT_SHAPE_SIZE / 2,
          width: DEFAULT_SHAPE_SIZE,
          height: DEFAULT_SHAPE_SIZE,
          rotation: 0,
          opacity: 1,
          visible: true,
          fill: ctx.fillColor,
        }
        ctx.dispatch({ type: 'CREATE_LAYER', layer: defaultLayer })
        ctx.dispatch({ type: 'SELECT_LAYER', id })
        ctx.recordCommand(createLayerCmd(defaultLayer))
      }
    }
    setSelectionSuppressed(false)
    ;(ellipseTool as ToolRuntime)._createState = null
    endResizeHandle(ctx, ellipseTool)
  },

  onCancel() {
    ;(ellipseTool as ToolRuntime)._createState = null
    ;(ellipseTool as ToolRuntime)._resizeState = null
    setSelectionSuppressed(false)
  },
}

export const brushTool: Tool = {
  id: 'brush',
  cursor: 'auto',

  onPointerDown(event, ctx) {
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
    const id = generateId()
    setSelectionSuppressed(true)
    ctx.dispatch({ type: 'START_BRUSH_STROKE', id, point: pt, color: ctx.brushColor, size: ctx.brushSize })
    ;(brushTool as ToolRuntime)._brushState = { layerId: id, points: [pt] } as BrushState
  },

  onPointerMove(event, ctx) {
    const brushState = (brushTool as ToolRuntime)._brushState as BrushState | undefined
    if (!brushState) return
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
    brushState.points.push(pt)
    ctx.dispatch({ type: 'ADD_BRUSH_POINT', id: brushState.layerId, point: pt })
  },

  onPointerUp(_event, ctx) {
    setSelectionSuppressed(false)
    const brushState = (brushTool as ToolRuntime)._brushState as BrushState | undefined
    if (brushState) {
      const layer = ctx.layers.find((l) => l.id === brushState.layerId)
      if (layer) {
        // Paths never auto-select; select them manually in select mode.
        ctx.recordCommand(createLayerCmd(layer))
      }
    }
    ;(brushTool as ToolRuntime)._brushState = null
  },

  onCancel() {
    ;(brushTool as ToolRuntime)._brushState = null
    setSelectionSuppressed(false)
  },
}

// While a creation tool is mid-gesture, the previous selection's box stays
// stale on screen (nothing re-renders until the first dispatch). Tools set
// this around creation gestures so Canvas hides the box until release.
// Resize grabs and the move tool never set it, so their boxes stay visible.
let selectionSuppressed = false
export function setSelectionSuppressed(value: boolean) {
  selectionSuppressed = value
}
export function isSelectionSuppressed(): boolean {
  return selectionSuppressed
}

function circleHitsRect(cx: number, cy: number, r: number, layer: Layer): boolean {
  const nearestX = clamp(cx, layer.x, layer.x + layer.width)
  const nearestY = clamp(cy, layer.y, layer.y + layer.height)
  return Math.hypot(cx - nearestX, cy - nearestY) <= r
}

type EraseState = {
  initial: Layer[]
  active: boolean
  changed: boolean
  last: Point | null
  stroke: EraserStroke
  stamped: Set<string>
}

function stampEraserPoint(ctx: ToolContext, eraseState: EraseState, point: Point) {
  eraseState.stroke.points.push(point)
  const radius = eraseState.stroke.width / 2
  let changed = false

  const next: Layer[] = []
  for (const layer of ctx.layers) {
    if (!layer.visible) {
      next.push(layer)
      continue
    }

    if (ctx.eraserMode === 'objects') {
      if (circleHitsRect(point.x, point.y, radius, layer)) {
        changed = true
        continue
      }
      next.push(layer)
      continue
    }

    const touched =
      layer.type === 'brush'
        ? (layer as BrushLayer).points.some(
            (p) => Math.hypot(p.x - point.x, p.y - point.y) <= radius + (layer as BrushLayer).strokeWidth / 2
          )
        : circleHitsRect(point.x, point.y, radius, layer)
    if (!touched) {
      next.push(layer)
      continue
    }
    changed = true
    if (eraseState.stamped.has(layer.id)) {
      next.push({ ...layer })
    } else {
      eraseState.stamped.add(layer.id)
      next.push({ ...layer, erasures: [...(layer.erasures ?? []), eraseState.stroke] })
    }
  }

  if (!changed) return
  eraseState.changed = true
  ctx.dispatch({ type: 'SET_LAYERS', layers: next })
}

export const eraserTool: Tool = {
  id: 'eraser',
  cursor: 'auto',

  onPointerDown(event, ctx) {
    const point = ctx.getCanvasPoint(event.clientX, event.clientY)
    setSelectionSuppressed(true)
    const eraseState = {
      initial: ctx.layers,
      active: true,
      changed: false,
      last: point,
      stroke: { points: [], width: ctx.eraserSize },
      stamped: new Set<string>(),
    } as EraseState
    ;(eraserTool as ToolRuntime)._eraseState = eraseState
    stampEraserPoint(ctx, eraseState, point)
  },

  onPointerMove(event, ctx) {
    const eraseState = (eraserTool as ToolRuntime)._eraseState as EraseState | undefined
    if (!eraseState?.active) return
    const point = ctx.getCanvasPoint(event.clientX, event.clientY)
    // Interpolate between events so fast drags carve a continuous swath,
    // even when the gesture starts off of any shape.
    const from = eraseState.last ?? point
    const step = Math.max(eraseState.stroke.width / 4, 1)
    const dist = Math.hypot(point.x - from.x, point.y - from.y)
    const steps = Math.max(1, Math.ceil(dist / step))
    for (let i = 1; i <= steps; i++) {
      stampEraserPoint(ctx, eraseState, {
        x: from.x + ((point.x - from.x) * i) / steps,
        y: from.y + ((point.y - from.y) * i) / steps,
      })
    }
    eraseState.last = point
  },

  onPointerUp(_event, ctx) {
    setSelectionSuppressed(false)
    const eraseState = (eraserTool as ToolRuntime)._eraseState as
      | { initial: Layer[]; active: boolean; changed: boolean }
      | undefined
    if (eraseState?.active && eraseState.changed) {
      const initial = eraseState.initial
      const final = ctx.layers
      ctx.recordCommand({
        apply: () => final,
        undo: () => initial,
      })
    }
    ;(eraserTool as ToolRuntime)._eraseState = null
  },

  onCancel() {
    ;(eraserTool as ToolRuntime)._eraseState = null
    setSelectionSuppressed(false)
  },
}

export const textTool: Tool = {
  id: 'text',
  cursor: 'text',

  onPointerDown(event, ctx) {
    if (ctx.editingTextId) {
      ctx.stopEditingText()
      return
    }

    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
    if (grabResizeHandle(ctx, textTool, pt)) return
    setSelectionSuppressed(true)
    const id = generateId()
    const textLayer: Layer = {
      id,
      type: 'text',
      name: `Text ${id.slice(-4)}`,
      x: pt.x,
      y: pt.y,
      width: 20,
      height: 24,
      rotation: 0,
      opacity: 1,
      visible: true,
      text: '',
      fontSize: 16,
      fill: ctx.fillColor,
    }
    ctx.dispatch({ type: 'CREATE_LAYER', layer: textLayer })
    ctx.startEditingText(id)
  },

  onPointerMove(event, ctx) {
    moveResizeHandle(ctx, textTool, ctx.getCanvasPoint(event.clientX, event.clientY))
  },
  onPointerUp(_event, ctx) {
    setSelectionSuppressed(false)
    endResizeHandle(ctx, textTool)
  },

  onCancel() {
    ;(textTool as ToolRuntime)._resizeState = null
    setSelectionSuppressed(false)
  },
}

function dispatchCreateLayer(ctx: ToolContext, shapeType: 'rectangle' | 'ellipse', id: string, x: number, y: number) {
  // No selection yet — the new shape takes it on pointer-up instead.
  ctx.dispatch({ type: 'START_CREATE', id, shapeType, point: { x, y }, fill: ctx.fillColor })
}

export const tools: Record<ToolId, Tool> = {
  move: moveTool,
  brush: brushTool,
  eraser: eraserTool,
  rectangle: rectangleTool,
  ellipse: ellipseTool,
  text: textTool,
}

export function getToolForId(id: ToolId): Tool {
  return tools[id]
}
