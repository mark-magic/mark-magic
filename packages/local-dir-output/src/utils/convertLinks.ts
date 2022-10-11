import { Note } from '@mami/cli'
import { keyBy } from 'lodash-es'
import { ValuesType } from 'utility-types'
import { visit, Root, Link, Image } from '@liuli-util/markdown-util'
import path from 'path'
import { BiMultiMap } from './BiMultiMap'

export function convertLinks({
  root,
  note,
  noteMap,
  resourceMap,
  fsPath,
}: {
  root: Root
  note: { resources: Pick<ValuesType<Note['resources']>, 'id' | 'title'>[] }
  noteMap: BiMultiMap<string, string>
  resourceMap: BiMultiMap<string, string>
  fsPath: string
}) {
  const urls: (Image | Link)[] = []
  visit(root, (node) => {
    if (['image', 'link'].includes(node.type) && (node as Link).url.startsWith(':/')) {
      urls.push(node as Link)
    }
  })
  const map = keyBy(note.resources, (item) => item.id)
  let isAfter = false
  const dirPath = path.dirname(fsPath)
  urls.forEach((item) => {
    const id = item.url.slice(2)
    const resource = map[id]
    if (resource) {
      item.url = path.relative(dirPath, resourceMap.get(id)!).replaceAll('\\', '/')
    } else {
      if (!noteMap.has(id)) {
        isAfter = true
        return
      }
      item.url = path.relative(dirPath, noteMap.get(id)!).replaceAll('\\', '/')
    }
  })
  return isAfter
}
