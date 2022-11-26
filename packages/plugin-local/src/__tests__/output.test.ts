import { mkdirp, remove, readFile, pathExists } from '@liuli-util/fs-extra'
import path from 'path'
import { beforeEach, expect, it, describe } from 'vitest'
import { convert, InputPlugin, Note, Resource, Tag } from '@mami/cli'
import { calcMeta, convertLinks, defaultOptions, output, OutputOptions } from '../output'
import filenamify, { filenamifyPath } from 'filenamify'
import { fromMarkdown, toMarkdown } from '@liuli-util/markdown-util'
import { BiMultiMap } from '@mami/utils'
import { formatRelative } from '../utils'
import { Required } from 'utility-types'
import { initTempPath } from '../test'

const tempPath = initTempPath(__filename)

describe('utils', () => {
  it('convertLinks', () => {
    const root = fromMarkdown(
      `
# hello

[test.mp3](:/4b638fd91af2417e9fd0942c3e04ea0c)
[flower.webm](:/b160280b7d94417bb7f64d5fd1969230)
[1. Welcome to Joplin!](:/b6175f189a4e4c1cbea14c72848c54cb)
[foo:bar](:/d867b35e62454483ae697185d93617ab)
[github](https://github.com)
  `.trim(),
    )
    const resources = [
      { id: '4b638fd91af2417e9fd0942c3e04ea0c', title: 'test.mp3' },
      { id: 'b160280b7d94417bb7f64d5fd1969230', title: 'flower.webm' },
    ] as Resource[]
    const noteMap = new BiMultiMap<string, string>()
    noteMap.set('b6175f189a4e4c1cbea14c72848c54cb', path.resolve(tempPath, 'c/Welcome to Joplin.md'))
    noteMap.set('d867b35e62454483ae697185d93617ab', filenamifyPath(path.resolve(tempPath, 'c/foo:bar')))
    const resourceMap = new BiMultiMap<string, string>()
    resources.forEach((item) => resourceMap.set(item.id, path.resolve(tempPath, '_resources', item.title)))
    convertLinks({
      fsPath: path.resolve(tempPath, 'a/b/test.md'),
      note: { resources } as Note,
      noteMap,
      resourceMap,
      root,
      noteLink: ({ notePath, linkNotePath }) => formatRelative(path.relative(path.dirname(notePath), linkNotePath)),
      resourceLink: ({ notePath, resourcePath }) => formatRelative(path.relative(path.dirname(notePath), resourcePath)),
    })
    const r = toMarkdown(root)
    console.log(r)
    expect(r.includes('../../_resources/test.mp3')).true
    expect(r.includes('../../_resources/flower.webm')).true
    expect(r.includes(encodeURI('../c/Welcome to Joplin.md'))).true
  })
  it('addMetas', () => {
    const note = {
      id: 'test',
      title: 'test-title',
      createAt: Date.now(),
      updateAt: Date.now(),
      tags: [] as Tag[],
    } as Note
    const r = calcMeta(note)
    expect(r.title).eq(note.title)
    expect(r.createAt).eq(note.createAt)
    expect(r.updateAt).eq(note.updateAt)
  })
})

it('basic', async () => {
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
        path: ['a/b'],
      } as Note
      yield {
        id: 'test2',
        title: 'test2',
        content: `
# test2

[test1](:/test1)
[localDirOutput.test.ts](:/test)
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
      } as Note
    },
  }

  await convert({
    input: [generateVirtual],
    output: [
      output(
        defaultOptions({
          rootNotePath: tempPath,
          rootResourcePath: path.resolve(tempPath, '_resources'),
        }),
      ),
    ],
  })

  const test1Path = path.resolve(tempPath, 'a/b/test1.md')
  expect(await pathExists(test1Path)).true
  const test2Path = path.resolve(tempPath, 'c/test2.md')
  expect(await pathExists(test2Path)).true
  expect(await pathExists(path.resolve(tempPath, '_resources/', path.basename(__filename)))).true
  expect(await readFile(test1Path, 'utf-8')).includes('../../c/test2.md')
  expect(await readFile(test2Path, 'utf-8')).includes('../a/b/test1.md')
  expect(await readFile(test2Path, 'utf-8')).includes(`../_resources/${path.basename(__filename)}`)
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
    output: [
      output(
        defaultOptions({
          rootNotePath: tempPath,
          rootResourcePath: path.resolve(tempPath, '_resources'),
        }),
      ),
    ],
  })

  const test1Path = path.resolve(tempPath, 'a/b/test1.md')
  expect(await pathExists(test1Path)).true
  const test2Path = filenamifyPath(path.resolve(tempPath, 'c/foo:bar.md'))
  expect(await pathExists(test2Path)).true
  expect(await readFile(test1Path, 'utf-8')).includes('../../c/foo!bar.md')
  expect(await readFile(test2Path, 'utf-8')).includes('../a/b/test1.md')
})

it('hexo', async () => {
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
      } as Note
    },
  }

  await convert({
    input: [generateVirtual],
    output: [
      output(
        defaultOptions({
          rootNotePath: path.resolve(tempPath, 'source/_posts'),
          rootResourcePath: path.resolve(tempPath, 'source/resources'),
          meta: (note) => ({
            layout: 'post',
            title: note.title,
            abbrlink: note.id,
            tags: note.tags.map((item) => item.title),
            categories: note.path.slice(note.path.length - 1),
            date: note.createAt,
            updated: note.updateAt,
          }),
          noteLink: ({ linkNoteId }) => `/p/${linkNoteId}`,
          resourceLink: ({ resource }) => `/resources/${resource.id}${path.extname(resource.title)}`,
          notePath: (note) => path.resolve(tempPath, 'source/_posts', note.id + '.md'),
          resourcePath: (resource) => path.resolve(tempPath, 'source/resources', filenamify(resource.title)),
        }),
      ),
    ],
  })

  const test1Path = path.resolve(tempPath, 'source/_posts/test1.md')
  expect(await pathExists(test1Path)).true
  const test2Path = path.resolve(tempPath, 'source/_posts/test2.md')
  expect(await pathExists(test2Path)).true
  expect(await pathExists(path.resolve(tempPath, 'source/resources/', path.basename(__filename)))).true
  expect(await readFile(test1Path, 'utf-8')).includes('/p/test2')
  expect(await readFile(test2Path, 'utf-8')).includes('/p/test1')
  expect(await readFile(test2Path, 'utf-8')).includes(`/resources/test.ts`)
})
