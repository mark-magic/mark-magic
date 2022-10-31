import { convert } from '@mami/cli'
import { expect, it } from 'vitest'
import * as joplin from '@mami/plugin-joplin'
import { hexo } from '../hexo'
import { pathExists } from '@liuli-util/fs-extra'
import path from 'path'
import { initTestDir } from '../utils/initTestDir'

const tempPath = path.resolve(__dirname, '.temp', path.basename(__filename))
initTestDir(tempPath)

it.skip('joplin2hexo', async () => {
  await convert({
    input: [
      joplin.input({
        baseUrl: 'http://localhost:27583',
        token:
          '5bcfa49330788dd68efea27a0a133d2df24df68c3fd78731eaa9914ef34811a34a782233025ed8a651677ec303de6a04e54b57a27d48898ff043fd812d8e0b31',
        tag: '',
      }),
    ],
    output: [hexo({ root: tempPath })],
  })

  expect(await pathExists(path.resolve(tempPath, 'source/_posts'))).to.be.true
  expect(await pathExists(path.resolve(tempPath, 'source/resources'))).to.be.true
})
