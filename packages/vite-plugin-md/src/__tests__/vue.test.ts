import { writeFile } from 'fs/promises'
import { it, expect } from 'vitest'
import pathe from 'pathe'
import { build } from 'vite'
import { markdown } from '..'
import { h } from 'vue'
import { renderToString as vueToString } from 'vue/server-renderer'
import { initTempPath } from '@liuli-util/test'

const tempPath = initTempPath(__filename)

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
