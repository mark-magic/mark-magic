import { readFile, stat } from '@liuli-util/fs-extra'
import { fromMarkdown, toMarkdown } from '@liuli-util/markdown-util'
import type { InputPlugin, Note } from '@mami/cli'
import { dropRight } from 'lodash-es'
import path from 'path'
import { getTags } from './utils/getTags'
import { convertYamlTab } from './utils/convertYamlTab'
import { scan } from './utils/scan'
import { BiMultiMap } from './utils/BiMultiMap'
import { convertLinks } from './utils/convertLinks'
import { AsyncArray } from '@liuli-util/async'

export function obsidianInput(options: { root: string }): InputPlugin {
  return {
    name: 'obsidianInput',
    async *generate() {
      const list = await scan(options.root)
      const resourceMap = new BiMultiMap<string, string>()
      for (const item of list) {
        const fsPath = path.resolve(options.root, item.relPath)
        const s = await stat(fsPath)
        const root = fromMarkdown(convertYamlTab(await readFile(fsPath, 'utf-8')))
        const tags = getTags(root)

        const resources = convertLinks({ root, rootPath: options.root, list, resourceMap, notePath: fsPath })
        const note: Note = {
          id: item.id,
          title: item.title,
          content: toMarkdown(root).replaceAll(/\\\[(.+)\]\\\(:\/(.*)\)/g, '[$1](:/$2)'),
          createAt: s.ctimeMs,
          updateAt: s.mtimeMs,
          tags,
          resources: await AsyncArray.map(resources, async (item) => ({
            id: item.id,
            title: path.basename(item.fsPath),
            raw: await readFile(item.fsPath),
          })),
          path: dropRight(
            item.relPath.split('/').filter((s) => s.length !== 0),
            1,
          ),
        }
        yield note
      }
    },
  }
}
