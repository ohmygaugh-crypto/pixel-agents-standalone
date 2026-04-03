/**
 * Generates minimal Cyber Cafe PWA icons under webview-ui/public/icons/.
 * Run from repo root: node scripts/generate-pwa-icons.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { PNG } = require('pngjs')

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'webview-ui', 'public', 'icons')

function rgbaBuffer(width, height, draw) {
  const data = Buffer.alloc(4 * width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = draw(x, y, width, height)
      const i = (width * y + x) << 2
      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
      data[i + 3] = a
    }
  }
  return data
}

function writeIcon(filename, size, innerRatio) {
  const bg = [9, 6, 19]
  const accent = [255, 0, 170]
  const edge = [120, 255, 220]

  const data = rgbaBuffer(size, size, (x, y, w, h) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return [...bg, 255]
    const cx = (w - 1) / 2
    const cy = (h - 1) / 2
    const half = (Math.min(w, h) * innerRatio) / 2
    const dx = Math.abs(x - cx)
    const dy = Math.abs(y - cy)
    const inside = dx <= half && dy <= half
    const border =
      dx <= half + 1 &&
      dy <= half + 1 &&
      (dx > half || dy > half)
    if (border) return [...edge, 255]
    if (inside) return [...accent, 255]
    return [...bg, 255]
  })

  const png = new PNG({ width: size, height: size })
  png.data = data
  const buf = PNG.sync.write(png)
  writeFileSync(join(outDir, filename), buf)
}

mkdirSync(outDir, { recursive: true })
writeIcon('icon-192.png', 192, 0.55)
writeIcon('icon-512.png', 512, 0.55)
writeIcon('icon-512-maskable.png', 512, 0.42)
console.log('Wrote PWA icons to', outDir)
