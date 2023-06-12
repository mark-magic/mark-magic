import { expect, it } from 'vitest'
import { initTempPath } from '../test'
import { access } from 'fs/promises'

const tempPath = initTempPath(__filename)

function pathExists(path: string): Promise<boolean> {
  return access(path)
    .then(() => true)
    .catch(() => false)
}

it('test', async () => {
  expect(await pathExists(tempPath)).true
})
