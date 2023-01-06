import path from 'path'
import type { OutputPlugin } from '@mami/cli'
import * as local from '@mami/plugin-local'
import { writeFile } from 'fs/promises'

export interface Sidebar {
  id: string
  title: string
  path: string[]
}

export interface VitepressSidebar {
  text: string
  link?: string
  items?: VitepressSidebar[]
}

/**
 * 转换列表到 vuepress 需要的树结构
 */
export function siderListToTree(data: Sidebar[]): VitepressSidebar[] {
  const r: VitepressSidebar = {
    text: 'root',
    items: [],
  }
  const dirMap = new Map<string, VitepressSidebar>()
  function mkdirp(s: string[]): VitepressSidebar {
    if (s.length === 0) {
      return r
    }
    const k = JSON.stringify(s)
    if (dirMap.has(k)) {
      return dirMap.get(k)!
    }
    const p = mkdirp(s.slice(0, s.length - 1))
    const c: VitepressSidebar = {
      text: s[s.length - 1],
      items: [],
    }
    p.items!.push(c)
    dirMap.set(k, c)
    return c
  }
  data.forEach((item) => {
    const k = JSON.stringify(item.path)
    if (!dirMap.has(k)) {
      const p = mkdirp(item.path)
      dirMap.set(k, p)
    }
    dirMap.get(k)!.items!.push({
      text: item.title,
      link: `/p/${item.id}.md`,
    })
  })
  return r.items!
}

export function output(options?: { root?: string }): OutputPlugin {
  const root = options?.root ?? path.resolve('docs')
  const postsPath = path.resolve(root, 'p')
  const resourcePath = path.resolve(root, 'resources')
  const p = local.output({
    rootNotePath: postsPath,
    rootResourcePath: resourcePath,
    meta: () => null,
    noteLink: ({ linkNoteId }) => `/p/${linkNoteId}`,
    resourceLink: ({ resource }) => `../resources/${resource.id}${path.extname(resource.title)}`,
    notePath: (note) => path.resolve(postsPath, note.id + '.md'),
    resourcePath: (resource) => path.resolve(resourcePath, resource.id + path.extname(resource.title)),
  })
  p.name = 'vitepress'
  const list: Sidebar[] = []
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
