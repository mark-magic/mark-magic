import { it, expect, describe, beforeAll } from 'vitest'
import { split, createTrans } from '../translate'
import { readFile, writeFile } from 'fs/promises'
import path from 'pathe'
import { initTempPath } from '@liuli-util/test'
import { OpenAI } from 'openai'

describe.skip('createTrans', () => {
  it('translate by google', async () => {
    expect(await createTrans({ engine: 'google', to: 'zh-CN' })('hello world')).eq('你好世界')
    expect((await createTrans({ engine: 'google', to: 'en' })('你好世界')).toLowerCase()).eq('hello world')
  })
  it('translate by openai', async () => {
    console.log(
      await createTrans({ engine: 'openai', apiKey: import.meta.env.VITE_OPENAI_API_KEY, to: 'zh-CN' })('hello world'),
    )
    // expect(await createTrans({ engine: 'openai', apiKey: import.meta.env.VITE_OPENAI_API_KEY, to: 'zh-CN' })('hello world'))
    //   .include('你好')
    //   .include('世界')
    // expect(
    //   (
    //     await createTrans({ engine: 'openai', apiKey: import.meta.env.VITE_OPENAI_API_KEY, to: 'en' })('你好世界')
    //   ).toLowerCase(),
    // ).eq('hello world')
  })
})

it('split text', async () => {
  const text = await readFile(path.resolve(__dirname, './assets/book.md'), 'utf-8')
  expect(await split(text, 2000)).length(3)
  // await trans({ engine: 'openai', apiKey: import.meta.env.VITE_OPENAI_API_KEY, to: 'zh-CN' })('hello world')
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
    const t = createTrans({ engine: 'openai', apiKey: import.meta.env.VITE_OPENAI_API_KEY, to: 'en' })
    await writeFile(path.resolve(tempPath, 'book-openai.md'), await t(book))
  }, 60_000)
  it('translate and split by copilot gpt-4', async () => {
    const t = createTrans({
      engine: 'openai',
      apiKey: import.meta.env.VITE_GITHUB_COPILOT_API_KEY,
      to: 'en',
      baseUrl: 'http://127.0.0.1:8080/v1/',
      model: 'gpt-4',
    })
    await writeFile(path.resolve(tempPath, 'book-openai.md'), await t(book))
  }, 60_000)
})

it.skip('local github copilot service', async () => {
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_GITHUB_COPILOT_API_KEY,
    baseURL: 'http://127.0.0.1:8080/v1/',
  })
  const r = await openai.chat.completions.create({
    messages: [{ role: 'user', content: '你能做什么？' }],
    model: 'gpt-4',
  })
  console.log(r.choices)
}, 60_000)
