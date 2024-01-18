import { expect, it } from 'vitest'
import { fromAsync } from '@mark-magic/utils'
import { convert } from '@mark-magic/core'
import * as local from '@mark-magic/plugin-local'
import * as ao3 from '../input'
import { initTempPath } from '@liuli-util/test'

const tempPath = initTempPath(__filename)

it.skip('input get chapters', async () => {
  const list = await fromAsync(ao3.input('https://archiveofourown.org/works/29943597/').generate())
  expect(list).length(7)
})

it('output to local', async () => {
  await convert({
    input: ao3.input('https://archiveofourown.org/works/29943597/'),
    output: local.output({
      path: tempPath,
    }),
  })
})

it.skip('output to local of 44255836', async () => {
  await convert({
    input: ao3.input('https://archiveofourown.org/works/44255836/'),
    output: local.output({
      path: tempPath,
    }),
  })
})
