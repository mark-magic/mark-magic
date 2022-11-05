import { convert } from '@mami/cli'
import path from 'path'
import { beforeEach, expect, it } from 'vitest'
import * as obsidian from '../input'
import { remove, mkdirp, pathExists, readFile } from '@liuli-util/fs-extra'
import * as raw from '@mami/plugin-raw'
import { fromAsync } from '../utils/fromAsync'
import { convertLinks, convertYamlTab, scan } from '../input'
import { fromMarkdown, toMarkdown } from '@liuli-util/markdown-util'
import { wikiLinkFromMarkdown, wikiLinkToMarkdown } from '../utils/wiki'
import { BiMultiMap } from '../utils/BiMultiMap'
import { v4 } from 'uuid'

const tempPath = path.resolve(__dirname, '.temp/', path.basename(__filename))
beforeEach(async () => {
  await remove(tempPath)
  await mkdirp(tempPath)
})

it('utils', () => {
  it('scan', async () => {
    const rootPath = path.resolve(__dirname, './assets')
    const r = await scan(rootPath)
    console.log(r)
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
    const rootPath = path.resolve(__dirname, '../../__tests__/assets')
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
        { id: v4(), relPath: 'hello/hello world 1.md', title: 'hello world 1' },
        { id: v4(), relPath: 'hello/hello world 2.md', title: 'hello world 2' },
        { id: v4(), relPath: 'hello world 1.md', title: 'hello world 1' },
      ],
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
    const rootPath = path.resolve(__dirname, '../../__tests__/assets')
    const notePath = path.resolve(rootPath, 'hello/hello world 2.md')
    const root = fromMarkdown(
      `
![[Pasted image 20221011232440.png]]
[[Pasted image 20221011232440.png]]
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
        { id: v4(), relPath: 'hello/hello world 1.md', title: 'hello world 1' },
        { id: v4(), relPath: 'hello/hello world 2.md', title: 'hello world 2' },
        { id: v4(), relPath: 'hello world 1.md', title: 'hello world 1' },
      ],
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
  const list = await fromAsync(obsidian.input({ root: path.resolve(__dirname, 'assets') }).generate())
  console.log(list)
  expect(list.length).eq(3)
})

it.only('input', async () => {
  const zipPath = path.resolve(tempPath, 'test.zip')
  const sourcePath = path.resolve(__dirname, 'assets')
  await convert({
    input: [obsidian.input({ root: sourcePath })],
    output: [raw.output({ path: zipPath })],
  })
})
