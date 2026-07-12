'use client'

import { createContext, type ReactNode, useCallback, useContext, useReducer, useRef } from 'react'
import type { Command } from './commands'
import {
  CommandHistory,
  createLayer as createLayerCmd,
  deleteLayer,
  reorderLayer,
  toggleVisibility,
  updateLayerProperty,
} from './commands'
import type { BrushLayer, EditorAction, EditorState, EllipseLayer, Layer, RectangleLayer } from './types'

function createInitialLayers(): Layer[] {
  return []
}

const initialLayers = createInitialLayers()

export const initialState: EditorState = {
  layers: initialLayers,
  selectedLayerId: null,
  activeTool: 'move',
  theme: 'jg',
  brushSize: 4,
  brushColor: '#1d1d1f',
  fillColor: '#60a5fa',
  history: [],
  historyIndex: 0,
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SELECT_LAYER':
      return { ...state, selectedLayerId: action.id }

    case 'DESELECT':
      return { ...state, selectedLayerId: null }

    case 'SET_TOOL':
      return { ...state, activeTool: action.tool, selectedLayerId: null }

    case 'SET_THEME':
      return { ...state, theme: action.theme }

    case 'SET_BRUSH_SIZE':
      return { ...state, brushSize: action.size }

    case 'SET_BRUSH_COLOR':
      return { ...state, brushColor: action.color }

    case 'SET_FILL_COLOR':
      return { ...state, fillColor: action.color }

    case 'SET_LAYERS':
      return { ...state, layers: action.layers }

    case 'CREATE_LAYER': {
      return {
        ...state,
        layers: [...state.layers, action.layer],
        selectedLayerId: action.layer.id,
      }
    }

    case 'DELETE_LAYER': {
      const filtered = state.layers.filter((l) => l.id !== action.id)
      const newSelected = state.selectedLayerId === action.id ? null : state.selectedLayerId
      return { ...state, layers: filtered, selectedLayerId: newSelected }
    }

    case 'REORDER_LAYER': {
      const layers = [...state.layers]
      const idx = layers.findIndex((l) => l.id === action.id)
      if (idx === -1) return state
      const [layer] = layers.splice(idx, 1)
      layers.splice(action.index, 0, layer)
      return { ...state, layers }
    }

    case 'RENAME_LAYER': {
      const layers = state.layers.map((l) => (l.id === action.id ? { ...l, name: action.name } : l))
      return { ...state, layers }
    }

    case 'TOGGLE_VISIBILITY': {
      const layers = state.layers.map((l) => (l.id === action.id ? { ...l, visible: !l.visible } : l))
      return { ...state, layers }
    }

    case 'SET_LAYER_PROPERTY': {
      const layers = state.layers.map((l) => {
        if (l.id !== action.id) return l
        return { ...l, [action.property]: action.value }
      })
      return { ...state, layers }
    }

    case 'MOVE_LAYER': {
      const layers = state.layers.map((l) => {
        if (l.id !== action.id) return l
        if (l.type !== 'brush') return { ...l, x: action.x, y: action.y }

        const dx = action.x - l.x
        const dy = action.y - l.y

        return {
          ...l,
          x: action.x,
          y: action.y,
          points: l.points.map((point) => ({ x: point.x + dx, y: point.y + dy })),
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
      }
      return {
        ...state,
        layers: [...state.layers, brushLayer],
        selectedLayerId: action.id,
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
        selectedLayerId: action.id,
      }
    }

    case 'UPDATE_CREATING': {
      const layers = state.layers.map((l) => {
        if (l.id !== action.id) return l
        return { ...l, x: action.x, y: action.y, width: action.width, height: action.height }
      })
      return { ...state, layers }
    }

    case 'PUSH_HISTORY':
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
        theme: state.theme,
        brushSize: state.brushSize,
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

export function EditorProvider({ children, initialTheme }: { children: ReactNode; initialTheme?: string }) {
  const [state, baseDispatch] = useReducer(
    editorReducer,
    initialTheme ? { ...initialState, theme: initialTheme as EditorState['theme'] } : initialState
  )
  const stateRef = useRef(state)
  stateRef.current = state
  const historyRef = useRef<CommandHistory>(new CommandHistory())

  const dispatch = useCallback((action: EditorAction) => {
    const current = stateRef.current

    if (action.type === 'UNDO') {
      const newLayers = historyRef.current.undo(current.layers)
      if (newLayers) {
        baseDispatch({ type: 'SET_LAYERS', layers: newLayers })
      }
      return
    }

    if (action.type === 'REDO') {
      const newLayers = historyRef.current.redo(current.layers)
      if (newLayers) {
        baseDispatch({ type: 'SET_LAYERS', layers: newLayers })
      }
      return
    }

    if (action.type === 'DELETE_LAYER') {
      const layer = current.layers.find((l) => l.id === action.id)
      if (layer) {
        const index = current.layers.indexOf(layer)
        historyRef.current.record(deleteLayer(action.id, index, layer))
      }
      baseDispatch(action)
      return
    }

    if (action.type === 'REORDER_LAYER') {
      const oldIndex = current.layers.findIndex((l) => l.id === action.id)
      if (oldIndex !== -1) {
        historyRef.current.record(reorderLayer(action.id, oldIndex, action.index))
      }
      baseDispatch(action)
      return
    }

    if (action.type === 'TOGGLE_VISIBILITY') {
      historyRef.current.record(toggleVisibility(action.id))
      baseDispatch(action)
      return
    }

    if (action.type === 'SET_LAYER_PROPERTY') {
      const layer = current.layers.find((l) => l.id === action.id)
      if (layer && action.property in layer) {
        const oldValue = (layer as any)[action.property]
        historyRef.current.record(updateLayerProperty(action.id, action.property, oldValue, action.value))
      }
      baseDispatch(action)
      return
    }

    if (action.type === 'LOAD_DEFAULT_COMPOSITION') {
      historyRef.current.reset()
      baseDispatch(action)
      return
    }

    baseDispatch(action)
  }, [])

  return (
    <EditorContext.Provider value={{ state, dispatch, history: historyRef.current }}>{children}</EditorContext.Provider>
  )
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}
