import type { Command } from './commands'
import { createLayer as createLayerCmd, resizeLayer, setLayerPosition } from './commands'
import type { EditorAction, Layer, Point, ToolId } from './types'

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
  dispatch: React.Dispatch<EditorAction>
  recordCommand: (cmd: Command) => void
  editingTextId: string | null
  startEditingText: (id: string, text: string, x: number, y: number) => void
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

interface ResizeState {
  layerId: string
  handle: string
  startX: number
  startY: number
  layerStartX: number
  layerStartY: number
  layerStartW: number
  layerStartH: number
  oldPoints?: { x: number; y: number }[]
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
          ;(moveTool as any)._resizeState = {
            layerId: layer.id,
            handle,
            startX: pt.x,
            startY: pt.y,
            layerStartX: layer.x,
            layerStartY: layer.y,
            layerStartW: layer.width,
            layerStartH: layer.height,
            oldPoints: layer.type === 'brush' ? [...layer.points] : undefined,
          } as ResizeState
          return
        }
      }
    }

    const hit = hitTest(ctx.layers, pt)
    if (!hit) {
      if (ctx.selectedLayerId) {
        ctx.dispatch({ type: 'DESELECT' })
      }
      ;(moveTool as any)._dragState = null
      return
    }

    ctx.dispatch({ type: 'SELECT_LAYER', id: hit.id })
    ;(moveTool as any)._dragState = {
      layerId: hit.id,
      startX: pt.x,
      startY: pt.y,
      layerStartX: hit.x,
      layerStartY: hit.y,
    } as DragState
  },

  onPointerMove(event, ctx) {
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)

    const resizeState = (moveTool as any)._resizeState as ResizeState | undefined
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

    const dragState = (moveTool as any)._dragState as DragState | undefined
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
    const dragState = (moveTool as any)._dragState as DragState | undefined
    if (dragState) {
      const layer = ctx.layers.find((l) => l.id === dragState.layerId)
      if (layer && (layer.x !== dragState.layerStartX || layer.y !== dragState.layerStartY)) {
        ctx.recordCommand(
          setLayerPosition(dragState.layerId, dragState.layerStartX, dragState.layerStartY, layer.x, layer.y)
        )
      }
    }

    const resizeState = (moveTool as any)._resizeState as ResizeState | undefined
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
            layer.type === 'brush' ? (layer as any).points : undefined
          )
        )
      }
    }

    ;(moveTool as any)._dragState = null
    ;(moveTool as any)._resizeState = null
  },

  onCancel() {
    ;(moveTool as any)._dragState = null
    ;(moveTool as any)._resizeState = null
  },
}

export const rectangleTool: Tool = {
  id: 'rectangle',
  cursor: 'crosshair',

  onPointerDown(event, ctx) {
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
    ;(rectangleTool as any)._createState = { layerId: null, startX: pt.x, startY: pt.y } as CreateState
  },

  onPointerMove(event, ctx) {
    const createState = (rectangleTool as any)._createState as CreateState | undefined
    if (!createState) return
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
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
    const createState = (rectangleTool as any)._createState as CreateState | undefined
    if (createState) {
      if (createState.layerId) {
        const layer = ctx.layers.find((l) => l.id === createState.layerId)
        if (layer) {
          if (layer.width < 5 && layer.height < 5) {
            ctx.dispatch({ type: 'DELETE_LAYER', id: createState.layerId })
          } else {
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
    ;(rectangleTool as any)._createState = null
  },

  onCancel() {
    ;(rectangleTool as any)._createState = null
  },
}

export const ellipseTool: Tool = {
  id: 'ellipse',
  cursor: 'crosshair',

  onPointerDown(event, ctx) {
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
    ;(ellipseTool as any)._createState = { layerId: null, startX: pt.x, startY: pt.y } as CreateState
  },

  onPointerMove(event, ctx) {
    const createState = (ellipseTool as any)._createState as CreateState | undefined
    if (!createState) return
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
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
    const createState = (ellipseTool as any)._createState as CreateState | undefined
    if (createState) {
      if (createState.layerId) {
        const layer = ctx.layers.find((l) => l.id === createState.layerId)
        if (layer) {
          if (layer.width < 5 && layer.height < 5) {
            ctx.dispatch({ type: 'DELETE_LAYER', id: createState.layerId })
          } else {
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
    ;(ellipseTool as any)._createState = null
  },

  onCancel() {
    ;(ellipseTool as any)._createState = null
  },
}

export const brushTool: Tool = {
  id: 'brush',
  cursor: 'auto',

  onPointerDown(event, ctx) {
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
    const id = generateId()
    ctx.dispatch({ type: 'START_BRUSH_STROKE', id, point: pt, color: ctx.brushColor, size: ctx.brushSize })
    ctx.dispatch({ type: 'SELECT_LAYER', id })
    ;(brushTool as any)._brushState = { layerId: id, points: [pt] } as BrushState
  },

  onPointerMove(event, ctx) {
    const brushState = (brushTool as any)._brushState as BrushState | undefined
    if (!brushState) return
    const pt = ctx.getCanvasPoint(event.clientX, event.clientY)
    brushState.points.push(pt)
    ctx.dispatch({ type: 'ADD_BRUSH_POINT', id: brushState.layerId, point: pt })
  },

  onPointerUp(_event, ctx) {
    const brushState = (brushTool as any)._brushState as BrushState | undefined
    if (brushState) {
      const layer = ctx.layers.find((l) => l.id === brushState.layerId)
      if (layer) {
        ctx.recordCommand(createLayerCmd(layer))
      }
    }
    ;(brushTool as any)._brushState = null
  },

  onCancel() {
    ;(brushTool as any)._brushState = null
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
    ctx.dispatch({ type: 'SET_TOOL', tool: 'move' })
    ctx.startEditingText(id, '', pt.x, pt.y)
  },

  onPointerMove() {},
  onPointerUp() {},

  onCancel() {},
}

function dispatchCreateLayer(ctx: ToolContext, shapeType: 'rectangle' | 'ellipse', id: string, x: number, y: number) {
  ctx.dispatch({ type: 'START_CREATE', id, shapeType, point: { x, y }, fill: ctx.fillColor })
  ctx.dispatch({ type: 'SELECT_LAYER', id })
}

export const tools: Record<ToolId, Tool> = {
  move: moveTool,
  brush: brushTool,
  rectangle: rectangleTool,
  ellipse: ellipseTool,
  text: textTool,
}

export function getToolForId(id: ToolId): Tool {
  return tools[id]
}
