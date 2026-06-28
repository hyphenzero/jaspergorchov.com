export type ToolId = 'move' | 'brush' | 'rectangle' | 'ellipse' | 'text'

export type ThemeId = 'jg' | 'terminal' | 'retro' | 'tactile'

export type LayerType = 'rectangle' | 'ellipse' | 'text' | 'brush'

export interface Point {
  x: number
  y: number
}

export const ARTBOARD_WIDTH = 640
export const ARTBOARD_HEIGHT = 440

export interface BaseLayer {
  id: string
  type: LayerType
  name: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  visible: boolean
}

export interface RectangleLayer extends BaseLayer {
  type: 'rectangle'
  fill: string
  cornerRadius: number
}

export interface EllipseLayer extends BaseLayer {
  type: 'ellipse'
  fill: string
}

export interface TextLayer extends BaseLayer {
  type: 'text'
  text: string
  fontSize: number
  fill: string
}

export interface BrushLayer extends BaseLayer {
  type: 'brush'
  strokeColor: string
  strokeWidth: number
  points: Point[]
}

export type Layer = RectangleLayer | EllipseLayer | TextLayer | BrushLayer

export const TOOL_IDS: ToolId[] = ['move', 'brush', 'rectangle', 'ellipse', 'text']

export const THEME_IDS: ThemeId[] = ['jg', 'terminal', 'retro', 'tactile']

export function isBrushLayer(layer: Layer): layer is BrushLayer {
  return layer.type === 'brush'
}

export type EditorAction =
  | { type: 'SELECT_LAYER'; id: string }
  | { type: 'DESELECT' }
  | { type: 'SET_TOOL'; tool: ToolId }
  | { type: 'SET_THEME'; theme: ThemeId }
  | { type: 'CREATE_LAYER'; layer: Layer }
  | { type: 'DELETE_LAYER'; id: string }
  | { type: 'REORDER_LAYER'; id: string; index: number }
  | { type: 'RENAME_LAYER'; id: string; name: string }
  | { type: 'TOGGLE_VISIBILITY'; id: string }
  | { type: 'SET_LAYER_PROPERTY'; id: string; property: string; value: number | string }
  | { type: 'MOVE_LAYER'; id: string; x: number; y: number }
  | { type: 'RESIZE_LAYER'; id: string; x: number; y: number; width: number; height: number }
  | { type: 'START_BRUSH_STROKE'; id: string; point: Point; color: string; size: number }
  | { type: 'ADD_BRUSH_POINT'; id: string; point: Point }
  | { type: 'START_CREATE'; id: string; shapeType: 'rectangle' | 'ellipse'; point: Point; fill: string }
  | { type: 'UPDATE_CREATING'; id: string; x: number; y: number; width: number; height: number }
  | { type: 'PUSH_HISTORY' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_BRUSH_SIZE'; size: number }
  | { type: 'SET_BRUSH_COLOR'; color: string }
  | { type: 'SET_FILL_COLOR'; color: string }
  | { type: 'LOAD_DEFAULT_COMPOSITION' }

export interface EditorState {
  layers: Layer[]
  selectedLayerId: string | null
  activeTool: ToolId
  theme: ThemeId
  brushSize: number
  brushColor: string
  fillColor: string
  history: string[]
  historyIndex: number
}
