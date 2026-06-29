'use client'

import type { KeyboardEvent } from 'react'
import { Canvas } from './canvas'
import { EditorProvider, useEditor } from './store'
import { ThemeSwitcher } from './theme'
import { BottomToolbar } from './toolbar'

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
  )
}

function EditorInner() {
  const { state, dispatch } = useEditor()

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isEditableTarget(event.target)) return

    const key = event.key.toLowerCase()
    const command = event.metaKey || event.ctrlKey

    if (command && key === 'z') {
      event.preventDefault()
      dispatch({ type: event.shiftKey ? 'REDO' : 'UNDO' })
      return
    }

    if (command && key === 'y') {
      event.preventDefault()
      dispatch({ type: 'REDO' })
      return
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      if (!state.selectedLayerId) return
      event.preventDefault()
      dispatch({ type: 'DELETE_LAYER', id: state.selectedLayerId })
      return
    }

    const toolShortcuts = {
      v: 'move',
      b: 'brush',
      r: 'rectangle',
      e: 'ellipse',
      t: 'text',
    } as const

    if (key in toolShortcuts) {
      event.preventDefault()
      dispatch({ type: 'SET_TOOL', tool: toolShortcuts[key as keyof typeof toolShortcuts] })
    }
  }

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown} className="relative h-full overflow-hidden outline-none">
      <Canvas />
      <div className="absolute top-3 right-3 z-10">
        <ThemeSwitcher />
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <BottomToolbar />
      </div>
    </div>
  )
}

export function MiniEditor() {
  return (
    <EditorProvider>
      <EditorInner />
    </EditorProvider>
  )
}
