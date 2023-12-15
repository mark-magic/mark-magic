import { treeMap } from '@liuli-util/tree'
import path from 'pathe'
import { isIndex } from './utils'

export function sortChapter<T extends { path: string }>(chapters: T[]): T[] {
  return chapters.sort((a, b) => {
    const aPath = a.path
    const bPath = b.path

    // Rule 1: 'cover' should be at the first
    if (aPath === 'cover') return -1
    if (bPath === 'cover') return 1

    // Rule 2: 'readme.md' or 'index.md' should be at the first in its directory
    const aDir = path.dirname(aPath)
    const bDir = path.dirname(bPath)

    if (aDir === bDir) {
      if (isIndex(aPath)) return -1
      if (isIndex(bPath)) return 1
    }

    // Default: natural sort
    return aPath.localeCompare(bPath)
  })
}

export interface ISidebar {
  /** 章节对应的内容路径，方便将其转换为 tree */
  path: string
  children?: ISidebar[]
}

export function treeSidebarByPath<T extends ISidebar>(sidebar: T[]): T[] {
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
      const findIndex = (it.children as ISidebar[]).find((it) =>
        ['readme.md', 'index.md'].includes(path.basename(it.path).toLocaleLowerCase()),
      )
      it.children = sortChapter(it.children as ISidebar[])
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
