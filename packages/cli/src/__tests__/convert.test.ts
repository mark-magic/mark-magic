import { wait } from '@liuli-util/async'
import { expect, it, vi } from 'vitest'
import { convert, InputPlugin, Note, OutputPlugin } from '../convert'

it('convert', async () => {
  const generateVirtual: InputPlugin = {
    name: 'generateVirtual',
    async *generate() {
      yield { id: 'test1', title: 'test1' } as Note
      yield { id: 'test2', title: 'test2' } as Note
    },
  }
  const mockFn = vi.fn()
  const outputVirtual: OutputPlugin = {
    name: 'outputVirtual',
    handle: mockFn,
  }
  await convert({ input: [generateVirtual], output: [outputVirtual] })

  expect(mockFn.mock.calls.length).eq(2)
})

it('convert slow', async () => {
  const generateVirtual: InputPlugin = {
    name: 'generateVirtual',
    async *generate() {
      yield { id: 'test1', title: 'test1' } as Note
      yield { id: 'test2', title: 'test2' } as Note
    },
  }
  const mockFn = vi.fn().mockImplementation(async (note: Note) => {
    if (note.id === 'test1') {
      await wait(1_000)
    }
  })
  const outputVirtual: OutputPlugin = {
    name: 'outputVirtual',
    handle: mockFn,
  }

  const slowLog = vi.fn()
  await convert({ input: [generateVirtual], output: [outputVirtual] }).on('handle', ({ time }) => {
    if (time > 1000) {
      slowLog()
    }
  })
  expect(slowLog.mock.calls.length).eq(1)
})
