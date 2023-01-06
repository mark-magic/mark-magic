import path from 'path'
import type { OutputPlugin } from '@mami/cli'
import * as local from '@mami/plugin-local'
import { List, toMarkdown } from '@liuli-util/markdown-util'
import { writeFile } from 'fs/promises'

interface Sidebar {
  id: string
  title: string
  path: string[]
}

export function generateSidebar(list: Sidebar[]): string {
  const map = new Map<string, List>()
  const root: List = {
    type: 'list',
    spread: false,
    children: [],
  }
  function mkdirp(path: string[]): List {
    if (path.length === 0) {
      return root
    }
    const s = path.join('/')
    let p = map.get(s)
    if (p) {
      return p
    }
    p = mkdirp(path.slice(0, path.length - 1))
    const r: List = { type: 'list', spread: false, children: [] }
    map.set(s, r)
    if (!p.children) {
      p.children = []
    }
    p.children.push({
      type: 'listItem',
      spread: false,
      children: [{ type: 'paragraph', children: [{ type: 'text', value: path[path.length - 1] }] }, r],
    })
    return r
  }
  list.forEach((item) => {
    const p = mkdirp(item.path)
    p.children.push({
      type: 'listItem',
      spread: false,
      children: [
        {
          type: 'paragraph',
          children: [{ type: 'link', url: `/p/${item.id}`, children: [{ type: 'text', value: item.title }] }],
        },
      ],
    })
  })
  return toMarkdown(root, {
    bullet: '-',
    listItemIndent: 'one',
  })
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
  p.name = 'docsify'
  const list: Sidebar[] = []
  return {
    ...p,
    async handle(note) {
      list.push(note)
      await p.handle(note)
    },
    async end() {
      await writeFile(path.resolve(root, '_sidebar.md'), generateSidebar(list))
      await p.end?.()
    },
  }
}
