import { fromMarkdown, getYamlMeta } from '@liuli-util/markdown-util'
import { Note, Tag } from '@mami/cli'
import { expect, it } from 'vitest'
import { addMeta, HexoPostMeta } from '../addMeta'

it('addMetas', () => {
  const root = fromMarkdown(`# hello`)
  const note = {
    id: 'test',
    title: 'test-title',
    createAt: Date.now(),
    updateAt: Date.now(),
    tags: [] as Tag[],
  } as Note
  addMeta(root, note)
  const r = getYamlMeta(root) as HexoPostMeta
  expect(r.abbrlink).eq(note.id)
  expect(r.title).eq(note.title)
  expect(r.date).eq(note.createAt)
  expect(r.updated).eq(note.updateAt)
})
