import { expect, it, vi } from 'vitest'
import { Content, convert } from '../convert'

it('basic', async () => {
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

it('transform', async () => {
  const content = {
    id: 'test',
    name: 'test',
    content: 'hello world',
    created: Date.now(),
    updated: Date.now(),
    resources: [],
    path: [],
  } as Content
  const f = vi.fn(),
    start = vi.fn(),
    end = vi.fn()
  await convert({
    input: {
      name: 'test-input',
      async *generate(): AsyncGenerator<Content> {
        yield content
        yield content
      },
    },
    transforms: [
      {
        name: 'test-transform',
        start,
        async transform(content: Content) {
          content.content = content.content.toUpperCase()
          return content
        },
        end,
      },
    ],
    output: {
      name: 'test-output',
      handle: f,
    },
  })
  expect(f.mock.calls.length).eq(2)
  expect(f.mock.calls[0][0]).deep.eq({
    ...content,
    content: 'HELLO WORLD',
  })
  expect(start.mock.calls).length(1)
  expect(end.mock.calls).length(1)
})
