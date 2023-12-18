import { it, expect } from 'vitest'
import { create } from '..'
import { initTempPath } from '@liuli-util/test'
import path from 'pathe'
import { pathExists, readJson } from 'fs-extra/esm'

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
