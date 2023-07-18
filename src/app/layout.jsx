import localFont from 'next/font/local'

import { RootLayout } from '@/components/RootLayout'

import './globals.css'

export const metadata = {
	title: {
		template: '%s - Jasper Gorchov',
		default: 'Jasper Gorchov - Software Developer & 3D Artist',
	},
}

export default function Layout({ children }) {
	return (
		<html lang="en" className="h-full bg-black antialiased">
			<body className="flex min-h-full flex-col">
				<RootLayout>{children}</RootLayout>
			</body>
		</html>
	)
}
