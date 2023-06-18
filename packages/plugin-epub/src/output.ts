import { OutputPlugin } from '@mark-magic/core'
import { EpubBuilder, GenerateOptions, MetaData, Toc, Chapter } from '@mark-magic/epub'
import { Heading, Image, Link, fromMarkdown, selectAll, toString, toHtml } from '@liuli-util/markdown-util'
import { v4 } from 'uuid'
import { treeMap } from '@liuli-util/tree'
import { readFile, writeFile } from 'fs/promises'
import { mkdirp } from 'fs-extra/esm'
import pathe from 'pathe'
import { keyBy } from 'lodash-es'
import path from 'path'
import { extractResourceId, isContentLink, isIndex, isResourceLink } from './utils'

export function sortChapter<T extends { path: string }>(chapters: T[]): T[] {
  return chapters.sort((a, b) => {
    const aPath = a.path
    const bPath = b.path

    // Rule 1: 'cover' should be at the first
    if (aPath === 'cover') return -1
    if (bPath === 'cover') return 1

    // Rule 2: 'readme.md' or 'index.md' should be at the first in its directory
    const aDir = pathe.dirname(aPath)
    const bDir = pathe.dirname(bPath)

    if (aDir === bDir) {
      if (isIndex(aPath)) return -1
      if (isIndex(bPath)) return 1
    }

    // Default: natural sort
    return aPath.localeCompare(bPath)
  })
}

export interface Sidebar extends Omit<Toc, 'children'> {
  /** 章节对应的内容路径，方便将其转换为 tree */
  path: string
  children?: Sidebar[]
}

export function treeSidebarByPath<T extends Pick<Sidebar, 'path' | 'children'>>(sidebar: T[]): T[] {
  const tree = {}

  // First, build a tree structure
  for (const item of sidebar) {
    const parts = item.path.split('/')
    let node = tree as any
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (!node[part]) {
        node[part] = {}
      }
      node = node[part]
    }
    node._self = item
  }

  // Then, convert the tree structure to the desired format
  function convert(node: any, prefix = ''): any[] {
    const children = []
    for (const key in node) {
      if (key !== '_self') {
        const childNode = node[key]
        const childPath = path.join(prefix, key)
        if (childNode._self) {
          children.push(childNode._self)
        }
        const grandChildren = convert(childNode, childPath)
        if (grandChildren.length > 0) {
          children.push({ path: childPath, children: grandChildren })
        }
      }
    }
    return children
  }

  const result = convert(tree)

  // Finally, remove top-level 'readme.md' or 'index.md'
  const r = result.filter((item) => !isIndex(item.path))
  return treeMap(
    sortChapter(r),
    (it) => {
      if (!it.children) {
        return it
      }
      const findIndex = (it.children as Sidebar[]).find((it) =>
        ['readme.md', 'index.md'].includes(pathe.basename(it.path).toLocaleLowerCase()),
      )
      it.children = sortChapter(it.children as Sidebar[])
      if (!findIndex) {
        throw new Error(it.path + ' 下必须存在 readme.md 或者 index.md')
      }
      Object.assign(it, findIndex)
      it.children = it.children.filter((it) => !isIndex(it.path))
      return it
    },
    {
      id: 'path',
      children: 'children',
    },
  )
}

export function output(options: { metadata: MetaData; path: string }): OutputPlugin {
  const _options: Omit<GenerateOptions, 'text'> & {
    text: (Chapter & {
      path: string
    })[]
  } = {
    metadata: options.metadata,
    media: [],
    text: [],
    toc: [],
  }

  const sidebars: Sidebar[] = []
  return {
    name: 'epub',
    async start() {
      const id = v4() + pathe.extname(options.metadata.cover)
      _options.media.push({
        id: id,
        buffer: await readFile(options.metadata.cover),
      })
      _options.metadata.cover = id
      _options.text.push({
        id: 'cover',
        title: 'cover',
        path: 'cover',
        content: `<svg
          xmlns="http://www.w3.org/2000/svg"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          version="1.1"
          viewBox="0 0 1352 2000"
          width="100%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <image width="1352" height="2000" xlink:href="../Media/${id}" />
        </svg>`,
      })
    },
    async handle(content) {
      const root = fromMarkdown(content.content)
      const resourceMap = keyBy(content.resources, (it) => it.id)
      ;(selectAll('image', root) as Image[])
        .filter((it) => isResourceLink(it.url))
        .forEach((it) => {
          const id = extractResourceId(it.url)
          it.url = '../Media/' + extractResourceId(it.url) + pathe.extname(resourceMap[id].name)
        })
      ;(selectAll('link', root) as Link[])
        .filter((it) => isContentLink(it.url))
        .forEach((it) => {
          it.url = './' + extractResourceId(it.url) + '.xhtml'
        })
      const findHeader = (selectAll('heading', root) as Heading[]).find((it) => it.depth === 1)
      if (findHeader?.children[0]) {
        content.name = toString(findHeader.children[0])
      }
      const sidebar: Sidebar = {
        id: content.id,
        title: content.name,
        path: pathe.join(...content.path),
        chapterId: content.id,
      }
      sidebars.push(sidebar)
      const c: Chapter & {
        path: string
      } = {
        id: content.id,
        title: content.name,
        content: toHtml(root),
        path: pathe.join(...content.path),
      }
      _options.text.push(c)
      content.resources.forEach((it) => {
        _options.media.push({
          id: it.id + path.extname(it.name),
          buffer: it.raw,
        })
      })
    },
    async end() {
      _options.toc = treeSidebarByPath(sidebars)
      _options.text = sortChapter(_options.text)
      const zip = new EpubBuilder().gen(_options)
      // const debugDirPath = pathe.join(pathe.dirname(options.path), pathe.basename(options.path, '.epub'))
      // await extractZipToFolder(zip, debugDirPath)
      await mkdirp(pathe.dirname(options.path))
      await writeFile(pathe.resolve(options.path), await zip.generateAsync({ type: 'nodebuffer' }))
    },
  }
}
