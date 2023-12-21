import { expect, it } from 'vitest'
import { lowcaseObjectKeys } from '../lowcase'

it('lowcaseObjectKeys', () => {
  expect(lowcaseObjectKeys({ A: 1, B: 2 })).deep.eq({ a: 1, b: 2 })
  expect(lowcaseObjectKeys({ Author: '', Tags: [] })).deep.eq({ author: '', tags: [] })
})
