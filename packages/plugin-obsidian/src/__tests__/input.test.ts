import { convert } from '@mami/cli'
import path from 'path'
import { beforeEach, expect, it } from 'vitest'
import * as obsidian from '../input'
import { remove, mkdirp } from '@liuli-util/fs-extra'
import * as raw from '@mami/plugin-raw'
import { fromAsync } from '../utils/fromAsync'

const tempPath = path.resolve(__dirname, '.temp/', path.basename(__filename))
beforeEach(async () => {
  await remove(tempPath)
  await mkdirp(tempPath)
})

it('obsidianInput', async () => {
  const list = await fromAsync(obsidian.input({ root: path.resolve(__dirname, 'assets') }).generate())
  console.log(list)
  expect(list.length).eq(3)
})

it.only('input', async () => {
  const zipPath = path.resolve(tempPath, 'test.zip')
  const sourcePath = path.resolve(__dirname, 'assets')
  await convert({
    input: [obsidian.input({ root: sourcePath })],
    output: [raw.output({ path: zipPath })],
  })
})
