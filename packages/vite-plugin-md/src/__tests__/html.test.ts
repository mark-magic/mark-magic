import { writeFile } from 'fs/promises'
import { it, expect } from 'vitest'
import pathe from 'pathe'
import { build } from 'vite'
import { markdown } from '..'
import { initTempPath } from '@liuli-util/test'

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
