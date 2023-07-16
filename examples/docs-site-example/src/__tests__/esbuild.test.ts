import { it, expect } from 'vitest'
import { transform } from 'esbuild'

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
