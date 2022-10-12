import { fromMarkdown, getYamlMeta, setYamlMeta } from '@liuli-util/markdown-util'
import { Note, Tag } from '@mami/cli'
import { expect, it } from 'vitest'
import { addMeta, HugoPostMeta } from '../addMeta'

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
  const r = getYamlMeta(root) as HugoPostMeta
  expect(r.slug).eq(note.id)
  expect(r.title).eq(note.title)
  expect(r.date).eq(new Date(note.createAt).toISOString())
})
