import { readFile, pathExists } from '@liuli-util/fs-extra'
import { fromMarkdown, getYamlMeta } from '@liuli-util/markdown-util'
import { InputPlugin, Resource, Tag, Note, convert } from '@mami/cli'
import path from 'path'
import { expect, it } from 'vitest'
import { generateSidebar, output } from '../output'
import { initTempPath } from '../test'

const tempPath = initTempPath(__filename)

const generateVirtual: InputPlugin = {
  name: 'generateVirtual',
  async *generate() {
    yield {
      id: 'test1',
      title: 'test1',
      content: `
# test1

[test2](:/test2)
      `.trim(),
      resources: [] as Resource[],
      tags: [{ id: 'test', title: 'test' }] as Tag[],
      path: ['a', 'b'],
      createAt: Date.now(),
      updateAt: Date.now(),
    } as Note
    yield {
      id: 'test2',
      title: 'test2',
      content: `
# test2

[test1](:/test1)
[localDirOutput.test.ts](:/test)
[github](https://github.com)
              `.trim(),
      resources: [
        {
          id: 'test',
          title: path.basename(__filename),
          raw: await readFile(__filename),
        },
      ] as Resource[],
      tags: [{ id: 'test', title: 'test' }] as Tag[],
      path: ['c'],
      createAt: Date.now(),
      updateAt: Date.now(),
    } as Note
  },
}

it('basic', async () => {
  await convert({
    input: [generateVirtual],
    output: [
      output({
        root: tempPath,
      }),
    ],
  })

  const test1Path = path.resolve(tempPath, 'p/test1.md')
  const test2Path = path.resolve(tempPath, 'p/test2.md')
  const resourcePath = path.resolve(tempPath, 'resources/test.ts')
  expect(await pathExists(test1Path)).true
  expect(await pathExists(test2Path)).true
  expect(await pathExists(resourcePath)).true
  expect(await readFile(test1Path, 'utf-8')).includes('[test2](/p/test2)')
  expect(await readFile(test2Path, 'utf-8')).includes('[test1](/p/test1)')
  console.log(await readFile(test2Path, 'utf-8'))
  expect(await readFile(test2Path, 'utf-8')).includes('[localDirOutput.test.ts](../resources/test.ts)')
  expect(await pathExists(path.resolve(tempPath, '_sidebar.md'))).true
  const r = await readFile(test1Path, 'utf-8')
  expect(getYamlMeta(fromMarkdown(r))).null
})

it('generateSidebar', async () => {
  const s = generateSidebar([
    { id: 'test1', title: 'test1', path: ['a', 'b'] },
    { id: 'test2', title: 'test2', path: ['c'] },
    { id: 'test3', title: 'test3', path: ['c'] },
  ])
  expect(s.trim()).eq(
    `
- a
  - b
    - [test1](/p/test1)
- c
  - [test2](/p/test2)
  - [test3](/p/test3)
  `.trim(),
  )
})
