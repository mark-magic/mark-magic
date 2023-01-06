import { readFile, pathExists } from '@liuli-util/fs-extra'
import { InputPlugin, Resource, Tag, Note, convert } from '@mami/cli'
import { output, Sidebar, siderListToTree, VitepressSidebar } from '../output'
import path from 'path'
import { it, expect } from 'vitest'
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
  expect(await pathExists(path.resolve(tempPath, 'sidebar.json'))).true
})

it('siderListToTree', () => {
  const r = siderListToTree([
    {
      id: 'be76d6d99d81444394bc206e08a8e80c',
      title: '1. Welcome to Joplin!',
      path: ['Welcome! (Desktop)'],
    },
    {
      id: '2ba8366ac77c4a93b9eb7595d1343eb6',
      title: '2. Importing and exporting notes',
      path: ['Welcome! (Desktop)'],
    },
    {
      id: '6651b9db52e14d278c6134166a4ef71d',
      title: '3. Synchronising your notes',
      path: ['Welcome! (Desktop)'],
    },
    {
      id: '132e470f077b4299a3db1560b8481bd4',
      title: '4. Tips',
      path: ['Welcome! (Desktop)'],
    },
    {
      id: '6649f36bf0ff4aa3ba26f30c808228c0',
      title: '5. Joplin Privacy Policy',
      path: ['Welcome! (Desktop)'],
    },
  ] as Sidebar[])
  expect(r).deep.eq([
    {
      text: 'Welcome! (Desktop)',
      items: [
        {
          text: '1. Welcome to Joplin!',
          link: '/p/be76d6d99d81444394bc206e08a8e80c.md',
        },
        {
          text: '2. Importing and exporting notes',
          link: '/p/2ba8366ac77c4a93b9eb7595d1343eb6.md',
        },
        {
          text: '3. Synchronising your notes',
          link: '/p/6651b9db52e14d278c6134166a4ef71d.md',
        },
        {
          text: '4. Tips',
          link: '/p/132e470f077b4299a3db1560b8481bd4.md',
        },
        {
          text: '5. Joplin Privacy Policy',
          link: '/p/6649f36bf0ff4aa3ba26f30c808228c0.md',
        },
      ],
    },
  ] as VitepressSidebar[])
})
