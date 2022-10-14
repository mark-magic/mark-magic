import filenamify, { filenamifyPath } from 'filenamify'
import path from 'path'
import { expect, it } from 'vitest'

it('filenamify', () => {
  expect(filenamifyPath(path.resolve(__dirname, 'foo:bar'))).includes('foo!bar')
  expect(filenamify('中文')).eq('中文')
})
