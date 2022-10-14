import { Root, setYamlMeta } from '@liuli-util/markdown-util'
import { Note } from '@mami/cli'

export interface HugoPostMeta {
  title: string
  slug: string
  tags: string[]
  date: string
}

export function addMeta(root: Root, note: Note) {
  setYamlMeta(root, {
    title: note.title,
    slug: note.id,
    tags: note.tags.map((item) => item.title),
    date: new Date(note.createAt).toISOString(),
  } as HugoPostMeta)
}
