import { it } from 'vitest'
import { fromAsync } from '@mark-magic/utils'
import { convert } from '@mark-magic/core'
import * as local from '@mark-magic/plugin-local'
import * as ao3 from '../input'
import { initTempPath } from '@liuli-util/test'
import path from 'pathe'

const tempPath = initTempPath(__filename)

it.skip('input get chapters', async () => {
  const list = await fromAsync(ao3.input('https://archiveofourown.org/works/29943597/').generate())
  console.log(list)
})

it.skip('output to local', async () => {
  await convert({
    input: ao3.input('https://archiveofourown.org/works/29943597/'),
    output: local.output({
      path: tempPath,
    }),
  })
})
