import { convert, InputPlugin, Note, Resource, Tag } from '@mami/cli'
import path from 'path'
import { beforeEach, expect, it } from 'vitest'
import { output } from '../output'
import { readFile } from '@liuli-util/fs-extra'
import { config, Config, folderApi, noteApi, PageUtil, resourceApi, tagApi } from 'joplin-api'
import { pick } from 'lodash-es'

const options: Config = {
  baseUrl: 'http://127.0.0.1:27583',
  token:
    '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31',
}

export async function clearDatabase() {
  await Promise.all((await PageUtil.pageToAllList(tagApi.list)).map(({ id }) => tagApi.remove(id)))
  await Promise.all((await PageUtil.pageToAllList(noteApi.list)).map(({ id }) => noteApi.remove(id)))
  await Promise.all((await PageUtil.pageToAllList(folderApi.list)).map(({ id }) => folderApi.remove(id)))
  await Promise.all((await PageUtil.pageToAllList(resourceApi.list)).map(({ id }) => resourceApi.remove(id)))
}

beforeEach(async () => {
  Object.assign(config, pick(options, 'baseUrl', 'token'))
  await clearDatabase()
})

it('output', async () => {
  const jsonPath = path.resolve(__dirname, '../../package.json')
  const mockInput: InputPlugin = {
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
            title: path.basename(jsonPath),
            raw: await readFile(jsonPath),
          },
        ] as Resource[],
        tags: [{ id: 'test', title: 'test' }] as Tag[],
        path: ['c'],
      } as Note
    },
  }

  await convert({
    input: [mockInput],
    output: [output(options)],
  })
  expect(await PageUtil.pageToAllList(noteApi.list)).length(2)
  const list = await PageUtil.pageToAllList(resourceApi.list)
  expect(list.length).eq(1)
  const res = await resourceApi.get(list[0].id, ['file_extension', 'mime'])
  expect(res.mime).eq('application/json')
  expect(res.file_extension).eq('json')
})

it.only('fix dont output', async () => {
  await convert({
    input: [
      {
        name: 'test-input',
        async *generate() {
          yield {
            id: '7a436b6754e4484db517fc002532d94d',
            title: '终之空通关感想',
            content:
              // 很神奇，joplin 创建笔记的时候会开始缓存图片
              '![1642905576354](https://images.weserv.nl/?url=https://lh3.googleusercontent.com/pw/AL9nZEUmvKBtRxGeG-J-0oVDVmdZccu0E0_HiDHaMPlvWBLp1v2wjaA152s9FxkIRFZROAChN-tYgimcK-ZYBFD_KGya40RzSKfDTVJqvoXjg5CsBmAaJPurSPdDmaDm6Bcunj4IxL_YPBnwtH0h7XdwaUxN=w1600-h1200-no)',
            createAt: 1642903136209,
            updateAt: 1659274731375,
            tags: [
              { id: '00db2306-15e3-4d89-a8b3-66f281e409b7', title: 'galgame' },
              { id: 'cd5a8bdb-f38b-4a15-a90a-1d5b8124fbea', title: 'blog' },
            ] as Tag[],
            resources: [] as Resource[],
            path: ['其他', 'Galgame'],
          } as Note
        },
      },
    ],

    output: [output(options)],
  })
})
