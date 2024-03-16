import { describe, expect, it } from 'vitest'
import { initTempPath } from '@liuli-util/test'
import { ao3, extractChaptersFromHTML, extractId } from '../input'
import { convert } from '@mark-magic/core'
import * as local from '@mark-magic/plugin-local'
import * as epub from '@mark-magic/plugin-epub'
import { fromAsync } from '@mark-magic/utils'
import { readFile, readdir } from 'fs/promises'
import { pathExists } from 'fs-extra/esm'
import path from 'pathe'
import { parse } from 'node-html-parser'

const tempPath = initTempPath(__filename)

it('extract ao3 id', () => {
  expect(extractId('https://archiveofourown.org/works/29943597/')).eq('29943597')
  expect(extractId('https://archiveofourown.org/works/29943597/chapters/73705791')).eq('29943597')
})

it('extractChaptersFromHTML', async () => {
  const html = await readFile(path.resolve(__dirname, './assets/32241079.html'), 'utf-8')
  const $dom = parse(html)
  const res = extractChaptersFromHTML($dom)
  expect(res.length).eq(33)
})

describe.skip('input', () => {
  it('input get chapters', async () => {
    const list = await fromAsync(ao3({ url: 'https://archiveofourown.org/works/29943597/' }).generate())
    expect(list).length(8)
  })

  it('output to local', async () => {
    await convert({
      input: ao3({ url: 'https://archiveofourown.org/works/29943597/' }),
      output: local.output({
        path: tempPath,
      }),
    })
    expect(await pathExists(path.resolve(tempPath, 'readme.md'))).true
    expect((await readdir(tempPath)).filter((it) => it.endsWith('.md'))).length(8)
  })

  it('output to local of 44255836', async () => {
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

  it('输出的文件名是按照章节数量计算的', async () => {
    await convert({
      input: ao3({ url: 'https://archiveofourown.org/works/777002' }),
      output: local.output({
        path: tempPath,
      }),
    })
    ;(await readdir(tempPath)).filter((it) => it.endsWith('.md')).forEach((it) => expect(it).match(/^\d{2}\.md$/))
  }, 20_000)

  it('should output epub format', async () => {
    await convert({
      input: ao3({ url: 'https://archiveofourown.org/works/29943597/' }),
      output: epub.output({
        path: path.resolve(tempPath, 'test.epub'),
        id: '29943597',
        title: 'test',
        creator: 'mark-magic',
        publisher: 'mark-magic',
      }),
    })
    expect((await readdir(tempPath)).filter((it) => it.endsWith('.epub'))).length(1)
  })

  it('Dont config epub output config', async () => {
    await convert({
      input: ao3({ url: 'https://archiveofourown.org/works/49095601/chapters/123864562' }),
      output: epub.output({
        path: path.resolve(tempPath, 'test.epub'),
      }),
    })
  })

  it('Input with cookie', async () => {
    await convert({
      input: ao3({
        url: 'https://archiveofourown.org/works/32241079/chapters/80670517',
        cookie: import.meta.env.VITE_AO3_COOKIE,
      }),
      output: local.output({
        path: tempPath,
      }),
    })
  })
})
