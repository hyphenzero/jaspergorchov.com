export type ToolId = 'move' | 'brush' | 'eraser' | 'rectangle' | 'ellipse' | 'text'

export type EraserMode = 'pixels' | 'objects'

export type LayerType = 'rectangle' | 'ellipse' | 'text' | 'brush'

export interface Point {
  x: number
  y: number
}

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
  flippedX?: boolean
  flippedY?: boolean
  erasures?: EraserStroke[]
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

export interface EraserStroke {
  points: Point[]
  width: number
}

export interface BrushLayer extends BaseLayer {
  type: 'brush'
  strokeColor: string
  strokeWidth: number
  points: Point[]
  erasures: EraserStroke[]
}

export type Layer = RectangleLayer | EllipseLayer | TextLayer | BrushLayer

export const TOOL_IDS: ToolId[] = ['move', 'brush', 'eraser', 'rectangle', 'ellipse', 'text']

export function isBrushLayer(layer: Layer): layer is BrushLayer {
  return layer.type === 'brush'
}

export type EditorAction =
  | { type: 'SELECT_LAYER'; id: string }
  | { type: 'DESELECT' }
  | { type: 'SET_TOOL'; tool: ToolId }
  | { type: 'CREATE_LAYER'; layer: Layer }
  | { type: 'DELETE_LAYER'; id: string }
  | { type: 'SET_LAYER_PROPERTY'; id: string; property: string; value: number | string }
  | { type: 'MOVE_LAYER'; id: string; x: number; y: number }
  | { type: 'RESIZE_LAYER'; id: string; x: number; y: number; width: number; height: number }
  | { type: 'RESIZE_TEXT'; id: string; fontSize: number; x: number; y: number; width: number; height: number }
  | { type: 'SET_TEXT_CONTENT'; id: string; text: string; width: number; height: number }
  | { type: 'START_BRUSH_STROKE'; id: string; point: Point; color: string; size: number }
  | { type: 'ADD_BRUSH_POINT'; id: string; point: Point }
  | { type: 'START_CREATE'; id: string; shapeType: 'rectangle' | 'ellipse'; point: Point; fill: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_BRUSH_SIZE'; size: number }
  | { type: 'SET_ERASER_SIZE'; size: number }
  | { type: 'SET_ERASER_MODE'; mode: EraserMode }
  | { type: 'SET_BRUSH_COLOR'; color: string }
  | { type: 'SET_FILL_COLOR'; color: string }
  | { type: 'LOAD_DEFAULT_COMPOSITION' }
  | { type: 'SET_LAYERS'; layers: Layer[] }

export interface EditorState {
  layers: Layer[]
  selectedLayerId: string | null
  activeTool: ToolId
  brushSize: number
  eraserSize: number
  eraserMode: EraserMode
  brushColor: string
  fillColor: string
}
