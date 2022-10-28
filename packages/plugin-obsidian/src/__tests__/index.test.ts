import { mkdirp, remove } from '@liuli-util/fs-extra'
import { convert, OutputPlugin } from '@mami/cli'
import path from 'path'
import { beforeEach, expect, it, vi } from 'vitest'
import * as raw from '@mami/plugin-raw'
import * as obsidian from '../'
import { fromAsync } from '../utils/fromAsync'

const tempPath = path.resolve(__dirname, '.temp')
beforeEach(async () => {
  await remove(tempPath)
  await mkdirp(tempPath)
})

it.only('测试导出最终等于导入', async () => {
  const zipPath = path.resolve(tempPath, 'test.zip')
  const sourcePath = path.resolve(__dirname, 'assets')
  const outputPath = path.resolve(tempPath, 'output')
  await convert({
    input: [obsidian.input({ root: sourcePath })],
    output: [raw.output({ path: zipPath })],
  })
  await convert({
    input: [raw.input({ path: zipPath })],
    output: [obsidian.output({ root: outputPath })],
  })
  await convert({
    input: [obsidian.input({ root: outputPath })],
    output: [raw.output({ path: zipPath })],
  })
  await convert({
    input: [raw.input({ path: zipPath })],
    output: [obsidian.output({ root: outputPath })],
  })
  const zip2Path = path.resolve(tempPath, 'test2.zip')
  await convert({
    input: [obsidian.input({ root: outputPath })],
    output: [raw.output({ path: zip2Path })],
  })
  const mockFn = vi.fn()
  const outputVirtual: OutputPlugin = {
    name: 'outputVirtual',
    handle: mockFn,
  }
  await convert({
    input: [raw.input({ path: zipPath })],
    output: [outputVirtual],
  })
  const r1 = mockFn.mock.calls
  mockFn.mockClear()
  await convert({
    input: [raw.input({ path: zipPath })],
    output: [outputVirtual],
  })
  const r2 = mockFn.mock.calls
  expect(r1).deep.eq(r2)
})

it('input', async () => {
  const outputPath = path.resolve(tempPath, 'output')
  const list = await fromAsync(obsidian.input({ root: outputPath }).generate())
  console.log(list)
})
