import path from 'path'
import { expect, it } from 'vitest'
import { input } from '../input'
import { fromAsync } from '@mami/utils'
import { mkdirp, readFile, writeFile } from '@liuli-util/fs-extra'
import { AsyncArray } from '@liuli-util/async'
import { keyBy, pick, uniqBy } from 'lodash-es'
import { Note } from '@mami/cli'
import { initTempPath } from '../test'

const tempPath = initTempPath(__filename)

it('input', async () => {
  const list = [
    {
      path: 'a/b/test1.md',
      content: `
---
title: test
tags:
  - blog
  - test
createAt: 1667644025993
updateAt: 1667644025993
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

  const r = keyBy(await fromAsync(input({ root: tempPath }).generate()), (item) => item.title)
  expect(Object.keys(r).length).eq(2)
  // 验证资源会自动去重
  expect(r['test'].resources.length).eq(1)
  expect(r['test2'].resources.length).eq(1)
  expect(r['test'].resources).deep.eq(r['test2'].resources)
  // 验证链接转换正常
  expect(r['test'].content.includes(`[test2](:/${r['test2'].id})`)).true
  expect(r['test2'].content.includes(`[test1](:/${r['test'].id})`)).true
  // 验证 meta 元数据被正确读取
  expect(pick(r['test'], 'title', 'createAt', 'updateAt')).deep.eq({
    title: 'test',
    createAt: 1667644025993,
    updateAt: 1667644025993,
  } as Note)
  // 验证标签是正确的
  expect(r['test'].tags.map((i) => i.title)).deep.eq(['blog', 'test'])
  expect(r['test2'].tags.map((i) => i.title)).deep.eq(['blog'])
  const tags = uniqBy(
    Object.values(r).flatMap((i) => i.tags),
    (i) => i.id,
  )
  expect(tags.length).eq(2)
})
