import path from 'path'
import type { OutputPlugin } from '@mami/cli'
import * as local from '@mami/plugin-local'

interface HugoPostMeta {
  title: string
  slug: string
  tags: string[]
  date: string
}

export function output(options?: { root?: string; baseUrl?: string }): OutputPlugin {
  const root = options?.root ?? path.resolve()
  const postsPath = path.resolve(root, 'content/posts')
  const resourcePath = path.resolve(root, 'content/resources')
  const baseUrl = options?.baseUrl ?? '/'
  const p = local.output(
    local.defaultOptions({
      rootNotePath: postsPath,
      rootResourcePath: resourcePath,
      meta: (note) =>
        ({
          title: note.title,
          slug: note.id,
          tags: note.tags.map((item) => item.title),
          date: new Date(note.createAt).toISOString(),
        } as HugoPostMeta),
      noteLink: ({ linkNoteId }) => path.posix.join('/', baseUrl, `/posts/${linkNoteId}`),
      resourceLink: ({ resource }) =>
        path.posix.join('/', baseUrl, `/resources/${resource.id}${path.extname(resource.title)}`),
      notePath: (note) => path.resolve(postsPath, note.id + '.md'),
      resourcePath: (resource) => path.resolve(resourcePath, resource.id + path.extname(resource.title)),
    }),
  )
  p.name = 'hugo'
  return p
}
