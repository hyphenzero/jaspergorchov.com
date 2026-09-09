'use client'

import { createContext, type ReactNode, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { trackEvent } from '@/actions/analytics'
import { CommandHistory, deleteLayer, updateLayerProperty } from './commands'
import type { BrushLayer, EditorAction, EditorState, EllipseLayer, Layer, RectangleLayer } from './types'

function createInitialLayers(): Layer[] {
  return []
}

const initialLayers = createInitialLayers()

// Keep initialState static so server and client render the same HTML.
// The dark-mode color preference (black vs white) is applied lazily on the
// first paint instead, so no fork happens during hydration.
export const initialState: EditorState = {
  layers: initialLayers,
  selectedLayerId: null,
  activeTool: 'brush',
  brushSize: 4,
  eraserSize: 16,
  eraserMode: 'pixels',
  brushColor: '#18181b',
  fillColor: '#18181b',
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SELECT_LAYER':
      return { ...state, selectedLayerId: action.id }

    case 'DESELECT':
      return { ...state, selectedLayerId: null }

    case 'SET_TOOL':
      // Switching tools clears the selection, except when switching
      // specifically to the select tool, which keeps it.
      return { ...state, activeTool: action.tool, selectedLayerId: action.tool === 'move' ? state.selectedLayerId : null }

    case 'SET_BRUSH_SIZE':
      return { ...state, brushSize: action.size }

    case 'SET_ERASER_SIZE':
      return { ...state, eraserSize: action.size }

    case 'SET_ERASER_MODE':
      return { ...state, eraserMode: action.mode }

    case 'SET_BRUSH_COLOR':
      return { ...state, brushColor: action.color }

    case 'SET_FILL_COLOR':
      return { ...state, fillColor: action.color }

    case 'SET_LAYERS':
      return { ...state, layers: action.layers }

    case 'CREATE_LAYER': {
      // No auto-select; callers select explicitly on pointer-up / edit-finish.
      return {
        ...state,
        layers: [...state.layers, action.layer],
      }
    }

    case 'DELETE_LAYER': {
      // Keep a stale selectedLayerId so undo restores the selection along
      // with the layer. Nothing renders for a missing layer, and any new
      // selection overwrites it.
      const filtered = state.layers.filter((l) => l.id !== action.id)
      return { ...state, layers: filtered }
    }

    case 'SET_LAYER_PROPERTY': {
      const layers = state.layers.map((l) => {
        if (l.id !== action.id) return l
        return { ...l, [action.property]: action.value } as Layer
      })
      return { ...state, layers }
    }

    case 'RESIZE_TEXT': {
      const layers = state.layers.map((l) => {
        if (l.id !== action.id) return l
        return { ...l, fontSize: action.fontSize, x: action.x, y: action.y, width: action.width, height: action.height }
      })
      return { ...state, layers }
    }

    case 'SET_TEXT_CONTENT': {
      const layers = state.layers.map((l) => {
        if (l.id !== action.id) return l
        return { ...l, text: action.text, width: action.width, height: action.height }
      })
      return { ...state, layers }
    }

    case 'MOVE_LAYER': {
      const layers = state.layers.map((l) => {
        if (l.id !== action.id) return l
        const dx = action.x - l.x
        const dy = action.y - l.y
        const movedErasures = l.erasures?.map((stroke) => ({
          ...stroke,
          points: stroke.points.map((point) => ({ x: point.x + dx, y: point.y + dy })),
        }))
        if (l.type !== 'brush') return { ...l, x: action.x, y: action.y, erasures: movedErasures }
        return {
          ...l,
          x: action.x,
          y: action.y,
          points: l.points.map((point) => ({ x: point.x + dx, y: point.y + dy })),
          erasures: movedErasures ?? [],
        }
      })
      return { ...state, layers }
    }

    case 'RESIZE_LAYER': {
      const layers = state.layers.map((l) => {
        if (l.id !== action.id) return l
        const flipX = action.width < 0
        const flipY = action.height < 0
        const nx = flipX ? action.x + action.width : action.x
        const ny = flipY ? action.y + action.height : action.y
        const nw = Math.abs(action.width)
        const nh = Math.abs(action.height)
        if (l.type !== 'brush') return { ...l, x: nx, y: ny, width: nw, height: nh, flippedX: flipX, flippedY: flipY }
        const scaleX = l.width > 0 ? nw / l.width : 1
        const scaleY = l.height > 0 ? nh / l.height : 1
        return {
          ...l,
          x: nx,
          y: ny,
          width: nw,
          height: nh,
          flippedX: flipX,
          flippedY: flipY,
          points: l.points.map((p) => ({
            x: flipX !== !!l.flippedX ? nx + nw - (p.x - l.x) * scaleX : nx + (p.x - l.x) * scaleX,
            y: flipY !== !!l.flippedY ? ny + nh - (p.y - l.y) * scaleY : ny + (p.y - l.y) * scaleY,
          })),
        } as BrushLayer
      })
      return { ...state, layers }
    }

    case 'START_BRUSH_STROKE': {
      const brushLayer: BrushLayer = {
        id: action.id,
        type: 'brush',
        name: 'Brush Stroke',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotation: 0,
        opacity: 1,
        visible: true,
        strokeColor: action.color,
        strokeWidth: action.size,
        points: [action.point],
        erasures: [],
      }
      // Paths never auto-select, so the brush tool stays handle-free.
      return {
        ...state,
        layers: [...state.layers, brushLayer],
      }
    }

    case 'ADD_BRUSH_POINT': {
      const layers = state.layers.map((l) => {
        if (l.id !== action.id || l.type !== 'brush') return l
        const newPoints = [...l.points, action.point]
        const xs = newPoints.map((p) => p.x)
        const ys = newPoints.map((p) => p.y)
        const minX = Math.min(...xs)
        const minY = Math.min(...ys)
        const maxX = Math.max(...xs)
        const maxY = Math.max(...ys)
        return {
          ...l,
          points: newPoints,
          x: minX - l.strokeWidth,
          y: minY - l.strokeWidth,
          width: maxX - minX + l.strokeWidth * 2,
          height: maxY - minY + l.strokeWidth * 2,
        } as BrushLayer
      })
      return { ...state, layers }
    }

    case 'START_CREATE': {
      const defaultWidth = action.shapeType === 'rectangle' ? 128 : 112
      const defaultHeight = action.shapeType === 'rectangle' ? 92 : 112
      const base = {
        id: action.id,
        name: action.shapeType === 'rectangle' ? 'Rectangle' : 'Ellipse',
        x: action.point.x - defaultWidth / 2,
        y: action.point.y - defaultHeight / 2,
        width: 0,
        height: 0,
        rotation: 0,
        opacity: 1,
        visible: true,
        fill: action.fill,
      }
      const layer: Layer =
        action.shapeType === 'rectangle'
          ? ({ ...base, type: 'rectangle', cornerRadius: 0 } as RectangleLayer)
          : ({ ...base, type: 'ellipse' } as EllipseLayer)
      return {
        ...state,
        layers: [...state.layers, layer],
      }
    }

    case 'UNDO':
    case 'REDO':
      return state

    case 'LOAD_DEFAULT_COMPOSITION': {
      const layers = createInitialLayers()
      return {
        ...initialState,
        layers,
        selectedLayerId: null,
        activeTool: state.activeTool,
        brushSize: state.brushSize,
        eraserSize: state.eraserSize,
        eraserMode: state.eraserMode,
        brushColor: state.brushColor,
        fillColor: state.fillColor,
      }
    }

    default:
      return state
  }
}

interface EditorContextValue {
  state: EditorState
  dispatch: React.Dispatch<EditorAction>
  history: CommandHistory
}

const EditorContext = createContext<EditorContextValue | null>(null)

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, baseDispatch] = useReducer(editorReducer, initialState)
  const stateRef = useRef(state)
  const drawTrackedRef = useRef(false)
  const [history] = useState(() => new CommandHistory())
  useEffect(() => {
    stateRef.current = state
  })
  // Dark-mode visitors get white defaults instead of black, but the decision
  // must not introduce a hydration mismatch. This effect runs only after
  // hydration and never mutates the DOM beforehand.
  const appliedThemeRef = useRef(false)
  useEffect(() => {
    if (appliedThemeRef.current) return
    appliedThemeRef.current = true
    const darkAtLoad =
      typeof window !== 'undefined' &&
      (window.matchMedia('(prefers-color-scheme: dark)').matches || document.documentElement.classList.contains('dark'))
    if (darkAtLoad) {
      baseDispatch({ type: 'SET_BRUSH_COLOR', color: '#ffffff' })
      baseDispatch({ type: 'SET_FILL_COLOR', color: '#ffffff' })
    }
  }, [])

  const dispatch = useCallback((action: EditorAction) => {
    const current = stateRef.current

    // First real mark on the canvas counts as one "use" per page load —
    // brush strokes and created shapes only, not selection or undo.
    if (action.type === 'START_BRUSH_STROKE' || action.type === 'START_CREATE') {
      if (!drawTrackedRef.current) {
        drawTrackedRef.current = true
        trackEvent({ event_type: 'canvas_draw', content_type: 'home', source: 'drawing-canvas' }).catch(() => {})
      }
    }

    if (action.type === 'UNDO') {
      const newLayers = history.undo(current.layers)
      if (newLayers) {
        baseDispatch({ type: 'SET_LAYERS', layers: newLayers })
      }
      return
    }

    if (action.type === 'REDO') {
      const newLayers = history.redo(current.layers)
      if (newLayers) {
        baseDispatch({ type: 'SET_LAYERS', layers: newLayers })
      }
      return
    }

    if (action.type === 'DELETE_LAYER') {
      const layer = current.layers.find((l) => l.id === action.id)
      if (layer) {
        const index = current.layers.indexOf(layer)
        history.record(deleteLayer(action.id, index, layer))
      }
      baseDispatch(action)
      return
    }

    if (action.type === 'SET_LAYER_PROPERTY') {
      const layer = current.layers.find((l) => l.id === action.id)
      if (layer && action.property in layer) {
        const oldValue = (layer as unknown as Record<string, unknown>)[action.property]
        history.record(updateLayerProperty(action.id, action.property, oldValue, action.value))
      }
      baseDispatch(action)
      return
    }

    if (action.type === 'LOAD_DEFAULT_COMPOSITION') {
      history.reset()
      baseDispatch(action)
      return
    }

    baseDispatch(action)
  }, [history])

  return (
    <EditorContext.Provider value={{ state, dispatch, history }}>{children}</EditorContext.Provider>
  )
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}
