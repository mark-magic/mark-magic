import { expect, it } from 'vitest'
import { sha1 } from '../sha1'

it('sha1', async () => {
  expect(await sha1('hello')).eq(await sha1('hello'))
  expect(await sha1('hello')).not.eq(await sha1('world'))
})
