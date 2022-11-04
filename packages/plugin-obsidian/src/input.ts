import { AsyncArray } from '@liuli-util/async'
import { stat, readFile } from '@liuli-util/fs-extra'
import { fromMarkdown, getYamlMeta, Heading, select, setYamlMeta, toMarkdown } from '@liuli-util/markdown-util'
import { InputPlugin, Note, Tag } from '@mami/cli'
import { dropRight } from 'lodash-es'
import path from 'path'
import { v4 } from 'uuid'
import { LocalNoteMeta } from './output'
import { BiMultiMap } from './utils/BiMultiMap'
import { convertLinks } from './utils/convertLinks'
import { convertYamlTab } from './utils/convertYamlTab'
import { scan } from './utils/scan'
import { wikiLinkFromMarkdown } from './utils/wiki'

/**
 * 从 obsidian 读取
 * @param options
 * @returns
 */
export function input(options: { root: string }): InputPlugin {
  return {
    name: 'obsidian',
    async *generate() {
      const list = await scan(options.root)
      const resourceMap = new BiMultiMap<string, string>()
      for (const item of list) {
        const fsPath = path.resolve(options.root, item.relPath)
        const s = await stat(fsPath)
        const root = fromMarkdown(convertYamlTab(await readFile(fsPath, 'utf-8')), {
          mdastExtensions: [wikiLinkFromMarkdown()],
        })
        const meta = (getYamlMeta(root) ?? {}) as Partial<LocalNoteMeta>
        root.children = root.children.filter((item) => item.type !== 'yaml')
        const resources = convertLinks({
          root,
          rootPath: options.root,
          list,
          resourceMap,
          notePath: fsPath,
        })
        const tagMap = new Map<string, Tag>()
        const tags = (meta.tags ?? []).map((title) => {
          if (tagMap.has(title)) {
            return tagMap.get(title)!
          }
          const r = { id: v4(), title } as Tag
          tagMap.set(title, r)
          return r
        })
        const note: Note = {
          id: item.id,
          title: meta.title ?? item.title,
          content: toMarkdown(root).replaceAll(/\\\[(.+)\]\\\(:\/(.*)\)/g, '[$1](:/$2)'),
          createAt: meta.createAt ?? s.ctimeMs,
          updateAt: meta.updateAt ?? s.mtimeMs,
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
