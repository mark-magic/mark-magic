import { mkdirp, remove } from '@liuli-util/fs-extra'
import { convert } from '@mami/cli'
import path from 'path'
import { beforeEach, it } from 'vitest'
import { obsidianInput } from '..'
import { localDirOutput } from '@mami/plugin-local'

const tempPath = path.resolve(__dirname, '.temp')
beforeEach(async () => {
  await remove(tempPath)
  await mkdirp(tempPath)
})

it('convert', async () => {
  await convert({
    input: [obsidianInput({ root: path.resolve(__dirname, 'assets') })],
    output: [localDirOutput({ noteRootPath: tempPath, resourceRootPath: path.resolve(tempPath, '_resources') })],
  })
})
