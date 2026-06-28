'use client'

import { createContext, type ReactNode, useContext, useReducer } from 'react'
import type {
  BrushLayer,
  EditorAction,
  EditorState,
  EllipseLayer,
  Layer,
  Point,
  RectangleLayer,
  TextLayer,
} from './types'
import { ARTBOARD_HEIGHT, ARTBOARD_WIDTH } from './types'

const HISTORY_MAX = 20

function createInitialLayers(): Layer[] {
  return []
}

const initialLayers = createInitialLayers()
const initialHistory = [JSON.stringify(initialLayers)]

export const initialState: EditorState = {
  layers: initialLayers,
  selectedLayerId: null,
  activeTool: 'move',
  theme: 'jg',
  brushSize: 4,
  brushColor: '#1d1d1f',
  fillColor: '#60a5fa',
  history: initialHistory,
  historyIndex: 0,
}

function pushHistory(state: EditorState): EditorState {
  const snapshot = JSON.stringify(state.layers)
  if (state.history[state.historyIndex] === snapshot) {
    return state
  }

  const newHistory = state.history.slice(0, state.historyIndex + 1)
  newHistory.push(snapshot)
  while (newHistory.length > HISTORY_MAX) {
    newHistory.shift()
  }
  return {
    ...state,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  }
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

    case 'CREATE_LAYER': {
      const newState = {
        ...state,
        layers: [...state.layers, action.layer],
        selectedLayerId: action.layer.id,
      }
      return pushHistory(newState)
    }

    case 'DELETE_LAYER': {
      const filtered = state.layers.filter((l) => l.id !== action.id)
      const newSelected = state.selectedLayerId === action.id ? null : state.selectedLayerId
      return pushHistory({ ...state, layers: filtered, selectedLayerId: newSelected })
    }

    case 'REORDER_LAYER': {
      const layers = [...state.layers]
      const idx = layers.findIndex((l) => l.id === action.id)
      if (idx === -1) return state
      const [layer] = layers.splice(idx, 1)
      layers.splice(action.index, 0, layer)
      return pushHistory({ ...state, layers })
    }

    case 'RENAME_LAYER': {
      const layers = state.layers.map((l) => (l.id === action.id ? { ...l, name: action.name } : l))
      return pushHistory({ ...state, layers })
    }

    case 'TOGGLE_VISIBILITY': {
      const layers = state.layers.map((l) => (l.id === action.id ? { ...l, visible: !l.visible } : l))
      return pushHistory({ ...state, layers })
    }

    case 'SET_LAYER_PROPERTY': {
      const layers = state.layers.map((l) => {
        if (l.id !== action.id) return l
        return { ...l, [action.property]: action.value }
      })
      return pushHistory({ ...state, layers })
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
      const layers = state.layers.map((l) =>
        l.id === action.id ? { ...l, x: action.x, y: action.y, width: action.width, height: action.height } : l
      )
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
        x: Math.max(0, Math.min(ARTBOARD_WIDTH - defaultWidth, action.point.x - defaultWidth / 2)),
        y: Math.max(0, Math.min(ARTBOARD_HEIGHT - defaultHeight, action.point.y - defaultHeight / 2)),
        width: defaultWidth,
        height: defaultHeight,
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
      return pushHistory(state)

    case 'UNDO': {
      if (state.historyIndex <= 0) return state
      const newIndex = state.historyIndex - 1
      const layers = JSON.parse(state.history[newIndex])
      return {
        ...state,
        layers,
        selectedLayerId: layers.some((layer: Layer) => layer.id === state.selectedLayerId)
          ? state.selectedLayerId
          : null,
        historyIndex: newIndex,
      }
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state
      const newIndex = state.historyIndex + 1
      const layers = JSON.parse(state.history[newIndex])
      return {
        ...state,
        layers,
        selectedLayerId: layers.some((layer: Layer) => layer.id === state.selectedLayerId)
          ? state.selectedLayerId
          : null,
        historyIndex: newIndex,
      }
    }

    case 'LOAD_DEFAULT_COMPOSITION': {
      const layers = createInitialLayers()
      const history = [JSON.stringify(layers)]
      return {
        ...initialState,
        layers,
        history,
        historyIndex: 0,
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
}

const EditorContext = createContext<EditorContextValue | null>(null)

export function EditorProvider({ children, initialTheme }: { children: ReactNode; initialTheme?: string }) {
  const [state, dispatch] = useReducer(
    editorReducer,
    initialTheme ? { ...initialState, theme: initialTheme as EditorState['theme'] } : initialState
  )

  return <EditorContext.Provider value={{ state, dispatch }}>{children}</EditorContext.Provider>
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return context
}
