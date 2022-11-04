import { AsyncArray } from '@liuli-util/async'
import { mkdirp, pathExists, readFile, writeFile } from '@liuli-util/fs-extra'
import {
  flatMap,
  fromMarkdown,
  Image,
  Link,
  Root,
  selectAll,
  setYamlMeta,
  toMarkdown,
  u,
} from '@liuli-util/markdown-util'
import { Note, OutputPlugin, Resource } from '@mami/cli'
import filenamify from 'filenamify'
import { keyBy } from 'lodash-es'
import path from 'path'
import { BiMultiMap } from './utils/BiMultiMap'
import { WikiLink, wikiLinkFromMarkdown, wikiLinkToMarkdown } from './utils/wiki'

export interface LocalNoteMeta extends Pick<Note, 'title' | 'createAt' | 'updateAt'> {
  tags: string[]
}

export function calcMeta(note: Note): LocalNoteMeta {
  return {
    title: note.title,
    tags: note.tags.map((item) => item.title),
    createAt: note.createAt,
    updateAt: note.updateAt,
  }
}

function formatRelative(s: string): string {
  const prefix = ['./', '../']
  const r = s.replaceAll('\\', '/')
  return prefix.some((i) => r.startsWith(i)) ? r : './' + r
}

export function convertLinks({
  root,
  note,
  noteMap,
  resourceMap,
  fsPath,
}: {
  root: Root
  note: { resources: Pick<Resource, 'id' | 'title'>[] }
  noteMap: BiMultiMap<string, string>
  resourceMap: BiMultiMap<string, string>
  fsPath: string
}) {
  const map = keyBy(note.resources, (item) => item.id)
  let isAfter = false
  const dirPath = path.dirname(fsPath)
  const urlMap = new Map<string, string>()
  const urls = (selectAll('image,link', root) as (Link | Image)[]).filter((item) => item.url.startsWith(':/'))
  urls.forEach((item) => {
    const id = item.url.slice(2)
    const resource = map[id]
    if (resource) {
      urlMap.set(item.url, formatRelative(path.relative(dirPath, resourceMap.get(id)!)))
    } else {
      if (!noteMap.has(id)) {
        isAfter = true
        return
      }
      const r = formatRelative(path.relative(dirPath, noteMap.get(id)!))
      urlMap.set(item.url, r.endsWith('.md') ? r.slice(0, r.length - 3) : r)
    }
  })
  flatMap(root, (item) => {
    if (!(['image', 'link'].includes(item.type) && urlMap.has((item as Link).url))) {
      return [item]
    }
    if (item.type === 'image') {
      const img = item as Image
      return [
        u('wiki', {
          embed: true,
          title: img.alt,
          url: urlMap.get(img.url),
        } as Partial<WikiLink>),
      ]
    }
    const link = item as Link
    return [
      u('wiki', {
        embed: false,
        title: link.title,
        url: urlMap.get(link.url),
      } as Partial<WikiLink>),
    ]
  })
  return isAfter
}

/**
 * 写入到 obsidian
 * @param options
 * @returns
 */
export function output(options: { root: string }): OutputPlugin {
  const resourceRootPath = path.resolve(options.root, '_resources')
  const resourceMap = new BiMultiMap<string, string>(),
    noteMap = new BiMultiMap<string, string>(),
    afterList: { fsPath: string; note: Note }[] = []
  return {
    name: 'obsidian',
    async start() {
      await mkdirp(resourceRootPath)
    },
    async handle(note) {
      // 写入资源到特定目录
      await AsyncArray.forEach(note.resources, async (item) => {
        let fsPath = path.resolve(resourceRootPath, filenamify(item.title))
        if (await pathExists(fsPath)) {
          const ext = path.extname(item.title)
          fsPath = path.resolve(resourceRootPath, filenamify(path.basename(item.title, ext)) + '_' + item.id + ext)
        }
        await writeFile(fsPath, item.raw)
        resourceMap.set(item.id, fsPath)
      })
      // 计算当前笔记的写入路径
      let fsPath = path.resolve(options.root, note.path.join('/'), filenamify(note.title) + '.md')
      if (noteMap.has(fsPath)) {
        fsPath = path.resolve(options.root, note.path.join('/'), filenamify(note.title) + '_' + note.id + '.md')
      }
      noteMap.set(note.id, fsPath)
      // 转换链接和笔记
      const root = fromMarkdown(note.content, {
        mdastExtensions: [wikiLinkFromMarkdown()],
      })
      setYamlMeta(root, calcMeta(note))
      const isAfter = convertLinks({ root, note, fsPath, noteMap, resourceMap })
      if (isAfter) {
        afterList.push({ fsPath, note })
      }
      // 写入笔记
      const s = toMarkdown(root, { extensions: [wikiLinkToMarkdown()] })
      await mkdirp(path.dirname(fsPath))
      await writeFile(fsPath, s)
    },
    async end() {
      await AsyncArray.forEach(afterList, async (item) => {
        const root = fromMarkdown(await readFile(item.fsPath, 'utf-8'), { mdastExtensions: [wikiLinkFromMarkdown()] })
        convertLinks({ ...item, root, noteMap, resourceMap })
        await writeFile(item.fsPath, toMarkdown(root, { extensions: [wikiLinkToMarkdown()] }))
      })
    },
  }
}
