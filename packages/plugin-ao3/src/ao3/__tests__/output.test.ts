import { initTempPath } from '@liuli-util/test'
import { convert } from '@mark-magic/core'
import { readFile, rm, writeFile } from 'fs/promises'
import path from 'pathe'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import * as local from '@mark-magic/plugin-local'
import {
  Ao3AuthOptions,
  addAo3Chapter,
  ao3,
  deleteAo3Chapter,
  extractChaptersFromHTML,
  getUpdateAuthToken,
  updateAo3Chapter,
  updateAo3Readme,
} from '../output'
import findCacheDirectory from 'find-cache-dir'

const tempPath = initTempPath(__filename)

let authOptions: Ao3AuthOptions

beforeAll(() => {
  authOptions = {
    cookie: import.meta.env.VITE_AO3_COOKIE,
    authenticityToken: import.meta.env.VITE_AO3_AUTH_TOKEN,
  }
})

describe.skip('api', () => {
  it('测试更新章节 api', async () => {
    const html = await updateAo3Chapter(
      {
        bookId: '53445904',
        chapterId: '135275704',
        name: '意料之外的后果 1',
        content: '你的意识在黑暗中飘忽不定，难以保持清醒。你痛苦地呕吐，但只吐出胆汁，努力回忆发生了什么',
        created: Date.now(),
        index: 1,
      },
      authOptions,
    )
    await writeFile(path.resolve(tempPath, 'index.html'), html)
  })
  it('测试获取更新 token api', async () => {
    const token = await getUpdateAuthToken({
      bookId: '53445904',
      chapterId: '135275704',
      cookie: import.meta.env.VITE_AO3_COOKIE,
    })
    // console.log('token', token)
    expect(token).not.empty
  })
  it('测试获取更新书籍元数据的 token api', async () => {
    const token = await getUpdateAuthToken({
      bookId: '53445904',
      cookie: import.meta.env.VITE_AO3_COOKIE,
    })
    // console.log('token', token)
    expect(token).not.empty
  })
  it('测试更新书籍元数据 api', async () => {
    const html = await updateAo3Readme(
      {
        bookId: '53445904',
        name: '意料之外的后果 1',
        content: '这是一本测试书籍',
      },
      authOptions,
    )
    await writeFile(path.resolve(tempPath, 'index.html'), html)
  })
  it('测试新增章节 api', async () => {
    const chapterId = await addAo3Chapter(
      {
        bookId: '53445904',
        name: '意料之外的后果 3',
        content: '这是新增的测试章节',
        created: Date.now(),
        index: 3,
      },
      authOptions,
    )
    expect(chapterId).not.empty
    // await writeFile(path.resolve(tempPath, 'index.html'), html)
  })
  it('测试删除章节 api', async () => {
    const html = await deleteAo3Chapter(
      {
        bookId: '53445904',
        chapterId: '135333889',
      },
      authOptions,
    )
    await writeFile(path.resolve(tempPath, 'index.html'), html)
  })
})

describe.skip('convert', () => {
  it('支持只有更新', async () => {
    await writeFile(
      path.resolve(tempPath, '01.md'),
      '# 意料之外的后果 1\n\n你的意识在黑暗中飘忽不定，难以保持清醒。你痛苦地呕吐，但只吐出胆汁，努力回忆发生了什么——',
    )
    await writeFile(
      path.resolve(tempPath, '02.md'),
      '# 意料之外的后果 2\n\n你花了一些时间来决定你愿意用灵魂交换的愿望。',
    )
    await convert({
      input: local.input({
        path: tempPath,
      }),
      output: ao3({
        id: '53445904',
        cookie: import.meta.env.VITE_AO3_COOKIE,
      }),
    })
  })
  it('支持存在新增章节时', async () => {
    const f = () =>
      convert({
        input: local.input({
          path: tempPath,
        }),
        output: ao3({
          id: '53445904',
          cookie: import.meta.env.VITE_AO3_COOKIE,
        }),
      })
    await writeFile(
      path.resolve(tempPath, '01.md'),
      '# 意料之外的后果 1\n\n你的意识在黑暗中飘忽不定，难以保持清醒。你痛苦地呕吐，但只吐出胆汁，努力回忆发生了什么——',
    )
    await f()
    await writeFile(
      path.resolve(tempPath, '01.md'),
      '# 意料之外的后果 1\n\n你的意识在黑暗中飘忽不定，难以保持清醒。你痛苦地呕吐，但只吐出胆汁，努力回忆发生了什么——',
    )
    await writeFile(
      path.resolve(tempPath, '02.md'),
      '# 意料之外的后果 2\n\n你花了一些时间来决定你愿意用灵魂交换的愿望。',
    )
    await f()
  })
  it.todo('支持之前多章现在单章的情况', () => {})
  // 仔细想想，也许使用 readme 更新首页简介会比较好
  it.todo('应该忽略 readme 文件')
  it.todo('支持处理只有一章的情况')
  // 删除章节可能必须要用户手动确认，所以暂时不实现
  // it.todo('存在删除章节时')
  it('应该自动缓存章节发布结果', async () => {
    const f = async () => {
      await writeFile(
        path.resolve(tempPath, '01.md'),
        '# 意料之外的后果 1\n\n你的意识在黑暗中飘忽不定，难以保持清醒。你痛苦地呕吐，但只吐出胆汁，努力回忆发生了什么——',
      )
      await writeFile(
        path.resolve(tempPath, '02.md'),
        '# 意料之外的后果 2\n\n你花了一些时间来决定你愿意用灵魂交换的愿望。',
      )
      await convert({
        input: local.input({
          path: tempPath,
        }),
        output: ao3({
          id: '53445904',
          cookie: import.meta.env.VITE_AO3_COOKIE,
        }),
      })
    }
    const spy = vi.spyOn(console, 'log')
    const dir = findCacheDirectory({ name: '@mark-magic/plugin-ao3' })
    await rm(dir!, { recursive: true })
    await f()
    await f()
    expect(spy.mock.calls.filter((it) => it[0] === 'cache hit')).length(2)
  }, 10_000)
})
