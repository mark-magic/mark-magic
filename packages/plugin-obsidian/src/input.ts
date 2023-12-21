import { AsyncArray } from '@liuli-util/async'
import { stat, readFile } from 'fs/promises'
import { flatMap, fromMarkdown, getYamlMeta, Root, toMarkdown, u } from '@liuli-util/markdown-util'
import { Content, InputPlugin, Resource } from '@mark-magic/core'
import FastGlob from 'fast-glob'
import { dropRight } from 'lodash-es'
import path from 'path'
import { WikiLink, wikiLinkFromMarkdown } from './utils/wiki'
import { BiMultiMap } from '@mark-magic/utils'
import { sha1 } from './utils/sha1'
import { lowcaseObjectKeys } from './utils/lowcase'

export interface LocalNoteMeta {
  Tags: string[]
}

interface ScanNote {
  id: string
  name: string
  relPath: string
}

export async function scan(root: string): Promise<ScanNote[]> {
  return await AsyncArray.map(
    await FastGlob('**/*.md', {
      cwd: root,
      onlyFiles: true,
      ignore: ['.obsidian'],
    }),
    async (it) => ({
      id: sha1(it),
      name: path.basename(it, '.md'),
      relPath: it,
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
      (it) =>
        // 绝对路径对比
        path.resolve(rootPath, it.relPath) === fsPath + '.md' ||
        // 绝对路径
        it.relPath === fileName + '.md' ||
        // 绝对路径，使用顶级目录中的文件名
        it.name === fileName,
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
      resourceMap.set(fsPath, sha1(fsPath))
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
export function input(options: { path: string; tag?: string }): InputPlugin {
  return {
    name: 'obsidian',
    async *generate() {
      const list = await scan(options.path)
      const resourceMap = new BiMultiMap<string, string>()
      for (const it of list) {
        const fsPath = path.resolve(options.path, it.relPath)
        const s = await stat(fsPath)
        const root = fromMarkdown(convertYamlTab(await readFile(fsPath, 'utf-8')), {
          mdastExtensions: [wikiLinkFromMarkdown()],
        })
        const meta = lowcaseObjectKeys(getYamlMeta(root) ?? {}) as Partial<LocalNoteMeta>
        if (typeof meta.Tags === 'string') {
          meta.Tags = (meta.Tags as string)
            .split(',')
            .map((it) => it.trim())
            .filter((it) => it.length !== 0)
        }
        if (options.tag && !meta.Tags?.includes(options.tag)) {
          continue
        }
        root.children = root.children.filter((it) => it.type !== 'yaml')
        const resources = convertLinks({
          root,
          rootPath: options.path,
          list,
          resourceMap,
          notePath: fsPath,
        })
        const tags = meta.Tags
        const note: Content = {
          id: it.id,
          name: it.name,
          content: toMarkdown(root).replaceAll(/\\\[(.+)\]\\\(:\/(.*)\)/g, '[$1](:/$2)'),
          created: s.ctimeMs,
          updated: s.mtimeMs,
          resources: await AsyncArray.map(
            resources,
            async (it) =>
              ({
                id: it.id,
                name: path.basename(it.fsPath),
                raw: await readFile(it.fsPath),
              } as Resource),
          ),
          path: dropRight(
            it.relPath.split('/').filter((s) => s.length !== 0),
            1,
          ),
          extra: {
            tags: tags ?? [],
          },
        }
        yield note
      }
    },
  }
}
