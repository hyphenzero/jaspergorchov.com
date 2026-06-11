'use client'

import { useEffect, useMemo, useState } from 'react'
import { FilmGrain, FlowingGradient, FractalNoise, Shader } from 'shaders/react'
import type { PaletteColors } from '@/lib/image-palette'

type Props = {
  backgroundPalette: PaletteColors
}

function ensureHexColor(color: string): string {
  if (color.startsWith('#')) return color
  if (color.startsWith('rgb')) {
    const match = /rgb\((\d+)\s+(\d+)\s+(\d+)\)/.exec(color)
    if (match) {
      const r = Number.parseInt(match[1], 10)
      const g = Number.parseInt(match[2], 10)
      const b = Number.parseInt(match[3], 10)
      return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
    }
  }
  return '#4776E6'
}

function getGradientColors(palette: PaletteColors): { colorA: string; colorB: string; colorC: string; colorD: string } {
  const dominantColors = palette.dominantColors?.length
    ? palette.dominantColors
    : ['#4776E6', '#C44DFF', '#1ABC9C', '#F8BBD9', '#FF8C42']

  const colors = dominantColors.map(ensureHexColor)

  while (colors.length < 4) {
    colors.push(colors[colors.length % dominantColors.length])
  }

  return {
    colorA: colors[0],
    colorB: colors[1],
    colorC: colors[2],
    colorD: colors[3],
  }
}

export function HeroShaders({ backgroundPalette }: Props) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const gradientColors = useMemo(() => getGradientColors(backgroundPalette), [backgroundPalette])

  const filmGrainStrength = isDark ? 0.35 : 0.15
  const fractalNoiseStrength = isDark ? 0.12 : 0.08

  return (
    <Shader className="absolute inset-0 -z-10 opacity-50">
      <FlowingGradient
        colorA={gradientColors.colorA}
        colorB={gradientColors.colorB}
        colorC={gradientColors.colorC}
        colorD={gradientColors.colorD}
        speed={0.6}
        distortion={0.7}
        seed={isDark ? 42 : 17}
        colorSpace="oklch"
      />
      <FractalNoise
        colorA="#000000"
        colorB="#ffffff"
        octaves={4}
        detail={2.2}
        contrast={0.35}
        speed={0.08}
        seed={isDark ? 42 : 17}
        colorSpace="linear"
        opacity={fractalNoiseStrength}
        blendMode="overlay"
      />
      <FilmGrain strength={filmGrainStrength} bias={isDark ? 3 : 1.5} animated={true} opacity={1} blendMode="overlay" />
    </Shader>
  )
}
