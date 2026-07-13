'use client'

import { ArrowDownIcon, ArrowUpIcon, EyeIcon, EyeSlashIcon, QueueListIcon, TrashIcon } from '@heroicons/react/16/solid'
import type { ReactNode } from 'react'
import { useEditor } from './store'
import type { LayerType } from './types'

const layerGlyphs: Record<LayerType, string> = {
  rectangle: 'R',
  ellipse: 'O',
  text: 'T',
  brush: 'B',
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      className="relative inline-flex size-7 items-center justify-center rounded-xs fill-(--text-tertiary) hover:bg-(--control-hover) hover:fill-(--text-primary) disabled:cursor-not-allowed disabled:opacity-25"
    >
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
        aria-hidden="true"
      />
      {children}
    </button>
  )
}

export function LayersPanel() {
  const { state, dispatch } = useEditor()
  const displayLayers = [...state.layers].reverse()

  return (
    <section className="flex min-h-0 flex-1 flex-col border-b border-(--panel-border) select-none">
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-(--panel-border) bg-(--panel-header-bg) px-3">
        <QueueListIcon className="size-4 shrink-0 fill-(--text-tertiary)" />
        <h3 className="text-sm/5 font-medium text-(--text-secondary)">Layers</h3>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
        {displayLayers.map((layer) => {
          const index = state.layers.findIndex((candidate) => candidate.id === layer.id)
          const isSelected = layer.id === state.selectedLayerId
          const canMoveUp = index < state.layers.length - 1
          const canMoveDown = index > 0

          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => dispatch({ type: 'SELECT_LAYER', id: layer.id })}
              className={`group flex w-full items-center gap-2 rounded-sm py-1.5 pr-1.5 pl-2 text-left ${
                isSelected ? 'bg-(--layer-selected)' : 'hover:bg-(--layer-hover)'
              }`}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-xs bg-(--layer-icon-bg) font-mono text-[0.6875rem]/4 text-(--text-secondary)">
                {layerGlyphs[layer.type]}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm/5 text-(--text-primary)">{layer.name}</span>
              <span className="flex shrink-0 items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                <IconButton
                  label={layer.visible ? 'Hide layer' : 'Show layer'}
                  onClick={() => dispatch({ type: 'TOGGLE_VISIBILITY', id: layer.id })}
                >
                  {layer.visible ? (
                    <EyeIcon className="size-4 shrink-0" />
                  ) : (
                    <EyeSlashIcon className="size-4 shrink-0" />
                  )}
                </IconButton>
                <IconButton
                  label="Move layer up"
                  disabled={!canMoveUp}
                  onClick={() => dispatch({ type: 'REORDER_LAYER', id: layer.id, index: index + 1 })}
                >
                  <ArrowUpIcon className="size-4 shrink-0" />
                </IconButton>
                <IconButton
                  label="Move layer down"
                  disabled={!canMoveDown}
                  onClick={() => dispatch({ type: 'REORDER_LAYER', id: layer.id, index: index - 1 })}
                >
                  <ArrowDownIcon className="size-4 shrink-0" />
                </IconButton>
                <IconButton label="Delete layer" onClick={() => dispatch({ type: 'DELETE_LAYER', id: layer.id })}>
                  <TrashIcon className="size-4 shrink-0 fill-rose-500" />
                </IconButton>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
