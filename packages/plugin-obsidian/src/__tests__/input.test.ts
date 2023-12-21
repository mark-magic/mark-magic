import path from 'path'
import { describe, expect, it } from 'vitest'
import * as obsidian from '../input'
import { mkdir, readFile } from 'fs/promises'
import { convertLinks, convertYamlTab, scan } from '../input'
import { fromMarkdown, toMarkdown } from '@liuli-util/markdown-util'
import { wikiLinkFromMarkdown, wikiLinkToMarkdown } from '../utils/wiki'
import { writeFile } from 'fs/promises'
import { chain, sortBy } from 'lodash-es'
import { BiMultiMap, fromAsync } from '@mark-magic/utils'
import { initTempPath } from '@liuli-util/test'
import { sha1 } from '../utils/sha1'
import { pathExists } from 'fs-extra/esm'
import { AsyncArray } from '@liuli-util/async'

const list = [
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
const tempPath = initTempPath(__filename, async () => {
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
})

describe('utils', () => {
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

  it('convertLinks on basic', async () => {
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

it('obsidianInput', async () => {
  const list = await fromAsync(obsidian.input({ path: tempPath }).generate())
  // console.log(list)
  expect(list).length(3)
})

it('input for repate tags', async () => {
  await writeFile(
    path.resolve(tempPath, 'test1.md'),
    `
---
tags:
  - blog
  - blog
---
  `.trim(),
  )
  await writeFile(
    path.resolve(tempPath, 'test2.md'),
    `
---
tags:
  - blog
  - blog
---
  `.trim(),
  )
  const list = await fromAsync(obsidian.input({ path: tempPath }).generate())
  const r = chain(list)
    .flatMap((it) => it.extra.tags)
    .uniq()
    .value()
  // console.log(list)
  expect(r.length).eq(0)
})

it('input multiple for id', async () => {
  const r1 = await fromAsync(obsidian.input({ path: path.resolve(tempPath, 'assets') }).generate())
  const r2 = await fromAsync(obsidian.input({ path: path.resolve(tempPath, 'assets') }).generate())
  expect(sortBy(r1.map((item) => item.id))).deep.eq(sortBy(r2.map((item) => item.id)))
})

it('test toMarkdown', async () => {
  toMarkdown(fromMarkdown(`- test`))
})
