import { expect, it } from 'vitest'
import { outputCache } from '../cache'
import { wait } from '@liuli-util/async'
import { convert, Note, Resource, Tag } from '@mami/cli'
import { Random } from 'mockjs'

it('outputCache', async () => {
  const list = Array(100)
    .fill(0)
    .map(
      () =>
        ({
          id: Random.id(),
          title: Random.string(),
          content: Random.string(),
          createAt: Date.now(),
          updateAt: Date.now(),
          path: [] as string[],
          resources: [] as Resource[],
          tags: [] as Tag[],
        } as Note),
    )
  const testInputPlugin: import('C:/Users/rxliuli/Code/web/mami/packages/cli/dist/convert').InputPlugin = {
    name: 'test',
    async *generate() {
      for (const item of list) {
        yield item
      }
    },
  }
  let cache: Record<string, number> = {}
  const outputPlugin = outputCache(
    {
      name: 'test',
      async handle() {
        await wait(10)
      },
    },
    {
      async read() {
        return cache
      },
      async write(data) {
        cache = data
      },
    },
  )
  const start = Date.now()
  await convert({
    input: [testInputPlugin],
    output: [outputPlugin],
  })
  const t1 = Date.now()
  await convert({
    input: [testInputPlugin],
    output: [outputPlugin],
  })
  const t2 = Date.now()
  const first = t1 - start
  const second = t2 - t1
  console.log('time: ', first, second)
  expect(first / second > 10).true
})
