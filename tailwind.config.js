const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	content: [
		'./src/**/*.{js,jsx,mdx}',
	],
	theme: {
		fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.75rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '2rem' }],
      '2xl': ['1.5rem', { lineHeight: '2.25rem' }],
      '3xl': ['1.75rem', { lineHeight: '2.25rem' }],
      '4xl': ['2rem', { lineHeight: '2.5rem' }],
      '5xl': ['2.5rem', { lineHeight: '3rem' }],
      '6xl': ['3rem', { lineHeight: '3.5rem' }],
			'7xl': ['4rem', { lineHeight: '4.5rem' }],
			'8xl': ['6rem', { lineHeight: '4.5rem' }],
			'9xl': ['8rem', { lineHeight: '5rem' }],
    },
		extend: {
			fontFamily: {
				sans: ['Mona Sans', ...defaultTheme.fontFamily.sans],
				display: [
					['Mona Sans', ...defaultTheme.fontFamily.sans],
					{ fontVariationSettings: '"wdth" 125' },
				],
			},
			colors: {
				primary: '#09090b',
				secondary: '#111113',
      },
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('@headlessui/tailwindcss')({ prefix: 'ui' }),
	],
}
