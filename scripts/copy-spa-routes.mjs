#!/usr/bin/env node
/**
 * GitHub Pages "ponytail": real folders with index.html for SPA routes
 * so HEAD/GET return 200 (stores, crawlers) instead of relying only on 404.html.
 */
import { copyFileSync, mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const index = join(dist, 'index.html')

if (!existsSync(index)) {
  console.error('dist/index.html missing — run build first')
  process.exit(1)
}

copyFileSync(index, join(dist, '404.html'))
writeFileSync(join(dist, '.nojekyll'), '')

const routes = ['privacidad', 'rosario', 'coronilla', 'oraciones', 'ajustes']
for (const route of routes) {
  const dir = join(dist, route)
  mkdirSync(dir, { recursive: true })
  copyFileSync(index, join(dir, 'index.html'))
  console.log(`copied index.html → dist/${route}/`)
}

console.log('copied index.html → dist/404.html')
console.log('wrote dist/.nojekyll')
