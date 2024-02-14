import { convert } from '@mark-magic/core'
import { expect, it } from 'vitest'
import * as local from '@mark-magic/plugin-local'
import path from 'pathe'
import { output } from '../output'
import { initTempPath } from '@liuli-util/test'
import { fromVirtual, trimMarkdown } from '@mark-magic/utils'
import { EpubOutputConfig } from '../config.schema'
import { mkdir, readFile, readdir, writeFile } from 'fs/promises'
import extract from 'extract-zip'
import { parse } from 'node-html-parser'

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

it('Should read readme yaml meta', async () => {
  const outputPath = path.resolve(tempPath, './01.epub')
  await convert({
    input: fromVirtual([
      {
        id: 'readme',
        path: 'readme.md',
        content: trimMarkdown(`
        ---
        book:
          id: test 2
          title: test 2
          creator: test 2
          publisher: test 2
          language: test 2
        ---
        # test 2
      `),
      },
    ]),
    output: output({
      path: outputPath,
      id: 'test 1',
      title: 'test 1',
      creator: 'test 1',
      publisher: 'test 1',
      language: 'test 1',
    }),
  })
  await extract(outputPath, { dir: path.resolve(tempPath, 'dist') })
  const $dom = parse(await readFile(path.resolve(tempPath, 'dist/content.opf'), 'utf-8'))
  expect($dom.getElementsByTagName('dc:identifier')[0].textContent).eq('test 2')
  expect($dom.getElementsByTagName('dc:title')[0].textContent).eq('test 2')
  expect($dom.getElementsByTagName('dc:creator')[0].textContent).eq('test 2')
  expect($dom.getElementsByTagName('dc:publisher')[0].textContent).eq('test 2')
  expect($dom.getElementsByTagName('dc:language')[0].textContent).eq('test 2')
})

it('Should read readme cover yaml meta', async () => {
  const outputPath = path.resolve(tempPath, './01.epub')
  await writeFile(
    path.resolve(tempPath, 'readme.md'),
    trimMarkdown(`
  ---
  book:
    cover: ./assets/cover.jpg
  ---
  # test
`),
  )
  await mkdir(path.resolve(tempPath, './assets'))
  await writeFile(path.resolve(tempPath, './assets/cover.jpg'), trimMarkdown('test'))
  await convert({
    input: local.input({
      path: tempPath,
    }),
    output: output({
      path: outputPath,
    }),
  })
  await extract(outputPath, { dir: path.resolve(tempPath, 'dist') })
  const distCoverPath = path.resolve(
    path.resolve(tempPath, 'dist/Media/'),
    (await readdir(path.resolve(tempPath, 'dist/Media/')))[0],
  )
  expect(await readFile(distCoverPath, 'utf-8')).eq('test')
})

it('Should support break line', async () => {
  const outputPath = path.resolve(tempPath, './01.epub')
  await convert({
    input: fromVirtual([
      {
        id: '01',
        path: '01.md',
        content: '# 第一章\n\n第一行\n第二行',
      },
    ]),
    output: output({
      path: outputPath,
      ...metadata,
    }),
  })
  await extract(outputPath, { dir: path.resolve(tempPath, 'dist') })
  const text = await readFile(path.resolve(tempPath, 'dist/Text/01.xhtml'), 'utf-8')
  expect(text.replaceAll('\n', '')).includes('第一行<br />第二行')
})
