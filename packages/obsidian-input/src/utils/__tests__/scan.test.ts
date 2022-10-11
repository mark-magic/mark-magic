import path from 'path'
import { expect, it } from 'vitest'
import { scan } from '../scan'

it('scan', async () => {
  const rootPath = path.resolve(__dirname, '../../__tests__/assets')
  const r = await scan(rootPath)
  console.log(r)
  expect(r).not.empty
})
