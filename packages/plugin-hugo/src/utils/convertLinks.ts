import { Note } from '@mami/cli'
import { keyBy } from 'lodash-es'
import { ValuesType } from 'utility-types'
import { visit, Root, Link, Image } from '@liuli-util/markdown-util'
import path from 'path'

export function convertLinks({
  root,
  note,
  baseUrl,
}: {
  root: Root
  baseUrl: string
  note: { resources: Pick<ValuesType<Note['resources']>, 'id' | 'title'>[] }
}) {
  const urls: (Image | Link)[] = []
  visit(root, (node) => {
    if (['image', 'link'].includes(node.type) && (node as Link).url.startsWith(':/')) {
      urls.push(node as Link)
    }
  })
  const map = keyBy(note.resources, (item) => item.id)
  urls.forEach((item) => {
    const id = item.url.slice(2)
    const resource = map[id]
    if (resource) {
      item.url = path.posix.join('/', baseUrl, '/resources', id + path.extname(resource.title))
    } else {
      item.url = `/p/${id}`
    }
  })
}
