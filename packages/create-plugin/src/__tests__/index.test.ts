import { it, expect } from 'vitest'
import { CreateOptions, create } from '..'
import { initTempPath } from '@liuli-util/test'
import path from 'pathe'
import { pathExists, readJson } from 'fs-extra/esm'
import { rm } from 'fs/promises'

const tempPath = initTempPath(__filename)

it('create', async () => {
  await create({
    root: tempPath,
    name: 'test',
    template: 'plugin-template',
  })
  expect(await pathExists(path.resolve(tempPath, 'test'))).true
  expect((await readJson(path.resolve(tempPath, 'test', 'package.json'))).name).eq('test')
})

it('overwrite', async () => {
  const options: CreateOptions = {
    root: tempPath,
    name: 'test',
    template: 'plugin-template',
  }
  await create(options)
  const p = path.resolve(tempPath, 'test/vite.config.ts')
  console.log(p)
  expect(await pathExists(p)).true
  await rm(p)
  expect(await pathExists(p)).false
  await create(options)
  expect(await pathExists(p)).true
})
