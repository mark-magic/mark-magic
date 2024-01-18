import { expect, it } from 'vitest'
import { extractFromHTML, extractId, sufficientvelocity } from '../sufficientvelocity'
import { convert } from '@mark-magic/core'
import * as local from '@mark-magic/plugin-local'
import { initTempPath } from '@liuli-util/test'
import { readFile } from 'fs/promises'
import path from 'pathe'
import { AsyncArray } from '@liuli-util/async'

const tempPath = initTempPath(__filename)

it('extractId', () => {
  const list = [
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
    expect(r.chapters).length(10)
  })
})

it.skip('output to local', async () => {
  await convert({
    input: sufficientvelocity({
      url: 'https://forums.sufficientvelocity.com/threads/puella-magi-adfligo-systema.2538/reader/',
    }),
    output: local.output({
      path: tempPath,
    }),
  })
}, 100_000)
