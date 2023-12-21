import { expect, it } from 'vitest'
import { sha1 } from '../sha1'

it('sha1', async () => {
  expect(sha1('hello')).eq(sha1('hello'))
  expect(sha1('hello')).not.eq(sha1('world'))
})
