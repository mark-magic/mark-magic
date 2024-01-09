import { OutputPlugin, convert } from '@mark-magic/core'
import { fromVirtual } from '@mark-magic/utils'
import { expect, it } from 'vitest'
import * as local from '..'
import path from 'pathe'
import { readFile } from 'fs/promises'
import { initTempPath } from '@liuli-util/test'
import { pathExists } from 'fs-extra/esm'
import { fromMarkdown, getYamlMeta } from '@liuli-util/markdown-util'

const tempPath = initTempPath(__filename)

export function hexo(options?: { path?: string; baseUrl?: string }): OutputPlugin {
  const root = options?.path ?? path.resolve()
  const postsPath = path.resolve(root, 'source/_posts')
  const resourcePath = path.resolve(root, 'source/resources')
  const p = local.output({
    path: postsPath,
    meta: (it) => ({
      layout: 'post',
      title: it.name,
      abbrlink: it.id,
      tags: it.extra?.tags.map((it: { title: string }) => it.title),
      categories: it.path,
      date: it.created,
      updated: it.updated,
    }),
    contentLink: (it) => path.join('/', options?.baseUrl ?? '/', `/p/${it.linkContentId}`),
    resourceLink: (it) => `/resources/${it.resource.id}${path.extname(it.resource.name)}`,
    contentPath: (it) => path.resolve(postsPath, it.id + '.md'),
    resourcePath: (it) => path.resolve(resourcePath, it.id + path.extname(it.name)),
  })
  p.name = 'hexo'
  return p
}

it('basic', async () => {
  const input = fromVirtual([
    {
      id: 'test1',
      content: `
  # test1
  
  [test2](:/content/test2)
        `.trim(),
      path: 'a/b/test1.md',
    },
    {
      id: 'test2',
      content: `
  # test2
  
  [test1](:/content/test1)
  [localDirOutput.test.ts](:/resource/test)
  [github](https://github.com)
                `.trim(),
      resources: [
        {
          id: 'test',
          name: path.basename(__filename),
          raw: await readFile(__filename),
        },
      ],
      path: 'c/test2.md',
    },
  ])
  await convert({
    input: input,
    output: hexo({
      path: tempPath,
    }),
  })

  // const test1Path = path.resolve(tempPath, 'source/_posts/test1.md')
  // expect(await pathExists(test1Path)).true
  // const test2Path = path.resolve(tempPath, 'source/_posts/test2.md')
  // expect(await pathExists(test2Path)).true
  // expect(await pathExists(path.resolve(tempPath, 'source/resources/test.ts'))).true
  // expect(await readFile(test1Path, 'utf-8')).includes('/p/test2')
  // expect(await readFile(test2Path, 'utf-8')).includes('/p/test1')
  // expect(await readFile(test2Path, 'utf-8')).includes(`/resources/test.ts`)
})

it('tags', async () => {
  const input = fromVirtual([
    {
      id: 'test1',
      content: `
  # test1
  
  [test2](:/content/test2)
        `.trim(),
      path: 'a/b/test1.md',
      extra: {
        tags: [
          {
            id: 'blog',
            title: 'blog',
          },
        ],
      },
    },
  ])
  await convert({
    input: input,
    output: hexo({
      path: tempPath,
    }),
  })
  const s = await readFile(path.resolve(tempPath, 'source/_posts/test1.md'), 'utf-8')
  const root = fromMarkdown(s)
  expect((getYamlMeta(root) as { tags: string[] }).tags).deep.eq(['blog'])
})
