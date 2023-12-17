import { convert } from '@mark-magic/core'
import { expect, it } from 'vitest'
import * as local from '@mark-magic/plugin-local'
import path from 'pathe'
import { output } from '../output'
import { initTempPath } from '@liuli-util/test'
import { fromVirtual } from '@mark-magic/utils'
import { EpubOutputConfig } from '../config.schema'

const tempPath = initTempPath(__filename)

// TODO 需要改善，使用虚拟文件而不是不可重现的文件作为测试用例
it.skip('generate', async () => {
  await convert({
    input: local.input({
      path: path.resolve(__dirname, './assets/books/01/'),
    }),
    output: output({
      path: path.resolve(tempPath, './01.epub'),
      id: 'to-the-stars-01',
      title: '第一卷-量子纠缠',
      cover: path.resolve(__dirname, './assets/books/01/assets/cover.png'),
      creator: 'Hieronym',
      publisher: 'rxliuli',
      language: 'zh-CN',
    }),
  })
})

// TODO 需要改善，使用虚拟文件而不是不可重现的文件作为测试用例
it.skip('multi-level', async () => {
  await convert({
    input: local.input({
      path: path.resolve(__dirname, './assets/books/'),
    }),
    output: output({
      path: path.resolve(tempPath, './01.epub'),
      id: 'to-the-stars',
      title: '魔法少女小圆-飞向星空',
      cover: path.resolve(__dirname, './assets/books/01/assets/cover.png'),
      creator: 'Hieronym',
      publisher: 'rxliuli',
      language: 'zh-CN',
    }),
  })
})

const metadata: Omit<EpubOutputConfig, 'path'> = {
  id: 'to-the-stars-01',
  title: '第一卷-量子纠缠',
  creator: 'Hieronym',
  publisher: 'rxliuli',
  language: 'zh-CN',
}

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
      ...metadata,
      path: path.resolve(tempPath, './01.epub'),
    }),
  })
})

it('cover is not absolute path', async () => {
  await convert({
    input: fromVirtual([
      {
        id: '01',
        path: '01.md',
        content: '# 第一章',
      },
    ]),
    output: output({
      ...metadata,
      path: path.resolve(tempPath, './01.epub'),
      root: path.resolve(__dirname, './assets/books/01/'),
    }),
  })
})

it('cover not exisit', async () => {
  await expect(
    convert({
      input: fromVirtual([
        {
          id: '01',
          path: '01.md',
          content: '# 第一章',
        },
      ]),
      output: output({
        ...metadata,
        cover: './cover.png',
        path: path.resolve(tempPath, './01.epub'),
        root: path.resolve(__dirname, './assets/books/01/'),
      }),
    }),
  ).rejects.toThrowError()
})
