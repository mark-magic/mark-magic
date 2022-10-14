import type { Root } from '@liuli-util/markdown-util'
import type { Note } from '@mami/cli'

export interface LocalNoteMeta {
  title: string
  abbrlink: string
  tags: string[]
  date: number
  updated: number
}

export function calcMeta(note: Note): LocalNoteMeta {
  return {
    title: note.title,
    abbrlink: note.id,
    tags: note.tags.map((item) => item.title),
    date: note.createAt,
    updated: note.updateAt,
  }
}
