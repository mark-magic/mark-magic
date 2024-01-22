import { expect, it } from 'vitest'
import { initTempPath } from '@liuli-util/test'
import { ao3, extractId } from '../ao3'
import { convert } from '@mark-magic/core'
import * as local from '@mark-magic/plugin-local'
import { fromAsync } from '@mark-magic/utils'
import { pathExists } from 'fs-extra'
import path from 'pathe'
import { readdir } from 'fs/promises'

const tempPath = initTempPath(__filename)

it('extract ao3 id', () => {
  expect(extractId('https://archiveofourown.org/works/29943597/')).toBe('29943597')
  expect(extractId('https://archiveofourown.org/works/29943597/chapters/73705791')).toBe('29943597')
})

it.skip('input get chapters', async () => {
  const list = await fromAsync(ao3({ url: 'https://archiveofourown.org/works/29943597/' }).generate())
  expect(list).length(7)
})

it.skip('output to local', async () => {
  await convert({
    input: ao3({ url: 'https://archiveofourown.org/works/29943597/' }),
    output: local.output({
      path: tempPath,
    }),
  })
})

it.skip('output to local of 44255836', async () => {
  await convert({
    input: ao3({ url: 'https://archiveofourown.org/works/44255836/' }),
    output: local.output({
      path: tempPath,
    }),
  })
})

it('只有一章的情况', async () => {
  await convert({
    input: ao3({ url: 'https://archiveofourown.org/works/50740075' }),
    output: local.output({
      path: tempPath,
    }),
  })
})

it.skip('输出的文件名是按照章节数量计算的', async () => {
  await convert({
    input: ao3({ url: 'https://archiveofourown.org/works/777002' }),
    output: local.output({
      path: tempPath,
    }),
  })
  ;(await readdir(tempPath)).filter((it) => it.endsWith('.md')).forEach((it) => expect(it).match(/^\d{2}\.md$/))
}, 20_000)
