import { Root, setYamlMeta } from '@liuli-util/markdown-util'
import { Note } from '@mami/cli'

export interface LocalNoteMeta {
  title: string
  abbrlink: string
  tags: string[]
  date: number
  updated: number
}

export function addMeta(root: Root, note: Note) {
  setYamlMeta(root, {
    title: note.title,
    abbrlink: note.id,
    tags: note.tags.map((item) => item.title),
    date: note.createAt,
    updated: note.updateAt,
  } as LocalNoteMeta)
}
