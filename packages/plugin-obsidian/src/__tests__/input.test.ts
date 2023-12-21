import path from 'path'
import { beforeEach, describe, expect, it } from 'vitest'
import * as obsidian from '../input'
import { mkdir, readFile } from 'fs/promises'
import { convertLinks, convertYamlTab, scan } from '../input'
import { fromMarkdown, toMarkdown } from '@liuli-util/markdown-util'
import { wikiLinkFromMarkdown, wikiLinkToMarkdown } from '../utils/wiki'
import { writeFile } from 'fs/promises'
import { chain, pick, sortBy } from 'lodash-es'
import { BiMultiMap, fromAsync } from '@mark-magic/utils'
import { initTempPath } from '@liuli-util/test'
import { sha1 } from '../utils/sha1'
import { pathExists } from 'fs-extra/esm'
import { AsyncArray } from '@liuli-util/async'

const list: [string, string][] = [
  [
    'hello/hello world 1.md',
    `
    ---
    tags:
      - blog
      - test
    ---

    [[hello world 2]]
    [[./hello world 2]]
    [[hello world 2.md]]
    [[./hello world 2.md]]
    `,
  ],
  [
    'hello/hello world 2.md',
    `
    [[hello/hello world 1]] test

    ![[test.png]]
    ![[../test.png]]
    `,
  ],
  ['hello world 1.md', `同名的 hello world 1`],
  ['test.png', `test`],
]

async function writeTestFiles(list: [string, string][]) {
  await AsyncArray.forEach(list, async ([relPath, content]): Promise<void> => {
    await mkdir(path.resolve(tempPath, path.dirname(relPath)), { recursive: true })
    await writeFile(
      path.resolve(tempPath, relPath),
      content
        .split('\n')
        .map((it) => it.trim())
        .join('\n'),
    )
  })
}

const tempPath = initTempPath(__filename)

describe('utils', () => {
  beforeEach(() => writeTestFiles(list))

  it('scan', async () => {
    const r = await scan(tempPath)
    // console.log(r)
    expect(r).not.empty
  })
  it('convertYamlTab', () => {
    const r = convertYamlTab(
      `
  ---
  tags:
  \t- blog
  \t- test
  ---
  [[hello world 2]]
    `.trim(),
    )
    expect(r).not.includes('\t')
  })

  it('convertLinks', async () => {
    const rootPath = path.resolve(tempPath)
    const notePath = path.resolve(rootPath, 'hello/hello world 2.md')
    const root = fromMarkdown(await readFile(notePath, 'utf-8'), {
      mdastExtensions: [wikiLinkFromMarkdown()],
    })
    const resourceMap = new BiMultiMap<string, string>()
    const resources = convertLinks({
      root,
      rootPath,
      notePath,
      list: [
        { relPath: 'hello/hello world 1.md', name: 'hello world 1' },
        { relPath: 'hello/hello world 2.md', name: 'hello world 2' },
        { relPath: 'hello world 1.md', name: 'hello world 1' },
      ].map((it) => ({ ...it, id: sha1(it.relPath) })),
      resourceMap,
    })
    const r = toMarkdown(root, { extensions: [wikiLinkToMarkdown()] }).replaceAll(
      /\\\[(.+)\]\\\(:\/(.*)\)/g,
      '[$1](:/$2)',
    )
    // console.log(r)
    expect(await pathExists(resources[0].fsPath)).true
    expect(/\[.+\]\(:\/.+\)/.test(r)).true
    expect(/\!\[.+\]\(:\/.+\)/.test(r)).true
    expect(/\[\[.+\]\]/.test(r)).false
  })

  it('convertLinks by link', async () => {
    const rootPath = path.resolve(tempPath)
    const notePath = path.resolve(rootPath, 'hello/hello world 2.md')
    const root = fromMarkdown(
      `
![[test.png]]
[[test.png]]
  `.trim(),
      {
        mdastExtensions: [wikiLinkFromMarkdown()],
      },
    )
    const resourceMap = new BiMultiMap<string, string>()
    const resources = convertLinks({
      root,
      rootPath,
      notePath,
      list: [
        { relPath: 'hello/hello world 1.md', name: 'hello world 1' },
        { relPath: 'hello/hello world 2.md', name: 'hello world 2' },
        { relPath: 'hello world 1.md', name: 'hello world 1' },
      ].map((it) => ({ ...it, id: sha1(it.relPath) })),
      resourceMap,
    })
    const r = toMarkdown(root, { extensions: [wikiLinkToMarkdown()] }).replaceAll(
      /\\\[(.+)\]\\\(:\/(.*)\)/g,
      '[$1](:/$2)',
    )
    expect(await pathExists(resources[0].fsPath)).true
    // console.log(r)
    expect(/\[.+\]\(:\/.+\)/.test(r)).true
    expect(/\!\[.+\]\(:\/.+\)/.test(r)).true
    expect(/\[\[.+\]\]/.test(r)).false
  })
})

it('basic', async () => {
  await writeTestFiles([
    ['test1.md', `[[test2]]`],
    ['test2.md', `[[test1]]\n[[test3.png]]`],
    ['test3.png', `test`],
  ])
  const r = await fromAsync(obsidian.input({ path: tempPath }).generate())
  expect(r).length(2)
  expect(r[0].name).eq('test1')
  expect(r[0].content.trim()).eq(`[test2](:/content/${r[1].id})`)
  expect(r[1].name).eq('test2')
  expect(r[1].content.trim()).eq(`[test1](:/content/${r[0].id})\n[test3.png](:/resource/${r[1].resources[0].id})`)
  expect(r[1].resources[0].raw.toString()).eq('test')
})

it('filter and parse tag', async () => {
  await writeTestFiles([
    ['test1.md', `---\ntags:\n  - blog\n  - test\n---\n[[test2]]`],
    ['test2.md', `[[test1]]`],
  ])
  const r = await fromAsync(obsidian.input({ path: tempPath, tag: 'blog' }).generate())
  expect(r).length(1)
  expect(r[0].extra.tags).deep.eq(['test'])
})
