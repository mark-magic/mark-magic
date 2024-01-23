import { expect, it, vi } from 'vitest'
import { extractFromHTML, extractId, getCachePath, sufficientvelocity } from '../sufficientvelocity'
import { convert } from '@mark-magic/core'
import * as local from '@mark-magic/plugin-local'
import { initTempPath } from '@liuli-util/test'
import { readFile, rm } from 'fs/promises'
import path from 'pathe'
import { AsyncArray } from '@liuli-util/async'

const tempPath = initTempPath(__filename)

it('extractId', () => {
  const list = [
    'https://forums.sufficientvelocity.com/threads/2538/',
    'https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/',
    'https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/reader/',
    'https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/reader/page-2',
    'https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/post-288898',
  ]
  list.forEach((it) => expect(extractId(it)).toBe('2538'))
})

it('extractFromHTML', async (context) => {
  await AsyncArray.forEach(['2538', '285723'], async (it) => {
    const s = await readFile(path.resolve(__dirname, `./assets/sufficientvelocity/${it}.html`), 'utf-8')
    const r = extractFromHTML(s)
    expect(r).length(10)
  })
})

it.skip('output to local', async () => {
  await convert({
    input: sufficientvelocity({
      url: 'https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/reader/',
      cached: true,
    }),
    output: local.output({
      path: tempPath,
    }),
  })
}, 100_000)

it.skip('output to local for 125149', async () => {
  await convert({
    input: sufficientvelocity({
      url: 'https://forums.sufficientvelocity.com/threads/lost-in-time-a-pmmm-quest.125149/',
    }),
    output: local.output({
      path: tempPath,
    }),
  })
})

it.skip('output to local for cache', async () => {
  const spy = vi.spyOn(globalThis, 'fetch')
  const f = () =>
    convert({
      input: sufficientvelocity({
        url: 'https://forums.sufficientvelocity.com/threads/125149/',
        cached: true,
      }),
      output: local.output({
        path: tempPath,
      }),
    })
  await rm(getCachePath()!, { force: true, recursive: true })
  await f()
  const len = spy.mock.calls.length
  await f()
  expect(spy).toBeCalledTimes(len)
})

it.skip('output to local for 122821', async () => {
  await convert({
    input: sufficientvelocity({
      url: 'https://forums.sufficientvelocity.com/threads/incubator-quest-pmmm-quest.122821/',
    }),
    output: local.output({
      path: tempPath,
    }),
  })
})
