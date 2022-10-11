import { mkdirp, remove } from '@liuli-util/fs-extra'
import { convert } from '@mami/cli'
import path from 'path'
import { beforeEach, it } from 'vitest'
import { obsidianInput } from '..'
import { localDirOutput } from '@mami/plugin-local-dir-output'

const tempPath = path.resolve(__dirname, '.temp')
beforeEach(async () => {
  await remove(tempPath)
  await mkdirp(tempPath)
})

it('convert', async () => {
  await convert({
    plugins: [obsidianInput({ root: path.resolve(__dirname, 'assets') }), localDirOutput({ root: tempPath })],
  })
})
