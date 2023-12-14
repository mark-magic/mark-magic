import { expect, it } from 'vitest'
import { Content, Resource, convert } from '@mark-magic/core'
import { fromVirtual } from '@mark-magic/utils'
import { output } from '../output'
import path from 'pathe'
import { initTempPath } from '@liuli-util/test'
import { pathExists } from 'fs-extra/esm'
import * as local from '@mark-magic/plugin-local'
import { parse } from 'node-html-parser'
import { readFile } from 'fs/promises'

const tempPath = initTempPath(__filename)

const list: (Pick<Content, 'id' | 'content'> & {
  path: string
  resources?: Pick<Resource, 'id' | 'name' | 'raw'>[]
})[] = [
  { id: 'index', path: '/index.md', content: '# test' },
  {
    id: 'a',
    path: '/a.md',
    content: `
# a
[b](:/content/b)
![c](:/resource/c)
  `.trim(),
    resources: [
      {
        id: 'c',
        name: 'c.jpg',
        raw: Buffer.from(''),
      } as Resource,
    ],
  },
  { id: 'b', path: '/b.md', content: '# b' },
]

it('basic', async () => {
  await convert({
    input: fromVirtual(list),
    output: output({
      path: path.resolve(tempPath, 'dist'),
      name: 'test',
      nav: [
        {
          text: 'GitHub',
          link: 'https://github.com',
        },
      ],
    }),
  })
  expect(await pathExists(path.resolve(tempPath, 'dist/index.html'))).true
  expect(await pathExists(path.resolve(tempPath, 'dist/a.html'))).true
  expect(await pathExists(path.resolve(tempPath, 'dist/b.html'))).true
})

it.skip('should support real site', async () => {
  const i = local.input({
    path: path.resolve(__dirname, './assets/to-the-stars/books/'),
  })
  // const list = await fromAsync(i.generate())
  // console.log(list.length)
  await convert({
    input: i,
    output: output({
      path: path.resolve(tempPath, 'dist'),
      name: '魔法少女小圆 飞向星空',
      nav: [
        {
          text: 'GitHub',
          link: 'https://github.com',
        },
        {
          text: '社区',
          items: [
            {
              text: '原作官网',
              link: 'https://tts.determinismsucks.net',
            },
            {
              text: 'Epub 电子书',
              link: 'https://github.com/liuli-moe/to-the-stars/releases/latest',
            },
            {
              text: '同人画',
              link: 'https://ttshieronym.tumblr.com/tagged/fanart',
            },
          ],
        },
      ],
      logo: {
        light: path.resolve(__dirname, '/logo.png'),
        dark: path.resolve(__dirname, '/logoDark.png'),
      },
      gtag: 'G-F20H7RT1RM',
      sitemap: {
        hostname: 'https://tts.liuli.moe',
      },
      public: path.resolve(__dirname, './assets/to-the-stars/public'),
      giscus: {
        repo: 'liuli-moe/to-the-stars',
        repoId: 'R_kgDOG4H10w',
        category: 'General',
        categoryId: 'DIC_kwDOG4H1084CQhBn',
        mapping: 'pathname',
        reactionsEnabled: '1',
        emitMetadata: '0',
        inputPosition: 'bottom',
        theme: 'preferred_color_scheme',
        lang: 'zh-CN',
        crossorigin: 'anonymous',
      },
      debug: {
        test: true,
      },
    }),
  })
  // expect(await pathExists(path.resolve(tempPath, 'dist/index.html'))).true
  // expect(await pathExists(path.resolve(tempPath, 'dist/a.html'))).true
  // expect(await pathExists(path.resolve(tempPath, 'dist/b.html'))).true
}, 10_000)

it.skip('should inferred prev and next page', async () => {
  await convert({
    input: fromVirtual([
      {
        id: 'readme',
        path: '/readme.md',
        content: '# test',
      },
      {
        id: '01-你在开玩笑吧？',
        path: '/01-你在开玩笑吧？.md',
        content: '# 你在开玩笑吧？',
      },
      {
        id: '02-我才不吃这种嗟来之食',
        path: '/02-我才不吃这种嗟来之食.md',
        content: '# 我才不吃这种嗟来之食',
      },
      {
        id: '03-如果我能给妈妈写封信的话',
        path: '/03-如果我能给妈妈写封信的话.md',
        content: '# 如果我能给妈妈写封信的话……',
      },
    ]),
    output: output({
      path: path.resolve(tempPath, 'dist'),
      name: 'test',
      lang: 'zh-CN',
    }),
  })
  const dom = parse(await readFile(path.resolve(tempPath, 'dist/02-我才不吃这种嗟来之食.html'), 'utf-8'))
  expect(dom.querySelector('.pager-link.prev .title')!.textContent).eq('你在开玩笑吧？')
  expect(dom.querySelector('.pager-link.next .title')!.textContent).eq('如果我能给妈妈写封信的话……')
})
