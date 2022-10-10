import { Root, setYamlMeta } from '@liuli-util/markdown-util'
import { Note } from '@mami/cli'

export interface HexoPostMeta {
  layout: string
  title: string
  abbrlink: string
  tags: string[]
  date: number
  updated: number
}

export function addMeta(root: Root, note: Note) {
  setYamlMeta(root, {
    layout: 'post',
    title: note.title,
    abbrlink: note.id,
    tags: note.tags.map((item) => item.title),
    date: note.createAt,
    updated: note.updateAt,
  } as HexoPostMeta)
}
