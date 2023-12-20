import { pathExists } from 'fs-extra/esm'
import path from 'path'
import { beforeAll, expect, it } from 'vitest'
import { convert, Resource } from '@mark-magic/core'
import { Tag, output } from '../output'
import { initTempPath } from '@liuli-util/test'
import { readFile } from 'fs/promises'
import { fromVirtual } from '@mark-magic/utils'

const tempPath = initTempPath(__filename)

let list: Parameters<typeof fromVirtual>['0']

beforeAll(async () => {
  list = [
    {
      id: 'test1',
      path: 'a/b/test1.md',
      content: '# test1\n\n[test2](:/content/test2)',
      extra: {
        tags: [{ id: 'test', title: 'test' }] as Tag[],
      },
    },
    {
      id: 'test2',
      path: 'c/test2.md',
      content: '# test2\n\n[test1](:/content/test1)\n[localDirOutput.test.ts](:/resource/test)',
      extra: {
        tags: [{ id: 'test', title: 'test' }] as Tag[],
      },
      resources: [
        {
          id: 'test',
          name: path.basename(__filename),
          raw: await readFile(__filename),
        },
      ] as Resource[],
    },
  ]
})

it('basic', async () => {
  await convert({
    input: fromVirtual(list),
    output: output({ path: tempPath }),
  })

  const test1Path = path.resolve(tempPath, 'source/_posts/test1.md')
  const test2Path = path.resolve(tempPath, 'source/_posts/test2.md')
  const resourcePath = path.resolve(tempPath, 'source/resources/test.ts')
  expect(await pathExists(test1Path)).true
  expect(await pathExists(test2Path)).true
  expect(await pathExists(resourcePath)).true
  expect(await readFile(test1Path, 'utf-8')).includes('[test2](/p/test2)')
  expect(await readFile(test2Path, 'utf-8')).includes('[test1](/p/test1)')
  expect(await readFile(test2Path, 'utf-8')).includes('[localDirOutput.test.ts](/resources/test.ts)')
})

it('base config', async () => {
  await convert({
    input: fromVirtual(list),
    output: output({ path: tempPath, base: '/demo/joplin2hexo/' }),
  })

  const test1Path = path.resolve(tempPath, 'source/_posts/test1.md')
  const test2Path = path.resolve(tempPath, 'source/_posts/test2.md')
  const resourcePath = path.resolve(tempPath, 'source/resources/test.ts')
  expect(await pathExists(test1Path)).true
  expect(await pathExists(test2Path)).true
  expect(await pathExists(resourcePath)).true
  expect(await readFile(test1Path, 'utf-8')).includes('[test2](/demo/joplin2hexo/p/test2)')
  expect(await readFile(test2Path, 'utf-8')).includes('[test1](/demo/joplin2hexo/p/test1)')
  expect(await readFile(test2Path, 'utf-8')).includes('[localDirOutput.test.ts](/resources/test.ts)')
})

it('should content not include h1 title', async () => {
  await convert({
    input: fromVirtual([
      {
        id: 'test1',
        path: 'a/b/test1.md',
        content: '# test1',
      },
    ]),
    output: output({ path: tempPath }),
  })
  expect(await readFile(path.resolve(tempPath, 'source/_posts/test1.md'), 'utf-8')).not.includes('# test1')
})
