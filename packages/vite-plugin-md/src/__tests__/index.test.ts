import { mkdir, rm, writeFile } from 'fs/promises'
import { it, expect, beforeEach } from 'vitest'
import pathe from 'pathe'
import { build } from 'vite'
import { markdown } from '..'
import { renderToString as reactToString } from 'react-dom/server'
import { createElement } from 'react'
import { h } from 'vue'
import { renderToString as vueToString } from 'vue/server-renderer'

function initTempPath(__filename: string) {
  const tempPath = pathe.resolve(pathe.dirname(__filename), '.temp', pathe.basename(__filename))
  beforeEach(async () => {
    await rm(tempPath, { recursive: true, force: true })
    await mkdir(tempPath, { recursive: true })
  })
  return tempPath
}

const tempPath = initTempPath(__filename)

it('html', async () => {
  await Promise.all([
    writeFile(pathe.resolve(tempPath, 'readme.md'), '# hello'),
    writeFile(pathe.resolve(tempPath, 'index.ts'), `import html from './readme.md'; export default html;`),
  ])
  await build({
    root: tempPath,
    build: {
      lib: {
        entry: 'index.ts',
        formats: ['es'],
        fileName: 'index',
      },
    },
    plugins: [markdown({ mode: 'html' })],
  })
  const r = await import(pathe.resolve(tempPath, 'dist/index.js'))
  expect(r.default).eq('<h1>hello</h1>')
})

it('react', async () => {
  await Promise.all([
    writeFile(pathe.resolve(tempPath, 'readme.md'), '# hello'),
    writeFile(
      pathe.resolve(tempPath, 'index.tsx'),
      `import ReactComponent from './readme.md'; export default ReactComponent;`,
    ),
  ])
  await build({
    root: tempPath,
    build: {
      lib: {
        entry: 'index.tsx',
        formats: ['es'],
        fileName: 'index',
      },
      rollupOptions: {
        external: ['react'],
      },
      minify: false,
    },
    plugins: [markdown({ mode: 'react' })],
  })
  const r = await import(pathe.resolve(tempPath, 'dist/index.js'))
  expect(r.default.name).eq('ReactComponent')
  expect(reactToString(createElement(r.default))).eq('<h1>hello</h1>')
})

it('vue', async () => {
  await Promise.all([
    writeFile(pathe.resolve(tempPath, 'readme.md'), '# hello'),
    writeFile(
      pathe.resolve(tempPath, 'index.tsx'),
      `import VueComponent from './readme.md'; export default VueComponent;`,
    ),
  ])
  await build({
    root: tempPath,
    build: {
      lib: {
        entry: 'index.tsx',
        formats: ['es'],
        fileName: 'index',
      },
      rollupOptions: {
        external: ['vue'],
      },
      minify: false,
    },
    plugins: [markdown({ mode: 'vue' })],
  })
  const r = await import(pathe.resolve(tempPath, 'dist/index.js'))
  expect(r.default.name).eq('VueComponent')
  expect(await vueToString(h(r.default))).include('<h1>hello</h1>')
})
