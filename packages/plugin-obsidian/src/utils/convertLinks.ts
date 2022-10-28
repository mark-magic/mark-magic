import { flatMap, Paragraph, Root, u, visit } from '@liuli-util/markdown-util'
import path from 'path'
import { v4 } from 'uuid'
import { BiMultiMap } from './BiMultiMap'
import { ScanNote } from './scan'
import { WikiLink } from './wiki'

export function convertLinks({
  root,
  rootPath,
  list,
  resourceMap,
  notePath,
}: {
  root: Root
  notePath: string
  rootPath: string
  list: ScanNote[]
  resourceMap: BiMultiMap<string, string>
}): { id: string; fsPath: string }[] {
  const resources: { id: string; fsPath: string }[] = []
  flatMap(root, (node) => {
    if (node.type !== 'wiki') {
      return [node]
    }
    const wiki = node as WikiLink
    const fileName = wiki.url
    if (wiki.embed) {
      const fsPath = ['./', '../'].some((s) => fileName.startsWith(s))
        ? path.resolve(path.dirname(notePath), fileName)
        : path.resolve(rootPath, fileName)
      if (!resourceMap.has(fsPath)) {
        resourceMap.set(fsPath, v4())
      }
      resources.push({ id: resourceMap.get(fsPath)!, fsPath })
      return [
        u('image', {
          alt: path.basename(fileName),
          url: `:/${resourceMap.get(fsPath)}`,
        }),
      ]
    }
    const findNote =
      list.find((item) => item.relPath === fileName + '.md') ?? list.find((item) => item.title === fileName)
    if (findNote) {
      return [
        u('link', {
          url: `:/${findNote.id}`,
          children: [u('text', path.basename(fileName))],
        }),
      ]
    } else {
      throw new Error('not found note: ' + fileName)
    }
  })
  return resources
}
