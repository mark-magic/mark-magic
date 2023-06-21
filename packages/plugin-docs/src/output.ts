import { OutputPlugin } from '@mark-magic/core'
import pathe from 'pathe'
import * as local from '@mark-magic/plugin-local'
import { Heading, fromMarkdown, selectAll, toString } from '@liuli-util/markdown-util'
import { mkdir, writeFile, rename } from 'fs/promises'
import { pathExists } from '@liuli-util/fs'
import indexHtml from './template/index.html?raw'
import nojekyll from './template/.nojekyll?raw'
import { isIndex } from './utils'
import { treeMap, treeReduce } from '@liuli-util/tree'

export interface Sidebar {
  id: string
  name: string
  path: string
}

export function generateSidebar(sidebars: Sidebar[]): string {
  return treeReduce(
    sidebars,
    (r, it, child, p) => {
      const s = `${'  '.repeat(p.length - 1)}- [${it.name}](/p/${it.id})`
      return r + s + '\n' + child
    },
    '',
    {
      id: 'id',
      children: 'children',
    },
  )
}

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

export interface Sidebar {
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
        const childPath = pathe.join(prefix, key)
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

export function output(options: { path: string }): OutputPlugin {
  const rootPath = options.path
  const postsPath = pathe.resolve(rootPath, 'p')
  const resourcePath = pathe.resolve(rootPath, 'resources')
  const p = local.output({
    rootNotePath: postsPath,
    rootResourcePath: resourcePath,
    meta: () => null,
    noteLink: ({ linkNoteId }) => `/p/${linkNoteId}`,
    resourceLink: ({ resource }) => `../resources/${resource.id}${pathe.extname(resource.name)}`,
    notePath: (note) => pathe.resolve(postsPath, note.id + '.md'),
    resourcePath: (resource) => pathe.resolve(resourcePath, resource.id + pathe.extname(resource.name)),
  })
  const sidebars: Sidebar[] = []
  return {
    ...p,
    name: 'docs',
    async handle(content) {
      const findHeader = (selectAll('heading', fromMarkdown(content.content)) as Heading[]).find((it) => it.depth === 1)
      if (findHeader?.children[0]) {
        content.name = toString(findHeader.children[0])
      }
      sidebars.push({
        id: content.id,
        name: content.name,
        path: pathe.join(...content.path),
      })
      await p.handle(content)
      if (content.path.length === 1 && isIndex(pathe.join(...content.path))) {
        await rename(pathe.resolve(postsPath, content.id + '.md'), pathe.resolve(options.path, 'readme.md'))
      }
    },
    async end() {
      if (!(await pathExists(rootPath))) {
        await mkdir(rootPath, { recursive: true })
      }
      await Promise.all(
        [
          ['index.html', indexHtml],
          ['.nojekyll', nojekyll],
          ['_sidebar.md', generateSidebar(treeSidebarByPath(sidebars))],
        ].map(([p, s]) => writeFile(pathe.resolve(rootPath, p), s)),
      )
      await p.end?.()
    },
  }
}
