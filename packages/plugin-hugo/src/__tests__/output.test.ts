import { mkdirp, remove, readFile, pathExists } from '@liuli-util/fs-extra'
import path from 'path'
import { afterEach, beforeEach, expect, it, isWatchMode } from 'vitest'
import { convert, InputPlugin, Note, Resource, Tag } from '@mami/cli'
import { output } from '../output'
import { initTempPath } from '../utils/test'

const tempPath = initTempPath(__filename)

it('hugoOutput', async () => {
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

  await convert({ input: [generateVirtual], output: [output({ root: tempPath })] })

  const test1Path = path.resolve(tempPath, 'content/posts/test1.md')
  const test2Path = path.resolve(tempPath, 'content/posts/test2.md')
  const resourcePath = path.resolve(tempPath, 'content/resources/test.ts')
  expect(await pathExists(test1Path)).true
  expect(await pathExists(test2Path)).true
  expect(await pathExists(resourcePath)).true
  expect(await readFile(test1Path, 'utf-8')).includes('[test2](/p/test2)')
  expect(await readFile(test2Path, 'utf-8')).includes('[test1](/p/test1)')
  expect(await readFile(test2Path, 'utf-8')).includes('[localDirOutput.test.ts](/resources/test.ts)')
})
