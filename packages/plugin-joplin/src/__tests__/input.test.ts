import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { calcTitle, convertContentLink, input } from '../input'
import { fromAsync } from '@mark-magic/utils'
import { flatMap, last, map } from 'lodash-es'
import { convert } from '@mark-magic/core'
import { fromMarkdown, select } from '@liuli-util/markdown-util'
import { config, noteApi, searchApi, tagApi } from 'joplin-api'
import { wait } from '@liuli-util/async'

it('calcTitle', () => {
  expect(calcTitle({ id: '1', title: 'test.png', file_extension: 'png', mime: 'image/png' })).eq('test.png')
  expect(calcTitle({ id: '1', title: 'test', file_extension: 'png', mime: 'image/png' })).eq('test.png')
  expect(calcTitle({ id: '1', title: 'test', file_extension: '', mime: 'image/png' })).eq('test.png')
  expect(calcTitle({ id: '1', title: '', file_extension: '', mime: 'image/png' })).eq('1.png')
  expect(calcTitle({ id: '1', title: '', file_extension: 'png', mime: '' })).eq('1.png')
})

it('internal link for note and resource', async () => {
  const r = convertContentLink(`[test](:/test) ![image](:/image) [github](https://github.com)`, ['test', 'image'])
  expect(r.trim()).eq('[test](:/resource/test) ![image](:/resource/image) [github](https://github.com)')
})

describe('convert', () => {
  beforeAll(() => {
    config.token = import.meta.env.VITE_JOPLIN_TOKEN
    config.baseUrl = import.meta.env.VITE_JOPLIN_BASE_URL
  })
  it('joplinInput', async () => {
    const list = await fromAsync(
      input({
        baseUrl: import.meta.env.VITE_JOPLIN_BASE_URL,
        token: import.meta.env.VITE_JOPLIN_TOKEN,
        tag: 'blog',
      }).generate(),
    )
    expect(list).not.empty
    expect(flatMap(list, 'extra.tags')).not.include('blog')
  })

  it('Should path is include file name', async () => {
    const list = await fromAsync(
      input({
        baseUrl: import.meta.env.VITE_JOPLIN_BASE_URL,
        token: import.meta.env.VITE_JOPLIN_TOKEN,
        tag: 'blog',
      }).generate(),
    )
    list.forEach((it) => expect(last(it.path)!.endsWith('.md')).true)
  })

  describe('Should content include title set context', () => {
    let createNoteId: string
    beforeAll(async () => {
      if ((await searchApi.search({ query: 'test title in plugin-joplin tag:blog' })).items.length > 0) {
        return
      }
      createNoteId = (
        await noteApi.create({
          title: 'test title in plugin-joplin',
          body: 'test body',
        })
      ).id
      const blogTagId = (await tagApi.list()).items.find((it) => it.title === 'blog')!.id
      await tagApi.addTagByNoteId(blogTagId, createNoteId)
    })
    it('Should content include title', async () => {
      const list = await fromAsync(
        input({
          baseUrl: import.meta.env.VITE_JOPLIN_BASE_URL,
          token: import.meta.env.VITE_JOPLIN_TOKEN,
          tag: 'blog',
        }).generate(),
      )
      console.log(
        list.map((it) => [it.id, it.name]),
        createNoteId,
      )
      list.forEach((it) => expect(!!select('heading[depth=1]', fromMarkdown(it.content))).true)
    })
  })
})
