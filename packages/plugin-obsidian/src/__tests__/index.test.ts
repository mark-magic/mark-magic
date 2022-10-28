import { convert } from '@mami/cli'
import path from 'path'
import { beforeEach, expect, it } from 'vitest'
import * as obsidian from '..'
import * as raw from '@mami/plugin-raw'
import { remove, mkdirp } from '@liuli-util/fs-extra'

const tempPath = path.resolve(__dirname, '.temp')
beforeEach(async () => {
  await remove(tempPath)
  await mkdirp(tempPath)
})

async function fromAsync<T>(asyncItems: AsyncIterable<T>): Promise<T[]> {
  const r: T[] = []
  for await (const i of asyncItems) {
    r.push(i)
  }
  return r
}

it('obsidianInput', async () => {
  const list = await fromAsync(obsidian.input({ root: path.resolve(__dirname, 'assets') }).generate())
  console.log(list)
  expect(list.length).eq(3)
})

it.only('input', async () => {
  const zipPath = path.resolve(tempPath, 'test.zip')
  await convert({
    input: [obsidian.input({ root: path.resolve(__dirname, 'assets') })],
    output: [raw.output({ path: zipPath })],
  })
  await convert({
    input: [raw.input({ path: zipPath })],
    output: [obsidian.output({ root: path.resolve(tempPath, 'output') })],
  })
})
