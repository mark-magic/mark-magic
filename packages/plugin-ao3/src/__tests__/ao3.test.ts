import { expect, it } from 'vitest'
import { initTempPath } from '@liuli-util/test'
import { writeFile } from 'fs/promises'
import path from 'pathe'
import { extractId, fetchChapterContent, getChapters } from '../input'

const tempPath = initTempPath(__filename)

it('extract ao3 id', () => {
  expect(extractId('https://archiveofourown.org/works/29943597/')).toBe('29943597')
  expect(extractId('https://archiveofourown.org/works/29943597/chapters/73705791')).toBe('29943597')
})

it.skip('fetch ao3 chapters', async () => {
  // https://archiveofourown.org/works/29943597/
  const url = 'https://archiveofourown.org/works/29943597/'
  const res = await fetch(url)
  const html = await res.text()
  await writeFile(path.join(tempPath, 'ao3.html'), html)
})

it.skip('parse ao3 chapters', async () => {
  const list = await getChapters(extractId('https://archiveofourown.org/works/29943597/'))
  // console.log(list)
  expect(list).deep.eq([
    { id: '73705791', name: '1. 1' },
    { id: '73705929', name: '2. 2' },
    { id: '73706112', name: '3. 3, 4' },
    {
      id: '73706373',
      name: '4. 5, 6, 13, 16, 19, 20, 21, 22, 23, 27, 28, 29, 30...',
    },
    { id: '73707411', name: '5. 44, 45, 46, 50' },
    { id: '73707681', name: '6. 51, 52, 53' },
    { id: '73707825', name: '7. 1' },
  ])
})

it.skip('fetch ao3 chapter content', async () => {
  const chapter = { bookId: '29943597', id: '73705791', name: '1. 1' }
  const content = await fetchChapterContent(chapter)
  console.log(content)
})
