import { readFile } from 'fs/promises'
import path from 'path'
import { expect, it } from 'vitest'
import { convert, InputPlugin } from '@mark-magic/core'
import { output } from '../output'
import { initTempPath } from '@liuli-util/test'
import { fromVirtual } from '@mark-magic/utils'
import { pathExists } from 'fs-extra/esm'

let generateVirtual: InputPlugin

const tempPath = initTempPath(__filename, async () => {
  generateVirtual = fromVirtual(
    [
      {
        id: 'test1',
        content: `
        # test1

        [test2](:/content/test2)
      `,
        path: 'a/b/test1.md',
        extra: {
          tags: ['test'],
        },
      },
      {
        id: 'test2',
        content: `
          # test2

          [test1](:/content/test1)
          [localDirOutput.test.ts](:/resource/test)
          [github](https://github.com)
              `,
        resources: [
          {
            id: 'test',
            name: path.basename(__filename),
            raw: await readFile(__filename),
          },
        ],
        path: 'c/test2.md',
        extra: {
          tags: ['test'],
        },
      },
    ].map((it) => ({
      ...it,
      content: it.content
        .split('\n')
        .map((it) => it.trim())
        .join('\n'),
    })),
  )
})

it('basic', async () => {
  await convert({ input: generateVirtual, output: output({ root: tempPath }) })

  const test1Path = path.resolve(tempPath, 'content/posts/test1.md')
  const test2Path = path.resolve(tempPath, 'content/posts/test2.md')
  const resourcePath = path.resolve(tempPath, 'content/resources/test.ts')
  expect(await pathExists(test1Path)).true
  expect(await pathExists(test2Path)).true
  expect(await pathExists(resourcePath)).true
  expect(await readFile(test1Path, 'utf-8')).includes('[test2](/posts/test2)')
  expect(await readFile(test2Path, 'utf-8')).includes('[test1](/posts/test1)')
  expect(await readFile(test2Path, 'utf-8')).includes('[localDirOutput.test.ts](/resources/test.ts)')
})

it('baseUrl', async () => {
  await convert({ input: generateVirtual, output: output({ root: tempPath, base: '/demo/joplin2hugo' }) })

  const test1Path = path.resolve(tempPath, 'content/posts/test1.md')
  const test2Path = path.resolve(tempPath, 'content/posts/test2.md')
  const resourcePath = path.resolve(tempPath, 'content/resources/test.ts')
  expect(await pathExists(test1Path)).true
  expect(await pathExists(test2Path)).true
  expect(await pathExists(resourcePath)).true
  expect(await readFile(test1Path, 'utf-8')).includes('[test2](/demo/joplin2hugo/posts/test2)')
  expect(await readFile(test2Path, 'utf-8')).includes('[test1](/demo/joplin2hugo/posts/test1)')
  expect(await readFile(test2Path, 'utf-8')).includes('[localDirOutput.test.ts](/demo/joplin2hugo/resources/test.ts)')
})
