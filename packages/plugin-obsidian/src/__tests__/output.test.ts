import { convert, InputPlugin, Note, Resource, Tag } from '@mami/cli'
import { expect, it } from 'vitest'
import * as raw from '@mami/plugin-raw'
import * as obsidian from '../output'
import path from 'path'
import { fromMarkdown, toMarkdown } from '@liuli-util/markdown-util'
import { wikiLinkToMarkdown } from '../utils/wiki'
import { pathExists, readFile } from '@liuli-util/fs-extra'
import { filenamifyPath } from 'filenamify'
import { BiMultiMap } from '@mami/utils'
import { initTempPath } from '../utils/test'

const tempPath = initTempPath(__filename)

it('convertLinks', () => {
  const root = fromMarkdown(
    `
# hello

[test.mp3](:/4b638fd91af2417e9fd0942c3e04ea0c)
[flower.webm](:/b160280b7d94417bb7f64d5fd1969230)
[1. Welcome to Joplin!](:/b6175f189a4e4c1cbea14c72848c54cb)
[foo](:/d867b35e62454483ae697185d93617ab)
[github](https://github.com)
  `.trim(),
  )
  const resources = [
    { id: '4b638fd91af2417e9fd0942c3e04ea0c', title: 'test.mp3' },
    { id: 'b160280b7d94417bb7f64d5fd1969230', title: 'flower.webm' },
  ] as Resource[]
  const noteMap = new BiMultiMap<string, string>()
  noteMap.set('b6175f189a4e4c1cbea14c72848c54cb', path.resolve(tempPath, 'a/b/Welcome to Joplin.md'))
  noteMap.set('d867b35e62454483ae697185d93617ab', path.resolve(tempPath, 'a/c/foo.md'))
  const resourceMap = new BiMultiMap<string, string>()
  resources.forEach((item) => resourceMap.set(item.id, path.resolve(tempPath, '_resources', item.title)))
  obsidian.convertLinks({
    fsPath: path.resolve(tempPath, 'a/b/Welcome to Joplin.md'),
    note: { resources },
    noteMap,
    resourceMap,
    root,
  })
  const r = toMarkdown(root, { extensions: [wikiLinkToMarkdown()] })
  console.log(r)
  expect(r.includes('[[../../_resources/test.mp3]]')).true
  expect(r.includes('[[../../_resources/flower.webm]]')).true
  expect(r.includes('[[./Welcome to Joplin]]')).true
  expect(r.includes('[[../c/foo]]')).true
})

it('output', async () => {
  const generateVirtual: InputPlugin = {
    name: 'generateVirtual',
    async *generate() {
      yield {
        id: 'test1',
        title: 'test1',
        content: `
  # test1
  
  [test2](:/test2)
        `.trim(),
        resources: [] as Resource[],
        tags: [{ id: 'test', title: 'test' }] as Tag[],
        path: ['a', 'b'],
        createAt: Date.now(),
        updateAt: Date.now(),
      } as Note
      yield {
        id: 'test2',
        title: 'test2',
        content: `
  # test2
  
  [test1](:/test1)
  [localDirOutput.test.ts](:/test)
  [github](https://github.com)
                `.trim(),
        resources: [
          {
            id: 'test',
            title: path.basename(__filename),
            raw: await readFile(__filename),
          },
        ] as Resource[],
        tags: [{ id: 'test', title: 'test' }] as Tag[],
        path: ['c'],
        createAt: Date.now(),
        updateAt: Date.now(),
      } as Note
    },
  }
  await convert({
    input: [generateVirtual],
    output: [obsidian.output({ root: tempPath })],
  })
  const test1Path = path.resolve(tempPath, 'a/b/test1.md')
  const test2Path = path.resolve(tempPath, 'c/test2.md')
  expect(await pathExists(test1Path)).true
  expect(await pathExists(test2Path)).true
  expect(await pathExists(path.resolve(tempPath, `_resources/${path.basename(__filename)}`))).true
  expect(await readFile(test1Path, 'utf-8')).includes('[[../../c/test2]]')
  expect(await readFile(test2Path, 'utf-8')).includes('[[../a/b/test1]]')
  expect(await readFile(test2Path, 'utf-8')).includes('[[../_resources/output.test.ts]]')
})

it('filename', async () => {
  const generateVirtual: InputPlugin = {
    name: 'generateVirtual',
    async *generate() {
      yield {
        id: 'test1',
        title: 'test1',
        content: `
[foo:bar](:/test2)
        `.trim(),
        resources: [] as Resource[],
        tags: [{ id: 'test', title: 'test' }] as Tag[],
        path: ['a/b'],
      } as Note
      yield {
        id: 'test2',
        title: 'foo:bar',
        content: `
# test2

[test1](:/test1)
                `.trim(),
        resources: [] as Resource[],
        tags: [{ id: 'test', title: 'test' }] as Tag[],
        path: ['c'],
      } as Note
    },
  }
  await convert({
    input: [generateVirtual],
    output: [obsidian.output({ root: tempPath })],
  })

  const test1Path = path.resolve(tempPath, 'a/b/test1.md')
  expect(await pathExists(test1Path)).true
  const test2Path = filenamifyPath(path.resolve(tempPath, 'c/foo:bar.md'))
  expect(await pathExists(test2Path)).true
  expect(await readFile(test1Path, 'utf-8')).includes('[[../../c/foo!bar]]')
  expect(await readFile(test2Path, 'utf-8')).includes('[[../a/b/test1]]')
})
