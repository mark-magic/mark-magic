import path from 'path'
import type { OutputPlugin } from '@mami/cli'
import * as vitepress from '@mami/plugin-vitepress'
import { writeFile } from 'fs/promises'
import { treeMap } from '@liuli-util/tree'
import * as local from '@mami/plugin-local'
import { PageFrontmatter } from 'vuepress-vite'

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
  const postsPath = path.resolve(root, 'p')
  const resourcePath = path.resolve(root, 'resources')
  const p = local.output({
    rootNotePath: postsPath,
    rootResourcePath: resourcePath,
    meta: (item) =>
      ({
        title: item.title,
        date: new Date(item.createAt).toISOString().slice(0, 10),
      } as PageFrontmatter),
    noteLink: ({ linkNoteId }) => `/p/${linkNoteId}`,
    resourceLink: ({ resource }) => `../resources/${resource.id}${path.extname(resource.title)}`,
    notePath: (note) => path.resolve(postsPath, note.id + '.md'),
    resourcePath: (resource) => path.resolve(resourcePath, resource.id + path.extname(resource.title)),
  })
  p.name = 'vitepress'
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
