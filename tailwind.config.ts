import type { Config } from 'tailwindcss'

const defaultTheme = require('tailwindcss/defaultTheme')

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    fontFamily: {
      sans: ['InterVariable', 'Inter', ...defaultTheme.fontFamily.sans],
      display: [['InterVariable', 'Inter', ...defaultTheme.fontFamily.sans], { fontVariationSettings: '"opsz" 32' }],
      mono: ['var(--font-ibm-plex-mono)', ...defaultTheme.fontFamily.mono],
			code: [
				// 'Fira Code',
				...defaultTheme.fontFamily.mono
			],
    },
    extend: {},
  },
  plugins: [],
}

export default config
