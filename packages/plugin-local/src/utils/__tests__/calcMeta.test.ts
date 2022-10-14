import { Note, Tag } from '@mami/cli'
import { expect, it } from 'vitest'
import { calcMeta } from '../calcMeta'

it('addMetas', () => {
  const note = {
    id: 'test',
    title: 'test-title',
    createAt: Date.now(),
    updateAt: Date.now(),
    tags: [] as Tag[],
  } as Note
  const r = calcMeta(note)
  expect(r.abbrlink).eq(note.id)
  expect(r.title).eq(note.title)
  expect(r.date).eq(note.createAt)
  expect(r.updated).eq(note.updateAt)
})
