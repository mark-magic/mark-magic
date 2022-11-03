import { expect, it, vi } from 'vitest'
import { convert, Note, OutputPlugin } from '@mami/cli'
import { calcTitle, input } from '../input'

it.skip('joplinInput', async () => {
  const mockFn = vi.fn()
  const outputVirtual: OutputPlugin = {
    name: 'outputVirtual',
    handle: mockFn,
  }
  await convert({
    input: [
      input({
        baseUrl: 'http://127.0.0.1:27583',
        token:
          '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31',
        tag: '',
      }),
    ],
    output: [outputVirtual],
  })
  const r = mockFn.mock.calls.map((item) => (item[0] as Note).title)
  expect(r).not.empty
})

it('calcTitle', () => {
  expect(calcTitle({ id: '1', title: 'test.png', file_extension: 'png', mime: 'image/png' })).eq('test.png')
  expect(calcTitle({ id: '1', title: 'test', file_extension: 'png', mime: 'image/png' })).eq('test.png')
  expect(calcTitle({ id: '1', title: 'test', file_extension: '', mime: 'image/png' })).eq('test.png')
  expect(calcTitle({ id: '1', title: '', file_extension: '', mime: 'image/png' })).eq('1.png')
  expect(calcTitle({ id: '1', title: '', file_extension: 'png', mime: '' })).eq('1.png')
})
