import { it, expect, vi } from 'vitest'
import { Content, convert } from '@mark-magic/core'
import { input } from '..'
import { omit } from 'lodash-es'

it('input', async () => {
  const mock = vi.fn()
  await convert({
    input: input(),
    output: {
      name: 'mock',
      handle: mock,
    },
  })
  expect(mock.mock.calls).length(1)
  expect(omit(mock.mock.calls[0][0] as Content, 'created', 'updated')).deep.eq({
    id: 'test',
    name: 'test',
    resources: [],
    path: ['test.md'],
    content: 'test',
  })
})
