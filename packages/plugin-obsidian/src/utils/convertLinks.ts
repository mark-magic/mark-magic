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
    const fileName = wiki.url.endsWith('.md') ? wiki.url.slice(0, wiki.url.length - 3) : wiki.url
    const fsPath = ['./', '../'].some((s) => fileName.startsWith(s))
      ? path.resolve(path.dirname(notePath), fileName)
      : path.resolve(rootPath, fileName)
    const findNote = list.find(
      (item) =>
        // 绝对路径对比
        path.resolve(rootPath, item.relPath) === fsPath + '.md' ||
        // 绝对路径
        item.relPath === fileName + '.md' ||
        // 绝对路径，使用顶级目录中的文件名
        item.title === fileName,
    )
    if (findNote) {
      return [
        u('link', {
          url: `:/${findNote.id}`,
          children: [u('text', path.basename(fileName))],
        }),
      ]
    }
    if (!resourceMap.has(fsPath)) {
      resourceMap.set(fsPath, v4())
    }
    resources.push({ id: resourceMap.get(fsPath)!, fsPath })
    return [
      wiki.embed
        ? u('image', {
            alt: path.basename(fileName),
            url: `:/${resourceMap.get(fsPath)}`,
          })
        : u('link', {
            url: `:/${resourceMap.get(fsPath)}`,
            children: [u('text', path.basename(fileName))],
          }),
    ]
  })
  return resources
}
