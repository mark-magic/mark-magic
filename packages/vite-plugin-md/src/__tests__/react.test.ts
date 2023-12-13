import { writeFile } from 'fs/promises'
import { it, expect } from 'vitest'
import pathe from 'pathe'
import { build } from 'vite'
import { markdown } from '..'
import { renderToString as reactToString } from 'react-dom/server'
import { createElement } from 'react'
import { initTempPath } from '@liuli-util/test'

const tempPath = initTempPath(__filename)

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
