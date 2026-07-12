import type { BrushLayer, Layer } from './types'

export interface Command {
  apply(layers: Layer[]): Layer[]
  undo(layers: Layer[]): Layer[]
}

export class CommandHistory {
  private stack: Command[] = []
  private index: number = -1

  record(cmd: Command): void {
    this.stack.length = this.index + 1
    this.stack.push(cmd)
    this.index++
  }

  undo(layers: Layer[]): Layer[] | null {
    if (this.index < 0) return null
    const cmd = this.stack[this.index]
    this.index--
    return cmd.undo(layers)
  }

  redo(layers: Layer[]): Layer[] | null {
    if (this.index >= this.stack.length - 1) return null
    this.index++
    return this.stack[this.index].apply(layers)
  }

  get canUndo(): boolean {
    return this.index >= 0
  }

  get canRedo(): boolean {
    return this.index < this.stack.length - 1
  }

  reset(): void {
    this.stack = []
    this.index = -1
  }
}

export function createLayer(layer: Layer): Command {
  return {
    apply(layers) {
      return [...layers, layer]
    },
    undo(layers) {
      return layers.filter((l) => l.id !== layer.id)
    },
  }
}

export function deleteLayer(id: string, index: number, layer: Layer): Command {
  return {
    apply(layers) {
      return layers.filter((l) => l.id !== id)
    },
    undo(layers) {
      const copy = [...layers]
      copy.splice(index, 0, layer)
      return copy
    },
  }
}

export function setLayerPosition(id: string, oldX: number, oldY: number, newX: number, newY: number): Command {
  return {
    apply(layers) {
      return layers.map((l) => (l.id === id ? { ...l, x: newX, y: newY } : l))
    },
    undo(layers) {
      return layers.map((l) => (l.id === id ? { ...l, x: oldX, y: oldY } : l))
    },
  }
}

export function resizeLayer(
  id: string,
  oldX: number,
  oldY: number,
  oldW: number,
  oldH: number,
  newX: number,
  newY: number,
  newW: number,
  newH: number,
  oldPoints?: { x: number; y: number }[],
  newPoints?: { x: number; y: number }[]
): Command {
  return {
    apply(layers) {
      return layers.map((l) => {
        if (l.id !== id) return l
        if (l.type !== 'brush') return { ...l, x: newX, y: newY, width: newW, height: newH }
        return { ...l, x: newX, y: newY, width: newW, height: newH, points: newPoints ?? l.points } as BrushLayer
      })
    },
    undo(layers) {
      return layers.map((l) => {
        if (l.id !== id) return l
        if (l.type !== 'brush') return { ...l, x: oldX, y: oldY, width: oldW, height: oldH }
        return { ...l, x: oldX, y: oldY, width: oldW, height: oldH, points: oldPoints ?? l.points } as BrushLayer
      })
    },
  }
}

export function updateLayerProperty(id: string, property: string, oldValue: unknown, newValue: unknown): Command {
  return {
    apply(layers) {
      return layers.map((l) => (l.id === id ? { ...l, [property]: newValue } : l))
    },
    undo(layers) {
      return layers.map((l) => (l.id === id ? { ...l, [property]: oldValue } : l))
    },
  }
}

export function addBrushPoints(id: string, oldPoints: { x: number; y: number }[]): Command {
  return {
    apply(layers) {
      return layers.map((l) => {
        if (l.id !== id || l.type !== 'brush') return l
        return { ...l, points: [...l.points] }
      })
    },
    undo(layers) {
      return layers.map((l) => {
        if (l.id !== id || l.type !== 'brush') return l
        return { ...l, points: oldPoints }
      })
    },
  }
}

export function reorderLayer(id: string, oldIndex: number, newIndex: number): Command {
  return {
    apply(layers) {
      const copy = [...layers]
      const idx = copy.findIndex((l) => l.id === id)
      if (idx === -1) return layers
      const [moved] = copy.splice(idx, 1)
      const target = newIndex > idx ? newIndex - 1 : newIndex
      copy.splice(target, 0, moved)
      return copy
    },
    undo(layers) {
      const copy = [...layers]
      const idx = copy.findIndex((l) => l.id === id)
      if (idx === -1) return layers
      const [moved] = copy.splice(idx, 1)
      copy.splice(oldIndex, 0, moved)
      return copy
    },
  }
}

export function toggleVisibility(id: string): Command {
  return {
    apply(layers) {
      return layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    },
    undo(layers) {
      return layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    },
  }
}

export function updateText(id: string, oldText: string, newText: string): Command {
  return {
    apply(layers) {
      return layers.map((l) => (l.id === id && l.type === 'text' ? { ...l, text: newText } : l))
    },
    undo(layers) {
      return layers.map((l) => (l.id === id && l.type === 'text' ? { ...l, text: oldText } : l))
    },
  }
}
