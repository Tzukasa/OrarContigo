import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Project Pages: set GITHUB_PAGES=1 (or VITE_BASE=/OrarContigo/) at build time.
const base =
  process.env.VITE_BASE ??
  (process.env.GITHUB_PAGES === '1' ? '/OrarContigo/' : '/')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'orarcontigo-mark.svg',
        'orarcontigo-wordmark.svg',
        'icons.svg',
      ],
      manifest: {
        name: 'OrarContigo',
        short_name: 'OrarContigo',
        description:
          'Rosario y Coronilla en español latino, sin cuenta ni conexión.',
        lang: 'es-MX',
        dir: 'ltr',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: '#2F5F5A',
        background_color: '#F7F0E6',
        // Relative to base — works for / and /OrarContigo/
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'orarcontigo-mark.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
        categories: ['lifestyle', 'education'],
      },
      workbox: {
        // App shell + hashed assets + fonts + SVG/PNG icons + HTML
        globPatterns: [
          '**/*.{js,css,html,ico,svg,png,webp,woff,woff2,webmanifest}',
        ],
        navigateFallback: 'index.html',
        // Allow SPA deep links offline (rosario, coronilla, oraciones, …)
        navigateFallbackAllowlist: [/./],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  base,
})
