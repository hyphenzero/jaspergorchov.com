export default function manifest() {
  return {
    name: 'Jasper Gorchov',
    short_name: 'Jasper Gorchov',
    description:
      'I’m Jasper Gorchov, and I craft immersive web-based apps and beautiful 3D illustrations.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
