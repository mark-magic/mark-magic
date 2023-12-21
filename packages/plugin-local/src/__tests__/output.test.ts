import { mkdir, readFile, writeFile } from 'fs/promises'
import pathe from 'pathe'
import { expect, it, describe } from 'vitest'
import { convert, InputPlugin, Content, Resource } from '@mark-magic/core'
import { convertLinks, output } from '../output'
import { filenamifyPath } from 'filenamify'
import { Image, Link, fromMarkdown, getYamlMeta, select, toMarkdown } from '@liuli-util/markdown-util'
import { BiMultiMap, fromVirtual } from '@mark-magic/utils'
import { formatRelative } from '../utils'
import { initTempPath } from '@liuli-util/test'
import path from 'pathe'
import { input } from '../input'
import { pathExists } from 'fs-extra/esm'

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
    const contentMap = new BiMultiMap<string, string>()
    contentMap.set('b6175f189a4e4c1cbea14c72848c54cb', pathe.resolve(tempPath, 'c/Welcome to Joplin.md'))
    contentMap.set('d867b35e62454483ae697185d93617ab', filenamifyPath(pathe.resolve(tempPath, 'c/foo:bar')))
    const resourceMap = new BiMultiMap<string, string>()
    resources.forEach((item) => resourceMap.set(item.id, pathe.resolve(tempPath, '_resources', item.name)))
    convertLinks({
      fsPath: pathe.resolve(tempPath, 'a/b/test.md'),
      content: { resources } as Content,
      contentMap,
      resourceMap,
      root,
      contentLink: ({ contentPath: contentPath, linkContentPath: linkcontentPath }) =>
        formatRelative(pathe.relative(pathe.dirname(contentPath), linkcontentPath)),
      resourceLink: ({ contentPath: contentPath, resourcePath }) =>
        formatRelative(pathe.relative(pathe.dirname(contentPath), resourcePath)),
    })
    const r = toMarkdown(root)
    expect(r.includes('../../_resources/test.mp3')).true
    expect(r.includes('../../_resources/flower.webm')).true
    expect(r.includes(encodeURI('../c/Welcome to Joplin.md'))).true
  })
})

it('basic', async () => {
  // console.log(await fromAsync(fromVirtual(list).generate()))
  await convert({
    input: fromVirtual([
      {
        id: 'test1',
        content: `
  # test1
  
  [test2](:/content/test2)
          `.trim(),
        resources: [] as Resource[],
        // tags: [{ id: 'test', name: 'test' }] as Tag[],
        path: 'a/b/test1.md',
      },
      {
        id: 'test2',
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
        path: 'c/test2.md',
      },
    ]),
    output: output({
      rootContentPath: tempPath,
      rootResourcePath: pathe.resolve(tempPath, '_resources'),
    }),
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
        path: ['a/b', 'test1.md'],
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
        path: ['c', 'foo:bar.md'],
      } as Content
    },
  }
  await convert({
    input: generateVirtual,
    output: output({
      rootContentPath: tempPath,
      rootResourcePath: pathe.resolve(tempPath, '_resources'),
    }),
  })

  const test1Path = pathe.resolve(tempPath, 'a/b/test1.md')
  expect(await pathExists(test1Path)).true
  const test2Path = filenamifyPath(pathe.resolve(tempPath, 'c/foo:bar.md'))
  expect(await pathExists(test2Path)).true
  expect(await readFile(test1Path, 'utf-8')).includes('../../c/foo!bar.md')
  expect(await readFile(test2Path, 'utf-8')).includes('../a/b/test1.md')
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
    output: output({
      rootContentPath: pathe.resolve(tempPath, 'source/_posts'),
      rootResourcePath: pathe.resolve(tempPath, 'source/resources'),
    }),
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
    const contentMap = new BiMultiMap<string, string>()
    contentMap.set('b6175f189a4e4c1cbea14c72848c54cb', pathe.resolve(tempPath, 'c/Welcome to Joplin.md'))
    contentMap.set('d867b35e62454483ae697185d93617ab', filenamifyPath(pathe.resolve(tempPath, 'c/foo:bar')))
    const resourceMap = new BiMultiMap<string, string>()
    resources.forEach((item) => resourceMap.set(item.id, pathe.resolve(tempPath, '_resources', item.name)))
    convertLinks({
      fsPath: pathe.resolve(tempPath, 'a/b/test.md'),
      content: { resources } as Content,
      contentMap,
      resourceMap,
      root,
      contentLink: ({ contentPath: contentPath, linkContentPath: linkcontentPath }) =>
        formatRelative(pathe.relative(pathe.dirname(contentPath), linkcontentPath)),
      resourceLink: ({ contentPath: contentPath, resourcePath }) =>
        formatRelative(pathe.relative(pathe.dirname(contentPath), resourcePath)),
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
      rootContentPath: postsPath,
      rootResourcePath: resourcePath,
      meta: () => null,
      contentLink: ({ linkContentId: linkcontentId }) => `/p/${linkcontentId}`,
      resourceLink: ({ resource }) => `../resources/${resource.id}${pathe.extname(resource.name)}`,
      contentPath: (content) => pathe.resolve(postsPath, content.id + '.md'),
      resourcePath: (resource) => pathe.resolve(resourcePath, resource.id + pathe.extname(resource.name)),
    }),
  })
  expect(await pathExists(pathe.resolve(rootPath, 'p/a.md'))).true
  expect(await pathExists(pathe.resolve(rootPath, 'p/b.md'))).true
  expect(await pathExists(pathe.resolve(rootPath, 'resources/c.jpg'))).true
  const t = await readFile(pathe.resolve(rootPath, 'p/a.md'), 'utf-8')
  const root = fromMarkdown(t)
  expect((select('link', root) as Link).url).eq('/p/b')
  expect((select('image', root) as Image).url).eq('../resources/c.jpg')
})

it('should support duplicate resource name', async () => {
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
      path: '03/readme.md',
      content: `# test 3\n![test](./assets/cover.png)`,
    },
    {
      path: '01/assets/cover.png',
      content: '01',
    },
    {
      path: '02/assets/cover.png',
      content: '02',
    },
    {
      path: '03/assets/cover.png',
      content: '03',
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
    input: input({
      path: path.resolve(tempPath, 'src'),
    }),
    output: output({
      rootContentPath: path.resolve(tempPath, 'dist'),
      rootResourcePath: path.resolve(tempPath, 'dist/resources'),
    }),
  })
  async function getContent(p: string): Promise<string> {
    const fsPath = path.resolve(tempPath, 'dist', p)
    const s = await readFile(fsPath, 'utf-8')
    const r = path.resolve(path.dirname(fsPath), (select('image', fromMarkdown(s)) as Image).url)
    return await readFile(r, 'utf-8')
  }
  expect(await getContent('readme.md')).eq('01')
  expect(await getContent('01/readme.md')).eq('01')
  expect(await getContent('02/readme.md')).eq('02')
  expect(await getContent('03/readme.md')).eq('03')
})

describe('meta', () => {
  const getMeta = async (fsPath: string) => getYamlMeta(fromMarkdown(await readFile(fsPath, 'utf-8')))

  it('should default not change content yaml meta', async () => {
    await convert({
      input: fromVirtual([
        {
          id: 'test1',
          content: `---\nname: test 1\n---\n# test 1`,
          path: 'test1.md',
        },
        {
          id: 'test2',
          content: `# test 1`,
          path: 'test2.md',
        },
      ]),
      output: output({
        rootContentPath: tempPath,
        rootResourcePath: pathe.resolve(tempPath, '_resources'),
      }),
    })
    expect(await getMeta(pathe.resolve(tempPath, 'test1.md'))).deep.eq({
      name: 'test 1',
    })
    expect(await getMeta(pathe.resolve(tempPath, 'test2.md'))).null
  })

  it('should can overwrite content yaml meta', async () => {
    await convert({
      input: fromVirtual([
        {
          id: 'test1',
          content: `---\nname: test 1\n---\n# test 1`,
          path: 'test1.md',
        },
        {
          id: 'test2',
          content: `# test 1`,
          path: 'test2.md',
        },
      ]),
      output: output({
        rootContentPath: tempPath,
        rootResourcePath: pathe.resolve(tempPath, '_resources'),
        meta: () => null,
      }),
    })
    expect(await getMeta(pathe.resolve(tempPath, 'test1.md'))).null
    expect(await getMeta(pathe.resolve(tempPath, 'test2.md'))).null
  })
})
