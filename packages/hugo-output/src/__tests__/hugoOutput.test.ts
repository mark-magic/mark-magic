import { mkdirp, remove, readFile, pathExists } from '@liuli-util/fs-extra'
import path from 'path'
import { afterEach, beforeEach, expect, it, isWatchMode } from 'vitest'
import { convert, InputPlugin, Note, Resource, Tag } from '@mami/cli'
import { hugoOutput } from '../hugoOutput'

const tempPath = path.resolve(__dirname, '.temp')
beforeEach(async () => {
  await remove(tempPath)
  await mkdirp(tempPath)
})
afterEach(async () => {
  if (!isWatchMode()) {
    await remove(tempPath)
  }
})

it('hugoOutput', async () => {
  const generateVirtual: InputPlugin = {
    name: 'generateVirtual',
    async *generate() {
      yield {
        id: 'test1',
        title: 'test1',
        content: '',
        resources: [] as Resource[],
        tags: [] as Tag[],
        createAt: Date.now(),
      } as Note
      yield {
        id: 'test2',
        title: 'test2',
        content: '',
        resources: [
          {
            id: 'test',
            title: path.basename(__filename),
            raw: await readFile(__filename),
          },
        ] as Resource[],
        tags: [] as Tag[],
        createAt: Date.now(),
      } as Note
    },
  }

  await convert({ plugins: [generateVirtual, hugoOutput({ root: tempPath })] })

  expect(await pathExists(path.resolve(tempPath, 'content/posts/test1.md'))).to.be.true
  expect(await pathExists(path.resolve(tempPath, 'content/posts/test2.md'))).to.be.true
  expect(await pathExists(path.resolve(tempPath, 'content/resources/test.ts'))).to.be.true
})
