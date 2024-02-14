import path from 'pathe'
import { describe, expect, it } from 'vitest'
import { input, scan } from '../input'
import { fromAsync, trimMarkdown } from '@mark-magic/utils'
import { AsyncArray } from '@liuli-util/async'
import { chain, keyBy, omit, pick, sortBy, uniq, uniqBy } from 'lodash-es'
import { Content } from '@mark-magic/core'
import { initTempPath } from '@liuli-util/test'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { fromMarkdown, getYamlMeta } from '@liuli-util/markdown-util'

const tempPath = initTempPath(__filename)

it('basic', async () => {
  const list = [
    {
      path: 'a/b/test1.md',
      content: `
---
name: test
tags:
  - blog
  - test
created: 1667644025993
updated: 1667644025993
---
# test1
[test2](../../c/test2.md)
[input.test.ts](../../input.test.ts)
[input.test.ts](../../input.test.ts)
      `.trim(),
    },
    {
      path: 'c/test2.md',
      content: `
---
tags:
  - blog
---
# test2
[test1](../a/b/test1.md)
[input.test.ts](../input.test.ts)
      `.trim(),
    },
    {
      path: 'input.test.ts',
      content: await readFile(__filename),
    },
  ]
  await AsyncArray.forEach(list, async (item) => {
    const fsPath = path.resolve(tempPath, item.path)
    await mkdir(path.dirname(fsPath), { recursive: true })
    await writeFile(fsPath, item.content)
  })

  const r = keyBy(await fromAsync(input({ path: tempPath }).generate()), (it) => it.name)
  expect(Object.keys(r).length).eq(2)
  // 验证资源会自动去重
  expect(r['test'].resources.length).eq(1)
  expect(r['test2'].resources.length).eq(1)
  expect(r['test'].resources.map((it) => omit(it, 'created', 'updated'))).deep.eq(
    r['test2'].resources.map((it) => omit(it, 'created', 'updated')),
  )
  // // 验证链接转换正常
  expect(r['test'].content.includes(`[test2](:/content/${r['test2'].id})`)).true
  expect(r['test2'].content.includes(`[test1](:/content/${r['test'].id})`)).true
  // // 验证 meta 元数据被正确读取
  expect(pick(r['test'], 'name', 'created', 'updated')).deep.eq({
    name: 'test',
    created: 1667644025993,
    updated: 1667644025993,
  } as Content)

  // 验证标签是正确的
  // expect(r['test'].tags.map((i) => i.title)).deep.eq(['blog', 'test'])
  // expect(r['test2'].tags.map((i) => i.title)).deep.eq(['blog'])
  // const tags = uniqBy(
  //   Object.values(r).flatMap((i) => i.tags),
  //   (i) => i.id,
  // )
  // expect(tags.length).eq(2)
})

it('input 读取目录下的文件', async () => {
  const srcPath = path.resolve(tempPath, './books/')
  await mkdir(srcPath)
  await writeFile(path.resolve(srcPath, './a.md'), 'a')
  await writeFile(path.resolve(srcPath, './b.md'), 'b')
  const list = await fromAsync(input({ path: srcPath }).generate())
  list.forEach((it) => expect(it.path).length(1))
})

it('hashid', async () => {
  const list = [
    {
      path: 'a/b/test1.md',
      content: `
---
name: test
tags:
  - blog
  - test
created: 1667644025993
updated: 1667644025993
---
# test1
[test2](../../c/test2.md)
[input.test.ts](../../input.test.ts)
[input.test.ts](../../input.test.ts)
      `.trim(),
    },
    {
      path: 'c/test2.md',
      content: `
---
tags:
  - blog
---
# test2
[test1](../a/b/test1.md)
[input.test.ts](../input.test.ts)
      `.trim(),
    },
    {
      path: 'input.test.ts',
      content: await readFile(__filename),
    },
  ]
  await AsyncArray.forEach(list, async (item) => {
    const fsPath = path.resolve(tempPath, item.path)
    await mkdir(path.dirname(fsPath), { recursive: true })
    await writeFile(fsPath, item.content)
  })

  const r1 = await scan({ path: path.resolve(tempPath) })
  const r2 = await scan({ path: path.resolve(tempPath) })
  expect(r1).deep.eq(r2)
})

it('测试 scan 得到的结果应该是有序的', async () => {
  const list = sortBy(
    Array.from({ length: 9 }, (_, i) => `0${i + 1}.md`),
    () => Math.random(),
  )
  await AsyncArray.forEach(list, (it) => writeFile(path.resolve(tempPath, it), it))
  const r = await scan({ path: tempPath })
  expect(r).deep.eq(sortBy(r, (it) => it.name))
})

it('重复的资源应该能保持相同的 id', async () => {
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
  const contents = await fromAsync(
    input({
      path: path.resolve(tempPath, 'src'),
    }).generate(),
  )
  const resources = sortBy(
    contents.flatMap((it) => it.resources),
    (it) => it.raw.toString(),
  )
  expect(resources).length(3)
  expect(uniq(resources)).length(2)
  expect(resources[0]).deep.eq(resources[1])
  expect(resources[0].raw.toString()).eq('01')
  expect(resources[2].raw.toString()).eq('02')
})

it('测试 input 的 ignore 参数', async () => {
  const list = [
    { path: 'readme.md', content: '' },
    { path: '01/readme.md', content: '' },
    { path: '02/readme.md', content: '' },
  ]
  await Promise.all(
    list.map(async (it) => {
      const fsPath = path.resolve(tempPath, 'src', it.path)
      await mkdir(path.dirname(fsPath), { recursive: true })
      await writeFile(fsPath, it.content)
    }),
  )
  const contents = await fromAsync(
    input({
      path: path.resolve(tempPath, 'src'),
      ignore: ['02/**'],
    }).generate(),
  )
  expect(contents.map((it) => it.path)).deep.eq([['readme.md'], ['01', 'readme.md']])
})

it('Should not remove readme yaml meta', async () => {
  await writeFile(
    path.resolve(tempPath, 'readme.md'),
    trimMarkdown(`
    ---
    name: readme
    ---
    # readme
  `),
  )
  await writeFile(
    path.resolve(tempPath, '01.md'),
    trimMarkdown(`
    ---
    name: test
    ---
    # test
  `),
  )
  const list = await fromAsync(
    input({
      path: tempPath,
    }).generate(),
  )
  const r = keyBy(list, 'name')
  expect(getYamlMeta(fromMarkdown(r.test.content))).null
  expect(getYamlMeta(fromMarkdown(r.readme.content))).deep.eq({ name: 'readme' })
})

describe('Should convert yaml meta book.cover of readme', () => {
  it('relpath', async () => {
    await writeFile(
      path.resolve(tempPath, 'readme.md'),
      trimMarkdown(`
      ---
      book:
        cover: ./assets/cover.jpg
      ---
      # readme
    `),
    )
    const list = await fromAsync(
      input({
        path: tempPath,
      }).generate(),
    )
    const r = keyBy(list, 'name')
    expect(getYamlMeta(fromMarkdown(r.readme.content))).deep.eq({
      book: {
        cover: path.resolve(tempPath, './assets/cover.jpg'),
      },
    })
  })
  it('abspath', async () => {
    await writeFile(
      path.resolve(tempPath, 'readme.md'),
      trimMarkdown(`
      ---
      book:
        cover: ${path.resolve(tempPath, './assets/cover.jpg')}
      ---
      # readme
    `),
    )
    const list = await fromAsync(
      input({
        path: tempPath,
      }).generate(),
    )
    const r = keyBy(list, 'name')
    expect(getYamlMeta(fromMarkdown(r.readme.content))).deep.eq({
      book: {
        cover: path.resolve(tempPath, './assets/cover.jpg'),
      },
    })
  })
})
