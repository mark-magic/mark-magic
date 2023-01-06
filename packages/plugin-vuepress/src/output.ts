import path from 'path'
import type { OutputPlugin } from '@mami/cli'
import * as vitepress from '@mami/plugin-vitepress'
import { writeFile } from 'fs/promises'
import { treeMap } from '@liuli-util/tree'

export interface VuepressSidebar {
  text: string
  link?: string
  children?: VuepressSidebar[]
}

export function siderListToTree(list: vitepress.Sidebar[]): VuepressSidebar[] {
  return treeMap(
    vitepress.siderListToTree(list),
    ({ items, ...o }) =>
      (items
        ? {
            ...o,
            children: items,
          }
        : o) as VuepressSidebar,
    { id: 'link', children: 'items' },
  )
}

export function output(options?: { root?: string }): OutputPlugin {
  const root = options?.root ?? path.resolve('docs')
  const p = vitepress.output({ root })
  p.name = 'vuepress'
  const list: vitepress.Sidebar[] = []
  return {
    ...p,
    async handle(note) {
      list.push(note)
      await p.handle(note)
    },
    async end() {
      await writeFile(path.resolve(root, 'sidebar.json'), JSON.stringify(siderListToTree(list), null, 2))
      await p.end?.()
    },
  }
}
