import { mkdirp, remove } from '@liuli-util/fs-extra'
import { convert } from '@mami/cli'
import path from 'path'
import { beforeEach, it } from 'vitest'
import { input } from '..'
import { output } from '@mami/plugin-local'

const tempPath = path.resolve(__dirname, '.temp/', path.basename(__filename))
beforeEach(async () => {
  await remove(tempPath)
  await mkdirp(tempPath)
})

it('convert', async () => {
  await convert({
    input: [input({ root: path.resolve(__dirname, 'assets') })],
    output: [output({ noteRootPath: tempPath, resourceRootPath: path.resolve(tempPath, '_resources') })],
  })
})
