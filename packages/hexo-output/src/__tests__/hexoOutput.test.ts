import { readFile, pathExists } from '@liuli-util/fs-extra'
import path from 'path'
import { expect, it } from 'vitest'
import { convert, InputPlugin, Note, Resource, Tag } from '@mami/cli'
import { hexoOutput } from '../hexoOutput'
import { initTestDir } from '../utils/initTestDir'

const tempPath = path.resolve(__dirname, '.temp', path.basename(__filename))
initTestDir(tempPath)

it('hexoOutput', async () => {
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
  await convert({
    input: [generateVirtual],
    output: [hexoOutput({ root: tempPath })],
  })

  expect(await pathExists(path.resolve(tempPath, 'source/_posts/test1.md'))).to.be.true
  expect(await pathExists(path.resolve(tempPath, 'source/_posts/test2.md'))).to.be.true
  expect(await pathExists(path.resolve(tempPath, 'source/resources/test.ts'))).to.be.true
})
