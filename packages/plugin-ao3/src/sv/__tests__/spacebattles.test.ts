import { convert } from '@mark-magic/core'
import { expect, it } from 'vitest'
import { sufficientvelocity } from '../input'
import * as local from '@mark-magic/plugin-local'
import { initTempPath } from '@liuli-util/test'
import { pathExists } from 'fs-extra/esm'
import path from 'pathe'

const tempPath = initTempPath(__filename)

it.skip('output to local', async () => {
  await convert({
    input: sufficientvelocity({
      url: 'https://forums.spacebattles.com/threads/magical-girl-harmonia-lux-a-mahou-shoujo-apocalypse-progression-fantasy-litrpg.1093247/',
      cached: true,
    }),
    output: local.output({
      path: tempPath,
    }),
  })
  expect(await pathExists(path.resolve(tempPath, 'readme.md'))).true
}, 100_000)
