import { AsyncArray } from '@liuli-util/async'
import { stat, readFile } from '@liuli-util/fs-extra'
import { flatMap, fromMarkdown, getYamlMeta, Root, toMarkdown, u } from '@liuli-util/markdown-util'
import { InputPlugin, Note, Tag } from '@mami/cli'
import FastGlob from 'fast-glob'
import { dropRight } from 'lodash-es'
import path from 'path'
import { v4 } from 'uuid'
import { LocalNoteMeta } from './output'
import { WikiLink, wikiLinkFromMarkdown } from './utils/wiki'
import { BiMultiMap } from '@mami/utils'
import { sha1 } from './utils/sha1'
import { lowcaseObjectKeys } from './utils/lowcase'

interface ScanNote {
  id: string
  title: string
  relPath: string
}

export async function scan(root: string): Promise<ScanNote[]> {
  return await AsyncArray.map(
    await FastGlob('**/*.md', {
      cwd: root,
      onlyFiles: true,
      ignore: ['.obsidian'],
    }),
    async (item) => ({
      id: await sha1(item),
      title: path.basename(item, '.md'),
      relPath: item,
    }),
  )
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

/**
 * 从 obsidian 读取
 * @param options
 * @returns
 */
export function input(options: { root: string; tag?: string }): InputPlugin {
  return {
    name: 'obsidian',
    async *generate() {
      const list = await scan(options.root)
      const resourceMap = new BiMultiMap<string, string>()
      const tagMap = new Map<string, Tag>()
      for (const item of list) {
        const fsPath = path.resolve(options.root, item.relPath)
        const s = await stat(fsPath)
        const root = fromMarkdown(convertYamlTab(await readFile(fsPath, 'utf-8')), {
          mdastExtensions: [wikiLinkFromMarkdown()],
        })
        const meta = lowcaseObjectKeys(getYamlMeta(root) ?? {}) as Partial<LocalNoteMeta>
        if (typeof meta.tags === 'string') {
          meta.tags = (meta.tags as string)
            .split(',')
            .map((it) => it.trim())
            .filter((it) => it.length !== 0)
        }
        if (options.tag && !meta.tags?.includes(options.tag)) {
          continue
        }
        root.children = root.children.filter((item) => item.type !== 'yaml')
        const resources = convertLinks({
          root,
          rootPath: options.root,
          list,
          resourceMap,
          notePath: fsPath,
        })
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
