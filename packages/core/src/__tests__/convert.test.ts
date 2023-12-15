import { expect, it, vi } from 'vitest'
import { Content, convert } from '../convert'

it('convert', async () => {
  const content = {
    id: 'test',
    name: 'test',
    content: '',
    created: Date.now(),
    updated: Date.now(),
    resources: [],
    path: [],
  } as Content
  const f = vi.fn()
  await convert({
    input: {
      name: '',
      async *generate(): AsyncGenerator<Content> {
        yield content
      },
    },
    output: {
      name: '',
      handle: f,
    },
  })
  expect(f.mock.calls.length).eq(1)
  expect(f.mock.calls[0][0]).deep.eq(content)
})
