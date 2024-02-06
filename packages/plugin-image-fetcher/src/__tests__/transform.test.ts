import { it, expect, vi } from 'vitest'
import { Content, convert, wrapResourceLink } from '@mark-magic/core'
import { fromVirtual } from '@mark-magic/utils'
import { hashString, transform } from '../transform'
import { writeFile } from 'fs/promises'
import { initTempPath } from '@liuli-util/test'
import path from 'pathe'

const tempPath = initTempPath(__filename)

it('input', async () => {
  const outputMock = vi.fn()
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
    return new Response('data', {
      headers: {
        'content-type': 'image/jpeg',
      },
    })
  })
  await convert({
    input: fromVirtual([
      {
        path: 'test.md',
        content: '![test](https://picsum.photos/200)',
        id: 'test',
      },
    ]),
    transforms: [transform()],
    output: {
      name: 'mock',
      handle: outputMock,
    },
  })
  expect(outputMock.mock.calls).length(1)
  expect(fetchMock).toHaveBeenCalled()
  const content = outputMock.mock.calls[0][0] as Content
  const id = hashString('https://picsum.photos/200')
  expect(content.content.trim()).eq(`![test](${wrapResourceLink(id)})`)
  expect(content.resources).length(1)
  expect(content.resources[0].name).eq(id + '.jpeg')
  expect(content.resources[0].raw.toString()).eq('data')
})
it.skip('input with real download', async () => {
  const outputMock = vi.fn()
  await convert({
    input: fromVirtual([
      {
        path: 'test.md',
        content: '![test](https://picsum.photos/200)',
        id: 'test',
      },
    ]),
    transforms: [transform()],
    output: {
      name: 'mock',
      handle: outputMock,
    },
  })
  expect(outputMock.mock.calls).length(1)
  const content = outputMock.mock.calls[0][0] as Content
  const id = hashString('https://picsum.photos/200')
  expect(content.content.trim()).eq(`![test](:/resources/${id})`)
  expect(content.resources).length(1)
  expect(content.resources[0].name).eq(id + '.jpeg')
  await writeFile(path.resolve(tempPath, content.resources[0].name), content.resources[0].raw)
})
it('input with local image', async () => {
  const fetchMock = vi.spyOn(globalThis, 'fetch')
  const outputMock = vi.fn()
  await convert({
    input: fromVirtual([
      {
        path: 'test.md',
        content: '![test](./test.jpeg)',
        id: 'test',
      },
    ]),
    transforms: [transform()],
    output: {
      name: 'mock',
      handle: outputMock,
    },
  })
  expect(outputMock.mock.calls).length(1)
  expect(fetchMock).not.toHaveBeenCalled()
  const content = outputMock.mock.calls[0][0] as Content
  expect(content.content.trim()).eq('![test](./test.jpeg)')
  expect(content.resources).length(0)
})
