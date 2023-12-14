import { describe, expect, it } from 'vitest'
import { Sidebar, generateSidebar, output } from '../output'
import { Content, Resource, convert } from '@mark-magic/core'
import * as local from '@mark-magic/plugin-local'
import pathe from 'pathe'
import { initTempPath } from '@liuli-util/test'
import { pathExists } from '@liuli-util/fs'
import { readFile } from 'fs/promises'
import { Image, Link, fromMarkdown, select, selectAll } from '@liuli-util/markdown-util'
import { fromVirtual, treeSidebarByPath } from '@mark-magic/utils'

const tempPath = initTempPath(__filename)

const list: (Pick<Content, 'id' | 'content'> & {
  path: string
  resources?: Pick<Resource, 'id' | 'name' | 'raw'>[]
})[] = [
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
  { id: 'readme', path: '/readme.md', content: '# readme' },
]

it('generateDocsify', async () => {
  await convert({
    input: fromVirtual(list),
    output: output({
      path: pathe.resolve(tempPath, 'dist/'),
      name: 'test',
    }),
  })
  expect(await pathExists(pathe.resolve(tempPath, 'dist/p/a.md'))).true
  expect(await pathExists(pathe.resolve(tempPath, 'dist/p/b.md'))).true
  expect(await pathExists(pathe.resolve(tempPath, 'dist/README.md'))).true
  expect(await pathExists(pathe.resolve(tempPath, 'dist/resources/c.jpg'))).true
  const t = await readFile(pathe.resolve(tempPath, 'dist/p/a.md'), 'utf-8')
  const root = fromMarkdown(t)
  expect((select('link', root) as Link).url).eq('/p/b')
  expect((select('image', root) as Image).url).eq('../resources/c.jpg')
})

it('gtag', async () => {
  const id = 'UA-123456789-1'
  await convert({
    input: fromVirtual(list),
    output: output({
      path: pathe.resolve(tempPath, 'dist/'),
      name: 'test',
      gtag: id,
    }),
  })
  expect(await pathExists(pathe.resolve(tempPath, 'dist/gtag.js'))).true
  expect(await readFile(pathe.resolve(tempPath, 'dist/index.html'), 'utf-8')).include(id)
})

it('giscus', async () => {
  await convert({
    input: fromVirtual(list),
    output: output({
      path: pathe.resolve(tempPath, 'dist/'),
      name: 'test',
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
    }),
  })
  expect(await pathExists(pathe.resolve(tempPath, 'dist/giscus.js'))).true
  expect(await readFile(pathe.resolve(tempPath, 'dist/index.html'), 'utf-8'))
    .include('liuli-moe/to-the-stars')
    .include('R_kgDOG4H10w')
    .include('DIC_kwDOG4H1084CQhBn')
})

it('logo', async () => {
  await convert({
    input: fromVirtual(list),
    output: output({
      path: pathe.resolve(tempPath, 'dist/'),
      name: 'test',
      logo: pathe.resolve(__dirname, 'assets/logo.jpeg'),
    }),
  })
  expect(await pathExists(pathe.resolve(tempPath, 'dist/logo.jpeg'))).true
  expect(await readFile(pathe.resolve(tempPath, 'dist/index.html'), 'utf-8')).include(
    '<link rel="icon" href="./logo.jpeg" type="image/jpeg">',
  )
})

describe('generateSidebar', () => {
  it('basic', async () => {
    const sidebars: Sidebar[] = [
      { id: 'a', name: 'a', path: 'a.md' },
      { id: 'b', name: 'b', path: 'b.md' },
      { id: 'readme', name: 'readme', path: 'readme.md' },
    ]
    const root = fromMarkdown(generateSidebar(treeSidebarByPath(sidebars)))
    expect((selectAll('listItem link', root) as Link[]).map((it) => it.url)).members(['/p/a', '/p/b'])
  })
  it('multi-level', () => {
    const sidebars: Sidebar[] = [
      { id: '01-001', name: '01-001', path: '01/001.md' },
      { id: '01-readme', name: '01-readme', path: '01/readme.md' },
      { id: '01-002', name: '01-002', path: '02/002.md' },
      { id: '01-readme', name: '01-readme', path: '02/readme.md' },
      { id: 'readme', name: 'readme', path: 'readme.md' },
    ]
    const root = fromMarkdown(generateSidebar(treeSidebarByPath(sidebars)))
    expect((selectAll('listItem link', root) as Link[]).map((it) => it.url)).members([
      '/p/01-readme',
      '/p/01-001',
      '/p/01-readme',
      '/p/01-002',
    ])
  })
})

it.skip('generate for tts', async () => {
  await convert({
    input: local.input({
      path: pathe.resolve(__dirname, './assets/to-the-stars/books/'),
    }),
    output: output({
      path: pathe.resolve(tempPath, 'dist/'),
      name: 'to-the-stars',
      repo: 'https://github.com/liuli-moe/to-the-stars',
      theme: {
        dark: true,
      },
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
    }),
  })
})
