'use client'

import { AdjustmentsHorizontalIcon } from '@heroicons/react/16/solid'
import type { ReactNode } from 'react'
import { useEditor } from './store'
import type { BrushLayer, EllipseLayer, RectangleLayer, TextLayer } from './types'

function hasFill(
  layer: RectangleLayer | EllipseLayer | TextLayer | BrushLayer
): layer is RectangleLayer | EllipseLayer | TextLayer {
  return layer.type === 'rectangle' || layer.type === 'ellipse' || layer.type === 'text'
}

function toNumber(value: string, fallback: number) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function clamp(value: number, min?: number, max?: number) {
  if (typeof min === 'number' && value < min) return min
  if (typeof max === 'number' && value > max) return max
  return value
}

function PanelHeader() {
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-(--panel-border) border-b bg-(--panel-header-bg) px-3">
      <AdjustmentsHorizontalIcon className="size-4 shrink-0 fill-(--text-tertiary)" />
      <h3 className="font-medium text-(--text-secondary) text-sm/5">Inspector</h3>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="font-mono text-(--text-tertiary) text-[0.625rem]/4 uppercase tracking-wide">{label}</span>
      {children}
    </label>
  )
}

function InputBase({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={`flex h-8 items-center rounded-sm bg-(--input-bg) ring-(--input-border) ring-1 has-focus-visible:outline-(--accent) has-focus-visible:outline-2 has-focus-visible:-outline-offset-1 ${className}`}
    >
      {children}
    </span>
  )
}

function TextInput({
  name,
  value,
  onChange,
  mono,
}: {
  name: string
  value: string
  onChange: (value: string) => void
  mono?: boolean
}) {
  return (
    <InputBase>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`min-w-0 flex-1 bg-transparent px-2 text-(--text-primary) text-sm/5 outline-none ${
          mono ? 'font-mono text-[0.75rem]/5' : 'font-medium'
        }`}
      />
    </InputBase>
  )
}

function NumberField({
  label,
  name,
  value,
  onChange,
  min,
  max,
}: {
  label: string
  name: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}) {
  return (
    <Field label={label}>
      <InputBase>
        <input
          type="number"
          name={name}
          value={value}
          min={min}
          max={max}
          onChange={(event) => onChange(clamp(toNumber(event.target.value, value), min, max))}
          className="min-w-0 flex-1 bg-transparent px-2 font-mono text-(--text-primary) text-[0.75rem]/5 tabular-nums outline-none"
        />
      </InputBase>
    </Field>
  )
}

function ColorField({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
}) {
  const colorValue = value.startsWith('#') ? value : '#0ea5e9'

  return (
    <Field label={label}>
      <div className="flex min-w-0 items-center gap-2">
        <input
          type="color"
          name={`${name}-picker`}
          aria-label={`${label} picker`}
          value={colorValue}
          onChange={(event) => onChange(event.target.value)}
          className="size-8 shrink-0 cursor-pointer rounded-sm border-0 bg-transparent p-0"
        />
        <TextInput name={name} value={value} onChange={onChange} mono />
      </div>
    </Field>
  )
}

function OpacitySlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <Field label="Opacity">
      <div className="grid gap-1">
        <div className="flex items-center justify-between font-mono text-(--text-secondary) text-[0.625rem]/4 tabular-nums">
          <span>0%</span>
          <span>{value}%</span>
        </div>
        <input
          type="range"
          name="opacity"
          aria-label="Opacity"
          min={0}
          max={100}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full"
        />
      </div>
    </Field>
  )
}

export function Inspector() {
  const { state, dispatch } = useEditor()
  const selectedLayer = state.layers.find((layer) => layer.id === state.selectedLayerId) ?? null

  if (!selectedLayer) {
    return (
      <section className="flex min-h-0 flex-1 select-none flex-col">
        <PanelHeader />
        <div className="flex flex-1 items-center justify-center px-5 py-8 text-center">
          <p className="max-w-[22ch] text-(--text-tertiary) text-sm/5">
            Select a layer to edit position, style, and opacity.
          </p>
        </div>
      </section>
    )
  }

  const update = (property: string, value: number | string) => {
    dispatch({ type: 'SET_LAYER_PROPERTY', id: selectedLayer.id, property, value })
  }

  return (
    <section className="flex min-h-0 flex-1 select-none flex-col">
      <PanelHeader />

      <div className="grid gap-4 overflow-y-auto p-3">
        <Field label="Name">
          <TextInput name="layer-name" value={selectedLayer.name} onChange={(value) => update('name', value)} />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <NumberField
            label="X"
            name="layer-x"
            value={Math.round(selectedLayer.x)}
            onChange={(value) => update('x', value)}
          />
          <NumberField
            label="Y"
            name="layer-y"
            value={Math.round(selectedLayer.y)}
            onChange={(value) => update('y', value)}
          />
          <NumberField
            label="Width"
            name="layer-width"
            value={Math.round(selectedLayer.width)}
            onChange={(value) => update('width', value)}
            min={1}
          />
          <NumberField
            label="Height"
            name="layer-height"
            value={Math.round(selectedLayer.height)}
            onChange={(value) => update('height', value)}
            min={1}
          />
        </div>

        {selectedLayer.type === 'rectangle' ? (
          <NumberField
            label="Radius"
            name="corner-radius"
            value={(selectedLayer as RectangleLayer).cornerRadius}
            onChange={(value) => update('cornerRadius', value)}
            min={0}
            max={120}
          />
        ) : null}

        {selectedLayer.type === 'text' ? (
          <>
            <Field label="Text">
              <TextInput
                name="text-content"
                value={(selectedLayer as TextLayer).text}
                onChange={(value) => update('text', value)}
              />
            </Field>
            <NumberField
              label="Font size"
              name="font-size"
              value={(selectedLayer as TextLayer).fontSize}
              onChange={(value) => update('fontSize', value)}
              min={8}
              max={96}
            />
          </>
        ) : null}

        {hasFill(selectedLayer) ? (
          <ColorField
            label={selectedLayer.type === 'text' ? 'Color' : 'Fill'}
            name="layer-fill"
            value={selectedLayer.fill}
            onChange={(value) => update('fill', value)}
          />
        ) : null}

        {selectedLayer.type === 'brush' ? (
          <>
            <ColorField
              label="Stroke"
              name="brush-stroke"
              value={(selectedLayer as BrushLayer).strokeColor}
              onChange={(value) => update('strokeColor', value)}
            />
            <NumberField
              label="Stroke width"
              name="stroke-width"
              value={(selectedLayer as BrushLayer).strokeWidth}
              onChange={(value) => update('strokeWidth', value)}
              min={1}
              max={64}
            />
          </>
        ) : null}

        <OpacitySlider
          value={Math.round(selectedLayer.opacity * 100)}
          onChange={(value) => update('opacity', value / 100)}
        />
      </div>
    </section>
  )
}
