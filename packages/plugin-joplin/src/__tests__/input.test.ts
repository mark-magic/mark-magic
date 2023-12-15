import { expect, it } from 'vitest'
import { calcTitle, input } from '../input'
import { fromAsync } from '@mark-magic/utils'
import { last } from 'lodash-es'

it.skip('joplinInput', async () => {
  const list = await fromAsync(
    input({
      baseUrl: import.meta.env.VITE_JOPLIN_BASE_URL,
      token: import.meta.env.VITE_JOPLIN_TOKEN,
      tag: '',
    }).generate(),
  )
  console.log(last(list)?.extra)
  expect(list).not.empty
})

it('calcTitle', () => {
  expect(calcTitle({ id: '1', title: 'test.png', file_extension: 'png', mime: 'image/png' })).eq('test.png')
  expect(calcTitle({ id: '1', title: 'test', file_extension: 'png', mime: 'image/png' })).eq('test.png')
  expect(calcTitle({ id: '1', title: 'test', file_extension: '', mime: 'image/png' })).eq('test.png')
  expect(calcTitle({ id: '1', title: '', file_extension: '', mime: 'image/png' })).eq('1.png')
  expect(calcTitle({ id: '1', title: '', file_extension: 'png', mime: '' })).eq('1.png')
})
