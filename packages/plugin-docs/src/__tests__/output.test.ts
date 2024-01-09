import { describe, expect, it } from 'vitest'
import { Content, Resource, convert } from '@mark-magic/core'
import { fromVirtual } from '@mark-magic/utils'
import { output } from '../output'
import path from 'pathe'
import { initTempPath } from '@liuli-util/test'
import { pathExists } from 'fs-extra/esm'
import * as local from '@mark-magic/plugin-local'
import { parse } from 'node-html-parser'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { build } from 'vitepress'

let tempPath = initTempPath(__filename)

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
      name: 'test name',
      description: 'test description',
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
  const s = await readFile(path.resolve(tempPath, 'dist/index.html'), 'utf-8')
  expect(s).include('test name').include('test description').include('GitHub').include('https://github.com')
})

it('should support duplicate name resource', async () => {
  const list = [
    {
      path: 'readme.md',
      content: `# test\n![test](./01/assets/cover.png)`,
    },
    {
      path: '01/readme.md',
      content: `# test 1\n![test](./assets/cover.png)`,
    },
    {
      path: '02/readme.md',
      content: `# test 2\n![test](./assets/cover.png)`,
    },
    {
      path: '01/assets/cover.png',
      content: '01',
    },
    {
      path: '02/assets/cover.png',
      content: '02',
    },
  ]
  await Promise.all(
    list.map(async (it) => {
      const fsPath = path.resolve(tempPath, 'src', it.path)
      await mkdir(path.dirname(fsPath), { recursive: true })
      await writeFile(fsPath, it.content)
    }),
  )
  await convert({
    input: local.input({
      path: path.resolve(tempPath, 'src'),
    }),
    output: output({
      path: path.resolve(tempPath, 'dist'),
      name: 'test name',
      description: 'test description',
      nav: [
        {
          text: 'GitHub',
          link: 'https://github.com',
        },
      ],
    }),
  })
  // await convert({
  //   input: local.input({
  //     path: path.resolve(tempPath, 'src'),
  //   }),
  //   output: local.output({
  //     path: path.resolve(tempPath, 'dist'),
  //   }),
  // })
})

it.skip('should support real site', async () => {
  // const list = await fromAsync(i.generate())
  // console.log(list.length)
  await convert({
    input: local.input({
      path: path.resolve(__dirname, './assets/books/'),
    }),
    output: output({
      path: path.resolve(tempPath, 'dist'),
      name: '魔法少女小圆 飞向星空',
      description:
        '在经历了几个世纪的动荡之后，一个乌托邦式的 AI— 人类政府治理着地球，预示着后稀缺社会的来临和太空殖民的新时代。一次意外的接触却让科技更先进的敌对外星种族打破了和平，这迫使魔法少女们走出幕后，拯救人类文明。在这一切之中，志筑良子，一个普通的女孩，仰望着星空，好奇着她在宇宙中的归所。',
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
      public: path.resolve(__dirname, './assets/books/public'),
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
      rss: {
        hostname: 'https://tts.liuli.moe',
        copyright: 'Copyright © 2023 Hieronym, Inc. Built with feed.',
        ignore: ['**/99/**'],
      },
      debug: {
        // test: true,
      },
    }),
  })
  // expect(await pathExists(path.resolve(tempPath, 'dist/index.html'))).true
  // expect(await pathExists(path.resolve(tempPath, 'dist/a.html'))).true
  // expect(await pathExists(path.resolve(tempPath, 'dist/b.html'))).true
}, 10_000)

it('should inferred prev and next page', async () => {
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

it('should clear strong and em space', async () => {
  await convert({
    input: fromVirtual([
      {
        id: 'readme',
        path: '/readme.md',
        content: '**真，** 她。',
      },
      {
        id: '01',
        path: '/01.md',
        content: '**真，** 她。',
      },
    ]),
    output: output({
      path: path.resolve(tempPath, 'dist'),
      name: 'test',
      lang: 'zh-CN',
    }),
  })
  const dom = parse(await readFile(path.resolve(tempPath, 'dist/index.html'), 'utf-8'))
  expect(dom.querySelector('main')!.textContent).eq('真，她。')
})

describe('rss', () => {
  it('should support rss on basic', async () => {
    await convert({
      input: fromVirtual([
        {
          id: '01',
          path: '/01.md',
          content: '# test 1',
        },
        {
          id: '02',
          path: '/02/readme.md',
          content: '# test 2',
        },
        {
          id: 'readme',
          path: '/readme.md',
          content: '# test',
        },
      ]),
      output: output({
        path: path.resolve(tempPath, 'dist'),
        name: 'test',
        lang: 'zh-CN',
        rss: {
          hostname: 'https://tts.liuli.moe',
          copyright: 'Copyright © 2023 Hieronym, Inc. Built with feed.',
          ignore: ['**/02/**'],
        },
      }),
    })
    expect(await pathExists(path.resolve(tempPath, 'dist/rss.xml'))).true
    const s = await readFile(path.resolve(tempPath, 'dist/rss.xml'), 'utf-8')
    expect(s)
      .include('<![CDATA[test]]>')
      .include('<![CDATA[test 1]]>')
      // .not.include('<![CDATA[test 2]]>')
      .include('https://tts.liuli.moe')
      .include('Copyright © 2023 Hieronym, Inc. Built with feed.')
    expect(s.indexOf('<![CDATA[test]]>')).lt(s.indexOf('<![CDATA[test 1]]>'))
  })
  it('should support rss on multi level', async () => {
    await convert({
      input: fromVirtual([
        {
          id: '01',
          path: '/01/readme.md',
          content: '# test 1',
        },
        {
          id: '02',
          path: '/02/readme.md',
          content: '# test 2',
        },
        {
          id: 'readme',
          path: '/readme.md',
          content: '# test',
        },
      ]),
      output: output({
        path: path.resolve(tempPath, 'dist'),
        name: 'test',
        lang: 'zh-CN',
        rss: {
          hostname: 'https://tts.liuli.moe',
          copyright: 'Copyright © 2023 Hieronym, Inc. Built with feed.',
        },
      }),
    })
    expect(await pathExists(path.resolve(tempPath, 'dist/rss.xml'))).true
    const s = await readFile(path.resolve(tempPath, 'dist/rss.xml'), 'utf-8')
    expect(s)
      .include('<![CDATA[test 1]]>')
      .include('<![CDATA[test]]>')
      .include('https://tts.liuli.moe')
      .include('Copyright © 2023 Hieronym, Inc. Built with feed.')
    expect(s.indexOf('<![CDATA[test]]>')).lt(s.indexOf('<![CDATA[test 1]]>'))
    expect(s.indexOf('<![CDATA[test 1]]>')).lt(s.indexOf('<![CDATA[test 2]]>'))
  })
  it('should working on node_modules', async () => {
    await convert({
      input: fromVirtual([
        {
          id: '01',
          path: '/01.md',
          content: '# test 1',
        },
        {
          id: 'readme',
          path: '/readme.md',
          content: '# test',
        },
      ]),
      output: output({
        path: path.resolve(tempPath, 'dist'),
        name: 'test',
        lang: 'zh-CN',
        rss: {
          hostname: 'https://tts.liuli.moe',
          copyright: 'Copyright © 2023 Hieronym, Inc. Built with feed.',
        },
        debug: {
          root: path.resolve(tempPath, 'node_modules/@mark-magic/plugin-docs'),
        },
      }),
    })
    expect(await pathExists(path.resolve(tempPath, 'dist/rss.xml'))).true
    const s = await readFile(path.resolve(tempPath, 'dist/rss.xml'), 'utf-8')
    expect(s)
      .include('<![CDATA[test 1]]>')
      .include('<![CDATA[test]]>')
      .include('https://tts.liuli.moe')
      .include('Copyright © 2023 Hieronym, Inc. Built with feed.')
  })
  it('should not generate rss when rss not configuration', async () => {
    await convert({
      input: fromVirtual(list),
      output: output({
        path: path.resolve(tempPath, 'dist'),
        name: 'test name',
        description: 'test description',
      }),
    })
    expect(await pathExists(path.resolve(tempPath, 'dist/rss.xml'))).false
  })
  it('should not generate zero width space', async () => {
    await convert({
      input: fromVirtual([
        {
          id: 'readme',
          path: '/readme.md',
          content: '# 第四卷-爱因斯坦-罗森桥',
        },
      ]),
      output: output({
        path: path.resolve(tempPath, 'dist'),
        name: 'test',
        lang: 'zh-CN',
        rss: {
          hostname: 'https://tts.liuli.moe',
          copyright: 'Copyright © 2023 Hieronym, Inc. Built with feed.',
          ignore: ['**/02/**'],
        },
      }),
    })
    expect(await readFile(path.resolve(tempPath, 'dist/rss.xml'), 'utf-8')).not.include('&ZeroWidthSpace;')
  })
  // wait for https://github.com/vuejs/vitepress/issues/3364#issuecomment-1864096230
  it('should support include image on rss', async () => {
    await convert({
      input: fromVirtual([
        {
          id: 'index',
          path: '/index.md',
          content: '![cover](:/resource/cover)',
          resources: [
            {
              id: 'cover',
              name: 'cover.jpg',
              // 保证图片足够大不会被转换为 base64
              raw: Buffer.from('t'.repeat(1024 * 1024 * 2), 'utf-8'),
            },
          ],
        },
      ]),
      output: output({
        path: path.resolve(tempPath, 'dist'),
        name: 'test',
        lang: 'zh-CN',
        rss: {
          hostname: 'https://tts.liuli.moe',
          copyright: 'Copyright © 2023 Hieronym, Inc. Built with feed.',
          ignore: ['**/02/**'],
        },
      }),
    })
    const s = await readFile(path.resolve(tempPath, 'dist/rss.xml'), 'utf-8')
    expect(s).not.include('./resources/cover.jpg')
    expect(parse(s).querySelector('img')!.getAttribute('src')!.startsWith('https://tts.liuli.moe/')).true
  })
})

it('base path', async () => {
  await convert({
    input: fromVirtual(list),
    output: output({
      path: path.resolve(tempPath, 'dist'),
      name: 'test name',
      base: '/test-basepath/',
      description: 'test description',
      nav: [
        {
          text: 'GitHub',
          link: 'https://github.com',
        },
      ],
    }),
  })
}, 10_000)
