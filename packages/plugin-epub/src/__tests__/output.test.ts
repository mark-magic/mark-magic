import { convert } from '@mark-magic/core'
import { it, expect } from 'vitest'
import * as local from '@mark-magic/plugin-local'
import path from 'path'
import { output, sortChapter as sortChapter } from '../output'
import { initTempPath } from '@liuli-util/test'

const tempPath = initTempPath(__filename)

it('generate', async () => {
  await convert({
    input: local.input({
      root: path.resolve(__dirname, './assets/books/01/'),
    }),
    output: output({
      metadata: {
        id: 'to-the-stars-01',
        title: '第一卷-量子纠缠',
        cover: path.resolve(__dirname, './assets/books/01/assets/cover.png'),
        creator: 'Hieronym',
        publisher: 'rxliuli',
        language: 'zh-CN',
      },
      toc: [
        {
          title: '第一章-许愿',
          path: '001-第一章-许愿.md',
        },
        {
          title: '第二章-幻影',
          path: '002-第二章-幻影.md',
        },
        {
          title: '第三章-麻美观影记-上',
          path: '003-第三章-麻美观影记-上.md',
        },
        {
          title: '第四章-麻美观影记-下',
          path: '004-第四章-麻美观影记-下.md',
        },
        {
          title: '第五章-家人',
          path: '005-第五章-家人.md',
        },
        {
          title: '第六章-军队',
          path: '006-第六章-军队.md',
        },
        {
          title: '第七章-南方组',
          path: '007-第七章-南方组.md',
        },
        {
          title: '第八章-政与教',
          path: '008-第八章-政与教.md',
        },
        {
          title: '第九章-回声',
          path: '009-第九章-回声.md',
        },
        {
          title: '第十章-准将',
          path: '010-第十章-准将.md',
        },
        {
          title: '第十一章-以往生活的残骸',
          path: '011-第十一章-以往生活的残骸.md',
        },
        {
          title: '第十二章-狩猎魔兽的人',
          path: '012-第十二章-狩猎魔兽的人.md',
        },
        {
          title: '第十三章-不对等的信息',
          path: '013-第十三章-不对等的信息.md',
        },
        {
          title: '第十四章-血缘',
          path: '014-第十四章-血缘.md',
        },
        {
          title: '第十五章-萨姆萨拉',
          path: '015-第十五章-萨姆萨拉.md',
        },
        {
          title: '第十六章-属于天空的光芒',
          path: '016-第十六章-属于天空的光芒.md',
        },
      ],
      output: path.resolve(tempPath, './01.epub'),
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

it('multi-level', async () => {
  await convert({
    input: local.input({
      root: path.resolve(__dirname, './assets/books/'),
    }),
    output: output({
      metadata: {
        id: 'to-the-stars',
        title: '魔法少女小圆-飞向星空',
        cover: path.resolve(__dirname, './assets/books/01/assets/cover.png'),
        creator: 'Hieronym',
        publisher: 'rxliuli',
        language: 'zh-CN',
      },
      toc: [
        {
          title: '第一卷-量子纠缠',
          path: '01/readme.md',
          children: [
            {
              title: '第一章-许愿',
              path: '001-第一章-许愿.md',
            },
            {
              title: '第二章-幻影',
              path: '002-第二章-幻影.md',
            },
          ],
        },
        {
          title: '第二卷-宇宙膨胀',
          path: '02/readme.md',
          children: [
            {
              title: '幕间-1-无间迷梦',
              path: '02/017-幕间-1-无间迷梦.md',
            },
          ],
        },
      ],
      output: path.resolve(tempPath, './01.epub'),
    }),
  })
})
