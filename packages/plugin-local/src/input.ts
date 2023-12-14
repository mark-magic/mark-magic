import { AsyncArray } from '@liuli-util/async'
import { pathExists, stat } from '@liuli-util/fs-extra'
import {
  fromMarkdown,
  getYamlMeta,
  Link,
  Root,
  toMarkdown,
  Image,
  selectAll,
  setYamlMeta,
} from '@liuli-util/markdown-util'
import { InputPlugin, Content, wrapContentLink, wrapResourceLink } from '@mark-magic/core'
import { BiMultiMap } from '@mark-magic/utils'
import FastGlob from 'fast-glob'
import { readFile } from 'fs/promises'
import { keyBy, uniqBy, omit } from 'lodash-es'
import pathe from 'pathe'
import { LocalContentMeta } from './output'
import crypto from 'crypto'
import type { LocalInputConfig } from './config.schema'

function hashString(s: string) {
  return crypto.createHash('md5').update(s).digest('hex')
}

interface ScanContent {
  id: string
  name: string
  relPath: string
}

export async function scan(root: string): Promise<ScanContent[]> {
  return (
    await FastGlob('**/*.md', {
      cwd: root,
      onlyFiles: true,
      ignore: ['.obsidian'],
    })
  ).map((item) => ({
    id: hashString(item).toString(),
    name: pathe.basename(item, '.md'),
    relPath: item,
  }))
}

export function convertYamlTab(content: string) {
  const sub = '---\n'
  const start = content.indexOf(sub)
  if (start === -1) {
    return content
  }
  const end = content.slice(start + sub.length).indexOf(sub)
  if (end === -1) {
    return content
  }
  const s = content.substring(start + sub.length, start + sub.length + end)
  return content.replace(s, s.replaceAll('\t', '  '))
}

export function convertLinks({
  root,
  resourceMap,
  list,
  contentPath,
  rootPath,
}: {
  root: Root
  list: ScanContent[]
  resourceMap: BiMultiMap<string, string>
  contentPath: string
  rootPath: string
}): { id: string; fsPath: string }[] {
  const urls = selectAll('image,link', root) as (Image | Link)[]
  const contentMap = keyBy(list, (item) => item.relPath)
  const resources: { id: string; fsPath: string }[] = []
  urls.forEach((item) => {
    if (!['../', './'].some((s) => item.url.startsWith(s))) {
      return
    }
    const fsPath = pathe.resolve(pathe.dirname(contentPath), item.url)
    const relPath = pathe.relative(rootPath, fsPath)
    if (contentMap[relPath]) {
      item.url = wrapContentLink(contentMap[relPath].id)
      return
    }
    if (!resourceMap.has(fsPath)) {
      resourceMap.set(fsPath, hashString(fsPath).toString())
    }
    resources.push({ id: resourceMap.get(fsPath)!, fsPath })
    item.url = wrapResourceLink(resourceMap.get(fsPath)!)
  })
  return uniqBy(resources, (item) => item.id)
}

export function input(options: LocalInputConfig): InputPlugin {
  return {
    name: 'local',
    async *generate() {
      const list = await scan(options.path)
      const resourceMap = new BiMultiMap<string, string>()
      // const tagMap = new Map<string, Tag>()
      for (const it of list) {
        const fsPath = pathe.resolve(options.path, it.relPath)
        const root = fromMarkdown(convertYamlTab(await readFile(fsPath, 'utf-8')))
        const meta = (getYamlMeta(root) ?? {}) as Partial<LocalContentMeta>
        const resources = convertLinks({
          root,
          rootPath: options.path,
          contentPath: fsPath,
          list,
          resourceMap,
        })
        setYamlMeta(root, null)
        // const tags = (meta.tags ?? []).map((title) => {
        //   if (tagMap.has(title)) {
        //     return tagMap.get(title)!
        //   }
        //   const r = { id: v4(), title } as Tag
        //   tagMap.set(title, r)
        //   return r
        // })
        const s = await stat(fsPath)
        const content: Content = {
          id: it.id,
          name: meta.name ?? it.name,
          content: toMarkdown(root),
          created: meta.created ?? s.ctimeMs,
          updated: meta.updated ?? s.mtimeMs,
          extra: omit(meta, ['name', 'created', 'updated']),
          // tags,
          resources: await new AsyncArray(resources)
            .filter((item) => pathExists(item.fsPath))
            .map(async (item) => {
              return {
                id: item.id,
                name: pathe.basename(item.fsPath),
                raw: await readFile(item.fsPath),
                created: Math.floor(s.birthtimeMs),
                updated: Math.floor(s.mtimeMs),
              }
            }),
          path: it.relPath.split('/').filter((s) => s.length !== 0),
        }
        yield content
      }
    },
  }
}
