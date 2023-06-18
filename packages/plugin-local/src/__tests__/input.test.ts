import path from 'pathe'
import { expect, it } from 'vitest'
import { input } from '../input'
import { fromAsync } from '@mark-magic/utils'
import { mkdirp, readFile, writeFile } from '@liuli-util/fs-extra'
import { AsyncArray } from '@liuli-util/async'
import { keyBy, omit, pick, uniqBy } from 'lodash-es'
import { Content } from '@mark-magic/core'
import { initTempPath } from '../test'
import { mkdir } from 'fs/promises'

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
    await mkdirp(path.dirname(fsPath))
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
