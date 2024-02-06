import { TransformPlugin, wrapResourceLink } from '@mark-magic/core'
import { Image, fromMarkdown, selectAll, toMarkdown } from '@liuli-util/markdown-util'
import { AsyncArray } from '@liuli-util/async'
import { createHash } from 'crypto'
import mime from 'mime/lite'

export function hashString(s: string) {
  return createHash('md5').update(s).digest('hex')
}

export function transform(): TransformPlugin {
  return {
    name: 'plugin-template',
    async transform(it) {
      const root = fromMarkdown(it.content)
      await AsyncArray.forEach(selectAll('image', root) as Image[], async (node) => {
        const src = node.url
        if (!src.startsWith('https://') && !src.startsWith('http://')) {
          return
        }
        try {
          const resp = await fetch(src)
          const contentType = resp.headers.get('content-type')
          const ext = contentType ? mime.getExtension(contentType) : 'jpg'
          const data = await resp.arrayBuffer()
          const now = Date.now()
          const id = hashString(src)
          it.resources.push({
            id,
            name: id + '.' + ext,
            raw: Buffer.from(data),
            created: now,
            updated: now,
          })
          node.url = wrapResourceLink(id)
        } catch (e) {
          console.error('Download image failed: ', src)
        }
      })
      it.content = toMarkdown(root)
      return it
    },
  }
}
