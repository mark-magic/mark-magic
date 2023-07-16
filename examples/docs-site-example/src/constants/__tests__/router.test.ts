import { it } from 'vitest'
import { initTempPath } from '@liuli-util/test'
import { treeMap } from '@liuli-util/tree'
import { groupBy, last, lastIndexOf } from 'lodash-es'
import FastGlob from 'fast-glob'
import pathe from 'pathe'
import { SidebarRouteConfig } from '../router'
import { writeFile } from 'node:fs/promises'

const tempPath = initTempPath(__filename)

export const isIndex = (path: string) => ['readme.md', 'index.md'].includes(pathe.basename(path).toLocaleLowerCase())
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

interface BaseSidebar {
  path: string
  children?: BaseSidebar[]
}
export function treeSidebarByPath<T extends BaseSidebar>(sidebar: T[]): T[] {
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
      const findIndex = (it.children as BaseSidebar[]).find((it) =>
        ['readme.md', 'index.md'].includes(pathe.basename(it.path).toLocaleLowerCase()),
      )
      it.children = sortChapter(it.children as BaseSidebar[])
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

it('generate', async () => {
  const list = treeSidebarByPath(
    (
      await FastGlob('**/*.md', {
        cwd: pathe.resolve(__dirname, '../../views/content/assets/books/'),
      })
    ).map((it) => {
      return {
        path: it,
        component: ('../views/content/assets/books/' + it) as any,
      } as SidebarRouteConfig
    }),
  )
  const titleMap: Record<string, string> = {
    '/': '魔法少女小圆 飞向星空',
    '/01': '第一卷-量子纠缠',
    '/02': '第二卷-宇宙膨胀',
    '/03': '第三卷-存在悖论',
    '/04': '第四卷-爱因斯坦-罗森桥',
    '/99': '番外',
  } as any
  const componentPaths: string[] = []
  const tree = treeMap(
    [
      {
        path: 'README.md',
        component: '../views/content/assets/books/README.md' as any,
        meta: {
          title: '量子纠缠',
        },
      },
      ...list,
    ] as SidebarRouteConfig[],
    (it) => {
      const p = pathe.join('/', isIndex(it.path) ? pathe.dirname(it.path) : it.path)
      componentPaths.push(it.component as any)
      return {
        ...it,
        path: p,
        meta: {
          title: isIndex(it.path) ? titleMap[p] : pathe.basename(it.path, pathe.extname(it.path)).slice(4),
        },
      }
    },
    {
      id: 'path',
      children: 'children',
    },
  )
  const s = JSON.stringify(tree, null, 2)
  const r = componentPaths.reduce((s, it) => s.replace(`"${it}"`, `() => import("${it}")`), s)
  await writeFile(pathe.resolve(tempPath, 'router.js'), 'const s = ' + r)
})
