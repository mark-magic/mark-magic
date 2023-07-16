import { it, expect } from 'vitest'
import { transform } from 'esbuild'
import pathe from 'pathe'
import { readFile } from 'node:fs/promises'
import { fromMarkdown, hastToJsx, mdToHast } from '@liuli-util/markdown-util'

it('transform jsx', async () => {
  const r = await transform(`<div>hello</div>`, { loader: 'jsx' })
  expect(r.code).include('React.createElement')
})

it('multiple tag', async () => {
  await expect(transform(`<div>hello</div><div>hello</div>`, { loader: 'jsx' })).rejects.toThrow()
  expect((await transform(`<><div>hello</div><div>hello</div></>`, { loader: 'jsx' })).code).include(
    'React.createElement',
  )
})

it('hastToJsx', async () => {
  const s = await readFile(
    pathe.resolve(__dirname, '../views/content/assets/books/03/057-第五十七章-三相点.md'),
    'utf-8',
  )
  const hast = mdToHast(fromMarkdown(s))!
  console.log(hast)
  const jsx = hastToJsx(hast)
  // console.log(jsx)
  expect(jsx).include('React.createElement')
})
