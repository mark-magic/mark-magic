import { convert } from '@mami/cli'
import { beforeEach, expect, it } from 'vitest'
import { joplinInput } from '@mami/plugin-joplin-input'
import { localDirOutput } from '../localDirOutput'
import { mkdirp, pathExists, remove } from '@liuli-util/fs-extra'
import path from 'path'

const tempPath = path.resolve(__dirname, '.temp')
beforeEach(async () => {
  await remove(tempPath)
  await mkdirp(tempPath)
})

it.skip('joplin2hexo', async () => {
  await convert({
    root: tempPath,
    plugins: [
      joplinInput({
        baseUrl: 'http://localhost:27583',
        token:
          '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31',
        tag: '',
      }),
      localDirOutput({ root: tempPath }),
    ],
  })

  expect(await pathExists(path.resolve(tempPath, 'source/_posts'))).to.be.true
  expect(await pathExists(path.resolve(tempPath, 'source/resource'))).to.be.true
})
