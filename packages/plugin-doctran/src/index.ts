import { TransformPlugin } from '@mark-magic/core'
import { createTrans, trans } from './translate'
import findCacheDirectory from 'find-cache-dir'
import { mkdir } from 'fs/promises'
import path from 'pathe'
import { pathExists, readJson, writeJson } from 'fs-extra/esm'
import { DoctranTransformConfig } from './config.schema'

export function transform(options: DoctranTransformConfig): TransformPlugin {
  const cacheDir = findCacheDirectory({ name: '@mark-magic/plugin-doctran' })!

  return {
    name: 'doctran',
    async start() {
      if (!cacheDir) {
        throw new Error('Cannot find cache directory')
      }
      await mkdir(cacheDir, { recursive: true })
    },
    async transform(content) {
      const origin = content.content
      const cachePath = path.resolve(cacheDir, `${content.id}.json`)

      interface Cache {
        origin: string
        transformed: string
      }

      if (await pathExists(cachePath)) {
        const cache = (await readJson(cachePath)) as Cache
        if (cache.origin === origin) {
          content.content = cache.transformed
          return content
        }
      }
      content.content = await trans(createTrans(options), origin)
      await writeJson(cachePath, {
        origin,
        transformed: content.content,
      } as Cache)
      return content
    },
  }
}
