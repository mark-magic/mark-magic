import { mkdirp, remove, readFile, pathExists } from '@liuli-util/fs-extra'
import path from 'path'
import { beforeEach, expect, it } from 'vitest'
import { convert, InputPlugin, Note, Resource, Tag } from '@mami/cli'
import { output } from '../output'
import { calcMeta } from '../utils/calcMeta'
import { filenamifyPath } from 'filenamify'

const tempPath = path.resolve(__dirname, '.temp')
beforeEach(async () => {
  await remove(tempPath)
  await mkdirp(tempPath)
})

it('hexoOutput', async () => {
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
        path: ['a/b'],
      } as Note
      yield {
        id: 'test2',
        title: 'test2',
        content: `
# test2

[test1](:/test1)
[localDirOutput.test.ts](:/test)
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
      } as Note
    },
  }
  await convert({
    input: [generateVirtual],
    output: [
      output({
        noteRootPath: tempPath,
        resourceRootPath: path.resolve(tempPath, '_resources'),
        meta: calcMeta,
      }),
    ],
  })

  const test1Path = path.resolve(tempPath, 'a/b/test1.md')
  expect(await pathExists(test1Path)).true
  const test2Path = path.resolve(tempPath, 'c/test2.md')
  expect(await pathExists(test2Path)).true
  expect(await pathExists(path.resolve(tempPath, '_resources/', path.basename(__filename)))).true
  expect(await readFile(test1Path, 'utf-8')).includes('../../c/test2.md')
  expect(await readFile(test2Path, 'utf-8')).includes('../a/b/test1.md')
  expect(await readFile(test2Path, 'utf-8')).includes('../_resources/localDirOutput.test.ts')
})

it('filename', async () => {
  const generateVirtual: InputPlugin = {
    name: 'generateVirtual',
    async *generate() {
      yield {
        id: 'test1',
        title: 'test1',
        content: `
[foo:bar](:/test2)
        `.trim(),
        resources: [] as Resource[],
        tags: [{ id: 'test', title: 'test' }] as Tag[],
        path: ['a/b'],
      } as Note
      yield {
        id: 'test2',
        title: 'foo:bar',
        content: `
# test2

[test1](:/test1)
                `.trim(),
        resources: [] as Resource[],
        tags: [{ id: 'test', title: 'test' }] as Tag[],
        path: ['c'],
      } as Note
    },
  }
  await convert({
    input: [generateVirtual],
    output: [
      output({
        noteRootPath: tempPath,
        resourceRootPath: path.resolve(tempPath, '_resources'),
        meta: calcMeta,
      }),
    ],
  })

  const test1Path = path.resolve(tempPath, 'a/b/test1.md')
  expect(await pathExists(test1Path)).true
  const test2Path = filenamifyPath(path.resolve(tempPath, 'c/foo:bar.md'))
  expect(await pathExists(test2Path)).true
  expect(await readFile(test1Path, 'utf-8')).includes('../../c/foo!bar.md')
  expect(await readFile(test2Path, 'utf-8')).includes('../a/b/test1.md')
})
