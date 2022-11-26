import path from 'path'
import type { OutputPlugin } from '@mami/cli'
import * as local from '@mami/plugin-local'

export function output(options?: { root?: string; baseUrl?: string }): OutputPlugin {
  const root = options?.root ?? path.resolve()
  const postsPath = path.resolve(root, 'source/_posts')
  const resourcePath = path.resolve(root, 'source/resources')
  const p = local.output(
    local.defaultOptions({
      rootNotePath: postsPath,
      rootResourcePath: resourcePath,
      meta: (note) => ({
        layout: 'post',
        title: note.title,
        abbrlink: note.id,
        tags: note.tags.map((item) => item.title),
        categories: note.path,
        date: note.createAt,
        updated: note.updateAt,
      }),
      noteLink: ({ linkNoteId }) => path.posix.join('/', options?.baseUrl ?? '/', `/p/${linkNoteId}`),
      resourceLink: ({ resource }) => `/resources/${resource.id}${path.extname(resource.title)}`,
      notePath: (note) => path.resolve(postsPath, note.id + '.md'),
      resourcePath: (resource) => path.resolve(resourcePath, resource.id + path.extname(resource.title)),
    }),
  )
  p.name = 'hexo'
  return p
}
