import { it, expect, describe, beforeAll } from 'vitest'
import { split, trans, createTrans, Translation } from '../translate'
import { readFile, writeFile } from 'fs/promises'
import path from 'pathe'
import { initTempPath } from '@liuli-util/test'

describe.skip('createTrans', () => {
  it('translate by google', async () => {
    expect(await createTrans({ engine: 'google', to: 'zh-CN' })('hello world')).eq('你好世界')
    expect((await createTrans({ engine: 'google', to: 'en' })('你好世界')).toLowerCase()).eq('hello world')
  })
  it('translate by openai', async () => {
    console.log(
      await createTrans({ engine: 'openai', apiKey: import.meta.env.OPENAI_API_KEY, to: 'zh-CN' })('hello world'),
    )
    // expect(await createTrans({ engine: 'openai', apiKey: import.meta.env.OPENAI_API_KEY, to: 'zh-CN' })('hello world'))
    //   .include('你好')
    //   .include('世界')
    // expect(
    //   (
    //     await createTrans({ engine: 'openai', apiKey: import.meta.env.OPENAI_API_KEY, to: 'en' })('你好世界')
    //   ).toLowerCase(),
    // ).eq('hello world')
  })
})

it('split text', async () => {
  const text = await readFile(path.resolve(__dirname, './assets/book.md'), 'utf-8')
  expect(await split(text, 2000)).length(3)
  // await trans({ engine: 'openai', apiKey: import.meta.env.OPENAI_API_KEY, to: 'zh-CN' })('hello world')
})

describe.skip('trans', () => {
  const tempPath = initTempPath(__filename)
  let book: string
  beforeAll(async () => {
    book = await readFile(path.resolve(__dirname, './assets/book.md'), 'utf-8')
  })
  it('translate and split by google', async () => {
    const t = createTrans({ engine: 'google', to: 'en' })
    await writeFile(path.resolve(tempPath, 'book-google.md'), await t(book))
  })
  it('translate and split by openai', async () => {
    const t = createTrans({ engine: 'openai', apiKey: import.meta.env.OPENAI_API_KEY, to: 'en' })
    await writeFile(path.resolve(tempPath, 'book-openai.md'), await t(book))
  }, 60_000)
})
