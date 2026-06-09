type RgbColor = {
  red: number
  green: number
  blue: number
}

export type PaletteColors = {
  light: string
  dark: string
  dominantColors: string[]
}

const LIGHT_BACKGROUND_BASE: RgbColor = { red: 250, green: 250, blue: 251 }
const DARK_BACKGROUND_BASE: RgbColor = { red: 24, green: 24, blue: 27 }
const DEFAULT_LIGHT_BACKGROUND = 'rgb(244 244 245)'
const DEFAULT_DARK_BACKGROUND = 'rgb(24 24 27)'

const MAX_IMAGE_DIMENSION = 256
const QUANTIZATION_LEVELS = 32
const MIN_ALPHA = 24
const NUM_DOMINANT_COLORS = 5

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function normalizeChannel(value: number) {
  return clamp(Math.round((value / 255) * (QUANTIZATION_LEVELS - 1)), 0, QUANTIZATION_LEVELS - 1)
}

function packColor(red: number, green: number, blue: number) {
  return (red << 8) | (green << 4) | blue
}

function toRgbString(color: RgbColor): string {
  return `rgb(${color.red} ${color.green} ${color.blue})`
}

function mixColor(base: RgbColor, accent: RgbColor, accentWeight: number): RgbColor {
  const baseWeight = 1 - accentWeight
  return {
    red: Math.round(base.red * baseWeight + accent.red * accentWeight),
    green: Math.round(base.green * baseWeight + accent.green * accentWeight),
    blue: Math.round(base.blue * baseWeight + accent.blue * accentWeight),
  }
}

function rgbToHsl(color: RgbColor) {
  const red = color.red / 255
  const green = color.green / 255
  const blue = color.blue / 255

  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  const lightness = (max + min) / 2

  if (delta === 0) {
    return { hue: 0, saturation: 0, lightness }
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  let hue = 0

  if (max === red) {
    hue = ((green - blue) / delta) % 6
  } else if (max === green) {
    hue = (blue - red) / delta + 2
  } else {
    hue = (red - green) / delta + 4
  }

  return {
    hue: (hue * 60 + 360) % 360,
    saturation,
    lightness,
  }
}

function colorDistance(a: RgbColor, b: RgbColor) {
  const red = a.red - b.red
  const green = a.green - b.green
  const blue = a.blue - b.blue
  return Math.sqrt(red * red + green * green + blue * blue)
}

export function createFallbackPalette(backgroundColor?: string): PaletteColors {
  if (!backgroundColor) {
    return {
      light: DEFAULT_LIGHT_BACKGROUND,
      dark: DEFAULT_DARK_BACKGROUND,
      dominantColors: ['#4776E6', '#C44DFF', '#1ABC9C', '#F8BBD9', '#FF8C42'],
    }
  }

  const parsed = backgroundColor.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!parsed) {
    return {
      light: backgroundColor,
      dark: backgroundColor,
      dominantColors: ['#4776E6', '#C44DFF', '#1ABC9C', '#F8BBD9', '#FF8C42'],
    }
  }

  const hex = parsed[1]
  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((part) => `${part}${part}`)
          .join('')
      : hex

  const accent: RgbColor = {
    red: Number.parseInt(normalized.slice(0, 2), 16),
    green: Number.parseInt(normalized.slice(2, 4), 16),
    blue: Number.parseInt(normalized.slice(4, 6), 16),
  }

  return {
    light: toRgbString(mixColor(LIGHT_BACKGROUND_BASE, accent, 0.22)),
    dark: toRgbString(mixColor(DARK_BACKGROUND_BASE, accent, 0.28)),
    dominantColors: [backgroundColor, backgroundColor, backgroundColor, backgroundColor, backgroundColor],
  }
}

function chooseDominantColors(colors: Array<{ color: RgbColor; count: number }>, numColors: number): RgbColor[] {
  const ranked = [...colors].sort((left, right) => {
    const leftHsl = rgbToHsl(left.color)
    const rightHsl = rgbToHsl(right.color)
    const leftScore = left.count * (0.7 + leftHsl.saturation * 0.8) * (0.85 + (1 - Math.abs(leftHsl.lightness - 0.5)))
    const rightScore =
      right.count * (0.7 + rightHsl.saturation * 0.8) * (0.85 + (1 - Math.abs(rightHsl.lightness - 0.5)))
    return rightScore - leftScore
  })

  const distinct: Array<{ color: RgbColor; count: number }> = []

  for (const entry of ranked) {
    if (distinct.every((current) => colorDistance(current.color, entry.color) > 25)) {
      distinct.push(entry)
    }

    if (distinct.length >= numColors) {
      break
    }
  }

  const palette = distinct.length > 0 ? distinct : ranked.slice(0, numColors)

  return palette.map((entry) => entry.color)
}

function buildPaletteFromDominantColors(colors: RgbColor[]): PaletteColors {
  const representative = colors[0] ?? { red: 128, green: 128, blue: 128 }

  return {
    light: toRgbString(mixColor(LIGHT_BACKGROUND_BASE, representative, 0.26)),
    dark: toRgbString(mixColor(DARK_BACKGROUND_BASE, representative, 0.34)),
    dominantColors: colors.map((c) => `#${c.red.toString(16).padStart(2, '0')}${c.green.toString(16).padStart(2, '0')}${c.blue.toString(16).padStart(2, '0')}`),
  }
}

export async function extractPaletteFromImage(imageSrc: string, backgroundColor?: string): Promise<PaletteColors> {
  if (typeof window === 'undefined') {
    return createFallbackPalette(backgroundColor)
  }

  const image = new window.Image()
  image.decoding = 'async'
  image.crossOrigin = 'anonymous'

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error(`Failed to load image: ${imageSrc}`))
    image.src = imageSrc
  })

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) {
    return createFallbackPalette(backgroundColor)
  }

  const scale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height)
  )
  const width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale))
  const height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale))

  canvas.width = width
  canvas.height = height
  context.drawImage(image, 0, 0, width, height)

  let data: Uint8ClampedArray
  try {
    data = context.getImageData(0, 0, width, height).data
  } catch {
    return createFallbackPalette(backgroundColor)
  }

  const swatches = new Map<number, { count: number; red: number; green: number; blue: number }>()

  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3]
    if (alpha < MIN_ALPHA) continue

    const red = data[index]
    const green = data[index + 1]
    const blue = data[index + 2]
    const key = packColor(normalizeChannel(red), normalizeChannel(green), normalizeChannel(blue))
    const current = swatches.get(key)

    if (current) {
      current.count += 1
      current.red += red
      current.green += green
      current.blue += blue
    } else {
      swatches.set(key, { count: 1, red, green, blue })
    }
  }

  if (swatches.size === 0) {
    return createFallbackPalette(backgroundColor)
  }

  const dominantColors = chooseDominantColors(
    [...swatches.entries()].map(([key, value]) => ({
      color: {
        red: Math.round(value.red / value.count),
        green: Math.round(value.green / value.count),
        blue: Math.round(value.blue / value.count),
      },
      count: value.count,
    })),
    NUM_DOMINANT_COLORS
  )

  if (dominantColors.length === 0) {
    return createFallbackPalette(backgroundColor)
  }

  return buildPaletteFromDominantColors(dominantColors)
}
