import { expect, it } from 'vitest'
import { extractFromHTML, extractId, getBook } from '../input'
import { readFile } from 'fs/promises'
import path from 'pathe'

it('extract ao3 id', () => {
  expect(extractId('https://archiveofourown.org/works/29943597/')).toBe('29943597')
  expect(extractId('https://archiveofourown.org/works/29943597/chapters/73705791')).toBe('29943597')
})

it.skip('extractFromHTML', async () => {
  const s = await readFile(path.join(__dirname, './assets', '29943597.html'), 'utf8')
  const r = extractFromHTML(s)
  expect(r).length(7)
})

it.skip('getBook', async () => {
  const r = await getBook('29943597')
  expect(r).length(7)
})
