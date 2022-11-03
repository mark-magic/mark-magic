import { pathExists, readFile } from '@liuli-util/fs-extra'
import { fromMarkdown, toMarkdown } from '@liuli-util/markdown-util'
import path from 'path'
import { v4 } from 'uuid'
import { expect, it } from 'vitest'
import { BiMultiMap } from '../BiMultiMap'
import { convertLinks } from '../convertLinks'
import { wikiLinkFromMarkdown, wikiLinkToMarkdown } from '../wiki'

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
