import { Paragraph, Root, visit } from '@liuli-util/markdown-util'
import path from 'path'
import { v4 } from 'uuid'
import { BiMultiMap } from './BiMultiMap'
import { ScanNote } from './scan'

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
  const bracketLinkRegex = () =>
    /\[\[([a-zA-ZÀ-ÿ0-9-'?%.():&,+/€! ]+)#?([a-zA-ZÀ-ÿ0-9-'?%.():&,+/€! ]+)?\|?([a-zA-ZÀ-ÿ0-9-'?%.():&,+/€! ]+)?\]\]/g
  const embedLinkRegex = () => /!\[\[([a-zA-ZÀ-ÿ0-9-'?%.():&,+/€! ]+)\]\]/g
  const resources: { id: string; fsPath: string }[] = []
  visit(root, (item) => {
    if (item.type === 'paragraph') {
      const p = item as Paragraph
      p.children = p.children.map((item, i) => {
        if (item.type !== 'text') {
          return item
        }
        // console.log('fileName', item.value, embedLinkRegex().test(item.value))
        if (embedLinkRegex().test(item.value)) {
          ;[...item.value.matchAll(embedLinkRegex())].forEach(([, fileName]) => {
            const fsPath = ['./', '../'].some((s) => fileName.startsWith(s))
              ? path.resolve(path.dirname(notePath), fileName)
              : path.resolve(rootPath, fileName)
            if (!resourceMap.has(fsPath)) {
              resourceMap.set(fsPath, v4())
            }
            item.value = item.value.replace(
              `![[${fileName}]]`,
              `![${path.basename(fileName)}](:/${resourceMap.get(fsPath)})`,
            )
            resources.push({ id: resourceMap.get(fsPath)!, fsPath })
          })
        } else if (bracketLinkRegex().test(item.value)) {
          ;[...item.value.matchAll(bracketLinkRegex())].forEach(([, fileName]) => {
            const findNote =
              list.find((item) => item.relPath === fileName + '.md') ?? list.find((item) => item.title === fileName)
            if (findNote) {
              item.value = item.value.replace(`[[${fileName}]]`, `[${path.basename(fileName)}](:/${findNote.id})`)
            } else {
              throw new Error('not found note: ' + fileName)
            }
          })
        }
        return item
      })
    }
  })
  return resources
}
