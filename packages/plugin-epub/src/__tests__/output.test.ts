import { convert } from '@mark-magic/core'
import { it } from 'vitest'
import * as local from '@mark-magic/plugin-local'
import pathe from 'pathe'
import { output } from '../output'
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
