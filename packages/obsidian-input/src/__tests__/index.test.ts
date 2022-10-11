import { convert } from '@mami/cli'
import { keyBy } from 'lodash-es'
import path from 'path'
import { expect, it } from 'vitest'
import { obsidianInput } from '..'

async function fromAsync<T>(asyncItems: AsyncIterable<T>): Promise<T[]> {
  const r: T[] = []
  for await (const i of asyncItems) {
    r.push(i)
  }
  return r
}

it('obsidianInput', async () => {
  const list = await fromAsync(obsidianInput({ root: path.resolve(__dirname, 'assets') }).generate())
  console.log(list)
  expect(list.length).eq(3)
})
