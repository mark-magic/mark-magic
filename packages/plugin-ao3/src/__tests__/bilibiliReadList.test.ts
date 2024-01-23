import { it } from 'vitest'
import { bilibiliReadList } from '../bilibiliReadList'
import { convert } from '@mark-magic/core'
import * as local from '@mark-magic/plugin-local'
import { initTempPath } from '@liuli-util/test'

const tempPath = initTempPath(__filename)

it.skip('bilibiliReadList', async () => {
  await convert({
    input: bilibiliReadList({ url: 'https://www.bilibili.com/read/readlist/rl705094' }),
    output: local.output({ path: tempPath }),
  }).on('generate', (it) => {
    console.log(it.content.name)
  })
})
