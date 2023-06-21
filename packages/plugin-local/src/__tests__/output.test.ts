import { pathExists } from '@liuli-util/fs-extra'
import { readFile } from 'fs/promises'
import pathe from 'pathe'
import { expect, it, describe } from 'vitest'
import { convert, InputPlugin, Content, Resource } from '@mark-magic/core'
import { calcMeta, convertLinks, defaultOptions, output } from '../output'
import filenamify, { filenamifyPath } from 'filenamify'
import { Image, Link, fromMarkdown, select, toMarkdown } from '@liuli-util/markdown-util'
import { BiMultiMap } from '@mark-magic/utils'
import { formatRelative } from '../utils'
import { fromVirtual } from '@mark-magic/utils'
import { initTempPath } from '@liuli-util/test'

const tempPath = initTempPath(__filename)

describe('utils', () => {
  it('convertLinks', () => {
    const root = fromMarkdown(
      `
# hello

[test.mp3](:/resource/4b638fd91af2417e9fd0942c3e04ea0c)
[flower.webm](:/resource/b160280b7d94417bb7f64d5fd1969230)
[1. Welcome to Joplin!](:/content/b6175f189a4e4c1cbea14c72848c54cb)
[foo:bar](:/content/d867b35e62454483ae697185d93617ab)
[github](https://github.com)
  `.trim(),
    )
    const resources = [
      { id: '4b638fd91af2417e9fd0942c3e04ea0c', name: 'test.mp3' },
      { id: 'b160280b7d94417bb7f64d5fd1969230', name: 'flower.webm' },
    ] as Resource[]
    const noteMap = new BiMultiMap<string, string>()
    noteMap.set('b6175f189a4e4c1cbea14c72848c54cb', pathe.resolve(tempPath, 'c/Welcome to Joplin.md'))
    noteMap.set('d867b35e62454483ae697185d93617ab', filenamifyPath(pathe.resolve(tempPath, 'c/foo:bar')))
    const resourceMap = new BiMultiMap<string, string>()
    resources.forEach((item) => resourceMap.set(item.id, pathe.resolve(tempPath, '_resources', item.name)))
    convertLinks({
      fsPath: pathe.resolve(tempPath, 'a/b/test.md'),
      note: { resources } as Content,
      noteMap,
      resourceMap,
      root,
      noteLink: ({ notePath, linkNotePath }) => formatRelative(pathe.relative(pathe.dirname(notePath), linkNotePath)),
      resourceLink: ({ notePath, resourcePath }) =>
        formatRelative(pathe.relative(pathe.dirname(notePath), resourcePath)),
    })
    const r = toMarkdown(root)
    expect(r.includes('../../_resources/test.mp3')).true
    expect(r.includes('../../_resources/flower.webm')).true
    expect(r.includes(encodeURI('../c/Welcome to Joplin.md'))).true
  })
  it('addMetas', () => {
    const note = {
      id: 'test',
      name: 'test-name',
      created: Date.now(),
      updated: Date.now(),
      // tags: [] as Tag[],
    } as Content
    const r = calcMeta(note)
    expect(r.name).eq(note.name)
    expect(r.created).eq(note.created)
    expect(r.updated).eq(note.updated)
  })
})

it('basic', async () => {
  const generateVirtual: InputPlugin = {
    name: 'generateVirtual',
    async *generate() {
      yield {
        id: 'test1',
        name: 'test1',
        content: `
# test1

[test2](:/content/test2)
        `.trim(),
        resources: [] as Resource[],
        // tags: [{ id: 'test', name: 'test' }] as Tag[],
        path: ['a/b'],
      } as Content
      yield {
        id: 'test2',
        name: 'test2',
        content: `
# test2

[test1](:/content/test1)
[localDirOutput.test.ts](:/resource/test)
                `.trim(),
        resources: [
          {
            id: 'test',
            name: pathe.basename(__filename),
            raw: await readFile(__filename),
          },
        ] as Resource[],
        // tags: [{ id: 'test', name: 'test' }] as Tag[],
        path: ['c'],
      } as Content
    },
  }

  await convert({
    input: generateVirtual,
    output: output(
      defaultOptions({
        rootNotePath: tempPath,
        rootResourcePath: pathe.resolve(tempPath, '_resources'),
      }),
    ),
  })

  const test1Path = pathe.resolve(tempPath, 'a/b/test1.md')
  expect(await pathExists(test1Path)).true
  const test2Path = pathe.resolve(tempPath, 'c/test2.md')
  expect(await pathExists(test2Path)).true
  expect(await pathExists(pathe.resolve(tempPath, '_resources/', pathe.basename(__filename)))).true
  expect(await readFile(test1Path, 'utf-8')).includes('../../c/test2.md')
  expect(await readFile(test2Path, 'utf-8')).includes('../a/b/test1.md')
  expect(await readFile(test2Path, 'utf-8')).includes(`../_resources/${pathe.basename(__filename)}`)
})

it('filename', async () => {
  const generateVirtual: InputPlugin = {
    name: 'generateVirtual',
    async *generate() {
      yield {
        id: 'test1',
        name: 'test1',
        content: `
[foo:bar](:/content/test2)
        `.trim(),
        resources: [] as Resource[],
        // tags: [{ id: 'test', name: 'test' }] as Tag[],
        path: ['a/b'],
      } as Content
      yield {
        id: 'test2',
        name: 'foo:bar',
        content: `
# test2

[test1](:/content/test1)
                `.trim(),
        resources: [] as Resource[],
        // tags: [{ id: 'test', name: 'test' }] as Tag[],
        path: ['c'],
      } as Content
    },
  }
  await convert({
    input: generateVirtual,
    output: output(
      defaultOptions({
        rootNotePath: tempPath,
        rootResourcePath: pathe.resolve(tempPath, '_resources'),
      }),
    ),
  })

  const test1Path = pathe.resolve(tempPath, 'a/b/test1.md')
  expect(await pathExists(test1Path)).true
  const test2Path = filenamifyPath(pathe.resolve(tempPath, 'c/foo:bar.md'))
  expect(await pathExists(test2Path)).true
  expect(await readFile(test1Path, 'utf-8')).includes('../../c/foo!bar.md')
  expect(await readFile(test2Path, 'utf-8')).includes('../a/b/test1.md')
})

it('hexo', async () => {
  const generateVirtual: InputPlugin = {
    name: 'generateVirtual',
    async *generate(): AsyncGenerator<Content> {
      yield {
        id: 'test1',
        name: 'test1',
        content: `
# test1

[test2](:/content/test2)
        `.trim(),
        resources: [] as Resource[],
        // tags: [{ id: 'test', name: 'test' }] as Tag[],
        path: ['a', 'b'],
      } as Content
      yield {
        id: 'test2',
        name: 'test2',
        content: `
# test2

[test1](:/content/test1)
[localDirOutput.test.ts](:/resource/test)
[github](https://github.com)
                `.trim(),
        resources: [
          {
            id: 'test',
            name: pathe.basename(__filename),
            raw: await readFile(__filename),
          },
        ] as Resource[],
        // tags: [{ id: 'test', name: 'test' }] as Tag[],
        path: ['c'],
      } as Content
    },
  }

  await convert({
    input: generateVirtual,
    output: output(
      defaultOptions({
        rootNotePath: pathe.resolve(tempPath, 'source/_posts'),
        rootResourcePath: pathe.resolve(tempPath, 'source/resources'),
        meta: (note) => ({
          layout: 'post',
          name: note.name,
          abbrlink: note.id,
          // tags: note.tags.map((item) => item.name),
          categories: note.path.slice(note.path.length - 1),
          date: note.created,
          updated: note.updated,
        }),
        noteLink: ({ linkNoteId }) => `/p/${linkNoteId}`,
        resourceLink: ({ resource }) => `/resources/${resource.id}${pathe.extname(resource.name)}`,
        notePath: (note) => pathe.resolve(tempPath, 'source/_posts', note.id + '.md'),
        resourcePath: (resource) => pathe.resolve(tempPath, 'source/resources', filenamify(resource.name)),
      }),
    ),
  })

  const test1Path = pathe.resolve(tempPath, 'source/_posts/test1.md')
  expect(await pathExists(test1Path)).true
  const test2Path = pathe.resolve(tempPath, 'source/_posts/test2.md')
  expect(await pathExists(test2Path)).true
  expect(await pathExists(pathe.resolve(tempPath, 'source/resources/', pathe.basename(__filename)))).true
  expect(await readFile(test1Path, 'utf-8')).includes('/p/test2')
  expect(await readFile(test2Path, 'utf-8')).includes('/p/test1')
  expect(await readFile(test2Path, 'utf-8')).includes(`/resources/test.ts`)
})

it('duplicate resource filename', async () => {
  const generateVirtual: InputPlugin = {
    name: 'generateVirtual',
    async *generate() {
      yield {
        id: 'test1',
        name: 'test1',
        content: `
# test1
        `.trim(),
        resources: [
          {
            id: 'test',
            name: pathe.basename(__filename),
            raw: await readFile(__filename),
          },
          {
            id: 'test2',
            name: pathe.basename(__filename),
            raw: await readFile(__filename),
          },
        ] as Resource[],
        // tags: [] as Tag[],
        path: [] as string[],
      } as Content
    },
  }
  await convert({
    input: generateVirtual,
    output: output(
      defaultOptions({
        rootNotePath: pathe.resolve(tempPath, 'source/_posts'),
        rootResourcePath: pathe.resolve(tempPath, 'source/resources'),
      }),
    ),
  })
  expect(await pathExists(pathe.resolve(tempPath, 'source/resources/', pathe.basename(__filename)))).true
  expect(
    await pathExists(pathe.resolve(tempPath, 'source/resources/', pathe.basename(__filename, '.ts') + '_test2.ts')),
  ).true
})

describe('html', () => {
  it('convertHTMLLinks', () => {
    const root = fromMarkdown(
      `
  # hello

  <audio src=":/resource/4b638fd91af2417e9fd0942c3e04ea0c" loop="loop"></audio>
  <video src=":/resource/b160280b7d94417bb7f64d5fd1969230" loop="loop"></video>
  <img src=":/resource/b6175f189a4e4c1cbea14c72848c54cb" alt="IMG_9101.JPG" width="623" height="415" class="jop-noMdConv">
  <img src="https://github.com" alt="IMG_9101.JPG" width="623" height="415" class="jop-noMdConv">
  [foo:bar](:/content/d867b35e62454483ae697185d93617ab)
  [github](https://github.com)
  `.trim(),
    )
    const resources = [
      { id: '4b638fd91af2417e9fd0942c3e04ea0c', name: 'test.mp3' },
      { id: 'b160280b7d94417bb7f64d5fd1969230', name: 'flower.webm' },
    ] as Resource[]
    const noteMap = new BiMultiMap<string, string>()
    noteMap.set('b6175f189a4e4c1cbea14c72848c54cb', pathe.resolve(tempPath, 'c/Welcome to Joplin.md'))
    noteMap.set('d867b35e62454483ae697185d93617ab', filenamifyPath(pathe.resolve(tempPath, 'c/foo:bar')))
    const resourceMap = new BiMultiMap<string, string>()
    resources.forEach((item) => resourceMap.set(item.id, pathe.resolve(tempPath, '_resources', item.name)))
    convertLinks({
      fsPath: pathe.resolve(tempPath, 'a/b/test.md'),
      note: { resources } as Content,
      noteMap,
      resourceMap,
      root,
      noteLink: ({ notePath, linkNotePath }) => formatRelative(pathe.relative(pathe.dirname(notePath), linkNotePath)),
      resourceLink: ({ notePath, resourcePath }) =>
        formatRelative(pathe.relative(pathe.dirname(notePath), resourcePath)),
    })
    const r = toMarkdown(root)
    console.log(r)
    expect(r.includes('../../_resources/test.mp3')).true
    expect(r.includes('../../_resources/flower.webm')).true
    // expect(r.includes(encodeURI('../c/Welcome to Joplin.md'))).true
  })
})

it('output', async () => {
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
    `
        .split('\n')
        .map((it) => it.trim())
        .join('\n'),
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
  const rootPath = pathe.resolve(tempPath, './docs/')
  const postsPath = pathe.resolve(rootPath, 'p')
  const resourcePath = pathe.resolve(rootPath, 'resources')
  await convert({
    input: fromVirtual(list),
    output: output({
      rootNotePath: postsPath,
      rootResourcePath: resourcePath,
      meta: () => null,
      noteLink: ({ linkNoteId }) => `/p/${linkNoteId}`,
      resourceLink: ({ resource }) => `../resources/${resource.id}${pathe.extname(resource.name)}`,
      notePath: (note) => pathe.resolve(postsPath, note.id + '.md'),
      resourcePath: (resource) => pathe.resolve(resourcePath, resource.id + pathe.extname(resource.name)),
    }),
  })
  expect(await pathExists(pathe.resolve(rootPath, 'p/a.md'))).true
  expect(await pathExists(pathe.resolve(rootPath, 'p/b.md'))).true
  expect(await pathExists(pathe.resolve(rootPath, 'resources/c.jpg'))).true
  const t = await readFile(pathe.resolve(rootPath, 'p/a.md'), 'utf-8')
  console.log(t)
  const root = fromMarkdown(t)
  expect((select('link', root) as Link).url).eq('/p/b')
  expect((select('image', root) as Image).url).eq('../resources/c.jpg')
})
