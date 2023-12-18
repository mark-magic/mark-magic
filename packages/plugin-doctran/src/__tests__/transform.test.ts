import { expect, it } from 'vitest'
import * as local from '@mark-magic/plugin-local'
import { convert } from '@mark-magic/core'
import path from 'pathe'
import { transform } from '..'
import { initTempPath } from '@liuli-util/test'
import { readFile } from 'fs/promises'
import { AsyncArray } from '@liuli-util/async'
import { pathExists } from 'fs-extra/esm'

const tempPath = initTempPath(__filename)

it.skip('transform by google', async () => {
  await convert({
    input: local.input({ path: path.resolve(__dirname, './assets/docs') }),
    transforms: [transform({ engine: 'google', to: 'en' })],
    output: local.output({
      rootContentPath: path.resolve(tempPath, 'en'),
      rootResourcePath: path.resolve(tempPath, 'en/resources'),
      meta: () => null,
    }),
  })
  expect(await pathExists(path.resolve(tempPath, 'en/index.md'))).true
  expect(await pathExists(path.resolve(tempPath, 'en/book.md'))).true
})

it.skip('transform by openai', async () => {
  await convert({
    input: local.input({ path: path.resolve(__dirname, './assets/docs') }),
    transforms: [transform({ engine: 'openai', to: 'en', apiKey: import.meta.env.OPENAI_API_KEY })],
    output: local.output({
      rootContentPath: path.resolve(tempPath, 'en'),
      rootResourcePath: path.resolve(tempPath, 'en/resources'),
      meta: () => null,
    }),
  }).on('transform', ({ content }) => {
    console.log(content.name)
  })
}, 100_000)

it.skip('transform for cache', async () => {
  await convert({
    input: local.input({ path: path.resolve(__dirname, './assets/docs') }),
    transforms: [transform({ engine: 'google', to: 'en' })],
    output: local.output({
      rootContentPath: path.resolve(tempPath, 'en-01'),
      rootResourcePath: path.resolve(tempPath, 'en-01/resources'),
      meta: () => null,
    }),
  })
  await convert({
    input: local.input({ path: path.resolve(__dirname, './assets/docs') }),
    transforms: [transform({ engine: 'google', to: 'en' })],
    output: local.output({
      rootContentPath: path.resolve(tempPath, 'en-02'),
      rootResourcePath: path.resolve(tempPath, 'en-02/resources'),
      meta: () => null,
    }),
  })
  await AsyncArray.forEach(['index.md', 'book.md'], async (it) => {
    expect(await readFile(path.resolve(tempPath, 'en-01', it), 'utf-8')).eq(
      await readFile(path.resolve(tempPath, 'en-02', it), 'utf-8'),
    )
  })
})
