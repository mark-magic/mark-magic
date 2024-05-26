import { it } from 'vitest'
import { fromAsync } from '@mark-magic/utils'
import * as ao3 from '../input'
import { initTempPath } from '@liuli-util/test'

const tempPath = initTempPath(__filename)

it.skip('input get chapters', async () => {
  const list = await fromAsync(ao3.input({ url: 'https://archiveofourown.org/works/29943597/' }).generate())
  console.log(list)
})
