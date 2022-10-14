import { mkdirp, remove } from '@liuli-util/fs-extra'
import { fromMarkdown, toMarkdown } from '@liuli-util/markdown-util'
import { Resource } from '@mami/cli'
import { filenamifyPath } from 'filenamify'
import path from 'path'
import { beforeEach, expect, it } from 'vitest'
import { BiMultiMap } from '../BiMultiMap'
import { convertLinks } from '../convertLinks'

const tempPath = path.resolve(__dirname, '.temp')
beforeEach(async () => {
  await remove(tempPath)
  await mkdirp(tempPath)
})

it('convertLinks', () => {
  const root = fromMarkdown(
    `
# hello

[test.mp3](:/4b638fd91af2417e9fd0942c3e04ea0c)
[flower.webm](:/b160280b7d94417bb7f64d5fd1969230)
[1. Welcome to Joplin!](:/b6175f189a4e4c1cbea14c72848c54cb)
[foo:bar](:/d867b35e62454483ae697185d93617ab)
[github](https://github.com)
  `.trim(),
  )
  const resources = [
    { id: '4b638fd91af2417e9fd0942c3e04ea0c', title: 'test.mp3' },
    { id: 'b160280b7d94417bb7f64d5fd1969230', title: 'flower.webm' },
  ] as Resource[]
  const noteMap = new BiMultiMap<string, string>()
  noteMap.set('b6175f189a4e4c1cbea14c72848c54cb', path.resolve(tempPath, 'c/Welcome to Joplin.md'))
  noteMap.set('d867b35e62454483ae697185d93617ab', filenamifyPath(path.resolve(tempPath, 'c/foo:bar')))
  const resourceMap = new BiMultiMap<string, string>()
  resources.forEach((item) => resourceMap.set(item.id, path.resolve(tempPath, '_resources', item.title)))
  convertLinks({ fsPath: path.resolve(tempPath, 'a/b/test.md'), note: { resources }, noteMap, resourceMap, root })
  const r = toMarkdown(root)
  console.log(r)
  expect(r.includes('../../_resources/test.mp3')).true
  expect(r.includes('../../_resources/flower.webm')).true
  expect(r.includes(encodeURI('../c/Welcome to Joplin.md'))).true
})
