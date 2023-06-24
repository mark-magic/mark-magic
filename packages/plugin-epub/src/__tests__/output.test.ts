import { convert } from '@mark-magic/core'
import { it, expect } from 'vitest'
import * as local from '@mark-magic/plugin-local'
import pathe from 'pathe'
import { output, sortChapter as sortChapter, treeSidebarByPath } from '../output'
import { initTempPath } from '@liuli-util/test'
import { fromVirtual } from '@mark-magic/utils'

const tempPath = initTempPath(__filename)

it('generate', async () => {
  await convert({
    input: local.input({
      path: pathe.resolve(__dirname, './assets/books/01/'),
    }),
    output: output({
      metadata: {
        id: 'to-the-stars-01',
        title: '第一卷-量子纠缠',
        cover: pathe.resolve(__dirname, './assets/books/01/assets/cover.png'),
        creator: 'Hieronym',
        publisher: 'rxliuli',
        language: 'zh-CN',
      },
      path: pathe.resolve(tempPath, './01.epub'),
    }),
  })
})

it('sortChapter', () => {
  expect(sortChapter([{ path: '001.md' }, { path: 'readme.md' }]).map((it) => it.path)).deep.eq(['readme.md', '001.md'])
  expect(sortChapter([{ path: '01/001.md' }, { path: '01/readme.md' }]).map((it) => it.path)).deep.eq([
    '01/readme.md',
    '01/001.md',
  ])
  expect(sortChapter([{ path: '01/001.md' }, { path: '01/index.md' }]).map((it) => it.path)).deep.eq([
    '01/index.md',
    '01/001.md',
  ])
  expect(
    sortChapter([
      { path: '01/001.md' },
      { path: '01/readme.md' },
      { path: '02/017-幕间-1-无间迷梦.md' },
      { path: '02/readme.md' },
      { path: 'cover' },
    ]).map((it) => it.path),
  ).deep.eq(['cover', '01/readme.md', '01/001.md', '02/readme.md', '02/017-幕间-1-无间迷梦.md'])
})

it('treeSidebarByPath', () => {
  expect(treeSidebarByPath([{ path: '001.md' }, { path: 'readme.md' }])).deep.eq([{ path: '001.md' }])

  expect(
    treeSidebarByPath([
      { path: '01/001.md' },
      { path: '01/readme.md' },
      { path: '02/017-幕间-1-无间迷梦.md' },
      { path: '02/readme.md' },
    ]),
  ).deep.eq([
    { path: '01/readme.md', children: [{ path: '01/001.md' }] },
    { path: '02/readme.md', children: [{ path: '02/017-幕间-1-无间迷梦.md' }] },
  ])
})

it('multi-level', async () => {
  await convert({
    input: local.input({
      path: pathe.resolve(__dirname, './assets/books/'),
    }),
    output: output({
      metadata: {
        id: 'to-the-stars',
        title: '魔法少女小圆-飞向星空',
        cover: pathe.resolve(__dirname, './assets/books/01/assets/cover.png'),
        creator: 'Hieronym',
        publisher: 'rxliuli',
        language: 'zh-CN',
      },
      path: pathe.resolve(tempPath, './01.epub'),
    }),
  })
})

it('no cover', async () => {
  await convert({
    input: fromVirtual([
      {
        id: '01',
        path: '01.md',
        content: '# 第一章',
      },
    ]),
    output: output({
      metadata: {
        id: 'to-the-stars-01',
        title: '第一卷-量子纠缠',
        creator: 'Hieronym',
        publisher: 'rxliuli',
        language: 'zh-CN',
      },
      path: pathe.resolve(tempPath, './01.epub'),
    }),
  })
})
