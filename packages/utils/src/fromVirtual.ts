import { Content, Resource, InputPlugin } from '@mark-magic/core'
import pathe from 'pathe'

export function fromVirtual(
  list: (Pick<Content, 'id' | 'content'> & {
    path: string
    resources?: Pick<Resource, 'id' | 'name' | 'raw'>[]
    extra?: any
  })[],
): InputPlugin {
  return {
    name: 'virtual',
    async *generate(): AsyncGenerator<Content> {
      for (const it of list) {
        yield {
          id: it.id,
          content: it.content,
          extra: it.extra,
          name: pathe.basename(it.path, '.md'),
          path: it.path.split('/').filter((it) => it.trim().length !== 0),
          resources: (it.resources ?? []).map((it) => ({
            ...it,
            created: Date.now(),
            updated: Date.now(),
          })),
          created: Date.now(),
          updated: Date.now(),
        }
      }
    },
  }
}
