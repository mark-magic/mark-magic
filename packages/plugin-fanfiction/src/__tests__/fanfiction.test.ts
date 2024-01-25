import { convert } from '@mark-magic/core'
import { expect, it } from 'vitest'
import { extractId, fanfiction } from '../fanfiction'
import * as local from '@mark-magic/plugin-local'
import { initTempPath } from '@liuli-util/test'

const tempPath = initTempPath(__filename)

it('extractId', () => {
  expect(extractId('https://www.fanfiction.net/s/11551156/1/A-Wish-Within-Darkness')).toBe('11551156')
  expect(extractId('https://www.fanfiction.net/s/11551156/1/')).toBe('11551156')
  expect(extractId('https://m.fanfiction.net/s/11551156/1/A-Wish-Within-Darkness')).toBe('11551156')
  expect(extractId('https://m.fanfiction.net/s/11551156/1/')).toBe('11551156')
})

it.skip('output to local', async () => {
  await convert({
    input: fanfiction({ url: 'https://www.fanfiction.net/s/11551156/2/A-Wish-Within-Darkness' }),
    output: local.output({
      path: tempPath,
    }),
  })
}, 100_000)
